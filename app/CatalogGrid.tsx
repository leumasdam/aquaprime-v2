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

/**
 * LED nie je prierezová vlastnosť, ale rad sám o sebe: kompletne opláštená
 * Premium skrinka s LED pásmi pod vrchnou doskou. Preto stojí v tom istom
 * prepínači ako Premium/Štandard/Basic, nie ako samostatný filter.
 */
type Rad = Tier | "all" | "led";
const jeLed = (p: Product) => p.tier === "premium" && Boolean(p.priceLed);
const LED_POCET = PRODUCTS.filter(jeLed).length;

/**
 * Titulná fotka pre rad LED. Dekor striedame podľa poradia produktu
 * v cenníku — inak by celý rad ukázal päťkrát tú istú skrinku.
 */
function ledFoto(p: Product) {
  const varianty = p.decors.flatMap((d) => {
    const farba = d.led?.zlta?.length ? "zlta" : d.led?.modra?.length ? "modra" : null;
    return farba ? [{ src: d.led![farba]![0], dekor: d.id, farba }] : [];
  });
  if (!varianty.length) return undefined;
  return varianty[PRODUCTS.indexOf(p) % varianty.length];
}

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
  const [tier, setTier] = useState<Rad>("all");
  const [widths, setWidths] = useState<Set<number>>(new Set());
  const [radenie, setRadenie] = useState<Radenie>("odporucane");
  const lenLed = tier === "led";

  // predvoľba radu z URL (?rad= — preklik z landingu) + event z dlaždíc radov
  useEffect(() => {
    const rad = new URLSearchParams(window.location.search).get("rad");
    if (rad === "led" || TIERS.some((t) => t.id === rad)) setTier(rad as Rad);
    const onTier = (e: Event) => setTier((e as CustomEvent<Rad>).detail);
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
        (tier === "all" || (tier === "led" ? jeLed(p) : p.tier === tier)) &&
        (widths.size === 0 || widths.has(p.w)),
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
          label: tier === "led" ? "LED" : (TIERS.find((t) => t.id === tier)?.label ?? tier),
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
            { id: "all" as Rad, label: "Všetky" },
            ...TIERS.map((t) => ({
              id: t.id as Rad,
              label: t.label,
              count: PRODUCTS.filter((p) => p.tier === t.id).length,
            })),
            { id: "led" as Rad, label: "LED", count: LED_POCET },
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
        {items.map((p, i) => {
          const led = lenLed ? ledFoto(p) : undefined;
          return (
            <ProductCard
              key={p.slug}
              p={p}
              entered
              delay={(i % 3) * 70}
              foto={led?.src}
              stitok={led ? "Vizualizácia LED" : undefined}
              // detail sa má otvoriť presne v tom, čo je na karte
              odkazParam={led ? `?led=${led.farba}&dekor=${led.dekor}` : undefined}
            />
          );
        })}
      </div>
      {items.length === 0 && (
        <p className="catalog__empty">
          Tejto kombinácii filtrov nezodpovedá žiadna skrinka — skúste iný rad,
          alebo nám pošlite rozmer na mieru cez <a href="/dopyt">dopyt</a>.
        </p>
      )}
    </>
  );
}
