"use client";

import { useMemo, useState } from "react";
import { AQUARIUMS, aquariumPriceValue } from "./aquariums";
import AquariumCard from "./AquariumCard";
import {
  FilterLista,
  Segmented,
  Filter,
  FilterVolba,
  FilterChipy,
  PocetVysledkov,
} from "./Filtre";

const LENGTHS = [...new Set(AQUARIUMS.map((a) => a.w))].sort((x, y) => x - y);

/** Objemové pásma — pre zákazníka zrozumiteľnejšie než holé litre. */
const BANDS = [
  { id: "xs", label: "do 150 l", min: 0, max: 150 },
  { id: "s", label: "150–300 l", min: 151, max: 300 },
  { id: "m", label: "300–500 l", min: 301, max: 500 },
  { id: "l", label: "500 l +", min: 501, max: Infinity },
] as const;

type Band = (typeof BANDS)[number]["id"] | "all";

const RADENIA = [
  { id: "odporucane", label: "Odporúčané" },
  { id: "objem-hore", label: "Od najmenšieho" },
  { id: "objem-dole", label: "Od najväčšieho" },
  { id: "cena-hore", label: "Od najlacnejšieho" },
] as const;
type Radenie = (typeof RADENIA)[number]["id"];

export default function AquaGrid() {
  const [band, setBand] = useState<Band>("all");
  const [lens, setLens] = useState<Set<number>>(new Set());
  const [radenie, setRadenie] = useState<Radenie>("odporucane");

  const prepniDlzku = (w: number) =>
    setLens((s) => {
      const n = new Set(s);
      if (n.has(w)) n.delete(w);
      else n.add(w);
      return n;
    });

  const items = useMemo(() => {
    const f = AQUARIUMS.filter((a) => {
      if (lens.size > 0 && !lens.has(a.w)) return false;
      if (band === "all") return true;
      const b = BANDS.find((x) => x.id === band)!;
      return a.liters >= b.min && a.liters <= b.max;
    });
    switch (radenie) {
      case "objem-hore":
        return [...f].sort((x, y) => x.liters - y.liters);
      case "objem-dole":
        return [...f].sort((x, y) => y.liters - x.liters);
      case "cena-hore":
        return [...f].sort((x, y) => aquariumPriceValue(x) - aquariumPriceValue(y));
      default:
        // rozmery s vlastnou fotkou a popisom od klienta idú prvé
        return [...f].sort(
          (x, y) => Number(y.featured) - Number(x.featured) || x.liters - y.liters,
        );
    }
  }, [band, lens, radenie]);

  const chipy = [
    ...(band !== "all"
      ? [{
          id: `band-${band}`,
          label: BANDS.find((b) => b.id === band)!.label,
          onRemove: () => setBand("all"),
        }]
      : []),
    ...[...lens].sort((a, b) => a - b).map((w) => ({
      id: `l-${w}`,
      label: `${w} cm`,
      onRemove: () => prepniDlzku(w),
    })),
    ...(radenie !== "odporucane"
      ? [{
          id: "sort",
          label: RADENIA.find((r) => r.id === radenie)!.label,
          onRemove: () => setRadenie("odporucane"),
        }]
      : []),
  ];

  const dlzkaHodnota =
    lens.size === 0
      ? "Všetky"
      : [...lens].sort((a, b) => a - b).map((w) => `${w}`).join(", ") + " cm";

  return (
    <>
      <FilterLista>
        <Segmented
          ariaLabel="Objem akvária"
          value={band}
          onChange={setBand}
          volby={[
            { id: "all" as const, label: "Všetky" },
            ...BANDS.map((b) => ({
              id: b.id,
              label: b.label,
              count: AQUARIUMS.filter((a) => a.liters >= b.min && a.liters <= b.max).length,
            })),
          ]}
        />
        <Filter label="Dĺžka" hodnota={dlzkaHodnota} aktivny={lens.size > 0}>
          {LENGTHS.map((w) => (
            <FilterVolba
              key={w}
              label={`${w} cm`}
              count={AQUARIUMS.filter((a) => a.w === w).length}
              checked={lens.has(w)}
              onSelect={() => prepniDlzku(w)}
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
        <PocetVysledkov pocet={items.length} spolu={AQUARIUMS.length} slovo="rozmerov" />
      </FilterLista>

      <FilterChipy
        chipy={chipy}
        onZrusVsetko={() => {
          setBand("all");
          setLens(new Set());
          setRadenie("odporucane");
        }}
      />

      <div className="product-grid" key={`${band}-${[...lens].join("_")}-${radenie}`}>
        {items.map((a, i) => (
          <AquariumCard key={a.slug} a={a} entered delay={(i % 3) * 70} />
        ))}
      </div>
      {items.length === 0 && (
        <p className="catalog__empty">
          Tejto kombinácii objem × dĺžka nezodpovedá žiadna nádrž zo štandardnej
          ponuky — vyrábame však na mieru, tak nám{" "}
          <a href="/dopyt">pošlite svoj rozmer</a>.
        </p>
      )}
    </>
  );
}
