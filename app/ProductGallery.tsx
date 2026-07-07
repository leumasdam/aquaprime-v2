"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "./products";

/** Galéria detailu produktu — hlavná fotka, thumbnaily a prepínač dekorov. */
export default function ProductGallery({ p }: { p: Product }) {
  const [decorIdx, setDecorIdx] = useState(0);
  const [imgIdx, setImgIdx] = useState(0);
  const decor = p.decors[decorIdx];
  const img = decor.images[Math.min(imgIdx, decor.images.length - 1)];

  return (
    <div className="pgal" data-reveal="scale">
      <div className="pgal__main">
        <Image
          key={img}
          src={img}
          alt={`${p.name} — dekor ${decor.name}`}
          fill
          priority
          sizes="(max-width: 820px) 92vw, 48vw"
        />
        <span className={`product__badge product__badge--${p.tier}`}>
          {p.tierLabel}
        </span>
      </div>

      {decor.images.length > 1 && (
        <div className="pgal__thumbs">
          {decor.images.map((src, i) => (
            <button
              key={src}
              type="button"
              className={`pgal__thumb${i === imgIdx ? " is-on" : ""}`}
              onClick={() => setImgIdx(i)}
              aria-label={`Fotografia ${i + 1}`}
            >
              <Image src={src} alt="" fill sizes="64px" />
            </button>
          ))}
        </div>
      )}

      {p.decors.length > 1 && (
        <div className="pgal__decors" role="group" aria-label="Dekor">
          {p.decors.map((d, i) => (
            <button
              key={d.id}
              type="button"
              className={`chipbtn${i === decorIdx ? " is-on" : ""}`}
              onClick={() => {
                setDecorIdx(i);
                setImgIdx(0);
              }}
            >
              {d.name}
            </button>
          ))}
        </div>
      )}

      {decor.inherited && (
        <p className="pgal__note">
          Ilustračné fotografie — rovnaký dekor na skrinke iného rozmeru.
        </p>
      )}
    </div>
  );
}
