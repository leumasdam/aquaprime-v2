/**
 * HTML šablóna pre všetky maily z webu.
 *
 * Písané tak, ako to poštové klienty znesú: tabuľky namiesto flexu, štýly
 * priamo na prvkoch, žiadne webfonty ani media queries, na ktoré by Outlook
 * nereagoval. Šírka 600 px je štandard, na telefóne sa zmestí.
 *
 * Obrázky sa berú z webu (public/mail), aby sa mail nemusel nafukovať
 * prílohami. Gmail si ich prekopíruje na svoje servery.
 */

const WEB = "https://aquaprime.sk";

const BARVA = {
  pozadie: "#0b0e0d",
  panel: "#121716",
  panelSvetly: "#182020",
  linka: "#25302f",
  text: "#f7f6f2",
  textTlmeny: "#a8b2ae",
  cyan: "#009ac0",
};

const PISMO =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const PATKOVE = "Georgia,'Times New Roman',Times,serif";

export type Riadok = [string, string];

export type MailBlok =
  | { typ: "text"; text: string }
  | { typ: "tabulka"; riadky: Riadok[] }
  | { typ: "citat"; nadpis?: string; text: string }
  | { typ: "suma"; popis: string; hodnota: string; poznamka?: string }
  | { typ: "obrazok"; src: string; popis?: string }
  | { typ: "tlacidlo"; text: string; href: string };

export type MailObsah = {
  /** predtitulok v zozname mailov */
  nahlad: string;
  eyebrow: string;
  titul: string;
  perex?: string;
  bloky: MailBlok[];
  /** krátka veta v pätičke nad kontaktmi */
  zaver?: string;
};

const esc = (s: string) =>
  String(s).replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" })[c]!);

const nl = (s: string) => esc(s).replace(/\n/g, "<br/>");

