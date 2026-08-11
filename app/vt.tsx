/**
 * <ViewTransition> z Reactu (canary vendorovaný v Next 16). Stabilné typy ho
 * ešte nepoznajú, tak ho vyťahujeme na jednom mieste s vlastným typom —
 * zvyšok kódu importuje odtiaľto a nič „unstable" nerieši.
 */
import * as React from "react";

type Mapa = string | Record<string, string>;

type VTProps = {
  children: React.ReactNode;
  name?: string;
  /** trieda pre shared-element morph (::view-transition-group(.trieda)) */
  share?: Mapa;
  enter?: Mapa;
  exit?: Mapa;
  default?: Mapa;
};

export const VT = (React as unknown as { ViewTransition: React.ComponentType<VTProps> })
  .ViewTransition;
