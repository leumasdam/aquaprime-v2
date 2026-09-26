/**
 * Náhľad mailových šablón do HTML súboru, nech sa dajú pozrieť bez posielania.
 *
 *   node scripts/nahlad-mailu.mjs            # do scratchpadu
 *   node scripts/nahlad-mailu.mjs cesta.html
 *
 * Skladá tie isté bloky, aké posielajú /api/dopyt a /api/objednavka, takže
 * čo je v náhľade, to príde aj do schránky.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const KOREN = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

/* sablona.ts je TypeScript — prepíšeme ho na JS a načítame ako modul */
const zdroj = fs
  .readFileSync(path.join(KOREN, "app/api/_lib/sablona.ts"), "utf8")
  .replace(/^export type[\s\S]*?^};$/gm, "")
  .replace(/^export type .*$/gm, "")
  .replace(/: MailBlok\b/g, "")
  .replace(/: MailObsah\b/g, "")
  .replace(/: string\b/g, "")
  .replace(/\(s: string\)/g, "(s)")
  .replace(/\(b: MailBlok\)/g, "(b)")
  .replace(/\(o: MailObsah\)/g, "(o)")
  .replace(/ as \w+\b/g, "")
  .replace(/!\]/g, "]")
  .replace(/\}\)\[c\]!/g, "})[c]");
const docasny = path.join(KOREN, "scripts", "_sablona.mjs");
fs.writeFileSync(docasny, zdroj, "utf8");
const { mailHtml } = await import("file://" + docasny.replace(/\\/g, "/"));
fs.unlinkSync(docasny);

const eur = (n) => `${n.toFixed(2).replace(".", ",")} €`;

const dopytFirme = mailHtml({
  nahlad: "Samuel Zenko — Skrinka na mieru",
  eyebrow: "Nový dopyt z webu",
  titul: "Samuel Zenko",
  perex: "Téma: Skrinka na mieru",
  bloky: [
    {
      typ: "tabulka",
      riadky: [
        ["Téma", "Skrinka na mieru"],
        ["Rozmer", "150 × 50 × 80 cm"],
        ["Dopočítané", "asi 375 l"],
        ["Meno", "Samuel Zenko"],
        ["E-mail", "samuel.zenko@gmail.com"],
        ["Telefón", "+421 900 000 000"],
      ],
    },
    {
      typ: "citat",
      nadpis: "Správa od zákazníka",
      text:
        "Dobrý deň, mám záujem o skrinku PREMIUM v dekore Dub Hunton.\nPotrebujem ju do obývačky k stene, kde je zásuvka vpravo dole.",
    },
    { typ: "tlacidlo", text: "Odpovedať", href: "mailto:samuel.zenko@gmail.com" },
  ],
  zaver: "Odpoveď na tento mail ide priamo zákazníkovi.",
});

const dopytZakaznikovi = mailHtml({
  nahlad: "Máme vašu správu a ozveme sa v pracovný deň.",
  eyebrow: "Ďakujeme za správu",
  titul: "Dobrý deň, Samuel.",
  perex:
    "Vaša správa nám dorazila. Pozrieme si ju a ozveme sa najneskôr nasledujúci pracovný deň.",
  bloky: [
    {
      typ: "citat",
      nadpis: "Čo ste nám napísali",
      text: "Dobrý deň, mám záujem o skrinku PREMIUM v dekore Dub Hunton.",
    },
    {
      typ: "obrazok",
      src: "https://aquaprime.sk/mail/skrinka.jpg",
      popis: "Skrinky staviame na zváranom oceľovom ráme 30 × 30 mm.",
    },
    { typ: "text", text: "Kým čakáte, môžete si pozrieť ponuku rozmerov a dekorov." },
    { typ: "tlacidlo", text: "Prezrieť skrinky", href: "https://aquaprime.sk/skrinky" },
  ],
  zaver: "Ak chcete niečo doplniť, stačí odpovedať na tento e-mail.",
});

const objednavka = mailHtml({
  nahlad: "Objednávka AQ-2609-014 je u nás. Záloha 108,00 €.",
  eyebrow: "Objednávka AQ-2609-014",
  titul: "Ďakujeme, Samuel.",
  perex:
    "Objednávku máme u seba a ozveme sa vám v pracovný deň s potvrdením termínu. Výroba sa spúšťa po uhradení zálohy, zvyšok zaplatíte až pri prevzatí.",
  bloky: [
    {
      typ: "suma",
      popis: "Záloha 30 %",
      hodnota: eur(108),
      poznamka: `Zvyšok ${eur(252)} zaplatíte pri prevzatí.`,
    },
    {
      typ: "tabulka",
      riadky: [
        ["IBAN", "SK31 1200 0000 1987 4263 7541"],
        ["Variabilný symbol", "2609014"],
        ["Poznámka", "Zaloha AQ-2609-014"],
      ],
    },
    {
      typ: "obrazok",
      src: "https://aquaprime.sk/mail/skrinka.jpg",
      popis: "Každá skrinka stojí na zváranom oceľovom ráme 30 × 30 mm.",
    },
    {
      typ: "tabulka",
      riadky: [
        ["PREMIUM 150 × 50 × 80 · Dub Hunton / Black Matt", `1 × ${eur(360)}`],
        ["Doprava", "zdarma"],
        ["Spolu", eur(360)],
      ],
    },
    {
      typ: "tabulka",
      riadky: [
        ["Meno", "Samuel Zenko"],
        ["E-mail", "samuel.zenko@gmail.com"],
        ["Telefón", "+421 900 000 000"],
        ["Doručenie", "Hlavná 12\n811 01 Bratislava\n3. poschodie, výťah"],
      ],
    },
  ],
  zaver: "Ak treba čokoľvek upraviť, stačí odpovedať na tento e-mail.",
});

const ciel =
  process.argv[2] ??
  path.join(process.env.TEMP ?? "/tmp", "aquaprime-maily.html");

const strana = `<!doctype html><meta charset="utf-8"><title>Náhľad mailov AQUAPRIME</title>
<body style="margin:0;background:#1b1f1e;font-family:system-ui,sans-serif">
${[
  ["Dopyt — do firmy", dopytFirme],
  ["Dopyt — potvrdenie zákazníkovi", dopytZakaznikovi],
  ["Objednávka — potvrdenie zákazníkovi", objednavka],
]
  .map(
    ([nazov, html]) => `<div style="padding:26px 0 6px;text-align:center;color:#9aa3a0;font-size:12px;letter-spacing:2px;text-transform:uppercase">${nazov}</div>
<iframe srcdoc="${html.replace(/"/g, "&quot;")}" style="display:block;width:100%;max-width:680px;height:1400px;margin:0 auto;border:0"></iframe>`
  )
  .join("\n")}
</body>`;

fs.writeFileSync(ciel, strana, "utf8");
console.log("náhľad:", ciel);
