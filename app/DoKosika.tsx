"use client";

import { useState } from "react";
import { useKosik, type PolozkaKosika } from "./kosik-store";
import { type Jazyk } from "./jazyk";
import { SLOVNIKY } from "./preklady";

/**
 * Pridanie do košíka. Po kliknutí sa na dve sekundy prepne na potvrdenie,
 * aby bolo jasné, že sa niečo stalo — bez toho ľudia klikajú znova.
 */
export default function DoKosika({
  polozka,
  variant = "plne",
  popis,
  jazyk = "sk",
}: {
  polozka: Omit<PolozkaKosika, "ks">;
  variant?: "plne" | "tiche";
  /** text tlačidla — mení sa s jazykom stránky */
  popis?: string;
  jazyk?: Jazyk;
}) {
  const s = SLOVNIKY[jazyk].spolocne;
  const { pridaj } = useKosik();
  const [pridane, setPridane] = useState(false);

  return (
    <button
      type="button"
      className={variant === "plne" ? "btn-cyan dokosika" : "btn-outline dokosika"}
      onClick={() => {
        pridaj(polozka);
        setPridane(true);
        setTimeout(() => setPridane(false), 2000);
      }}
      aria-live="polite"
    >
      {pridane ? (
        <>
          {s.vKosiku} <span aria-hidden>✓</span>
        </>
      ) : (
        <>
          {popis ?? s.doKosika} <span aria-hidden>+</span>
        </>
      )}
    </button>
  );
}
