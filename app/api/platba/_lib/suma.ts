import { najdiProdukt, type Product } from "../../../products";
import type { Aquarium } from "../../../aquariums";
import { NOZICKY_PRIPLATOK } from "../../../nozicky";

/**
 * Prepočet objednávky z katalógu na serveri.
 *
 * Košík posiela aj ceny, ale pri platbe sa na ne spoľahnúť nedá — kto si
 * upraví požiadavku, zaplatí za skrinku euro. Berieme preto len slug
 * a počet kusov; cenu si dohľadáme sami. Musí to sedieť s tým, ako ju
 * ráta košík (SkrinkaDoKosika, akvaria/[slug]/page.tsx), inak by zákazník
 * videl inú sumu, než akú by zaplatil.
 *
 * Katalóg skriniek dostáva volajúci. Ceny sa menia v administrácii, takže
 * platba musí počítať s tou istou verziou, akú zákazník videl na webe —
 * nie s cenami zapečenými do kódu pri builde.
 */

export type PolozkaVstup = {
  slug?: unknown;
  druh?: unknown;
  ks?: unknown;
  /** skrinka s nožičkami — pripočíta sa NOZICKY_PRIPLATOK, kým je známy */
  nozicky?: unknown;
};

export const DOPRAVA_ZDARMA_OD = 500;
export const KURIER = 39;
export const ZALOHA_PODIEL = 0.3;

/** položka s cenou z katalógu — ide do e-mailu, nikdy nie cena od klienta */
export type PolozkaPrepoctu = {
  slug: string;
  druh: "skrinka" | "akvarium";
  ks: number;
  /** cena za kus vrátane prípadných nožičiek */
  cena: number;
  nozicky: boolean;
};

export type Prepocet =
  | {
      ok: true;
      suma: number;
      doprava: number;
      spolu: number;
      zaloha: number;
      doplatok: number;
      polozky: PolozkaPrepoctu[];
    }
  | { ok: false; dovod: string };

/** viac položiek než toto v jednej objednávke nedáva zmysel — bráni to aj nafúknutým telám */
export const MAX_POLOZIEK = 30;

export function prepocitaj(
  katalog: Product[],
  akvaria: Aquarium[],
  polozky: PolozkaVstup[],
  odber: boolean,
): Prepocet {
  if (!Array.isArray(polozky) || !polozky.length) return { ok: false, dovod: "prazdny_kosik" };
  if (polozky.length > MAX_POLOZIEK) return { ok: false, dovod: "prilis_vela_poloziek" };

  let suma = 0;
  const overene: PolozkaPrepoctu[] = [];
  for (const p of polozky) {
    const slug = String(p.slug ?? "");
    const ks = Math.floor(Number(p.ks));
    if (!slug || !Number.isFinite(ks) || ks < 1 || ks > 50) {
      return { ok: false, dovod: `zla_polozka:${slug || "?"}` };
    }

    let cena: number | null = null;
    if (p.druh === "skrinka") {
      const s = najdiProdukt(katalog, slug);
      // rovnaký prepis ako v SkrinkaDoKosika — „335 €" → 335
      if (s) cena = Number(s.price.replace(/[^\d]/g, "")) || null;
      // príplatok za nožičky, kým ho klient neurčí (null), sa nepočíta —
      // dorieši sa v potvrdení objednávky, presne ako to vidí zákazník v košíku
      if (cena !== null && p.nozicky === true) cena += NOZICKY_PRIPLATOK ?? 0;
    } else if (p.druh === "akvarium") {
      cena = akvaria.find((a) => a.slug === slug)?.priceValue ?? null;
    }
    if (cena === null) return { ok: false, dovod: `neznamy_tovar:${slug}` };

    suma += cena * ks;
    overene.push({ slug, druh: p.druh as "skrinka" | "akvarium", ks, cena, nozicky: p.nozicky === true });
  }

  suma = Math.round(suma * 100) / 100;
  const doprava = odber || suma >= DOPRAVA_ZDARMA_OD || suma === 0 ? 0 : KURIER;
  const spolu = Math.round((suma + doprava) * 100) / 100;
  const zaloha = Math.round(spolu * ZALOHA_PODIEL * 100) / 100;
  const doplatok = Math.round((spolu - zaloha) * 100) / 100;

  if (zaloha < 1) return { ok: false, dovod: "prilis_nizka_zaloha" };
  return { ok: true, suma, doprava, spolu, zaloha, doplatok, polozky: overene };
}
