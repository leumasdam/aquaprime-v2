import { NextResponse } from "next/server";
import { mailNastaveny, posliMail } from "../_lib/mail";
import { mailHtml, type MailBlok } from "../_lib/sablona";
import { encode, PaymentOptions, CurrencyCode } from "bysquare/pay";
import { ipZ, prekrocenyLimit } from "../_lib/limit";
import { prepocitaj } from "../platba/_lib/suma";
import { nacitajSkrinky } from "../../katalog/skrinky";
import { nacitajAkvaria } from "../../katalog/akvaria";

/**
 * Príjem objednávky. Objednávka sa musí prijať aj vtedy, keď e-mail zlyhá —
 * preto sa číslo objednávky vytvorí vždy a stav odoslania sa vráti zvlášť.
 * Do databázy to pôjde, keď ju nasadíme; dovtedy je nosičom e-mail.
 *
 * Ceny, doprava, celková suma aj záloha sa počítajú tu z katalógu —
 * rovnako ako pri platbe kartou (platba/_lib/suma.ts). Z prehliadača
 * berieme len to, čo sa z katalógu odvodiť nedá: kto objednáva, kam
 * a názvy položiek do e-mailu. Do 13. 10. 2026 sa suma brala od klienta,
 * takže upravená požiadavka mohla dostať QR kód na nižšiu zálohu.
 */

type Polozka = {
  nazov?: unknown;
  variant?: unknown;
  ks?: unknown;
  druh?: unknown;
  slug?: unknown;
  nozicky?: unknown;
};

/** text od klienta do e-mailu — orezaný, nech nikto nepošle román ani nič nenafúkne */
const text = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

const eur = (n: number) =>
  n.toLocaleString("sk-SK", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) +
  " €";

