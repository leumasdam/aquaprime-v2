"use client";

import type { CSSProperties } from "react";
import type { Tier } from "./products";

const CARDS: { id: Tier; name: string; sub: string }[] = [
  {
    id: "premium",
    name: "PREMIUM",
    sub: "KOMPLETNE OPLÁŠTENÁ",
  },
  {
    id: "standard",
    name: "ŠTANDARD",
    sub: "BOČNICE A DVIERKA",
  },
  {
    id: "basic",
    name: "BASIC",
    sub: "KOVOVÝ RÁM + VRCHNÁ DOSKA",
  },
];

/** Rýchla voľba radu — klik prednastaví filter v CatalogGrid a zoskroluje na katalóg. */
export default function TierCards() {
  return (
    <div className="collection-cards">
      {CARDS.map((c, i) => (
        <a
          key={c.id}
          href="#katalog"
          className={`collection-card collection-card--${c.id}`}
          data-reveal
          style={{ "--rd": `${i * 100}ms` } as CSSProperties}
          onClick={() => {
            window.dispatchEvent(
              new CustomEvent("aq:tier", { detail: c.id })
            );
          }}
        >
          <div className="collection-card__text">
            <div className="collection-card__name">{c.name}</div>
            <div className="collection-card__sub">{c.sub}</div>
          </div>
        </a>
      ))}
    </div>
  );
}
