"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "./products";
import Swatch from "./Swatch";

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
        {decor.inherited &&
          (decor.illuFrom === "rad" ? (
            <span className="pgal__illu" title="Tento dekor máme nafotený len na inom rade">
              Ilustračné foto — iný rad
            </span>
          ) : (
            <span
              className="pgal__illu pgal__illu--size"
              title="Tá istá skrinka a dekor, len kratšie vyhotovenie"
            >
              Foto rozmeru {decor.illuSize ?? "iného"}
            </span>
          ))}
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
        <div className="pgal__decorbar">
          <div className="pgal__decor-head">
            <span className="pgal__decor-label">Dekor</span>
            <span className="pgal__decor-name">{decor.name}</span>
          </div>
          <div className="pgal__decors" role="group" aria-label="Dekor">
            {p.decors.map((d, i) => (
              <button
                key={d.id}
                type="button"
                title={d.name}
                aria-label={d.name}
                aria-pressed={i === decorIdx}
                className={`pgal__decorbtn${i === decorIdx ? " is-on" : ""}`}
                onClick={() => {
                  setDecorIdx(i);
                  setImgIdx(0);
                }}
              >
                <Swatch swatch={d.swatch} />
              </button>
            ))}
          </div>
        </div>
      )}

      {decor.inherited && (
        <p className="pgal__note">
          {decor.illuFrom === "rad"
            ? "Ilustračné fotografie — tento dekor máme zatiaľ nafotený len na inom rade konštrukcie."
            : `Fotografie zachytávajú rovnakú skrinku v tomto dekore, len v dĺžke ${
                decor.illuSize ?? "iného rozmeru"
              }. Konštrukcia aj povrch sú zhodné.`}
        </p>
      )}
    </div>
  );
}
