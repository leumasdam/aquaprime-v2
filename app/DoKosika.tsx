"use client";

import { useState } from "react";
import { useKosik, type PolozkaKosika } from "./kosik-store";

/**
 * Pridanie do košíka. Po kliknutí sa na dve sekundy prepne na potvrdenie,
 * aby bolo jasné, že sa niečo stalo — bez toho ľudia klikajú znova.
 */
export default function DoKosika({
  polozka,
  variant = "plne",
}: {
  polozka: Omit<PolozkaKosika, "ks">;
  variant?: "plne" | "tiche";
}) {
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
          V KOŠÍKU <span aria-hidden>✓</span>
        </>
      ) : (
        <>
          DO KOŠÍKA <span aria-hidden>+</span>
        </>
      )}
    </button>
  );
}
