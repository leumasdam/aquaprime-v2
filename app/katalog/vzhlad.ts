/**
 * Vzhľad webu, ktorý si klient mení v administrácii — zatiaľ úvodné fotky
 * radov na domovskej stránke (karty Basic / Štandard / Premium / LED).
 *
 * Uložené v tom istom úložisku ako katalóg (kolekcia „vzhlad"), s históriou
 * verzií. Kým klient nič neuloží, platia pôvodné fotky z kódu. Cache nesie
 * rovnakú značku ako katalóg, takže uloženie ju zneplatní tým istým krokom.
 */

import { unstable_cache } from "next/cache";
import { TAG_KATALOG } from "./skrinky";
import { nacitajUlozene } from "./uloziste";
import { povolenaFotka } from "./kontrola";

export const RADY_VZHLADU = ["basic", "standard", "premium", "led"] as const;
export type RadVzhladu = (typeof RADY_VZHLADU)[number];

export type Vzhlad = {
  /** úvodná fotka karty radu; chýbajúci kľúč = pôvodná fotka z kódu */
  rady: Partial<Record<RadVzhladu, string>>;
};

/** pôvodné fotky z kódu — zároveň to, na čo sa dá v administrácii vrátiť */
export const VZHLAD_POVODNY: Record<RadVzhladu, string> = {
  basic: "/img/products/kat-basic-v3.webp",
  standard: "/img/products/kat-standard-v3.webp",
  premium: "/img/products/kat-premium-v3.webp",
  led: "/img/products/led/led-black-matt-zlta-3d-01.webp",
};

/** Overí a zjednotí tvar uloženého vzhľadu; cudzie cesty a kľúče vyhodí. */
export function normalizujVzhlad(vstup: unknown): Vzhlad {
  const rady: Vzhlad["rady"] = {};
  const zdroj = (vstup as { rady?: unknown } | null)?.rady;
  if (zdroj && typeof zdroj === "object") {
    for (const rad of RADY_VZHLADU) {
      const v = (zdroj as Record<string, unknown>)[rad];
      if (typeof v === "string" && v && v !== VZHLAD_POVODNY[rad] && povolenaFotka(v)) rady[rad] = v;
    }
  }
  return { rady };
}

const NASADENIE = process.env.VERCEL_DEPLOYMENT_ID ?? process.env.VERCEL_GIT_COMMIT_SHA ?? "lokal";

export const nacitajVzhlad = unstable_cache(
  async (): Promise<Vzhlad> => normalizujVzhlad(await nacitajUlozene<Vzhlad>("vzhlad")),
  ["katalog-vzhlad", NASADENIE],
  { tags: [TAG_KATALOG] },
);

/** Úvodná fotka radu — uložená klientom, inak pôvodná z kódu. */
export function fotkaRadu(v: Vzhlad, rad: RadVzhladu): string {
  return v.rady[rad] ?? VZHLAD_POVODNY[rad];
}
