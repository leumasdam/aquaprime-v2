/**
 * Anglické znenie textov, ktoré sú k akváriám uložené v dátach
 * (`aquariums.ts` a `aquarium-sizes.ts`). Slovenčina ostáva zdrojom pravdy,
 * tu ju len zrkadlíme pre /en. Dlhé klientske odseky sa po audite textov
 * (11. 9. 2026) na detaile nezobrazujú, takže ich tu netreba.
 */

import type { Aquarium } from "./aquariums";
import type { Jazyk } from "./jazyk";

/** Sklenené výstuhy — poradie zodpovedá `stredoveVystuhy()`. */
const VYSTUHY_EN = [
  "longitudinal glass braces",
  "longitudinal glass braces and one centre brace",
  "longitudinal glass braces and two centre braces",
];

const VYSTUHY_SK = [
  "sklenené pozdĺžne výstuhy",
  "sklenené pozdĺžne výstuhy a jedna stredová",
  "sklenené pozdĺžne výstuhy a dve stredové",
];

const POUZITIE_EN: Record<string, string> = {
  "sladkovodné akvárium": "freshwater aquarium",
  "sladkovodné aj morské akvárium": "freshwater and marine aquarium",
};

/** „Akvárium 120 × 50 × 50" → „Aquarium 120 × 50 × 50" */
export function akvariumNazov(a: Aquarium, jazyk: Jazyk): string {
  return jazyk === "en" ? a.name.replace("Akvárium", "Aquarium") : a.name;
}

export function akvariumVystuhy(a: Aquarium, jazyk: Jazyk): string | undefined {
  if (!a.braces) return a.braces;
  if (jazyk === "sk") return a.braces;
  const i = VYSTUHY_SK.indexOf(a.braces);
  return i >= 0 ? VYSTUHY_EN[i] : a.braces;
}

export function akvariumPouzitie(a: Aquarium, jazyk: Jazyk): string | undefined {
  if (!a.use || jazyk === "sk") return a.use;
  return POUZITIE_EN[a.use] ?? a.use;
}
