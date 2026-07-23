"use client";

import { useEffect, useState } from "react";
import { PRODUCTS, TIERS, type Tier } from "./products";
import ProductCard from "./ProductCard";

const WIDTHS = [...new Set(PRODUCTS.map((p) => p.w))].sort((a, b) => a - b);

export default function CatalogGrid() {
  const [tier, setTier] = useState<Tier | "all">("all");
  const [width, setWidth] = useState<number>(0);

  // predvoľba radu z TierCards, chips aj z URL (?rad= — preklik z landingu)
  useEffect(() => {
    const rad = new URLSearchParams(window.location.search).get("rad");
    if (rad && TIERS.some((t) => t.id === rad)) setTier(rad as Tier);
    const onTier = (e: Event) => setTier((e as CustomEvent<Tier | "all">).detail);
    window.addEventListener("aq:tier", onTier);
    return () => window.removeEventListener("aq:tier", onTier);
  }, []);

  /* zmena filtra chipsami — ohlásiť aj TierCards, nech svieti správny rad */
  const pickTier = (t: Tier | "all") => {
    setTier(t);
    window.dispatchEvent(new CustomEvent("aq:tier", { detail: t }));
  };

  const items = PRODUCTS.filter(
    (p) => (tier === "all" || p.tier === tier) && (!width || p.w === width)
  );

  return (
    <>
      <div className="catalog__filter-chips">
        <button
          type="button"
          className={`chipbtn${tier === "all" ? " is-on" : ""}`}
          onClick={() => pickTier("all")}
        >
          Všetky rady
        </button>
        {TIERS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`chipbtn${tier === t.id ? " is-on" : ""}`}
            onClick={() => pickTier(t.id)}
            title={t.note}
          >
            {t.label}
            <span className="chipbtn__count">
              {PRODUCTS.filter((p) => p.tier === t.id).length}
            </span>
          </button>
        ))}
      </div>
      <div className="catalog__filter-chips catalog__filter-chips--sizes">
        <button
          type="button"
          className={`chipbtn chipbtn--size${!width ? " is-on" : ""}`}
          onClick={() => setWidth(0)}
        >
          Všetky šírky
        </button>
        {WIDTHS.map((w) => (
          <button
            key={w}
            type="button"
            className={`chipbtn chipbtn--size${width === w ? " is-on" : ""}`}
            onClick={() => setWidth(w)}
          >
            {w} cm
          </button>
        ))}
      </div>
      <div className="product-grid" key={`${tier}-${width}`}>
        {items.map((p, i) => (
          <ProductCard key={p.slug} p={p} entered delay={(i % 3) * 70} />
        ))}
      </div>
      {items.length === 0 && (
        <p className="catalog__empty">
          Tejto kombinácii rad × šírka nezodpovedá žiadna skrinka — skúste iný
          rad, alebo nám pošlite rozmer na mieru cez{" "}
          <a href="/dopyt">dopyt</a>.
        </p>
      )}
    </>
  );
}