export async function POST(req: Request) {
  if (prekrocenyLimit(`objednavka:${ipZ(req)}`)) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429, headers: { "retry-after": "600" } }
    );
  }

  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const vstup = Array.isArray(b.polozky) ? (b.polozky as Polozka[]) : [];
  const meno = text(b.meno, 120);
  const email = text(b.email, 200);

  if (!vstup.length || !meno || !/.+@.+\..+/.test(email)) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  // suma z katalógu — klientovi neveríme ani cenu, ani počet položiek
  const prepocet = prepocitaj(await nacitajSkrinky(), await nacitajAkvaria(), vstup, b.odber === true);
  if (!prepocet.ok) {
    return NextResponse.json({ ok: false, error: prepocet.dovod }, { status: 400 });
  }
  const { spolu, doprava, zaloha, doplatok } = prepocet;

  /* Číslo objednávky: deň + čas na sekundy, čitateľné pri telefonáte.
     Do 13. 10. 2026 bolo len na minúty — dve objednávky v tej istej minúte
     dostali rovnaké číslo aj variabilný symbol a platby sa nedali rozlíšiť. */
  const d = new Date();
  const dd = (n: number) => String(n).padStart(2, "0");
  const cislo = `AQ${d.getFullYear()}${dd(d.getMonth() + 1)}${dd(d.getDate())}-${dd(d.getHours())}${dd(d.getMinutes())}${dd(d.getSeconds())}`;
  // variabilný symbol: najviac 10 číslic → DDMM + HHMMSS
  const vs = `${dd(d.getDate())}${dd(d.getMonth() + 1)}${dd(d.getHours())}${dd(d.getMinutes())}${dd(d.getSeconds())}`;

  // QR platby — len keď je nastavený firemný IBAN. Dva formáty:
  //  pbs = Pay by Square (slovenské banky)
  //  spd = QR Platba / Short Payment Descriptor (české banky — má pole X-VS,
  //        takže variabilný symbol prejde aj pri SEPA platbe z ČR)
  const iban = process.env.FIRMA_IBAN?.replace(/\s+/g, "").toUpperCase() || null;
  const firma = process.env.FIRMA_NAZOV || "AQUAPRIME";
  // BIC je pri zahraničnom IBAN-e (napr. Revolut, LT) istota pre staršie bankové appky
  const bic = process.env.FIRMA_BIC?.replace(/\s+/g, "").toUpperCase() || undefined;
  let pbs: string | null = null;
  let spd: string | null = null;
  if (iban && zaloha > 0) {
    try {
      pbs = encode({
        payments: [
          {
            type: PaymentOptions.PaymentOrder,
            amount: zaloha,
            currencyCode: CurrencyCode.EUR,
            variableSymbol: vs,
            bankAccounts: [{ iban, bic }],
            paymentNote: `Zaloha ${cislo}`,
            beneficiary: { name: firma },
          },
        ],
      });
    } catch (e) {
      console.warn("PayBySquare sa nepodarilo vygenerovať:", e);
    }
    spd = [
      "SPD*1.0",
      `ACC:${iban}${bic ? `+${bic}` : ""}`,
      `AM:${zaloha.toFixed(2)}`,
      "CC:EUR",
      `X-VS:${vs}`,
      `MSG:ZALOHA ${cislo}`,
      `RN:${firma.normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase().slice(0, 35)}`,
    ].join("*");
  }

  /* Údaje do šablóny mailu — rovnaké bloky použije interné oznámenie
     aj potvrdenie zákazníkovi, len s iným úvodom. */
  const platbaRiadky: [string, string][] = iban
    ? [
        ["IBAN", iban.replace(/(.{4})/g, "$1 ").trim()],
        ...(bic ? ([["BIC / SWIFT", bic]] as [string, string][]) : []),
        ["Variabilný symbol", vs],
        ["Poznámka", `Zaloha ${cislo}`],
      ]
    : [];

  // názov a variant sú text z karty v košíku (dekor, nožičky…); cena je z katalógu
  const polozkyRiadky: [string, string][] = prepocet.polozky.map((p, i) => {
    const nazov = text(vstup[i]?.nazov, 120) || p.slug;
    const variant = text(vstup[i]?.variant, 160);
    return [`${nazov}${variant ? ` · ${variant}` : ""}`, `${p.ks} × ${eur(p.cena)}`];
  });

  const suhrnRiadky: [string, string][] = [
    ...polozkyRiadky,
    ["Doprava", doprava === 0 ? "zdarma" : eur(doprava)],
    ["Spolu", eur(spolu)],
  ];

  const adresa = [text(b.ulica, 160), `${text(b.psc, 12)} ${text(b.mesto, 80)}`.trim(), text(b.poschodie, 80)]
    .filter(Boolean)
    .join("\n");
  const tel = text(b.tel, 40);
  const firmaZakaznika = text(b.firma, 120);
  const ico = text(b.ico, 20);
  const dodanie = text(b.dorucenie, 60);
  const platba = text(b.platba, 60);

  const zakaznikRiadky: [string, string][] = [
    ["Meno", meno],
    ["E-mail", email],
    ...(tel ? ([["Telefón", tel]] as [string, string][]) : []),
    ...(firmaZakaznika ? ([["Firma", `${firmaZakaznika}${ico ? `, IČO ${ico}` : ""}`]] as [string, string][]) : []),
    ...(dodanie ? ([["Spôsob dodania", dodanie]] as [string, string][]) : []),
    ...(platba ? ([["Platba", platba]] as [string, string][]) : []),
    ["Doručenie", adresa || "—"],
  ];
  const poznamka = text(b.poznamka, 2000);

  const platbaBloky: MailBlok[] = [
    {
      typ: "suma",
      popis: "Záloha 30 %",
      hodnota: eur(zaloha),
      poznamka: iban
        ? `Zvyšok ${eur(doplatok)} zaplatíte pri prevzatí.`
        : `Platobné údaje k zálohe pošleme v samostatnom e-maile. Zvyšok ${eur(doplatok)} zaplatíte pri prevzatí.`,
    },
    ...(platbaRiadky.length ? ([{ typ: "tabulka", riadky: platbaRiadky }] as MailBlok[]) : []),
    ...(iban
      ? ([
          {
            typ: "text",
            text: `Platíte z Česka alebo zo zahraničia? Variabilný symbol sa tam zadať nedá — do správy pre príjemcu napíšte /VS${vs}/ alebo číslo objednávky ${cislo}. Platbu spárujeme.`,
          },
        ] as MailBlok[])
      : []),
  ];

  if (!mailNastaveny()) {
    // objednávka je platná, len ju zatiaľ nemáme ako odoslať — nech sa nestratí
    // do logov nejdú mená ani e-maily — Vercel ich drží a nie sú na to určené
    console.warn(`OBJEDNÁVKA ${cislo} bez odoslania (mail nie je nastavený): ${prepocet.polozky.length} položiek, ${eur(spolu)}`);
    return NextResponse.json({ ok: true, cislo, vs, zaloha, doplatok, iban, pbs, spd, mailom: false });
  }

  try {
    await posliMail({
      odpovedatNa: email,
      predmet: `Objednávka ${cislo} — ${meno} — ${eur(spolu)}`,
      html: mailHtml({
        nahlad: `${meno} — ${eur(spolu)}`,
        eyebrow: `Objednávka ${cislo}`,
        titul: `${meno} objednal za ${eur(spolu)}`,
        bloky: [
          { typ: "tabulka", riadky: suhrnRiadky },
          { typ: "tabulka", riadky: zakaznikRiadky },
          ...(poznamka ? ([{ typ: "citat", nadpis: "Poznámka zákazníka", text: poznamka }] as MailBlok[]) : []),
          ...platbaBloky,
          { typ: "tlacidlo", text: "Odpovedať zákazníkovi", href: `mailto:${email}` },
        ],
        zaver: "Odpoveď na tento mail ide priamo zákazníkovi.",
      }),
    });
    await posliMail({
      komu: email,
      predmet: `Vaša objednávka ${cislo} — AQUAPRIME`,
      html: mailHtml({
        nahlad: `Objednávka ${cislo} je u nás. Záloha ${eur(zaloha)}.`,
        eyebrow: `Objednávka ${cislo}`,
        titul: `Ďakujeme${meno ? `, ${meno.split(" ")[0]}` : ""}.`,
        perex:
          "Objednávku máme u seba a ozveme sa vám v pracovný deň s potvrdením termínu. Výroba sa spúšťa po uhradení zálohy, zvyšok zaplatíte až pri prevzatí.",
        bloky: [
          ...platbaBloky,
          {
            typ: "obrazok",
            src: "https://aquaprime.sk/mail/skrinka.jpg",
            popis: "Každá skrinka stojí na zváranom oceľovom ráme.",
          },
          { typ: "tabulka", riadky: suhrnRiadky },
          { typ: "tabulka", riadky: zakaznikRiadky },
          ...(poznamka ? ([{ typ: "citat", nadpis: "Vaša poznámka", text: poznamka }] as MailBlok[]) : []),
        ],
        zaver: "Ak treba čokoľvek upraviť, stačí odpovedať na tento e-mail.",
      }),
    }).catch(() => null);
    return NextResponse.json({ ok: true, cislo, vs, zaloha, doplatok, iban, pbs, spd, mailom: true });
  } catch (e) {
    console.error(`OBJEDNÁVKA ${cislo} — odoslanie zlyhalo`, e);
    return NextResponse.json({ ok: true, cislo, vs, zaloha, doplatok, iban, pbs, spd, mailom: false });
  }
}
