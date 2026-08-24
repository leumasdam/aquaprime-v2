"use client";

import { useEffect, useMemo, useState } from "react";
import { PRODUCTS, TIERS, type Tier, type Product } from "./products";
import ProductCard from "./ProductCard";
import {
  FilterLista,
  Segmented,
  Filter,
  FilterVolba,
  FilterChipy,
  PocetVysledkov,
  Prepinac,
} from "./Filtre";

const WIDTHS = [...new Set(PRODUCTS.map((p) => p.w))].sort((a, b) => a - b);

/** LED lišta sa osádza do plášťa — rad Basic ju v cenníku nemá. */
const maLed = (p: Product) => Boolean(p.priceLed);
const LED_POCET = PRODUCTS.filter(maLed).length;

const LED_IKONA = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
    <path d="M4 10.5h16" />
    <path d="M6.5 14.2h11" />
    <path d="M9 17.4h6" />
  </svg>
);

const RADENIA = [
  { id: "odporucane", label: "Odporúčané" },
  { id: "cena-hore", label: "Od najlacnejšej" },
  { id: "cena-dole", label: "Od najdrahšej" },
  { id: "sirka", label: "Podľa šírky" },
] as const;
type Radenie = (typeof RADENIA)[number]["id"];

function cena(p: Product): number {
  const n = parseFloat(p.price.replace(/[^\d,\.]/g, "").replace(",", "."));
  return Number.isFinite(n) && n > 0 ? n : Infinity; // „na dopyt" radíme na koniec
}

export default function CatalogGrid() {
  const [tier, setTier] = useState<Tier | "all">("all");
  const [widths, setWidths] = useState<Set<number>>(new Set());
  const [radenie, setRadenie] = useState<Radenie>("odporucane");
  const [lenLed, setLenLed] = useState(false);

  // predvoľby z URL: ?rad= (rad skriniek) a ?led=1 (dlaždica LED na landingu)
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const rad = q.get("rad");
    if (rad && TIERS.some((t) => t.id === rad)) setTier(rad as Tier);
    if (q.get("led") === "1") setLenLed(true);
    const onTier = (e: Event) => setTier((e as CustomEvent<Tier | "all">).detail);
    window.addEventListener("aq:tier", onTier);
    return () => window.removeEventListener("aq:tier", onTier);
  }, []);

  const prepniSirku = (w: number) =>
    setWidths((s) => {
      const n = new Set(s);
      if (n.has(w)) n.delete(w);
      else n.add(w);
      return n;
    });

  const items = useMemo(() => {
    const f = PRODUCTS.filter(
      (p) =>
        (tier === "all" || p.tier === tier) &&
        (widths.size === 0 || widths.has(p.w)) &&
        (!lenLed || maLed(p)),
    );
    switch (radenie) {
      case "cena-hore":
        return [...f].sort((a, b) => cena(a) - cena(b));
      case "cena-dole":
        return [...f].sort((a, b) => cena(b) - cena(a));
      case "sirka":
        return [...f].sort((a, b) => a.w - b.w || cena(a) - cena(b));
      default:
        return f;
    }
  }, [tier, widths, radenie, lenLed]);

  const chipy = [
    ...(lenLed
      ? [{ id: "led", label: "S LED podsvietením", onRemove: () => setLenLed(false) }]
      : []),
    ...(tier !== "all"
      ? [{
          id: `rad-${tier}`,
          label: TIERS.find((t) => t.id === tier)?.label ?? tier,
          onRemove: () => setTier("all"),
        }]
      : []),
    ...[...widths].sort((a, b) => a - b).map((w) => ({
      id: `w-${w}`,
      label: `${w} cm`,
      onRemove: () => prepniSirku(w),
    })),
    ...(radenie !== "odporucane"
      ? [{
          id: "sort",
          label: RADENIA.find((r) => r.id === radenie)!.label,
          onRemove: () => setRadenie("odporucane"),
        }]
      : []),
  ];

  const sirkaHodnota =
    widths.size === 0
      ? "Všetky"
      : [...widths].sort((a, b) => a - b).map((w) => `${w}`).join(", ") + " cm";

  return (
    <>
      <FilterLista>
        <Segmented
          ariaLabel="Rad skriniek"
          value={tier}
          onChange={setTier}
          volby={[
            { id: "all" as const, label: "Všetky" },
            ...TIERS.map((t) => ({
              id: t.id,
              label: t.label,
              count: PRODUCTS.filter((p) => p.tier === t.id).length,
            })),
          ]}
        />
        <Filter label="Šírka" hodnota={sirkaHodnota} aktivny={widths.size > 0}>
          {WIDTHS.map((w) => (
            <FilterVolba
              key={w}
              label={`${w} cm`}
              count={PRODUCTS.filter((p) => p.w === w).length}
              checked={widths.has(w)}
              onSelect={() => prepniSirku(w)}
            />
          ))}
        </Filter>
        <Prepinac
          label="S LED podsvietením"
          zapnuty={lenLed}
          onToggle={() => setLenLed((v) => !v)}
          ikona={LED_IKONA}
          count={LED_POCET}
        />
        <Filter
          label="Zoradiť"
          hodnota={RADENIA.find((r) => r.id === radenie)!.label}
          aktivny={radenie !== "odporucane"}
        >
          {RADENIA.map((r) => (
            <FilterVolba
              key={r.id}
              typ="radio"
              label={r.label}
              checked={radenie === r.id}
              onSelect={() => setRadenie(r.id)}
            />
          ))}
        </Filter>
        <PocetVysledkov pocet={items.length} spolu={PRODUCTS.length} slovo="modelov" />
      </FilterLista>

      <FilterChipy
        chipy={chipy}
        onZrusVsetko={() => {
          setTier("all");
          setWidths(new Set());
          setRadenie("odporucane");
          setLenLed(false);
        }}
      />

      <div className="product-grid" key={`${tier}-${[...widths].join("_")}-${radenie}-${lenLed}`}>
        {items.map((p, i) => (
          <ProductCard key={p.slug} p={p} entered delay={(i % 3) * 70} />
        ))}
      </div>
      {items.length === 0 && (
        <p className="catalog__empty">
          {lenLed && tier === "basic" ? (
            <>
              Rad Basic nemá opláštenie, do ktorého sa LED lišta osádza — vyberte
              Štandard alebo Premium, prípadne nám napíšte cez{" "}
              <a href="/dopyt">dopyt</a>.
            </>
          ) : (
            <>
              Tejto kombinácii filtrov nezodpovedá žiadna skrinka — skúste iný
              rad, alebo nám pošlite rozmer na mieru cez <a href="/dopyt">dopyt</a>.
            </>
          )}
        </p>
      )}
    </>
  );
}
