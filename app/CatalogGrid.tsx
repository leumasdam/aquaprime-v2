"use client";

import { useEffect, useMemo, useState } from "react";
import { PRODUCTS, TIERS, type Tier, type Product } from "./products";
import { odkaz, radText, type Jazyk } from "./jazyk";
import { SLOVNIKY } from "./preklady";
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

/** koľko dlaždíc padne na danú šírku — LED verzia je vlastná dlaždica */
const pocetPreSirku = (w: number) =>
  PRODUCTS.filter((p) => p.w === w).length + PRODUCTS.filter((p) => p.w === w && jeLed(p)).length;

/**
 * LED nie je prierezová vlastnosť, ale rad sám o sebe: kompletne opláštená
 * Premium skrinka s LED pásmi pod vrchnou doskou. Preto stojí v tom istom
 * prepínači ako Premium/Štandard/Basic, nie ako samostatný filter.
 */
type Rad = Tier | "all" | "led";
const jeLed = (p: Product) => p.tier === "premium" && Boolean(p.priceLed);
const LED_POCET = PRODUCTS.filter(jeLed).length;

/**
 * Jedna dlaždica katalógu. LED verzia je samostatná položka, nie prepínač na
 * karte — inak by rad LED vo „Všetkých" zmizol, hoci sa naň dá prekliknúť
 * z úvodnej stránky.
 */
type LedFoto = { src: string; dekor: string; farba: string };
type Polozka = { p: Product; led?: LedFoto };

/**
 * Titulné fotky radu LED. Dekor zámerne striedame: väčšina skriniek má
 * nafotenú čiernu aj dubovú a keby každá dlaždica vzala prvú dostupnú,
 * celý rad by ukázal päťkrát tú istú čiernu skrinku.
 */
const LED_FOTA: Map<string, LedFoto> = (() => {
  const out = new Map<string, LedFoto>();
  let predchadzajuci = "";
  for (const p of PRODUCTS.filter(jeLed)) {
    const varianty: LedFoto[] = p.decors.flatMap((d) => {
      const farba = d.led?.zlta?.length ? "zlta" : d.led?.modra?.length ? "modra" : null;
      return farba ? [{ src: d.led![farba]![0], dekor: d.id, farba }] : [];
    });
    if (!varianty.length) continue;
    const v = varianty.find((x) => x.dekor !== predchadzajuci) ?? varianty[0];
    predchadzajuci = v.dekor;
    out.set(p.slug, v);
  }
  return out;
})();

type Radenie = "odporucane" | "cena-hore" | "cena-dole" | "sirka";

function cena(x: Polozka): number {
  const zdroj = (x.led ? x.p.priceLed : x.p.price) ?? x.p.price;
  const n = parseFloat(zdroj.replace(/[^\d,\.]/g, "").replace(",", "."));
  return Number.isFinite(n) && n > 0 ? n : Infinity; // „na dopyt" radíme na koniec
}

export default function CatalogGrid({ jazyk = "sk" }: { jazyk?: Jazyk }) {
  const t = SLOVNIKY[jazyk].katalog;
  const RADENIA = t.radenia.map(([id, label]) => ({ id: id as Radenie, label }));
  const [tier, setTier] = useState<Rad>("all");
  const [widths, setWidths] = useState<Set<number>>(new Set());
  const [radenie, setRadenie] = useState<Radenie>("odporucane");

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
    // vo „Všetkých" ide LED za ostatné rady — rovnaké poradie ako dlaždice
    // kolekcií na úvodnej stránke (Basic, Štandard, Premium, LED)
    const zaklad: Polozka[] =
      tier === "led"
        ? []
        : PRODUCTS.filter((p) => tier === "all" || p.tier === tier).map((p) => ({ p }));
    const ledove: Polozka[] =
      tier === "all" || tier === "led"
        ? PRODUCTS.filter(jeLed).map((p) => ({ p, led: LED_FOTA.get(p.slug) }))
        : [];
    const f = [...zaklad, ...ledove].filter(
      (x) => widths.size === 0 || widths.has(x.p.w),
    );
    switch (radenie) {
      case "cena-hore":
        return [...f].sort((a, b) => cena(a) - cena(b));
      case "cena-dole":
        return [...f].sort((a, b) => cena(b) - cena(a));
      case "sirka":
        return [...f].sort((a, b) => a.p.w - b.p.w || cena(a) - cena(b));
      default:
        return f;
    }
  }, [tier, widths, radenie]);

  const chipy = [
    ...(tier !== "all"
      ? [{
          id: `rad-${tier}`,
          label:
            tier === "led"
              ? "LED"
              : radText(TIERS.find((x) => x.id === tier)?.label ?? tier, jazyk),
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
      ? t.filterVsetky
      : [...widths].sort((a, b) => a - b).map((w) => `${w}`).join(", ") + " cm";

  return (
    <>
      <FilterLista ariaLabel={SLOVNIKY[jazyk].spolocne.filtreAria}>
        <Segmented
          ariaLabel={t.filterRad}
          value={tier}
          onChange={setTier}
          volby={[
            { id: "all" as Rad, label: t.filterVsetky },
            ...TIERS.map((t) => ({
              id: t.id as Rad,
              label: radText(t.label, jazyk),
              count: PRODUCTS.filter((p) => p.tier === t.id).length,
            })),
            { id: "led" as Rad, label: "LED", count: LED_POCET },
          ]}
        />
        <Filter label={t.filterSirka} hodnota={sirkaHodnota} aktivny={widths.size > 0}>
          {WIDTHS.map((w) => (
            <FilterVolba
              key={w}
              label={`${w} cm`}
              count={pocetPreSirku(w)}
              checked={widths.has(w)}
              onSelect={() => prepniSirku(w)}
            />
          ))}
        </Filter>
        <Filter
          label={t.filterZoradit}
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
        <PocetVysledkov
          pocet={items.length}
          spolu={PRODUCTS.length + LED_POCET}
          slovo={t.modelov}
          zo={SLOVNIKY[jazyk].spolocne.zo}
        />
      </FilterLista>

      <FilterChipy
        zrusitVsetko={t.zrusitVsetko}
        chipy={chipy}
        onZrusVsetko={() => {
          setTier("all");
          setWidths(new Set());
          setRadenie("odporucane");
        }}
      />

      <div className="product-grid" key={`${tier}-${[...widths].join("_")}-${radenie}`}>
        {items.map(({ p, led }, i) => (
          <ProductCard
            key={p.slug + (led ? "-led" : "")}
            p={p}
            entered
            delay={(i % 3) * 70}
            foto={led?.src}
            znacka={led ? "LED" : undefined}
            stitok={led ? t.vizualizaciaLed : undefined}
            // detail sa má otvoriť presne v tom, čo je na karte
            odkazParam={led ? `?led=${led.farba}&dekor=${led.dekor}` : undefined}
            jazyk={jazyk}
          />
        ))}
      </div>
      {items.length === 0 && (
        <p className="catalog__empty">
          {t.ziadneVysledky}{" "}
          <a href={odkaz("/dopyt", jazyk)}>{t.ziadneVysledkyOdkaz}</a>.
        </p>
      )}
    </>
  );
}
