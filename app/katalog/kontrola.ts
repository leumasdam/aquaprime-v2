/**
 * Kontrola a úprava skrinky pred uložením z administrácie.
 *
 * Web má o zverejnenej skrinke isté predpoklady: aspoň jeden nafotený
 * dekor, titulná fotka z prvého dekoru, rozmer v nadpise sedí s číslami.
 * Karty, galéria, košík aj konfigurátor s tým počítajú bez ďalších
 * podmienok. Tento súbor tie predpoklady stráži na jedinom mieste — pri
 * ukladaní. Čo prejde, to web vie ukázať.
 *
 * Beží na serveri (API pri ukladaní) aj v prehliadači (editor ukazuje
 * chyby ešte pred odoslaním). Preto tu nie je nič serverové.
 */

import { TIERS, type Decor, type Product, type Tier } from "../products";

export type Chyba = {
  /** ktorej skrinky sa týka */
  slug: string;
  /** pole vo formulári, pri ktorom sa chyba ukáže; "" = celá skrinka */
  pole: string;
  sprava: string;
};

/* ---------------- povolené hodnoty ---------------- */

/**
 * Fotky smú byť len z webu samotného: pôvodné súbory v /img/ alebo fotky
 * nahraté v administrácii, ktoré sa servírujú cez /foto/katalog/fotky/
 * (pri vývoji /foto/katalog-test/fotky/).
 * Cudzie adresy by obišli ochranu obsahu a mohli by podvrhnúť čokoľvek.
 */
