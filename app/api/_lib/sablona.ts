/**
 * HTML šablóna pre všetky maily z webu.
 *
 * Písané tak, ako to poštové klienty znesú: tabuľky namiesto flexu, štýly
 * priamo na prvkoch, žiadne webfonty ani media queries, na ktoré by Outlook
 * nereagoval. Šírka je najviac 600 px a na telefóne sa zúži na displej.
 * Nič v tabuľke nesmie roztiahnuť mail nad displej: telefón by ho potom
 * oddialil, časť by ostala mimo obrazovky a písmo by sa nafúklo cez seba.
 *
 * Mail je svetlý zámerne. Gmail v tmavom režime na iPhone farby prevracia,
 * takže z tmavého mailu robil svetlý s vyblednutým textom. Zo svetlého
 * spraví tmavý a čitateľný, inde ostane čistý biely.
 *
 * Obrázky sa berú z webu (public/mail), aby sa mail nemusel nafukovať
 * prílohami. Gmail si ich prekopíruje na svoje servery.
 */

const WEB = "https://aquaprime.sk";

const BARVA = {
  okolie: "#eef2f1",
  pozadie: "#ffffff",
  panel: "#f5f8f7",
  panelSvetly: "#ffffff",
  linka: "#dde4e2",
  text: "#121716",
  textTlmeny: "#55615d",
  cyan: "#007f9f",
};

/** dlhší popis (názov produktu) sa do úzkeho stĺpca nezmestí, ide na celý riadok */
const DLHY_POPIS = 26;

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

function riadokTabulky([k, v]: Riadok, i: number, pocet: number): string {
  const bunka = `background:${i % 2 ? BARVA.panel : BARVA.panelSvetly};border-bottom:${i === pocet - 1 ? "0" : `1px solid ${BARVA.linka}`}`;
  if (k.length > DLHY_POPIS) {
    return `<tr><td colspan="2" style="padding:13px 16px;${bunka}">
          <div style="font-family:${PISMO};font-size:14px;line-height:1.45;font-weight:600;color:${BARVA.text};word-break:break-word">${esc(k)}</div>
          <div style="font-family:${PISMO};font-size:14px;line-height:1.45;font-weight:400;color:${BARVA.textTlmeny};margin-top:4px">${nl(v)}</div>
        </td></tr>`;
  }
  return `<tr>
          <td style="padding:13px 0 13px 16px;${bunka};font-family:${PISMO};font-size:10px;line-height:1.4;font-weight:600;letter-spacing:1.4px;text-transform:uppercase;color:${BARVA.textTlmeny};white-space:nowrap;vertical-align:top">${esc(k)}</td>
          <td style="padding:13px 16px 13px 12px;${bunka};font-family:${PISMO};font-size:15px;line-height:1.5;font-weight:400;color:${BARVA.text};text-align:right;word-break:break-word">${nl(v)}</td>
        </tr>`;
}

