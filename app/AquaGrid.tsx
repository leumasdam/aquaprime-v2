"use client";

import { useMemo, useState } from "react";
import { AQUARIUMS, aquariumPriceValue } from "./aquariums";
import AquariumCard from "./AquariumCard";
import { odkaz, type Jazyk } from "./jazyk";
import { SLOVNIKY } from "./preklady";
import {
  FilterLista,
  Segmented,
  Filter,
  FilterVolba,
  FilterChipy,
  PocetVysledkov,
} from "./Filtre";

const LENGTHS = [...new Set(AQUARIUMS.map((a) => a.w))].sort((x, y) => x - y);

type Band = Pasmo | "all";

type Radenie = "odporucane" | "objem-hore" | "objem-dole" | "cena-hore";
/** Objemové pásma — pre zákazníka zrozumiteľnejšie než holé litre. */
type Pasmo = "xs" | "s" | "m" | "l";
const HRANICE: Record<Pasmo, [number, number]> = {
  xs: [0, 150],
  s: [151, 300],
  m: [301, 500],
  l: [501, Infinity],
};

export default function AquaGrid({ jazyk = "sk" }: { jazyk?: Jazyk }) {
  const t = SLOVNIKY[jazyk].akvaria;
  const BANDS = t.pasma.map(([id, label]) => ({
    id: id as Pasmo,
    label,
    min: HRANICE[id as Pasmo][0],
    max: HRANICE[id as Pasmo][1],
  }));
  const RADENIA = t.radenia.map(([id, label]) => ({ id: id as Radenie, label }));
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
      ? t.filterVsetky
      : [...lens].sort((a, b) => a - b).map((w) => `${w}`).join(", ") + " cm";

  return (
    <>
      <FilterLista ariaLabel={SLOVNIKY[jazyk].spolocne.filtreAria}>
        <Segmented
          ariaLabel={t.filterObjem}
          value={band}
          onChange={setBand}
          volby={[
            { id: "all" as const, label: t.filterVsetky },
            ...BANDS.map((b) => ({
              id: b.id,
              label: b.label,
              count: AQUARIUMS.filter((a) => a.liters >= b.min && a.liters <= b.max).length,
            })),
          ]}
        />
        <Filter label={t.filterDlzka} hodnota={dlzkaHodnota} aktivny={lens.size > 0}>
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
          spolu={AQUARIUMS.length}
          slovo={t.rozmerov}
          zo={SLOVNIKY[jazyk].spolocne.zo}
        />
      </FilterLista>

      <FilterChipy
        zrusitVsetko={SLOVNIKY[jazyk].katalog.zrusitVsetko}
        chipy={chipy}
        onZrusVsetko={() => {
          setBand("all");
          setLens(new Set());
          setRadenie("odporucane");
        }}
      />

      <div className="product-grid" key={`${band}-${[...lens].join("_")}-${radenie}`}>
        {items.map((a, i) => (
          <AquariumCard key={a.slug} a={a} entered delay={(i % 3) * 70} jazyk={jazyk} />
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
