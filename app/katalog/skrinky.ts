/**
 * Katalóg skriniek, ako ho vidí web. Server ho číta odtiaľto, nie priamo
 * z products.ts — tak sa na webe prejaví to, čo klient uložil v administrácii.
 *
 * Poradie zdrojov:
 *   1. uložená verzia z úložiska (po prvom uložení v administrácii)
 *   2. pôvodné dáta v kóde (products.ts), kým klient nič neuložil
 *
 * Výsledok drží Next v cache so značkou "katalog". Uloženie v administrácii
 * značku zneplatní a stránky sa pri ďalšej návšteve prekreslia z nových dát.
 */

import { unstable_cache } from "next/cache";
import { SEED_PRODUKTY, type Product } from "../products";
import { nacitajUlozene } from "./uloziste";

export const TAG_KATALOG = "katalog";

/*
 * Cache Next.js prežíva aj nové nasadenie. Keby bol kľúč stále rovnaký,
 * po zmene products.ts v kóde (kým klient nič neuložil) by web ďalej
 * ukazoval starú verziu. Kľúč preto obsahuje identifikátor nasadenia —
 * každé nasadenie si katalóg načíta raz nanovo.
 */
const NASADENIE = process.env.VERCEL_DEPLOYMENT_ID ?? process.env.VERCEL_GIT_COMMIT_SHA ?? "lokal";

/** Celý katalóg vrátane rozpracovaných (skrytých) skriniek — pre administráciu. */
export const nacitajSkrinkyVsetky = unstable_cache(
  async (): Promise<Product[]> => (await nacitajUlozene<Product[]>("skrinky")) ?? SEED_PRODUKTY,
  ["katalog-skrinky", NASADENIE],
  { tags: [TAG_KATALOG] },
);

/**
 * Katalóg, ako ho vidí návštevník — bez rozpracovaných skriniek. Zverejnená
 * skrinka prešla kontrolou pri ukladaní, takže karty, galéria aj košík môžu
 * počítať s aspoň jedným nafoteným dekorom a platnou titulnou fotkou. Cena
 * povinná nie je — skrinka bez ceny sa ponúka na dopyt.
 */
export async function nacitajSkrinky(): Promise<Product[]> {
  return (await nacitajSkrinkyVsetky()).filter((p) => !p.skryta);
}

/** Jedna zverejnená skrinka podľa adresy, alebo undefined. */
export async function nacitajSkrinku(slug: string): Promise<Product | undefined> {
  return (await nacitajSkrinky()).find((p) => p.slug === slug);
}
