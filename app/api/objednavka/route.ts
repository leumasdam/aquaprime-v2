import { NextResponse } from "next/server";
import { mailNastaveny, posliMail } from "../_lib/mail";
import { mailHtml, type MailBlok } from "../_lib/sablona";
import { encode, PaymentOptions, CurrencyCode } from "bysquare/pay";
import { ipZ, prekrocenyLimit } from "../_lib/limit";

/**
 * Príjem objednávky. Objednávka sa musí prijať aj vtedy, keď e-mail zlyhá —
 * preto sa číslo objednávky vytvorí vždy a stav odoslania sa vráti zvlášť.
 * Do databázy to pôjde, keď ju nasadíme; dovtedy je nosičom e-mail.
 */

type Polozka = {
  nazov: string;
  variant: string;
  cena: number;
  ks: number;
  druh: string;
  slug: string;
};

const esc = (s: string) =>
  String(s).replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c]!);

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

  const polozky = (b.polozky as Polozka[]) ?? [];
  const meno = String(b.meno ?? "").trim();
  const email = String(b.email ?? "").trim();

  if (!polozky.length || !meno || !/.+@.+\..+/.test(email)) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  // číslo objednávky: rok + poradie podľa času, čitateľné pri telefonáte
  const d = new Date();
  const cislo = `AQ${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(
    d.getDate()
  ).padStart(2, "0")}-${String(d.getHours()).padStart(2, "0")}${String(
    d.getMinutes()
  ).padStart(2, "0")}`;

  // záloha 30 % vopred, zvyšok pri prevzatí; VS = numerická podoba času (10 číslic)
  const spolu = Number(b.spolu) || 0;
  const zaloha = Math.round(spolu * 0.3 * 100) / 100;
  const doplatok = Math.round((spolu - zaloha) * 100) / 100;
  const vs = `${String(d.getDate()).padStart(2, "0")}${String(d.getMonth() + 1).padStart(2, "0")}${String(
    d.getFullYear()
  ).slice(-2)}${String(d.getHours()).padStart(2, "0")}${String(d.getMinutes()).padStart(2, "0")}`;

  // QR platby — len keď je nastavený firemný IBAN. Dva formáty:
  //  pbs = Pay by Square (slovenské banky)
  //  spd = QR Platba / Short Payment Descriptor (české banky — má pole X-VS,
  //        takže variabilný symbol prejde aj pri SEPA platbe z ČR)
  const iban = process.env.FIRMA_IBAN?.replace(/\s+/g, "").toUpperCase() || null;
  const firma = process.env.FIRMA_NAZOV || "AQUAPRIME";
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
            bankAccounts: [{ iban }],
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
      `ACC:${iban}`,
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
        ["Variabilný symbol", vs],
        ["Poznámka", `Zaloha ${cislo}`],
      ]
    : [];

  const polozkyRiadky: [string, string][] = polozky.map((p) => [
    `${p.nazov}${p.variant ? ` · ${p.variant}` : ""}`,
    `${p.ks} × ${eur(p.cena)}`,
  ]);

  const suhrnRiadky: [string, string][] = [
    ...polozkyRiadky,
    ["Doprava", Number(b.doprava) === 0 ? "zdarma" : eur(Number(b.doprava))],
    ["Spolu", eur(Number(b.spolu))],
  ];

  const adresa = [b.ulica, `${b.psc ?? ""} ${b.mesto ?? ""}`.trim(), b.poschodie]
    .filter(Boolean)
    .map(String)
    .join("\n");

  const zakaznikRiadky: [string, string][] = [
    ["Meno", meno],
    ["E-mail", email],
    ...(b.tel ? ([["Telefón", String(b.tel)]] as [string, string][]) : []),
    ...(b.firma
      ? ([["Firma", `${String(b.firma)}${b.ico ? `, IČO ${String(b.ico)}` : ""}`]] as [string, string][])
      : []),
    ["Doručenie", adresa],
  ];

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
    console.warn(`OBJEDNÁVKA ${cislo} bez odoslania (mail nie je nastavený):`, {
      meno,
      email,
      polozky,
      spolu: b.spolu,
    });
    return NextResponse.json({ ok: true, cislo, vs, zaloha, doplatok, iban, pbs, spd, mailom: false });
  }

  try {
    await posliMail({
      odpovedatNa: email,
      predmet: `Objednávka ${cislo} — ${meno} — ${eur(Number(b.spolu))}`,
      html: mailHtml({
        nahlad: `${meno} — ${eur(Number(b.spolu))}`,
        eyebrow: `Objednávka ${cislo}`,
        titul: `${meno} objednal za ${eur(Number(b.spolu))}`,
        bloky: [
          { typ: "tabulka", riadky: suhrnRiadky },
          { typ: "tabulka", riadky: zakaznikRiadky },
          ...(b.poznamka
            ? ([{ typ: "citat", nadpis: "Poznámka zákazníka", text: String(b.poznamka) }] as MailBlok[])
            : []),
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
            popis: "Každá skrinka stojí na zváranom oceľovom ráme 30 × 30 mm.",
          },
          { typ: "tabulka", riadky: suhrnRiadky },
          { typ: "tabulka", riadky: zakaznikRiadky },
          ...(b.poznamka
            ? ([{ typ: "citat", nadpis: "Vaša poznámka", text: String(b.poznamka) }] as MailBlok[])
            : []),
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
