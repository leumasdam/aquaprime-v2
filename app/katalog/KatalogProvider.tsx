"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Product } from "../products";

/**
 * Katalóg skriniek pre komponenty v prehliadači (košík, konfigurátor,
 * filtre katalógu, kontaktný formulár…). Server ho načíta v koreňovom
 * layoute a pošle sem — komponenty tak vidia presne to, čo je uložené
 * v administrácii, a nie dáta zapečené do JavaScriptu pri builde.
 *
 * Celý katalóg má po kompresii okolo 6 kB, takže ho posielame vcelku.
 * Layout sa pri prechode medzi stránkami neprekresľuje, takže prichádza
 * len raz za návštevu.
 */

const KatalogContext = createContext<Product[] | null>(null);

export function KatalogProvider({
  katalog,
  children,
}: {
  katalog: Product[];
  children: ReactNode;
}) {
  return <KatalogContext.Provider value={katalog}>{children}</KatalogContext.Provider>;
}

export function useKatalog(): Product[] {
  const k = useContext(KatalogContext);
  if (!k) throw new Error("useKatalog musí byť vo vnútri <KatalogProvider>");
  return k;
}
