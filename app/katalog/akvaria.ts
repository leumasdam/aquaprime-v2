/**
 * Akváriá, ako ich vidí web — z úložiska (po úprave v administrácii), inak
 * z kódu (aquariums.ts). Rovnaký mechanizmus ako skrinky: cache so značkou
 * „katalog", ktorú uloženie v administrácii zneplatní.
 */

import { unstable_cache } from "next/cache";
import { AQUARIUMS, type Aquarium } from "../aquariums";
import { TAG_KATALOG } from "./skrinky";
import { nacitajUlozene } from "./uloziste";

const NASADENIE = process.env.VERCEL_DEPLOYMENT_ID ?? process.env.VERCEL_GIT_COMMIT_SHA ?? "lokal";

/** Všetky vrátane rozpracovaných — pre administráciu. */
export const nacitajAkvariaVsetky = unstable_cache(
  async (): Promise<Aquarium[]> => (await nacitajUlozene<Aquarium[]>("akvaria")) ?? AQUARIUMS,
  ["katalog-akvaria", NASADENIE],
  { tags: [TAG_KATALOG] },
);

/** Zverejnené akváriá — katalóg, detail, košík, platba. */
export async function nacitajAkvaria(): Promise<Aquarium[]> {
  return (await nacitajAkvariaVsetky()).filter((a) => !a.skryta);
}

export async function nacitajAkvarium(slug: string): Promise<Aquarium | undefined> {
  return (await nacitajAkvaria()).find((a) => a.slug === slug);
}
