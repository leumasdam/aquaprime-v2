"use client";

import { useEffect, useState, type CSSProperties } from "react";
import type { Tier } from "./products";

const CARDS: { id: Tier; name: string; sub: string }[] = [
  { id: "premium", name: "PREMIUM", sub: "Kompletne opláštená" },
  { id: "standard", name: "ŠTANDARD", sub: "Bočnice a dvierka" },
  { id: "basic", name: "BASIC", sub: "Kovový rám + doska" },
];

const TIER_IDS: Tier[] = ["premium", "standard", "basic"];

/**
 * Rýchla voľba radu — kompaktné prepínače. Aktívny rad svieti;
 * stav sa synchronizuje s filtrom katalógu cez event `aq:tier`
 * a predvolí sa aj z URL (?rad=premium|standard|basic).
 */
export default function TierCards() {
  const [active, setActive] = useState<Tier | null>(null);

  useEffect(() => {
    /* predvoľba z URL (preklik z landingu) */
    const rad = new URLSearchParams(window.location.search).get("rad");
    if (rad && TIER_IDS.includes(rad as Tier)) setActive(rad as Tier);

    /* zmeny filtra (chips v katalógu aj tieto karty) */
    const onTier = (e: Event) => {
      const t = (e as CustomEvent<Tier | "all">).detail;
      setActive(t === "all" ? null : t);
    };
    window.addEventListener("aq:tier", onTier);
    return () => window.removeEventListener("aq:tier", onTier);
  }, []);

  return (
    <div className="tier-mini" role="group" aria-label="Rýchla voľba radu">
      {CARDS.map((c, i) => (
        <a
          key={c.id}
          href="#katalog"
          className={`tier-mini__btn${active === c.id ? " is-on" : ""}`}
          aria-pressed={active === c.id}
          data-reveal
          style={{ "--rd": `${i * 80}ms` } as CSSProperties}
          onClick={() => {
            window.dispatchEvent(new CustomEvent("aq:tier", { detail: c.id }));
          }}
        >
          <span className="tier-mini__dot" aria-hidden />
          <span className="tier-mini__text">
            <b>{c.name}</b>
            {c.sub}
          </span>
          <span className="tier-mini__arrow" aria-hidden>
            →
          </span>
        </a>
      ))}
    </div>
  );
}
