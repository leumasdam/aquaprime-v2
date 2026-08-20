// Serverové dáta pre administráciu — všetko, čo sa dá vyčítať priamo
// z katalógu a z prostredia, bez externých služieb. Počíta sa pri každom
// requeste, takže čísla vždy sedia s tým, čo je nasadené.

import { PRODUCTS } from "./products";
import { AQUARIUMS, aquariumPriceValue } from "./aquariums";
import { SKRYTY_PRED_VYHLADAVACMI } from "./site-config";

function cenaNaCislo(cena: string): number {
  const n = parseFloat(cena.replace(/[^\d,\.]/g, "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

export function katalogStats() {
  const dekory = PRODUCTS.flatMap((p) => p.decors.map((d) => ({ p, d })));
  const vlastne = dekory.filter(({ d }) => !d.inherited && !d.illuFrom);
  const inyRozmer = dekory.filter(({ d }) => d.illuFrom === "rozmer");
  const inyRad = dekory.filter(({ d }) => d.illuFrom === "rad");

  const cenySkriniek = PRODUCTS.map((p) => cenaNaCislo(p.price)).filter((n) => n > 0);
  const cenyAkvarii = AQUARIUMS.map(aquariumPriceValue).filter((n) => n > 0);

  return {
    skrinky: {
      pocet: PRODUCTS.length,
      rady: {
        premium: PRODUCTS.filter((p) => p.tier === "premium").length,
        standard: PRODUCTS.filter((p) => p.tier === "standard").length,
        basic: PRODUCTS.filter((p) => p.tier === "basic").length,
      },
      cenaOd: Math.min(...cenySkriniek),
      cenaDo: Math.max(...cenySkriniek),
      sLed: PRODUCTS.filter((p) => p.priceLed).length,
    },
    akvaria: {
      pocet: AQUARIUMS.length,
      sVlastnymTextom: AQUARIUMS.filter((a) => a.featured).length,
      cenaOd: Math.min(...cenyAkvarii),
      cenaDo: Math.max(...cenyAkvarii),
    },
    fotky: {
      variantovSpolu: dekory.length,
      vlastne: vlastne.length,
      fotoInehoRozmeru: inyRozmer.length,
      fotoInehoRadu: inyRad.length,
      /** varianty, kde treba dofotiť — dekor je nafotený len na inom rade */
      naDofotenie: inyRad.map(({ p, d }) => `${p.name} — ${d.name}`),
    },
  };
}

export function integracie() {
  const ma = (k: string) => Boolean(process.env[k]);
  return {
    resend: ma("RESEND_API_KEY") && ma("DOPYT_TO") && ma("DOPYT_FROM"),
    ga4: ma("GA4_PROPERTY_ID") && ma("GOOGLE_SA_EMAIL") && ma("GOOGLE_SA_KEY"),
    gsc: ma("GOOGLE_SA_EMAIL") && ma("GOOGLE_SA_KEY"),
    gtmNaWebe: ma("NEXT_PUBLIC_GTM_ID"),
    ga4NaWebe: ma("NEXT_PUBLIC_GA4_ID"),
    ai: ma("ANTHROPIC_API_KEY"),
    iban: ma("FIRMA_IBAN"),
    zamokWebu: ma("SITE_PASSWORD"),
    adminHeslo: ma("ADMIN_PASSWORD"),
  };
}

export function zdravieWebu() {
  const i = integracie();
  const stats = katalogStats();
  // checklist zoradený podľa dôležitosti — čo blokuje ostrý štart
  return [
    {
      id: "zamok",
      ok: !i.zamokWebu && !SKRYTY_PRED_VYHLADAVACMI,
      titul: i.zamokWebu ? "Web je zamknutý heslom" : "Web je verejný",
      detail: i.zamokWebu
        ? "Návštevníci sa bez hesla nedostanú dnu. Odomknúť: zmazať SITE_PASSWORD vo Verceli."
        : SKRYTY_PRED_VYHLADAVACMI
          ? "Web je verejný, ale vyhľadávače ho ignorujú (noindex)."
          : "Web je verejný a indexuje sa.",
    },
    {
      id: "noindex",
      ok: !SKRYTY_PRED_VYHLADAVACMI,
      titul: SKRYTY_PRED_VYHLADAVACMI ? "Skrytý pred Googlom (noindex)" : "Indexovanie zapnuté",
      detail: SKRYTY_PRED_VYHLADAVACMI
        ? "Zámerne — kým nie sú potvrdené ceny a reálne realizácie. Prepína sa v app/site-config.ts."
        : "Sitemap sa ponúka vyhľadávačom.",
    },
    {
      id: "maily",
      ok: i.resend,
      titul: i.resend ? "Odosielanie mailov funguje" : "Maily z formulárov sa neodosielajú",
      detail: i.resend
        ? "Resend nakonfigurovaný — dopyty aj objednávky chodia mailom."
        : "Chýba Resend účet + kľúče (RESEND_API_KEY, DOPYT_TO, DOPYT_FROM). Objednávky sa zatiaľ len logujú.",
    },
    {
      id: "analytika",
      ok: i.ga4NaWebe || i.gtmNaWebe,
      titul: i.ga4NaWebe || i.gtmNaWebe ? "Meranie návštevnosti beží" : "Návštevnosť sa nemeria",
      detail: i.ga4NaWebe || i.gtmNaWebe
        ? "GA4/GTM skript je na webe."
        : "Na webe nie je merací kód — treba NEXT_PUBLIC_GA4_ID (alebo NEXT_PUBLIC_GTM_ID).",
    },
    {
      id: "platby",
      ok: i.iban,
      titul: i.iban
        ? "Zálohy cez QR platbu fungujú"
        : "Chýba IBAN pre zálohové platby",
      detail: i.iban
        ? "Zákazník dostane po objednávke QR kód na zálohu 30 % (slovenský aj český formát). Kartová brána zatiaľ nie je — čaká sa na výber (Stripe vs GoPay/Besteron)."
        : "Objednávkový systém počíta zálohu 30 %, ale bez premennej FIRMA_IBAN sa QR kód nevygeneruje a zákazníkovi sa zobrazí len „údaje pošleme e-mailom“.",
    },
    {
      id: "fotky",
      ok: stats.fotky.fotoInehoRadu === 0,
      titul:
        stats.fotky.fotoInehoRadu === 0
          ? "Všetky varianty majú použiteľné foto"
          : `${stats.fotky.fotoInehoRadu} variantov čaká na dofotenie`,
      detail:
        stats.fotky.fotoInehoRadu === 0
          ? "Katalóg je foto-kompletný."
          : "Dekory nafotené len na inom rade skriniek — zoznam v prehľade katalógu.",
    },
    {
      id: "realizacie",
      ok: false,
      titul: "Realizácie sú ukážkové",
      detail: "Sekcia Realizácie čaká na skutočné fotky a texty od klienta.",
    },
    {
      id: "podmienky",
      ok: false,
      titul: "Právne texty sú návrh",
      detail:
        "Obchodné podmienky, reklamačný poriadok aj GDPR sú na webe ako draft — doplniť firemné údaje (IČO, sídlo, e-mail) a dať skontrolovať právnikovi.",
    },
  ];
}
