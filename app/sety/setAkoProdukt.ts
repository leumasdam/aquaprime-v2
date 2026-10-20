import type { Product } from "../products";
import type { Set } from "../sety";
import type { Slovnik } from "../preklady";
import { textZCeny } from "../katalog/kontrola";

/**
 * Set v tvare skrinky — aby mohol používať tú istú kartu (ProductCard)
 * a tú istú galériu (ProductGallery) ako katalóg skriniek: dekory, LED
 * prepínač, striedanie fotiek, morfovanie karty do detailu.
 */
export function setAkoProdukt(s: Set, t: Slovnik["sety"]): Product {
  const p: Product = {
    slug: s.id,
    name: s.nazov,
    tier: "premium",
    tierLabel: t.kategorie[s.kategoria],
    tierNote: "",
    dim: s.skrinka,
    w: 0,
    d: 0,
    h: 0,
    aquarium: s.akvarium,
    vol: `${s.objem} l`,
    price: textZCeny(s.cena),
    desc: s.popis.sk[0] ?? "",
    features: [],
    decors: s.prevedenia,
    cover: s.prevedenia.find((x) => !x.chyba && x.images.length)?.images[0] ?? "",
  };
  if (s.cenaLed) p.priceLed = textZCeny(s.cenaLed);
  return p;
}

/** Titulná LED fotka setu (prvý dekor s LED vizualizáciou) — na LED dlaždicu v katalógu. */
export function setLed(s: Set): { src: string; dekor: string; farba: "zlta" | "modra" } | null {
  for (const d of s.prevedenia) {
    if (d.chyba) continue;
    const farba = d.led?.zlta?.length ? "zlta" : d.led?.modra?.length ? "modra" : null;
    if (farba) return { src: d.led![farba]![0], dekor: d.id, farba };
  }
  return null;
}
