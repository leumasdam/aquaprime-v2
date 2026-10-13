"use client";

import { useEffect, useRef, useState } from "react";
import { nahrajFotku } from "./api";

type Rad = "basic" | "standard" | "premium" | "led";
const RADY: { id: Rad; nazov: string; popis: string }[] = [
  { id: "basic", nazov: "BASIC", popis: "Otvorený oceľový rám s vrchnou doskou" },
  { id: "standard", nazov: "ŠTANDARD", popis: "Oceľový rám s bočnicami a dvierkami" },
  { id: "premium", nazov: "PREMIUM", popis: "Kompletne opláštená skrinka" },
  { id: "led", nazov: "LED", popis: "Doplnok k vybraným skrinkám" },
];

type Stav = {
  rady: Partial<Record<Rad, string>>;
  povodne: Record<Rad, string>;
  ulozene: { kedy: string; kto: string } | null;
};

/**
 * Úvodné fotky radov na domovskej stránke (karty Basic / Štandard /
 * Premium / LED). Každý rad má jednu fotku; nahratá sa uloží do úložiska
 * a po uložení sa objaví na webe. „Vrátiť pôvodnú" vráti fotku z kódu.
 */
export default function UvodneFotky({ onSpat }: { onSpat: () => void }) {
  const [stav, setStav] = useState<Stav | null>(null);
  const [draft, setDraft] = useState<Partial<Record<Rad, string | "">>>({});
  const [nahrava, setNahrava] = useState<Rad | null>(null);
  const [uklada, setUklada] = useState(false);
  const [sprava, setSprava] = useState("");
  const [chyba, setChyba] = useState("");
  const vstup = useRef<HTMLInputElement>(null);
  const cielovy = useRef<Rad>("basic");

  useEffect(() => {
    fetch("/api/admin/vzhlad", { cache: "no-store" })
      .then((r) => r.json())
      .then(setStav)
      .catch(() => setChyba("Nastavenia sa nepodarilo načítať."));
  }, []);

  if (chyba && !stav) return <p className="ad-err">{chyba}</p>;
  if (!stav) return <p className="ad-muted">Načítavam…</p>;

  const aktualna = (rad: Rad) => {
    const d = draft[rad];
    if (d === "") return stav.povodne[rad];
    return d ?? stav.rady[rad] ?? stav.povodne[rad];
  };
  const jeVlastna = (rad: Rad) => aktualna(rad) !== stav.povodne[rad];
  const zmenene = Object.keys(draft).length > 0;

  const nahraj = async (subor: File) => {
    const rad = cielovy.current;
    setNahrava(rad);
    setChyba("");
    try {
      const src = await nahrajFotku(subor);
      setDraft((d) => ({ ...d, [rad]: src }));
    } catch (e) {
      setChyba(e instanceof Error ? e.message : "Fotku sa nepodarilo nahrať.");
    } finally {
      setNahrava(null);
    }
  };

  const uloz = async () => {
    setUklada(true);
    setChyba("");
    try {
      const r = await fetch("/api/admin/vzhlad", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ rady: draft }),
      });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error(j.chyba ?? "Uloženie zlyhalo.");
      setStav((s) => (s ? { ...s, rady: j.rady, ulozene: j.ulozene } : s));
      setDraft({});
      setSprava("Uložené. Na úvodnej stránke sa zmena prejaví do pár sekúnd.");
      window.setTimeout(() => setSprava(""), 6000);
    } catch (e) {
      setChyba(e instanceof Error ? e.message : "Uloženie zlyhalo.");
    } finally {
      setUklada(false);
    }
  };

  return (
    <section className="ad-section">
      <button type="button" className="kt-spat" onClick={onSpat} disabled={uklada}>
        ← Všetky skrinky
      </button>
      <header className="ad-head">
        <h1>Úvodné fotky radov</h1>
        <p>
          Fotky na kartách Basic, Štandard, Premium a LED na domovskej stránke. Najlepšie vyzerá záber na šírku
          v pomere 4 : 3 s tmavou atmosférou, ako majú tie súčasné.
        </p>
      </header>

      {sprava && <div className="ad-banner">{sprava}</div>}
      {chyba && <div className="ad-banner is-warn">{chyba}</div>}

      <div className="kt-rady-fotky">
        {RADY.map((r) => (
          <article key={r.id} className={`kt-rad-foto${draft[r.id] !== undefined ? " is-zmenena" : ""}`}>
            <div className="kt-rad-foto__nahlad">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={aktualna(r.id)} alt={r.nazov} />
              {nahrava === r.id && (
                <span className="kt-rad-foto__nahrava">
                  <i className="kt-toc" aria-hidden /> Nahrávam…
                </span>
              )}
            </div>
            <div className="kt-rad-foto__telo">
              <b>{r.nazov}</b>
              <small>{r.popis}</small>
              <span className={`ad-tag ${jeVlastna(r.id) ? "is-b" : "is-c"}`}>
                {jeVlastna(r.id) ? "Vlastná fotka" : "Pôvodná fotka"}
              </span>
              <div className="kt-rad-foto__akcie">
                <button
                  type="button"
                  className="ad-btn ad-btn--ghost"
                  disabled={nahrava !== null || uklada}
                  onClick={() => {
                    cielovy.current = r.id;
                    vstup.current?.click();
                  }}
                >
                  Vymeniť fotku
                </button>
                {jeVlastna(r.id) && (
                  <button type="button" className="kt-odkaz" disabled={uklada} onClick={() => setDraft((d) => ({ ...d, [r.id]: "" }))}>
                    Vrátiť pôvodnú
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
      <input
        ref={vstup}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void nahraj(f);
          e.target.value = "";
        }}
      />

      <div className="kt-lista">
        <div className="kt-lista__stav">
          {zmenene ? <span>Neuložené zmeny</span> : <span className="ad-muted">{stav.ulozene ? `Naposledy uložil ${stav.ulozene.kto}` : "Bez zmien"}</span>}
        </div>
        <div className="kt-lista__akcie">
          <button type="button" className="ad-btn ad-btn--ghost" disabled={!zmenene || uklada} onClick={() => setDraft({})}>
            Zahodiť zmeny
          </button>
          <button type="button" className="ad-btn" disabled={!zmenene || uklada || nahrava !== null} onClick={uloz}>
            {uklada ? "Ukladám…" : "Uložiť"}
          </button>
        </div>
      </div>
    </section>
  );
}
