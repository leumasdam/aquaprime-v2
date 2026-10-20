/**
 * Načítanie galérií setov a akvárií z úložiska — len pre server. Cache nesie
 * tú istú značku ako katalóg skriniek, uloženie v administrácii ju zneplatní.
 */

import { unstable_cache } from "next/cache";
import type { Aquarium } from "../aquariums";
import type { Set } from "../sety";
import { akvariaSGaleriou, normalizujGalerie, setySGaleriou, type Galerie } from "./galerie";
import { TAG_KATALOG } from "./skrinky";
import { nacitajUlozene } from "./uloziste";

const NASADENIE = process.env.VERCEL_DEPLOYMENT_ID ?? process.env.VERCEL_GIT_COMMIT_SHA ?? "lokal";

export const nacitajGalerie = unstable_cache(
  async (): Promise<Galerie> => normalizujGalerie(await nacitajUlozene<Galerie>("galerie")),
  ["katalog-galerie", NASADENIE],
  { tags: [TAG_KATALOG] },
);

export async function nacitajSety(): Promise<Set[]> {
  return setySGaleriou(await nacitajGalerie());
}

export async function nacitajSet(id: string): Promise<Set | undefined> {
  return (await nacitajSety()).find((s) => s.id === id);
}

export async function nacitajAkvaria(): Promise<Aquarium[]> {
  return akvariaSGaleriou(await nacitajGalerie());
}

export async function nacitajAkvarium(slug: string): Promise<Aquarium | undefined> {
  return (await nacitajAkvaria()).find((a) => a.slug === slug);
}
