// Zdieľaná logika konfigurátora — ceny, dekory a párovanie akvária.
// Cieľ: konfigurátor musí hovoriť to isté čo katalóg. Preto sa ceny počítajú
// z reálnych cenníkových kotiev v products.ts, nie z vymysleného vzorca.

import { PRODUCTS, type Decor, type Product, type Tier } from "./products";
import { AQUARIUMS, type Aquarium } from "./aquariums";

export type CfgTier = { id: Tier; label: string; note: string };

/** Rozmery, ktoré sa naozaj vyrábajú — konfigurátor nesmie ponúknuť iné. */
export type CfgSize = {
  key: string;
  w: number;
  d: number;
  h: number;
  label: string;
};

export const CFG_SIZES: CfgSize[] = (() => {
  const seen = new Map<string, CfgSize>();
  for (const p of PRODUCTS) {
    const key = `${p.w}x${p.d}x${p.h}`;
    if (!seen.has(key)) {
      seen.set(key, { key, w: p.w, d: p.d, h: p.h, label: `${p.w} × ${p.d} × ${p.h}` });
    }
  }
  return [...seen.values()].sort((a, b) => a.w - b.w || a.h - b.h);
})();

/** Konkrétny produkt z katalógu pre kombináciu rad × rozmer. */
export function productFor(tier: Tier, size: CfgSize): Product | undefined {
  return PRODUCTS.find(
    (p) => p.tier === tier && p.w === size.w && p.d === size.d && p.h === size.h
  );
}

const toNum = (s: string) => Number(s.replace(/[^\d]/g, ""));

/** Cena priamo z cenníka — žiadny odhad, konfigurátor ponúka len katalógové rozmery. */
export function priceOf(p: Product, led: boolean): number {
  return toNum(led && p.priceLed ? p.priceLed : p.price);
}

/** Príplatok za LED pri konkrétnom produkte (Basic ho nemá). */
export function ledOf(p: Product): number | null {
  return p.priceLed ? toNum(p.priceLed) - toNum(p.price) : null;
}

/** Dekor z katalógu do tvaru, ktorému rozumie náhľad. */
export function toCfgDecor(d: Decor): CfgDecor {
  return {
    id: d.id,
    name: d.name,
    doors: d.swatch[0],
    body: d.swatch[1] ?? d.swatch[0],
    swatch: d.swatch,
  };
}

export const CFG_TIERS: CfgTier[] = [
  { id: "basic", label: "BASIC", note: "Kovový rám + vrchná doska" },
  { id: "standard", label: "ŠTANDARD", note: "Bočnice a dvierka" },
  { id: "premium", label: "PREMIUM", note: "Kompletne opláštená" },
];

/** Dekor pre náhľad: dvierka a korpus môžu byť iné (napr. „Black Matt / Orech"). */
export type CfgDecor = {
  id: string;
  name: string;
  /** "#hex" alebo cesta na textúru */
  doors: string;
  body: string;
  /** pôvodný swatch z katalógu — pre zdieľaný komponent <Swatch> */
  swatch: string[];
};

const num = (s: string) => Number(s.replace(/[^\d]/g, ""));

type Anchor = { w: number; d: number; h: number; price: number; led: number | null };

/** Cenníkové kotvy pre rad, zoradené podľa šírky. */
function anchors(tier: Tier): Anchor[] {
  return PRODUCTS.filter((p) => p.tier === tier)
    .map((p) => ({
      w: p.w,
      d: p.d,
      h: p.h,
      price: num(p.price),
      led: p.priceLed ? num(p.priceLed) - num(p.price) : null,
    }))
    .sort((a, b) => a.w - b.w);
}

/** Príplatok za LED podsvietenie v danom rade (Basic ho v cenníku nemá). */
export function ledSurcharge(tier: Tier): number | null {
  const a = anchors(tier);
  const withLed = a.find((x) => x.led !== null);
  return withLed ? withLed.led : null;
}

export type PriceResult = {
  value: number;
  /** rozmer presne sedí s cenníkom → cena je presná, nie odhad */
  exact: boolean;
  /** najbližší cenníkový rozmer, z ktorého sa počítalo */
  basedOn: string;
};

/**
 * Cena skrinky. Medzi cenníkovými šírkami interpoluje lineárne, mimo rozsahu
 * pokračuje sklonom krajného úseku. Hĺbka a výška nad rámec kotvy sa priplácajú
 * mierne — je to orientačný odhad, presnú cenu dá výroba.
 */
