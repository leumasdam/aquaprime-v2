"use client";

import Image from "next/image";
import { useState } from "react";
import Lightbox from "../Lightbox";
import { useOkrajFotky } from "../okrajFotky";
import type { Jazyk } from "../jazyk";
import { SLOVNIKY } from "../preklady";
import { VT } from "../vt";

/**
 * Galéria akvária s fotkami od klienta (z administrácie): hlavný záber
 * a rad náhľadov pod ním; každá fotka sa dá rozkliknúť na celú obrazovku.
 * Akvárium bez vlastných fotiek dostane jedinú pôvodnú vizualizáciu.
 */
function Nahlad({ src }: { src: string }) {
  const okraj = useOkrajFotky(src);
  return <Image src={src} alt="" fill sizes="64px" style={{ objectPosition: okraj }} />;
}

export default function AkvariumGaleria({
  slug,
  fotky,
  alt,
  objem,
  jazyk,
  ilustracna,
  poznamka,
}: {
  slug: string;
  fotky: string[];
  alt: string;
  objem: string;
  jazyk: Jazyk;
  /** štítok „ilustračná fotka" pri pôvodnej vizualizácii z kódu */
  ilustracna?: string;
  /** poznámka pod fotkou (len pri pôvodnej vizualizácii) */
  poznamka?: string;
}) {
  const tp = SLOVNIKY[jazyk].produkt;
  const [i, setI] = useState(0);
  const [velke, setVelke] = useState(false);
  const img = fotky[Math.min(i, fotky.length - 1)];
  const okraj = useOkrajFotky(img);

  return (
    <div className="pgal pgal--scene" data-reveal="scale">
      {/* rovnaké meno má karta v katalógu — z nej sa sem premorfuje */}
      <VT name={`a-${slug}`} share="vt-morph">
        <div className="pgal__main">
          <button type="button" className="pgal__zoom" onClick={() => setVelke(true)} aria-label={tp.zvacsit}>
            <Image key={img} src={img} alt={alt} fill priority sizes="(max-width: 820px) 92vw, 48vw" style={{ objectPosition: okraj }} />
            <span className="pgal__lupa" aria-hidden>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5M11 8v6M8 11h6" /></svg>
            </span>
          </button>
          <span className="product__badge product__badge--aqua">{objem}</span>
          {ilustracna && <span className="pgal__illu">{ilustracna}</span>}
        </div>
      </VT>
      {velke && <Lightbox fotky={fotky} index={i} alt={alt} jazyk={jazyk} onZmena={setI} onZavri={() => setVelke(false)} />}
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
              <Nahlad src={src} />
            </button>
          ))}
        </div>
      )}
      {poznamka && <p className="pgal__note">{poznamka}</p>}
    </div>
  );
}
