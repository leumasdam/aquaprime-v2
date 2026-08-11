"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Swatch from "./Swatch";
import {
  CFG_SIZES,
  CFG_TIERS,
  ledOf,
  priceOf,
  productFor,
} from "./configurator-logic";
import type { Tier } from "./products";

/**
 * Mini-konfigurátor na homepade — zámerne len tri voľby (rad, rozmer, dekor).
 * Podnož, LED a akvárium patria do plného konfigurátora; tu ide o to ukázať
 * reálny produkt a cenu na pár klikov, nie zopakovať celú stránku.
 */
export default function Configurator() {
  const [tier, setTier] = useState<Tier>("premium");
  const [sizeKey, setSizeKey] = useState(CFG_SIZES[0].key);
  const [decorId, setDecorId] = useState<string | null>(null);

  const size = CFG_SIZES.find((s) => s.key === sizeKey)!;
  const product = productFor(tier, size)!;
  // bez vlastnej voľby ukáž najlepšie zdokumentovaný dekor
  const decor =
    product.decors.find((x) => x.id === decorId) ??
    product.decors.find((x) => !x.inherited) ??
    product.decors.find((x) => x.illuFrom === "rozmer") ??
    product.decors[0];
  const price = priceOf(product, false);
  const ledPrem = ledOf(product);

  return (
    <div className="cfg__grid">
      {/* náhľad — reálna fotka z katalógu */}
      <div className="cfg__preview" data-reveal="scale">
        <div className="cfg__shot">
          <Image
            key={decor.images[0]}
            src={decor.images[0]}
            alt={`${product.name} — dekor ${decor.name}`}
            fill
            sizes="(max-width: 900px) 92vw, 46vw"
          />
          {decor.inherited &&
            (decor.illuFrom === "rad" ? (
              <span className="pgal__illu">Ilustračné foto — iný rad</span>
            ) : (
              <span className="pgal__illu pgal__illu--size">
                Foto rozmeru {decor.illuSize ?? "iného"}
              </span>
            ))}
        </div>
        <p className="cfg__hint">
          {product.tierLabel} · {product.dim} · {decor.name}
        </p>
      </div>

      {/* ovládanie */}
      <div className="cfg__panel" data-reveal>
        <div className="cfg__field">
          <span className="cfg__legend">
            <span className="cfg__n">01</span> Rad
          </span>
          <div className="cfg__feet-opts">
            {CFG_TIERS.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`cfg__opt${tier === t.id ? " is-on" : ""}`}
                onClick={() => setTier(t.id)}
                title={t.note}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="cfg__field">
          <span className="cfg__legend">
            <span className="cfg__n">02</span> Rozmer
          </span>
          <div className="cfg__sizes">
            {CFG_SIZES.map((s) => (
              <button
                key={s.key}
                type="button"
                className={`cfg__opt cfg__opt--size${
                  sizeKey === s.key ? " is-on" : ""
                }`}
                onClick={() => setSizeKey(s.key)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="cfg__field">
          <span className="cfg__legend">
            <span className="cfg__n">03</span> Dekor
          </span>
          <div className="cfg__swatches">
            {product.decors.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`cfg__swatch${decor.id === c.id ? " is-on" : ""}`}
                aria-label={c.name}
                title={c.name}
                onClick={() => setDecorId(c.id)}
              >
                <Swatch swatch={c.swatch} />
              </button>
            ))}
          </div>
        </div>

        <div className="cfg__summary">
          <div className="cfg__price">
            <span className="cfg__price-label">Cena skrinky</span>
            <span className="cfg__price-val">
              {price.toLocaleString("sk-SK")} €
            </span>
            <span className="cfg__price-note">
              vrátane DPH
              {ledPrem !== null ? ` · s LED +${ledPrem} €` : ""}
            </span>
          </div>
          <div className="cfg__actions">
            <Link href="/konfigurator" className="btn-cyan cfg__submit">
              DOLADIŤ V KONFIGURÁTORE <span aria-hidden>→</span>
            </Link>
            <Link href={`/skrinky/${product.slug}`} className="cfg__detail">
              Detail produktu
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
