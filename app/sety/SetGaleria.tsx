"use client";

import Image from "next/image";
import { useState } from "react";
import type { Set } from "../sety";
import Swatch from "../Swatch";

/**
 * Galéria setu na detaile: veľký záber, pod ním miniatúry a prepínač
 * prevedení. Prepnutie prevedenia vymení celú sadu záberov a vráti sa
 * na prvý, aby zákazník nezostal na fotke, ktorá v novej farbe nesedí.
 */
export default function SetGaleria({
  set,
  popisPrevedenia,
  vychodzie,
}: {
  set: Set;
  popisPrevedenia: string;
  /** prevedenie z adresy (?prevedenie=…) */
  vychodzie?: string;
}) {
  const start = Math.max(0, set.prevedenia.findIndex((p) => p.id === vychodzie));
  const [prev, setPrev] = useState(start);
  const [foto, setFoto] = useState(0);
  const p = set.prevedenia[prev];

  return (
    <div className="setg">
      <div className="setg__hlavna">
        <Image
          key={p.fotky[foto]}
          src={p.fotky[foto]}
          alt={`${set.nazov} — ${p.nazov}`}
          fill
          priority
          sizes="(max-width: 899px) 92vw, 44vw"
        />
      </div>

      <div className="setg__mini" role="group" aria-label={set.nazov}>
        {p.fotky.map((f, j) => (
          <button
            key={f}
            type="button"
            className={`setg__minii${j === foto ? " is-on" : ""}`}
            aria-pressed={j === foto}
            aria-label={`${set.nazov} ${j + 1}`}
            onClick={() => setFoto(j)}
          >
            <Image src={f} alt="" fill sizes="90px" />
          </button>
        ))}
      </div>

      <div className="setg__prevedenia" role="group" aria-label={popisPrevedenia}>
        {set.prevedenia.map((x, j) => (
          <button
            key={x.id}
            type="button"
            className={`setg__prev${j === prev ? " is-on" : ""}`}
            aria-pressed={j === prev}
            onClick={() => {
              setPrev(j);
              setFoto(0);
            }}
          >
            <Swatch swatch={x.swatch} className="swatch--dot" />
            <span>{x.nazov}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