function blok(b: MailBlok): string {
  switch (b.typ) {
    case "text":
      return `<p style="margin:0 0 16px;font-family:${PISMO};font-size:15px;line-height:1.7;font-weight:400;color:${BARVA.textTlmeny}">${nl(b.text)}</p>`;

    case "tabulka":
      return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 22px;border:1px solid ${BARVA.linka};border-radius:10px;border-collapse:separate;overflow:hidden">
        ${b.riadky.map((r, i) => riadokTabulky(r, i, b.riadky.length)).join("")}
      </table>`;

    case "citat":
      return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 22px">
        <tr><td style="padding:16px 20px;background:${BARVA.panel};border-left:3px solid ${BARVA.cyan};border-radius:0 10px 10px 0">
          ${b.nadpis ? `<div style="font-family:${PISMO};font-size:10px;line-height:1.4;font-weight:600;letter-spacing:1.6px;text-transform:uppercase;color:${BARVA.cyan};margin-bottom:8px">${esc(b.nadpis)}</div>` : ""}
          <div style="font-family:${PISMO};font-size:15px;line-height:1.7;font-weight:400;color:${BARVA.text}">${nl(b.text)}</div>
        </td></tr>
      </table>`;

    case "suma":
      return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 22px">
        <tr><td style="padding:20px;background:${BARVA.panel};border:1px solid ${BARVA.cyan};border-radius:10px;text-align:center">
          <div style="font-family:${PISMO};font-size:10px;line-height:1.4;font-weight:600;letter-spacing:1.8px;text-transform:uppercase;color:${BARVA.textTlmeny};margin-bottom:8px">${esc(b.popis)}</div>
          <div style="font-family:${PATKOVE};font-size:30px;line-height:1.15;font-weight:400;color:${BARVA.cyan}">${esc(b.hodnota)}</div>
          ${b.poznamka ? `<div style="font-family:${PISMO};font-size:13px;line-height:1.6;font-weight:400;color:${BARVA.textTlmeny};margin-top:8px">${nl(b.poznamka)}</div>` : ""}
        </td></tr>
      </table>`;

    case "obrazok":
      return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 22px">
        <tr><td style="text-align:center">
          <img src="${esc(b.src)}" width="520" alt="${esc(b.popis ?? "")}" style="display:block;width:100%;max-width:520px;height:auto;margin:0 auto;border:0;border-radius:10px"/>
        </td></tr>
        ${b.popis ? `<tr><td style="padding-top:8px;font-family:${PISMO};font-size:12px;line-height:1.5;font-weight:400;color:${BARVA.textTlmeny};text-align:center">${esc(b.popis)}</td></tr>` : ""}
      </table>`;

    case "tlacidlo":
      return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 24px">
        <tr><td style="background:${BARVA.cyan};border-radius:6px">
          <a href="${esc(b.href)}" style="display:inline-block;padding:14px 28px;font-family:${PISMO};font-size:11px;line-height:1;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#ffffff;text-decoration:none">${esc(b.text)}</a>
        </td></tr>
      </table>`;
  }
}

export function mailHtml(o: MailObsah): string {
  return `<!doctype html>
<html lang="sk"><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="color-scheme" content="light"/>
<meta name="supported-color-schemes" content="light"/>
<title>${esc(o.titul)}</title>
</head>
<body style="margin:0;padding:0;background:${BARVA.okolie};-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(o.nahlad)}</div>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${BARVA.okolie}">
<tr><td align="center" style="padding:20px 8px">
  <!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->

  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;max-width:600px;background:${BARVA.pozadie};border:1px solid ${BARVA.linka};border-radius:16px;overflow:hidden">

    <!-- hlavička: logo je priamo v obrázku, Gmail pozadia a farby upravuje -->
    <tr><td style="font-size:0;line-height:0">
      <img src="${WEB}/mail/hlavicka-logo.jpg" width="600" alt="AQUAPRIME" style="display:block;width:100%;max-width:600px;height:auto;border:0"/>
    </td></tr>
    <tr><td style="height:3px;background:${BARVA.cyan};font-size:0;line-height:0">&nbsp;</td></tr>

    <!-- telo -->
    <tr><td style="padding:26px 20px">
      <div style="font-family:${PISMO};font-size:10px;line-height:1.4;font-weight:700;letter-spacing:2.2px;text-transform:uppercase;color:${BARVA.cyan};margin-bottom:12px">${esc(o.eyebrow)}</div>
      <h1 style="margin:0 0 ${o.perex ? "14px" : "22px"};font-family:${PATKOVE};font-size:27px;line-height:1.25;font-weight:400;color:${BARVA.text}">${nl(o.titul)}</h1>
      ${o.perex ? `<p style="margin:0 0 24px;font-family:${PISMO};font-size:15px;line-height:1.7;font-weight:400;color:${BARVA.textTlmeny}">${nl(o.perex)}</p>` : ""}
      ${o.bloky.map(blok).join("\n")}
    </td></tr>

    <!-- pätička -->
    <tr><td style="padding:22px 20px 24px;background:${BARVA.panel};border-top:1px solid ${BARVA.linka}">
      ${o.zaver ? `<p style="margin:0 0 16px;font-family:${PISMO};font-size:14px;line-height:1.7;font-weight:400;color:${BARVA.textTlmeny}">${nl(o.zaver)}</p>` : ""}
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td style="font-family:${PISMO};font-size:13px;line-height:1.8;font-weight:400;color:${BARVA.textTlmeny};word-break:break-word">
            <strong style="color:${BARVA.text};font-weight:600">AQUAPRIME</strong><br/>
            Akváriá a skrinky na mieru<br/>
            <a href="mailto:patrikranda225@gmail.com" style="color:${BARVA.cyan};text-decoration:none">patrikranda225@gmail.com</a><br/>
            <a href="${WEB}" style="color:${BARVA.cyan};text-decoration:none">aquaprime.sk</a>
          </td>
          <td align="right" style="font-family:${PISMO};font-size:12px;line-height:1.7;font-weight:400;color:${BARVA.textTlmeny};vertical-align:bottom">
            <a href="${WEB}/skrinky" style="color:${BARVA.textTlmeny};text-decoration:none">Skrinky</a> &nbsp;·&nbsp;
            <a href="${WEB}/akvaria" style="color:${BARVA.textTlmeny};text-decoration:none">Akváriá</a><br/>
            <a href="${WEB}/sety" style="color:${BARVA.textTlmeny};text-decoration:none">Sety</a> &nbsp;·&nbsp;
            <a href="${WEB}/realizacie" style="color:${BARVA.textTlmeny};text-decoration:none">Realizácie</a>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>

  <div style="margin-top:16px;font-family:${PISMO};font-size:11px;line-height:1.6;font-weight:400;color:${BARVA.textTlmeny}">Vyrobené na Slovensku · © ${new Date().getFullYear()} AQUAPRIME</div>
  <!--[if mso]></td></tr></table><![endif]-->

</td></tr>
</table>
</body></html>`;
}
