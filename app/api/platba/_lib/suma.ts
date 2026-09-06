import { getProduct } from "../../../products";
import { getAquarium } from "../../../aquariums";

/**
 * Prepočet objednávky z katalógu na serveri.
 *
 * Košík posiela aj ceny, ale pri platbe sa na ne spoľahnúť nedá — kto si
 * upraví požiadavku, zaplatí za skrinku euro. Berieme preto len slug
 * a počet kusov; cenu si dohľadáme sami. Musí to sedieť s tým, ako ju
 * ráta košík (SkrinkaDoKosika, akvaria/[slug]/page.tsx), inak by zákazník
 * videl inú sumu, než akú by zaplatil.
 */

export type PolozkaVstup = {
  slug?: unknown;
  druh?: unknown;
  ks?: unknown;
};

export const DOPRAVA_ZDARMA_OD = 500;
export const KURIER = 39;
export const ZALOHA_PODIEL = 0.3;

export type Prepocet =
  | { ok: true; suma: number; doprava: number; spolu: number; zaloha: number; doplatok: number }
  | { ok: false; dovod: string };

export function prepocitaj(polozky: PolozkaVstup[], odber: boolean): Prepocet {
  if (!Array.isArray(polozky) || !polozky.length) return { ok: false, dovod: "prazdny_kosik" };

  let suma = 0;
  for (const p of polozky) {
    const slug = String(p.slug ?? "");
    const ks = Math.floor(Number(p.ks));
    if (!slug || !Number.isFinite(ks) || ks < 1 || ks > 50) {
      return { ok: false, dovod: `zla_polozka:${slug || "?"}` };
    }

    let cena: number | null = null;
    if (p.druh === "skrinka") {
      const s = getProduct(slug);
      // rovnaký prepis ako v SkrinkaDoKosika — „335 €" → 335
      if (s) cena = Number(s.price.replace(/[^\d]/g, "")) || null;
    } else if (p.druh === "akvarium") {
      cena = getAquarium(slug)?.priceValue ?? null;
    }
    if (cena === null) return { ok: false, dovod: `neznamy_tovar:${slug}` };

    suma += cena * ks;
  }

  suma = Math.round(suma * 100) / 100;
  const doprava = odber || suma >= DOPRAVA_ZDARMA_OD || suma === 0 ? 0 : KURIER;
  const spolu = Math.round((suma + doprava) * 100) / 100;
  const zaloha = Math.round(spolu * ZALOHA_PODIEL * 100) / 100;
  const doplatok = Math.round((spolu - zaloha) * 100) / 100;

  if (zaloha < 1) return { ok: false, dovod: "prilis_nizka_zaloha" };
  return { ok: true, suma, doprava, spolu, zaloha, doplatok };
}
