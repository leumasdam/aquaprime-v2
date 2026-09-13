"use client";

import { usePathname } from "next/navigation";
import { jazykZCesty } from "./jazyk";
import { SLOVNIKY } from "./preklady";

/** Odkaz „preskočiť na obsah" — text podľa jazyka aktuálnej cesty. */
export default function SkipLink() {
  return (
    <a href="#main" className="skip-link">
      {SLOVNIKY[jazykZCesty(usePathname())].nav.preskocit}
    </a>
  );
}
