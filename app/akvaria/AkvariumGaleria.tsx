"use client";

import Image from "next/image";
import { useState } from "react";
import type { Jazyk } from "../jazyk";
import { SLOVNIKY } from "../preklady";
import { VT } from "../vt";

/**
 * Galéria akvária s fotkami od klienta (z administrácie): hlavný záber
 * a rad náhľadov pod ním. Akvárium s jedinou pôvodnou fotkou galériu
 * nepotrebuje — to kreslí AkvariumObsah priamo.
 */
export default function AkvariumGaleria({
  slug,
  fotky,
  alt,
  objem,
  jazyk,
}: {
  slug: string;
  fotky: string[];
  alt: string;
  objem: string;
  jazyk: Jazyk;
}) {
  const tp = SLOVNIKY[jazyk].produkt;
  const [i, setI] = useState(0);
  const img = fotky[Math.min(i, fotky.length - 1)];

  return (
    <div className="pgal pgal--scene" data-reveal="scale">
      {/* rovnaké meno má karta v katalógu — z nej sa sem premorfuje */}
      <VT name={`a-${slug}`} share="vt-morph">
        <div className="pgal__main">
          <Image key={img} src={img} alt={alt} fill priority sizes="(max-width: 820px) 92vw, 48vw" />
          <span className="product__badge product__badge--aqua">{objem}</span>
        </div>
      </VT>
      {fotky.length > 1 && (
        <div className="pgal__thumbs">
          {fotky.map((src, j) => (
            <button
              key={src}
              type="button"
              className={`pgal__thumb${j === i ? " is-on" : ""}`}
              onClick={() => setI(j)}
              aria-label={`${tp.fotografia} ${j + 1}`}
            >
              <Image src={src} alt="" fill sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
