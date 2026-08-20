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
} from "./Filtre";

const WIDTHS = [...new Set(PRODUCTS.map((p) => p.w))].sort((a, b) => a - b);

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

  // predvoľba radu z URL (?rad= — preklik z landingu) + starší aq:tier event
  useEffect(() => {
    const rad = new URLSearchParams(window.location.search).get("rad");
    if (rad && TIERS.some((t) => t.id === rad)) setTier(rad as Tier);
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
      (p) => (tier === "all" || p.tier === tier) && (widths.size === 0 || widths.has(p.w)),
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
  }, [tier, widths, radenie]);

  const chipy = [
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
        }}
      />

      <div className="product-grid" key={`${tier}-${[...widths].join("_")}-${radenie}`}>
        {items.map((p, i) => (
          <ProductCard key={p.slug} p={p} entered delay={(i % 3) * 70} />
        ))}
      </div>
      {items.length === 0 && (
        <p className="catalog__empty">
          Tejto kombinácii rad × šírka nezodpovedá žiadna skrinka — skúste iný
          rad, alebo nám pošlite rozmer na mieru cez <a href="/dopyt">dopyt</a>.
        </p>
      )}
    </>
  );
}
