"use client";

import { useMemo, useState } from "react";
import type { Product } from "../../products";
import Swatch from "../../Swatch";
import Vzorka from "./Vzorka";
import { posli, type StavKatalogu } from "./api";

type Dekor = { id: string; name: string; swatch: string[]; skrinky: number; fotky: number };

/**
 * Dekory naprieč celým katalógom. Názov a vzorka dekoru sú uložené pri
 * každej skrinke zvlášť — tu sa dajú zmeniť naraz všade, kde dekor je.
 * Fotky dekoru sa menia pri konkrétnej skrinke, lebo každá je iná.
 */
export default function KniznicaDekorov({
  katalog,
  onUlozene,
  onSpat,
}: {
  katalog: Product[];
  onUlozene: (stav: StavKatalogu, sprava: string) => void;
  onSpat: () => void;
}) {
  const dekory = useMemo(() => {
    const m = new Map<string, Dekor>();
    for (const p of katalog)
      for (const d of p.decors) {
        const x = m.get(d.id) ?? { id: d.id, name: d.name, swatch: d.swatch, skrinky: 0, fotky: 0 };
        x.skrinky++;
        x.fotky += d.images.length;
        m.set(d.id, x);
      }
    return [...m.values()].sort((a, b) => b.skrinky - a.skrinky || a.name.localeCompare(b.name, "sk"));
  }, [katalog]);

  const [upravovany, setUpravovany] = useState<{ id: string; name: string; swatch: string[] } | null>(null);
  const [uklada, setUklada] = useState(false);
  const [chyba, setChyba] = useState("");

  const uloz = async () => {
    if (!upravovany) return;
    setUklada(true);
    setChyba("");
    const r = await posli({ akcia: "dekor", ...upravovany });
    setUklada(false);
    if (!r.ok) {
      setChyba(r.chyba);
      return;
    }
    setUpravovany(null);
    onUlozene(r, `Dekor ${upravovany.name} je upravený vo všetkých skrinkách.`);
  };

  return (
    <section className="ad-section">
      <button type="button" className="kt-spat" onClick={onSpat}>
        ← Všetky skrinky
      </button>
      <header className="ad-head">
        <h1>Dekory</h1>
        <p>
          Názov a vzorka dekoru sa tu zmenia naraz vo všetkých skrinkách. Fotky dekoru upravíte pri konkrétnej skrinke —
          každý rozmer je nafotený zvlášť.
        </p>
      </header>

      <ul className="kt-dekory-zoznam">
        {dekory.map((d) =>
          upravovany?.id === d.id ? (
            <li key={d.id} className="kt-karta kt-dekory-zoznam__uprava">
              <label className="kt-pole">
                <span>Názov</span>
                <input
                  className="kt-vstup"
                  value={upravovany.name}
                  onChange={(e) => setUpravovany({ ...upravovany, name: e.target.value })}
                />
              </label>
              <Vzorka id={d.id} hodnota={upravovany.swatch} onZmena={(swatch) => setUpravovany({ ...upravovany, swatch })} />
              {chyba && <p className="ad-err">{chyba}</p>}
              <div className="kt-riadok kt-riadok--akcia">
                <button type="button" className="ad-btn ad-btn--ghost" onClick={() => setUpravovany(null)} disabled={uklada}>
                  Zrušiť
                </button>
                <button type="button" className="ad-btn" onClick={uloz} disabled={uklada || !upravovany.name.trim()}>
                  {uklada ? "Ukladám…" : `Uložiť v ${d.skrinky} skrinkách`}
                </button>
              </div>
            </li>
          ) : (
            <li key={d.id}>
              <span className="kt-kniznica__vzorka">
                <Swatch swatch={d.swatch} />
              </span>
              <span className="kt-dekory-zoznam__text">
                <b>{d.name}</b>
                <small>
                  {d.skrinky} {d.skrinky === 1 ? "skrinka" : d.skrinky < 5 ? "skrinky" : "skriniek"} · {d.fotky} fotiek
                </small>
              </span>
              <button
                type="button"
                className="kt-odkaz"
                onClick={() => {
                  setChyba("");
                  setUpravovany({ id: d.id, name: d.name, swatch: [...d.swatch] });
                }}
              >
                Upraviť
              </button>
            </li>
          ),
        )}
      </ul>
    </section>
  );
}
