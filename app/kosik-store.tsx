"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

/**
 * Košík. Žije v localStorage, takže prežije zavretie prehliadača — pri nábytku
 * na mieru sa ľudia vracajú a rozhodujú dni, nie minúty.
 */

const KEY = "aq:kosik";

export type PolozkaKosika = {
  /** jednoznačný kľúč vrátane variantu, aby sa dva dekory nezlúčili do jedného */
  id: string;
  druh: "skrinka" | "akvarium";
  slug: string;
  nazov: string;
  /** dekor, hrúbka skla a podobne — do druhého riadku karty */
  variant: string;
  cena: number;
  ks: number;
  obrazok: string;
};

type Kontext = {
  polozky: PolozkaKosika[];
  pocet: number;
  suma: number;
  pridaj: (p: Omit<PolozkaKosika, "ks">, ks?: number) => void;
  uber: (id: string) => void;
  zmenPocet: (id: string, ks: number) => void;
  vyprazdni: () => void;
  /** true až po načítaní z localStorage — bez toho by sa server a klient rozišli */
  pripravene: boolean;
};

const KosikContext = createContext<Kontext | null>(null);

export function KosikProvider({ children }: { children: React.ReactNode }) {
  const [polozky, setPolozky] = useState<PolozkaKosika[]>([]);
  const [pripravene, setPripravene] = useState(false);

  useEffect(() => {
    try {
      const ulozene = localStorage.getItem(KEY);
      if (ulozene) setPolozky(JSON.parse(ulozene));
    } catch {
      /* poškodený obsah — začíname s prázdnym */
    }
    setPripravene(true);
  }, []);

  useEffect(() => {
    if (!pripravene) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(polozky));
    } catch {
      /* súkromný režim */
    }
  }, [polozky, pripravene]);

  const pridaj = useCallback((p: Omit<PolozkaKosika, "ks">, ks = 1) => {
    setPolozky((prev) => {
      const i = prev.findIndex((x) => x.id === p.id);
      if (i >= 0) {
        const kopia = [...prev];
        kopia[i] = { ...kopia[i], ks: Math.min(99, kopia[i].ks + ks) };
        return kopia;
      }
      return [...prev, { ...p, ks }];
    });
  }, []);

  const uber = useCallback(
    (id: string) => setPolozky((prev) => prev.filter((x) => x.id !== id)),
    []
  );

  const zmenPocet = useCallback((id: string, ks: number) => {
    setPolozky((prev) =>
      ks <= 0
        ? prev.filter((x) => x.id !== id)
        : prev.map((x) => (x.id === id ? { ...x, ks: Math.min(99, ks) } : x))
    );
  }, []);

  const vyprazdni = useCallback(() => setPolozky([]), []);

  const hodnota = useMemo<Kontext>(
    () => ({
      polozky,
      pocet: polozky.reduce((s, x) => s + x.ks, 0),
      suma: polozky.reduce((s, x) => s + x.cena * x.ks, 0),
      pridaj,
      uber,
      zmenPocet,
      vyprazdni,
      pripravene,
    }),
    [polozky, pridaj, uber, zmenPocet, vyprazdni, pripravene]
  );

  return <KosikContext.Provider value={hodnota}>{children}</KosikContext.Provider>;
}

export function useKosik(): Kontext {
  const ctx = useContext(KosikContext);
  if (!ctx) throw new Error("useKosik musí byť vnútri <KosikProvider>");
  return ctx;
}

export const eur = (n: number) =>
  n.toLocaleString("sk-SK", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) +
  " €";