function blok(b: MailBlok): string {
  switch (b.typ) {
    case "text":
      return `<p style="margin:0 0 16px;font:400 15px/1.7 ${PISMO};color:${BARVA.textTlmeny}">${nl(b.text)}</p>`;

    case "tabulka":
      return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 22px;border:1px solid ${BARVA.linka};border-radius:10px;border-collapse:separate;overflow:hidden">
        ${b.riadky
          .map(
            ([k, v], i) => `<tr>
          <td style="padding:13px 18px;background:${i % 2 ? BARVA.panel : BARVA.panelSvetly};border-bottom:${i === b.riadky.length - 1 ? "0" : `1px solid ${BARVA.linka}`};font:600 10px/1.4 ${PISMO};letter-spacing:1.6px;text-transform:uppercase;color:${BARVA.textTlmeny};white-space:nowrap;vertical-align:top">${esc(k)}</td>
          <td style="padding:13px 18px;background:${i % 2 ? BARVA.panel : BARVA.panelSvetly};border-bottom:${i === b.riadky.length - 1 ? "0" : `1px solid ${BARVA.linka}`};font:400 15px/1.5 ${PISMO};color:${BARVA.text};text-align:right">${nl(v)}</td>
        </tr>`
          )
          .join("")}
      </table>`;

    case "citat":
      return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 22px">
        <tr><td style="padding:16px 20px;background:${BARVA.panel};border-left:3px solid ${BARVA.cyan};border-radius:0 10px 10px 0">
          ${b.nadpis ? `<div style="font:600 10px/1.4 ${PISMO};letter-spacing:1.6px;text-transform:uppercase;color:${BARVA.cyan};margin-bottom:8px">${esc(b.nadpis)}</div>` : ""}
          <div style="font:400 15px/1.7 ${PISMO};color:${BARVA.text}">${nl(b.text)}</div>
        </td></tr>
      </table>`;

    case "suma":
      return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 22px">
        <tr><td style="padding:20px;background:${BARVA.panel};border:1px solid ${BARVA.cyan};border-radius:10px;text-align:center">
          <div style="font:600 10px/1.4 ${PISMO};letter-spacing:1.8px;text-transform:uppercase;color:${BARVA.textTlmeny};margin-bottom:8px">${esc(b.popis)}</div>
          <div style="font:400 30px/1.15 ${PATKOVE};color:${BARVA.cyan}">${esc(b.hodnota)}</div>
          ${b.poznamka ? `<div style="font:400 13px/1.6 ${PISMO};color:${BARVA.textTlmeny};margin-top:8px">${nl(b.poznamka)}</div>` : ""}
        </td></tr>
      </table>`;

    case "obrazok":
      return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 22px">
        <tr><td style="background:#ffffff;border-radius:10px;padding:10px;text-align:center">
          <img src="${esc(b.src)}" width="520" alt="${esc(b.popis ?? "")}" style="display:block;width:100%;max-width:520px;height:auto;margin:0 auto;border:0"/>
        </td></tr>
        ${b.popis ? `<tr><td style="padding-top:8px;font:400 12px/1.5 ${PISMO};color:${BARVA.textTlmeny};text-align:center">${esc(b.popis)}</td></tr>` : ""}
      </table>`;

    case "tlacidlo":
      return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 24px">
        <tr><td style="background:${BARVA.cyan};border-radius:6px">
          <a href="${esc(b.href)}" style="display:inline-block;padding:14px 28px;font:700 11px/1 ${PISMO};letter-spacing:2px;text-transform:uppercase;color:${BARVA.pozadie};text-decoration:none">${esc(b.text)}</a>
        </td></tr>
      </table>`;
  }
}

export function mailHtml(o: MailObsah): string {
  return `<!doctype html>
<html lang="sk"><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="color-scheme" content="dark"/>
<meta name="supported-color-schemes" content="dark"/>
<title>${esc(o.titul)}</title>
</head>
<body style="margin:0;padding:0;background:#070a09">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(o.nahlad)}</div>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#070a09">
<tr><td align="center" style="padding:28px 14px">

  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px;max-width:100%;background:${BARVA.pozadie};border:1px solid ${BARVA.linka};border-radius:16px;overflow:hidden">

    <!-- hlavička: logo na zábere -->
    <tr><td style="background:${BARVA.pozadie};background-image:url('${WEB}/mail/hlavicka.jpg');background-size:cover;background-position:center;padding:34px 32px 30px">
      <img src="${WEB}/mail/logo.png" width="190" alt="AQUAPRIME" style="display:block;width:190px;height:auto;border:0"/>
    </td></tr>
    <tr><td style="height:3px;background:${BARVA.cyan};font-size:0;line-height:0">&nbsp;</td></tr>

    <!-- telo -->
    <tr><td style="padding:32px">
      <div style="font:700 10px/1.4 ${PISMO};letter-spacing:2.2px;text-transform:uppercase;color:${BARVA.cyan};margin-bottom:12px">${esc(o.eyebrow)}</div>
      <h1 style="margin:0 0 ${o.perex ? "14px" : "22px"};font:400 27px/1.25 ${PATKOVE};color:${BARVA.text}">${nl(o.titul)}</h1>
      ${o.perex ? `<p style="margin:0 0 24px;font:400 15px/1.7 ${PISMO};color:${BARVA.textTlmeny}">${nl(o.perex)}</p>` : ""}
      ${o.bloky.map(blok).join("\n")}
    </td></tr>

    <!-- pätička -->
    <tr><td style="padding:24px 32px 28px;background:${BARVA.panel};border-top:1px solid ${BARVA.linka}">
      ${o.zaver ? `<p style="margin:0 0 16px;font:400 14px/1.7 ${PISMO};color:${BARVA.textTlmeny}">${nl(o.zaver)}</p>` : ""}
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td style="font:400 13px/1.8 ${PISMO};color:${BARVA.textTlmeny}">
            <strong style="color:${BARVA.text};font-weight:600">AQUAPRIME</strong><br/>
            Akváriá a skrinky na mieru<br/>
            <a href="mailto:patrikranda225@gmail.com" style="color:${BARVA.cyan};text-decoration:none">patrikranda225@gmail.com</a><br/>
            <a href="${WEB}" style="color:${BARVA.cyan};text-decoration:none">aquaprime.sk</a>
          </td>
          <td align="right" style="font:400 12px/1.7 ${PISMO};color:${BARVA.textTlmeny};vertical-align:bottom">
            <a href="${WEB}/skrinky" style="color:${BARVA.textTlmeny};text-decoration:none">Skrinky</a> &nbsp;·&nbsp;
            <a href="${WEB}/akvaria" style="color:${BARVA.textTlmeny};text-decoration:none">Akváriá</a><br/>
            <a href="${WEB}/sety" style="color:${BARVA.textTlmeny};text-decoration:none">Sety</a> &nbsp;·&nbsp;
            <a href="${WEB}/realizacie" style="color:${BARVA.textTlmeny};text-decoration:none">Realizácie</a>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>

  <div style="margin-top:16px;font:400 11px/1.6 ${PISMO};color:#5c6663">Vyrobené na Slovensku · © ${new Date().getFullYear()} AQUAPRIME</div>

</td></tr>
</table>
</body></html>`;
}