export function povolenaFotka(src: string): boolean {
  if (typeof src !== "string" || src.includes("..") || /[\s"'<>]/.test(src)) return false;
  return /^\/img\/[\w\-/.]+\.(webp|png|jpe?g|svg)$/i.test(src) || /^\/foto\/katalog(-test)?\/fotky\/[\w\-/]+\.(webp|png|jpe?g)$/i.test(src);
}

/** vzorka dekoru: farba #rrggbb alebo textúra ako fotka */
export function povolenaVzorka(v: string): boolean {
  return /^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(v) || povolenaFotka(v);
}

export const SLUG_VZOR = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/* ---------------- ceny ---------------- */

/** „335 €" → 335, „Na dopyt" alebo prázdne → null */
export function cenaZTextu(text: string | undefined): number | null {
  if (!text) return null;
  const n = parseFloat(text.replace(/[^\d,.]/g, "").replace(",", "."));
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** 335 → „335 €", null → „Na dopyt" (rovnaký tvar ako v cenníku) */
export function textZCeny(n: number | null): string {
  if (n === null || !Number.isFinite(n) || n <= 0) return "Na dopyt";
  const zaokruhlene = Math.round(n * 100) / 100;
  return `${String(zaokruhlene).replace(".", ",")} €`;
}

/* ---------------- odvodené polia ---------------- */

const rozmerText = (p: Pick<Product, "w" | "d" | "h">) => `${p.w} × ${p.d} × ${p.h}`;

/** Slug, aký by skrinka mala podľa radu a rozmeru — návrh pre novú skrinku. */
export function navrhSlug(tier: Tier, w: number, d: number, h: number): string {
  return `${tier}-${w}x${d}x${h}`;
}

/**
 * Dopočíta polia, ktoré sa nemajú zadávať ručne, a zjednotí tvar dát.
 * Klient tak nemôže napísať do nadpisu iný rozmer, než aký je v číslach,
 * a titulná fotka je vždy prvá fotka prvého dekoru.
 */
export function normalizuj(vstup: Product): Product {
  const rad = TIERS.find((t) => t.id === vstup.tier) ?? TIERS[0];
  const w = Math.round(Number(vstup.w)) || 0;
  const d = Math.round(Number(vstup.d)) || 0;
  const h = Math.round(Number(vstup.h)) || 0;

  const decors: Decor[] = (vstup.decors ?? []).map((dek) => {
    const chyba = Boolean(dek.chyba);
    const out: Decor = {
      id: String(dek.id ?? "").trim(),
      name: String(dek.name ?? "").trim(),
      swatch: (dek.swatch ?? []).map(String).filter(Boolean).slice(0, 2),
      // dekor čakajúci na fotky nesmie mať fotky — inak by sa tváril ako hotový
      images: chyba ? [] : (dek.images ?? []).map(String).filter(Boolean),
    };
    if (chyba) out.chyba = true;
    const zlta = (dek.led?.zlta ?? []).map(String).filter(Boolean);
    const modra = (dek.led?.modra ?? []).map(String).filter(Boolean);
    if (!chyba && (zlta.length || modra.length)) {
      out.led = {};
      if (zlta.length) out.led.zlta = zlta;
      if (modra.length) out.led.modra = modra;
    }
    // štítky „ilustračné" preberáme len keď dávajú zmysel
    if (dek.inherited && !chyba) {
      out.inherited = true;
      if (dek.illuFrom) out.illuFrom = dek.illuFrom;
      if (dek.illuFrom === "rozmer" && dek.illuSize) out.illuSize = String(dek.illuSize);
      if (dek.illuFrom === "dvierka" && dek.illuDvierka) out.illuDvierka = Number(dek.illuDvierka);
      if (Array.isArray(dek.illuIdx) && dek.illuIdx.length) {
        out.illuIdx = dek.illuIdx.map(Number).filter((i) => Number.isInteger(i) && i >= 0 && i < out.images.length);
        if (!out.illuIdx.length) delete out.illuIdx;
      }
    }
    return out;
  });

  const cena = cenaZTextu(vstup.price);
  const cenaLed = cenaZTextu(vstup.priceLed);

  const p: Product = {
    slug: String(vstup.slug ?? "").trim().toLowerCase(),
    name: String(vstup.name ?? "").trim() || `${rad.label} ${rozmerText({ w, d, h })}`,
    tier: rad.id,
    tierLabel: rad.label,
    tierNote: rad.note,
    dim: `${rozmerText({ w, d, h })} cm`,
    w,
    d,
    h,
    aquarium: `${w} × ${d} cm (pôdorys)`,
    vol: String(vstup.vol ?? "").trim(),
    price: textZCeny(cena),
    desc: String(vstup.desc ?? "").trim(),
    features: (vstup.features ?? []).map((f) => String(f).trim()).filter(Boolean),
    decors,
    // titulná fotka = prvá fotka prvého nafoteného dekoru
    cover: decors.find((x) => !x.chyba && x.images.length)?.images[0] ?? "",
  };
  // LED verzia má zmysel len s vlastnou cenou
  if (cenaLed !== null) p.priceLed = textZCeny(cenaLed);
  if (vstup.skryta) p.skryta = true;
  return p;
}

/* ---------------- kontrola ---------------- */

/**
 * Chyby jednej skrinky. Skrytá (rozpracovaná) skrinka prejde aj bez fotiek —
 * musí mať len to, čo ju identifikuje. Zverejnená musí spĺňať všetko,
 * s čím web počíta.
 */
export function chybySkrinky(p: Product): Chyba[] {
  const out: Chyba[] = [];
  const ch = (pole: string, sprava: string) => out.push({ slug: p.slug, pole, sprava });

  if (!p.slug) ch("slug", "Adresa skrinky je povinná.");
  else if (!SLUG_VZOR.test(p.slug))
    ch("slug", "Adresa smie mať len malé písmená bez diakritiky, číslice a pomlčky, napríklad premium-100x40x80.");
  if (!p.name) ch("name", "Názov je povinný.");
  for (const [pole, hodnota, nazov] of [
    ["w", p.w, "Šírka"],
    ["d", p.d, "Hĺbka"],
    ["h", p.h, "Výška"],
  ] as const) {
    if (!Number.isInteger(hodnota) || hodnota < 20 || hodnota > 400)
      ch(pole, `${nazov} musí byť celé číslo v centimetroch, od 20 do 400.`);
  }
  if (p.priceLed && cenaZTextu(p.price) === null)
    ch("priceLed", "Cena s LED má zmysel len vtedy, keď má skrinka aj základnú cenu.");

  // dekory — identifikátory musia byť jedinečné, inak by sa na webe prepínali dva naraz
  const idcka = new Set<string>();
  p.decors.forEach((dek, i) => {
    const kde = `decors.${i}`;
    if (!dek.id || !SLUG_VZOR.test(dek.id)) ch(kde, `Dekor č. ${i + 1} nemá platný identifikátor.`);
    else if (idcka.has(dek.id)) ch(kde, `Dekor „${dek.name || dek.id}" je v skrinke dvakrát.`);
    idcka.add(dek.id);
    if (!dek.name) ch(kde, `Dekor č. ${i + 1} nemá názov.`);
    if (!dek.swatch.length) ch(kde, `Dekor „${dek.name || dek.id}" nemá vzorku farby.`);
    for (const v of dek.swatch)
      if (!povolenaVzorka(v)) ch(kde, `Dekor „${dek.name || dek.id}" má neplatnú vzorku farby.`);
    for (const src of [...dek.images, ...(dek.led?.zlta ?? []), ...(dek.led?.modra ?? [])])
      if (!povolenaFotka(src)) ch(kde, `Dekor „${dek.name || dek.id}" má fotku z nepovolenej adresy.`);
  });

  if (p.skryta) return out;

  /* ---- len pre zverejnenú skrinku ---- */
  if (!p.decors.length) ch("decors", "Zverejnená skrinka potrebuje aspoň jeden dekor.");
  const prvy = p.decors[0];
  if (prvy && (prvy.chyba || !prvy.images.length))
    ch("decors.0", "Prvý dekor dáva skrinke titulnú fotku, preto musí mať aspoň jednu fotku.");
  p.decors.forEach((dek, i) => {
    if (!dek.chyba && !dek.images.length)
      ch(`decors.${i}`, `Dekor „${dek.name || dek.id}" nemá fotku. Nahrajte ju, alebo ho označte ako „čaká na fotky".`);
  });
  if (!p.desc) ch("desc", "Zverejnená skrinka potrebuje popis.");
  return out;
}

/**
 * Chyby celého katalógu: každá skrinka zvlášť plus pravidlá, ktoré platia
 * naprieč — jedinečná adresa a aspoň jedna zverejnená skrinka, aby sa
 * jedným uložením nedal vyprázdniť celý web.
 */
export function chybyKatalogu(katalog: Product[]): Chyba[] {
  const out = katalog.flatMap(chybySkrinky);
  const videne = new Map<string, number>();
  for (const p of katalog) videne.set(p.slug, (videne.get(p.slug) ?? 0) + 1);
  for (const [slug, n] of videne)
    if (n > 1) out.push({ slug, pole: "slug", sprava: `Adresu „${slug}" má ${n}× — každá skrinka potrebuje vlastnú.` });
  if (!katalog.some((p) => !p.skryta))
    out.push({ slug: "", pole: "", sprava: "Na webe musí ostať aspoň jedna zverejnená skrinka." });
  return out;
}

/* ---------------- súbežné úpravy ---------------- */

/**
 * Krátky odtlačok skrinky. Editor si ho zapamätá pri otvorení a pošle ho
 * s uložením. Keď sa na serveri medzitým skrinka zmenila (upravil ju niekto
 * iný), odtlačky nesedia a uloženie sa odmietne namiesto toho, aby jedna
 * zmena potichu prepísala druhú. FNV-1a stačí — nejde o bezpečnosť, len
 * o rozpoznanie zmeny.
 */
export function odtlacok(p: Product): string {
  const text = JSON.stringify(p);
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
}
