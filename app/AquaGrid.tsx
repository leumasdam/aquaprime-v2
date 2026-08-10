"use client";

import { useState } from "react";
import { AQUARIUMS } from "./aquariums";
import AquariumCard from "./AquariumCard";

const LENGTHS = [...new Set(AQUARIUMS.map((a) => a.w))].sort((x, y) => x - y);

/** Objemové pásma — pre zákazníka zrozumiteľnejšie než holé litre. */
const BANDS = [
  { id: "s", label: "do 200 l", min: 0, max: 200 },
  { id: "m", label: "200 – 400 l", min: 201, max: 400 },
  { id: "l", label: "nad 400 l", min: 401, max: Infinity },
] as const;

type Band = (typeof BANDS)[number]["id"] | "all";

export default function AquaGrid() {
  const [len, setLen] = useState(0);
  const [band, setBand] = useState<Band>("all");

  const items = AQUARIUMS.filter((a) => {
    if (len && a.w !== len) return false;
    if (band === "all") return true;
    const b = BANDS.find((x) => x.id === band)!;
    return a.liters >= b.min && a.liters <= b.max;
  });

  return (
    <>
      <div className="catalog__filter-chips">
        <button
          type="button"
          className={`chipbtn${band === "all" ? " is-on" : ""}`}
          onClick={() => setBand("all")}
        >
          Všetky objemy
        </button>
        {BANDS.map((b) => (
          <button
            key={b.id}
            type="button"
            className={`chipbtn${band === b.id ? " is-on" : ""}`}
            onClick={() => setBand(b.id)}
          >
            {b.label}
            <span className="chipbtn__count">
              {AQUARIUMS.filter((a) => a.liters >= b.min && a.liters <= b.max).length}
            </span>
          </button>
        ))}
      </div>
      <div className="catalog__filter-chips catalog__filter-chips--sizes">
        <button
          type="button"
          className={`chipbtn chipbtn--size${!len ? " is-on" : ""}`}
          onClick={() => setLen(0)}
        >
          Všetky dĺžky
        </button>
        {LENGTHS.map((w) => (
          <button
            key={w}
            type="button"
            className={`chipbtn chipbtn--size${len === w ? " is-on" : ""}`}
            onClick={() => setLen(w)}
          >
            {w} cm
          </button>
        ))}
      </div>
      <div className="product-grid" key={`${band}-${len}`}>
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
