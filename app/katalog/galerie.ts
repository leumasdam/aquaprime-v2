/**
 * Fotky setov a akvárií, ktoré si klient mení v administrácii.
 *
 * Sety aj akváriá majú texty, rozmery a ceny v kóde (sety.ts, aquariums.ts);
 * klient k nim dopĺňa len fotky. Uložené sú v kolekcii „galerie" v tom istom
 * úložisku ako katalóg skriniek, s históriou verzií:
 *
 *   sety:    id setu → id prevedenia → zoznam fotiek (prvá je titulná)
 *   akvaria: slug akvária → zoznam fotiek (prvá je titulná na karte aj detaile)
 *
 * Chýbajúci kľúč = pôvodné fotky z kódu. Tento modul je čistý (bez servera),
 * aby ho mohol použiť aj editor v prehliadači; načítanie z úložiska je
 * v galerie-server.ts.
 */

import { AQUARIUMS, type Aquarium } from "../aquariums";
import { SETY, type Set } from "../sety";
import { povolenaFotka } from "./kontrola";

export type Galerie = {
  sety: Record<string, Record<string, string[]>>;
  akvaria: Record<string, string[]>;
};

export const GALERIE_PRAZDNE: Galerie = { sety: {}, akvaria: {} };

/** najviac fotiek na jednu galériu — viac by zákazník aj tak nepozeral */
export const MAX_FOTIEK = 12;

function zoznamFotiek(v: unknown): string[] | null {
  if (!Array.isArray(v)) return null;
  const fotky = v.filter((f): f is string => typeof f === "string" && povolenaFotka(f));
  // duplicitné adresy (tá istá fotka nahratá dvakrát) necháme len raz
  return [...new Set(fotky)].slice(0, MAX_FOTIEK);
}

/** Overí a zjednotí uložené galérie; neznáme sety, akváriá a cudzie fotky vyhodí. */
export function normalizujGalerie(vstup: unknown): Galerie {
  const g: Galerie = { sety: {}, akvaria: {} };
  const z = (vstup ?? {}) as { sety?: unknown; akvaria?: unknown };

  if (z.sety && typeof z.sety === "object") {
    for (const set of SETY) {
      const prevedenia = (z.sety as Record<string, unknown>)[set.id];
      if (!prevedenia || typeof prevedenia !== "object") continue;
      for (const p of set.prevedenia) {
        const fotky = zoznamFotiek((prevedenia as Record<string, unknown>)[p.id]);
        if (fotky && fotky.length) (g.sety[set.id] ??= {})[p.id] = fotky;
      }
    }
  }
  if (z.akvaria && typeof z.akvaria === "object") {
    for (const a of AQUARIUMS) {
      const fotky = zoznamFotiek((z.akvaria as Record<string, unknown>)[a.slug]);
      if (fotky && fotky.length) g.akvaria[a.slug] = fotky;
    }
  }
  return g;
}

/** Sety tak, ako ich vidí web — s fotkami od klienta, kde ich uložil. */
export function setySGaleriou(g: Galerie): Set[] {
  return SETY.map((s) => {
    const vlastne = g.sety[s.id];
    if (!vlastne) return s;
    return {
      ...s,
      prevedenia: s.prevedenia.map((p) => (vlastne[p.id] ? { ...p, fotky: vlastne[p.id] } : p)),
    };
  });
}

/**
 * Akváriá s fotkami od klienta. Prvá uložená fotka je titulná (karta, detail,
 * košík) a je skutočná, takže štítok „ilustračná fotka" zmizne; zvyšok ide
 * do galérie na detaile.
 */
export function akvariaSGaleriou(g: Galerie): Aquarium[] {
  return AQUARIUMS.map((a) => {
    const fotky = g.akvaria[a.slug];
    if (!fotky) return a;
    return { ...a, cover: fotky[0], coverIllustrative: false, fotky };
  });
}
