/**
 * Kontrola a úprava akvárií a setov pred uložením z administrácie —
 * sesterský súbor ku kontrola.ts (skrinky). Rovnaké zásady: odvodené polia
 * sa dopočítajú, aby klient nemohol napísať do názvu iný rozmer než v číslach;
 * rozpracovaná (skrytá) položka prejde aj bez fotiek, zverejnená musí mať
 * všetko, s čím web počíta.
 *
 * Beží na serveri aj v prehliadači — nič serverové sem nepatrí.
 */

import type { Aquarium, GlassOption } from "../aquariums";
import { KATEGORIE, type Prevedenie, type Set } from "../sety";
import { cenaZTextu, povolenaFotka, povolenaVzorka, SLUG_VZOR, type Chyba } from "./kontrola";

/* ============================ AKVÁRIÁ ============================ */

export function navrhSlugAkvaria(w: number, d: number, h: number): string {
  return `akvarium-${w}x${d}x${h}`;
}

/** „66,60 €" v tvare cenníka; 2 hrúbky → „od 66,60 €" */
function cenaText(n: number): string {
  const s = (Math.round(n * 100) / 100).toLocaleString("sk-SK", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  return `${s} €`;
}

export function normalizujAkvarium(vstup: Aquarium): Aquarium {
  const w = Math.round(Number(vstup.w)) || 0;
  const d = Math.round(Number(vstup.d)) || 0;
  const h = Math.round(Number(vstup.h)) || 0;
  const liters = Math.round(Number(vstup.liters)) || Math.round((w * d * h) / 1000);

  // hrúbka bez ceny ostáva (rozpracované akvárium), do ceny sa ale nepočíta
  const glass: GlassOption[] = (vstup.glass ?? [])
    .map((g) => ({ mm: Math.round(Number(g.mm)) || 0, cena: cenaZTextu(String(g.price ?? "")) }))
    .filter((g) => g.mm > 0)
    .sort((a, b) => a.mm - b.mm)
    .slice(0, 2)
    .map((g) => ({ mm: g.mm, price: g.cena === null ? "" : cenaText(g.cena) }));
  const ceny = glass.map((g) => cenaZTextu(g.price)).filter((c): c is number => c !== null);
  const priceValue = ceny.length ? Math.min(...ceny) : 0;

  const fotky = [...new Set((vstup.fotky ?? []).map(String).filter(Boolean))].slice(0, 12);
  const rozmer = `${w} × ${d} × ${h}`;

  const a: Aquarium = {
    slug: String(vstup.slug ?? "").trim().toLowerCase(),
    w,
    d,
    h,
    liters,
    glass,
    priceValue,
    priceLabel: ceny.length > 1 ? `od ${cenaText(priceValue)}` : ceny.length ? cenaText(priceValue) : "Na dopyt",
    // vlastná fotka je skutočná; bez nej ostáva pôvodná (prípadne ilustračná) z kódu
    cover: fotky[0] ?? String(vstup.cover ?? ""),
    name: `Akvárium ${rozmer}`,
    dim: `${rozmer} cm`,
    vol: `${liters} l`,
    featured: Boolean(vstup.lead),
  };
  if (!fotky.length && vstup.coverIllustrative) a.coverIllustrative = true;
  if (fotky.length) a.fotky = fotky;
  for (const k of ["lead", "use", "braces"] as const) if (vstup[k]) a[k] = String(vstup[k]);
  if (vstup.body?.length) a.body = vstup.body.map(String).filter(Boolean);
  if (vstup.features?.length) a.features = vstup.features.map(String).filter(Boolean);
  if (vstup.skryta) a.skryta = true;
  return a;
}

export function chybyAkvaria(a: Aquarium): Chyba[] {
  const out: Chyba[] = [];
  const ch = (pole: string, sprava: string) => out.push({ slug: a.slug, pole, sprava });

  if (!a.slug) ch("slug", "Adresa akvária je povinná.");
  else if (!SLUG_VZOR.test(a.slug))
    ch("slug", "Adresa smie mať len malé písmená bez diakritiky, číslice a pomlčky, napríklad akvarium-120x50x50.");
  for (const [pole, hodnota, nazov] of [
    ["w", a.w, "Dĺžka"],
    ["d", a.d, "Šírka"],
    ["h", a.h, "Výška"],
  ] as const) {
    if (!Number.isInteger(hodnota) || hodnota < 10 || hodnota > 400)
      ch(pole, `${nazov} musí byť celé číslo v centimetroch, od 10 do 400.`);
  }
  if (!Number.isInteger(a.liters) || a.liters <= 0) ch("liters", "Objem musí byť kladné číslo v litroch.");
  a.glass.forEach((g, i) => {
    if (g.mm < 3 || g.mm > 30) ch(`glass.${i}`, `Hrúbka skla č. ${i + 1} musí byť od 3 do 30 mm.`);
  });
  if (a.glass.length === 2 && a.glass[0].mm === a.glass[1].mm) ch("glass.1", "Dve hrúbky skla musia byť rôzne.");
  for (const f of a.fotky ?? []) if (!povolenaFotka(f)) ch("fotky", "Fotka má nepovolenú adresu.");

  if (a.skryta) return out;
  if (!a.glass.length) ch("glass.0", "Zverejnené akvárium potrebuje aspoň jednu hrúbku skla s cenou.");
  a.glass.forEach((g, i) => {
    if (cenaZTextu(g.price) === null) ch(`glass.${i}`, `Hrúbka ${g.mm} mm nemá cenu.`);
  });
  if (!a.cover || !povolenaFotka(a.cover)) ch("fotky", "Zverejnené akvárium potrebuje aspoň jednu fotku.");
  return out;
}

export function chybyAkvarii(zoznam: Aquarium[]): Chyba[] {
  const out = zoznam.flatMap(chybyAkvaria);
  const videne = new Map<string, number>();
  for (const a of zoznam) videne.set(a.slug, (videne.get(a.slug) ?? 0) + 1);
  for (const [slug, n] of videne)
    if (n > 1) out.push({ slug, pole: "slug", sprava: `Adresu „${slug}" má ${n}× — každé akvárium potrebuje vlastnú.` });
  if (!zoznam.some((a) => !a.skryta)) out.push({ slug: "", pole: "", sprava: "Na webe musí ostať aspoň jedno zverejnené akvárium." });
  return out;
}

/* ============================ SETY ============================ */

const dvojjazycne = (v: unknown): Record<"sk" | "en", string> => {
  const z = (v ?? {}) as Record<string, unknown>;
  const sk = String(z.sk ?? "").trim();
  // bez anglického znenia ide na /en slovenčina — lepšie než prázdne miesto
  const en = String(z.en ?? "").trim() || sk;
  return { sk, en };
};
const dvojjazycneZoznamy = (v: unknown): Record<"sk" | "en", string[]> => {
  const z = (v ?? {}) as Record<string, unknown>;
  const sk = (Array.isArray(z.sk) ? z.sk : []).map((x) => String(x).trim()).filter(Boolean);
  const en = (Array.isArray(z.en) ? z.en : []).map((x) => String(x).trim()).filter(Boolean);
  return { sk, en: en.length ? en : sk };
};

export function normalizujSet(vstup: Set): Set {
  const prevedenia: Prevedenie[] = (vstup.prevedenia ?? []).map((p) => {
    const out: Prevedenie = {
      id: String(p.id ?? "").trim(),
      nazov: String(p.nazov ?? "").trim(),
      swatch: (p.swatch ?? []).map(String).filter(Boolean).slice(0, 2),
      fotky: [...new Set((p.fotky ?? []).map(String).filter(Boolean))].slice(0, 12),
    };
    if (p.obrazok) out.obrazok = String(p.obrazok);
    return out;
  });
  const cenaRaw = vstup.cena as unknown;
  const cena = cenaRaw === null || cenaRaw === undefined || cenaRaw === "" ? null : Number(cenaRaw);

  const s: Set = {
    id: String(vstup.id ?? "").trim().toLowerCase(),
    kategoria: KATEGORIE.includes(vstup.kategoria) ? vstup.kategoria : KATEGORIE[0],
    nazov: String(vstup.nazov ?? "").trim(),
    podtitul: dvojjazycne(vstup.podtitul),
    popis: dvojjazycneZoznamy(vstup.popis),
    preKoho: dvojjazycneZoznamy(vstup.preKoho),
    skrinka: String(vstup.skrinka ?? "").trim(),
    akvarium: String(vstup.akvarium ?? "").trim(),
    sklo: dvojjazycne(vstup.sklo),
    objem: Math.round(Number(vstup.objem)) || 0,
    prevedenia,
    cena: cena !== null && Number.isFinite(cena) && cena > 0 ? Math.round(cena * 100) / 100 : null,
  };
  if (vstup.novinka) s.novinka = true;
  if (vstup.skryta) s.skryta = true;
  return s;
}

export function chybySetu(s: Set): Chyba[] {
  const out: Chyba[] = [];
  const ch = (pole: string, sprava: string) => out.push({ slug: s.id, pole, sprava });

  if (!s.id) ch("id", "Adresa setu je povinná.");
  else if (!SLUG_VZOR.test(s.id))
    ch("id", "Adresa smie mať len malé písmená bez diakritiky, číslice a pomlčky, napríklad scape-60.");
  if (!s.nazov) ch("nazov", "Názov je povinný.");
  const idcka = new Set<string>();
  s.prevedenia.forEach((p, i) => {
    const kde = `prevedenia.${i}`;
    if (!p.id || !SLUG_VZOR.test(p.id)) ch(kde, `Prevedenie č. ${i + 1} nemá platný identifikátor.`);
    else if (idcka.has(p.id)) ch(kde, `Prevedenie „${p.nazov || p.id}" je v sete dvakrát.`);
    idcka.add(p.id);
    if (!p.nazov) ch(kde, `Prevedenie č. ${i + 1} nemá názov.`);
    if (!p.swatch.length) ch(kde, `Prevedenie „${p.nazov || p.id}" nemá vzorku farby.`);
    for (const v of p.swatch) if (!povolenaVzorka(v)) ch(kde, `Prevedenie „${p.nazov || p.id}" má neplatnú vzorku farby.`);
    for (const f of [...p.fotky, ...(p.obrazok ? [p.obrazok] : [])])
      if (!povolenaFotka(f)) ch(kde, `Prevedenie „${p.nazov || p.id}" má fotku z nepovolenej adresy.`);
  });

  if (s.skryta) return out;
  if (!s.podtitul.sk) ch("podtitul", "Zverejnený set potrebuje podtitul.");
  if (!s.skrinka) ch("skrinka", "Doplňte rozmer skrinky.");
  if (!s.akvarium) ch("akvarium", "Doplňte rozmer akvária.");
  if (!s.objem) ch("objem", "Doplňte objem v litroch.");
  if (!s.popis.sk.length) ch("popis", "Zverejnený set potrebuje popis.");
  if (!s.prevedenia.length) ch("prevedenia", "Zverejnený set potrebuje aspoň jedno prevedenie.");
  s.prevedenia.forEach((p, i) => {
    if (!p.fotky.length) ch(`prevedenia.${i}`, `Prevedenie „${p.nazov || p.id}" nemá fotku — prvé prevedenie dáva setu titulnú fotku.`);
  });
  return out;
}

export function chybySetov(zoznam: Set[]): Chyba[] {
  const out = zoznam.flatMap(chybySetu);
  const videne = new Map<string, number>();
  for (const s of zoznam) videne.set(s.id, (videne.get(s.id) ?? 0) + 1);
  for (const [id, n] of videne)
    if (n > 1) out.push({ slug: id, pole: "id", sprava: `Adresu „${id}" má ${n}× — každý set potrebuje vlastnú.` });
  return out;
}
