"use client";

import Link from "next/link";
import { useState } from "react";
import { PRODUCTS } from "./products";

const COLLS = ["Všetky", "LINEA", "PRESTIGE", "SIGNATURE"];

export default function CatalogGrid() {
  const [coll, setColl] = useState("Všetky");
  const items =
    coll === "Všetky"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.collection === coll);

  return (
    <>
      <div className="catalog__filter-chips">
        {COLLS.map((c) => (
          <button
            key={c}
            type="button"
            className={`chipbtn${coll === c ? " is-on" : ""}`}
            onClick={() => setColl(c)}
          >
            {c}
            {c !== "Všetky" && (
              <span className="chipbtn__count">
                {PRODUCTS.filter((p) => p.collection === c).length}
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="product-grid" key={coll}>
        {items.map((p, i) => (
          <Link
            href={`/skrinky/${p.slug}`}
            className="product product--in"
            key={p.slug}
            style={{ "--rd": `${(i % 3) * 70}ms` } as React.CSSProperties}
          >
            <div className={`product__media product__media--${p.mod}`}>
              <span className="product__badge">{p.collection}</span>
            </div>
            <div className="product__body">
              <h3 className="product__name">{p.name}</h3>
              <div className="product__specs">
                <span>
                  <i>Rozmer</i>
                  {p.dim}
                </span>
                <span>
                  <i>Nosnosť</i>
                  {p.load}
                </span>
              </div>
              <div className="product__foot">
                <span className="product__price">{p.price}</span>
                <span className="product__cta">
                  Detail <span aria-hidden>→</span>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