export function cabinetPrice(
  tier: Tier,
  w: number,
  d: number,
  h: number,
  led: boolean
): PriceResult {
  const a = anchors(tier);
  const first = a[0];
  const last = a[a.length - 1];

  let base: number;
  let ref: Anchor;

  if (w <= first.w) {
    const slope = (a[1].price - first.price) / (a[1].w - first.w);
    base = first.price - (first.w - w) * slope;
    ref = first;
  } else if (w >= last.w) {
    const prev = a[a.length - 2];
    const slope = (last.price - prev.price) / (last.w - prev.w);
    base = last.price + (w - last.w) * slope;
    ref = last;
  } else {
    const i = a.findIndex((x) => x.w > w);
    const lo = a[i - 1];
    const hi = a[i];
    const t = (w - lo.w) / (hi.w - lo.w);
    base = lo.price + (hi.price - lo.price) * t;
    ref = t < 0.5 ? lo : hi;
  }

  // atypická hĺbka a výška — malý príplatok za materiál navyše
  base += (d - ref.d) * 1.2 + (h - ref.h) * 0.9;

  const surcharge = led ? (ledSurcharge(tier) ?? 0) : 0;
  const exact = w === ref.w && d === ref.d && h === ref.h;

  return {
    value: Math.max(120, Math.round((base + surcharge) / 5) * 5),
    exact,
    basedOn: `${ref.w} × ${ref.d} × ${ref.h} cm`,
  };
}

export type TankMatch = {
  /** najväčšia nádrž, ktorá sa na skrinku bezpečne zmestí */
  best: Aquarium | null;
  /** všetky vyhovujúce, od najmenšej */
  fits: Aquarium[];
  /** pôdorys sedí presne na centimeter */
  exact: boolean;
  /** o koľko cm je skrinka širšia / hlbšia než odporúčaná nádrž */
  overhangW: number;
  overhangD: number;
};

/**
 * Odporúčaná nádrž na zvolenú skrinku. Akvárium nesmie pretŕčať cez pôdorys
 * skrinky — váhu musí niesť rám po celej ploche dna, nie previs. Preto sa berie
 * najväčší objem, ktorý sa šírkou aj hĺbkou zmestí.
 */
export function suggestTank(w: number, d: number): TankMatch {
  const fits = AQUARIUMS.filter((a) => a.w <= w && a.d <= d).sort(
    (x, y) => x.liters - y.liters
  );
  // najväčší objem NIE je vždy najlepšia rada: na 200 cm skrinku patrí 200 cm
  // nádrž, aj keby mala menej litrov než kratšia vyššia. Preto najprv zhoda
  // pôdorysu, až potom objem.
  const pick = (list: Aquarium[]) =>
    list.length ? list[list.length - 1] : null;
  const best =
    pick(fits.filter((a) => a.w === w && a.d === d)) ??
    pick(fits.filter((a) => a.w === w)) ??
    pick(fits);
  return {
    best,
    fits,
    exact: !!best && best.w === w && best.d === d,
    overhangW: best ? w - best.w : 0,
    overhangD: best ? d - best.d : 0,
  };
}

/**
 * Väčšia nádrž, ktorá by sa na danú šírku zmestila, keby bola skrinka hlbšia.
 * Typicky pri 200 cm skrinke s hĺbkou 50 cm — nádrž 200 × 60 × 60 potrebuje 60 cm.
 * Vracia null, keď hlbšia skrinka nič nové neodomkne.
 */
export function deeperOption(w: number, d: number): Aquarium | null {
  const best = suggestTank(w, d).best;
  const byWidth = AQUARIUMS.filter((a) => a.w <= w).sort(
    (x, y) => x.liters - y.liters
  );
  const top = byWidth[byWidth.length - 1];
  if (!top || top.d <= d) return null;
  if (best && top.liters <= best.liters) return null;
  return top;
}

/** Zaťaženie skrinky: voda + sklo (~15 %) + substrát (~10 %) — rovnaký vzorec ako kalkulačka na /technologia. */
export function tankLoadKg(liters: number): number {
  return Math.round(liters * 1.25);
}

/** Nosnosť rámu, na ktorú je konštrukcia testovaná. */
export const FRAME_LOAD_KG = 770;
