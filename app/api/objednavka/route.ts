import { NextResponse } from "next/server";
import { Resend } from "resend";
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

  const platbaBlok = `
    <div style="margin:16px 0;padding:14px 16px;border:1px solid #cfe9f2;background:#f2fafd;border-radius:8px">
      <p style="margin:0 0 6px"><b>Záloha 30 % — ${eur(zaloha)}</b></p>
      ${
        iban
          ? `<p style="margin:0;color:#333">IBAN: <b>${esc(iban.replace(/(.{4})/g, "$1 ").trim())}</b><br/>
             Variabilný symbol: <b>${vs}</b><br/>
             Poznámka: Zaloha ${cislo}</p>
             <p style="margin:8px 0 0;color:#666;font-size:13px">Platíte z Česka alebo zo zahraničia (SEPA)?
             Variabilný symbol sa tam zadať nedá — do správy pre príjemcu napíšte
             <b>/VS${vs}/</b> alebo číslo objednávky <b>${cislo}</b>. Platbu spárujeme.</p>`
          : `<p style="margin:0;color:#333">Platobné údaje k zálohe pošleme v samostatnom e-maile.</p>`
      }
      <p style="margin:8px 0 0;color:#666">Zvyšok ${eur(doplatok)} zaplatíte pri prevzatí.</p>
    </div>`;

  const riadky = polozky
    .map(
      (p) =>
        `<tr>
          <td style="padding:6px 12px 6px 0">${esc(p.nazov)}<br/><span style="color:#777;font-size:12px">${esc(
            p.variant
          )}</span></td>
          <td style="padding:6px 12px;text-align:center">${p.ks}×</td>
          <td style="padding:6px 0;text-align:right;white-space:nowrap"><b>${eur(
            p.cena * p.ks
          )}</b></td>
        </tr>`
    )
    .join("");

  const adresa = [b.ulica, `${b.psc ?? ""} ${b.mesto ?? ""}`.trim(), b.poschodie]
    .filter(Boolean)
    .map((x) => esc(String(x)))
    .join("<br/>");

  const suhrn = `
    <div style="font-family:system-ui,-apple-system,sans-serif;font-size:14px;line-height:1.6;color:#111">
      <h2 style="font-size:16px;margin:0 0 4px">Objednávka ${cislo}</h2>
      <table style="width:100%;max-width:520px;border-collapse:collapse;margin:14px 0">
        ${riadky}
        <tr><td colspan="2" style="padding:8px 12px 4px 0;border-top:1px solid #ddd">Doprava</td>
            <td style="padding:8px 0 4px;text-align:right;border-top:1px solid #ddd">${
              Number(b.doprava) === 0 ? "zdarma" : eur(Number(b.doprava))
            }</td></tr>
        <tr><td colspan="2" style="padding:4px 12px 0 0"><b>Spolu</b></td>
            <td style="padding:4px 0 0;text-align:right"><b>${eur(Number(b.spolu))}</b></td></tr>
      </table>
      <p style="margin:0 0 4px;color:#666">Zákazník</p>
      <p style="margin:0 0 14px">
        <b>${esc(meno)}</b><br/>${esc(email)}${b.tel ? `<br/>${esc(String(b.tel))}` : ""}
        ${b.firma ? `<br/>${esc(String(b.firma))}${b.ico ? `, IČO ${esc(String(b.ico))}` : ""}` : ""}
      </p>
      <p style="margin:0 0 4px;color:#666">Doručenie</p>
      <p style="margin:0 0 14px">${adresa}</p>
      ${
        b.poznamka
          ? `<p style="margin:0 0 4px;color:#666">Poznámka</p><p style="white-space:pre-wrap;margin:0">${esc(
              String(b.poznamka)
            )}</p>`
          : ""
      }
    </div>`;

  const key = process.env.RESEND_API_KEY;
  const to = process.env.DOPYT_TO;
  const from = process.env.DOPYT_FROM;

  if (!key || !to || !from) {
    // objednávka je platná, len ju zatiaľ nemáme ako odoslať — nech sa nestratí
    console.warn(`OBJEDNÁVKA ${cislo} bez odoslania (chýba Resend):`, {
      meno,
      email,
      polozky,
      spolu: b.spolu,
    });
    return NextResponse.json({ ok: true, cislo, vs, zaloha, doplatok, iban, pbs, spd, mailom: false });
  }

  try {
    const resend = new Resend(key);
    await resend.emails.send({
      from,
      to: [to],
      replyTo: email,
      subject: `Objednávka ${cislo} — ${meno} — ${eur(Number(b.spolu))}`,
      html: platbaBlok + suhrn,
    });
    await resend.emails
      .send({
        from,
        to: [email],
        subject: `Vaša objednávka ${cislo} — AQUAPRIME`,
        html: `<div style="font-family:system-ui,-apple-system,sans-serif;font-size:14px;line-height:1.7;color:#111">
            <p>Dobrý deň${meno ? `, ${esc(meno.split(" ")[0])}` : ""},</p>
            <p>ďakujeme za objednávku. Máme ju u seba a ozveme sa do 24 hodín
            v pracovný deň s potvrdením termínu. Výroba sa spúšťa po uhradení
            zálohy 30 % — zvyšok zaplatíte až pri prevzatí.</p>
            ${platbaBlok}
            ${suhrn}
            <p style="color:#666;font-size:13px">AQUAPRIME · aquaprime.sk</p>
          </div>`,
      })
      .catch(() => null);
    return NextResponse.json({ ok: true, cislo, vs, zaloha, doplatok, iban, pbs, spd, mailom: true });
  } catch (e) {
    console.error(`OBJEDNÁVKA ${cislo} — odoslanie zlyhalo`, e);
    return NextResponse.json({ ok: true, cislo, vs, zaloha, doplatok, iban, pbs, spd, mailom: false });
  }
}
