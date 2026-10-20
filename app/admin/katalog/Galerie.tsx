"use client";

import { useEffect, useMemo, useState } from "react";
import type { Galerie } from "../../katalog/galerie";
import type { PovodneGalerie } from "../../api/admin/galerie/route";
import Fotky from "./Fotky";

type Stav = {
  galerie: Galerie;
  povodne: PovodneGalerie;
  ulozene: { kedy: string; kto: string } | null;
  uloziskoPripravene: boolean;
};

/** rozpracované zmeny — prázdny zoznam znamená „vrátiť pôvodné fotky z kódu" */
type Draft = {
  sety: Record<string, Record<string, string[]>>;
  akvaria: Record<string, string[]>;
};
const PRAZDNY: Draft = { sety: {}, akvaria: {} };

type Zalozka = "sety" | "akvaria";

/**
 * Fotky setov a akvárií. Sety majú prevedenia (Black Matt, Cool White…) a každé
 * vlastnú sadu fotiek; akvárium má jednu sadu — prvá fotka je titulná na karte,
 * ďalšie sa ukážu v galérii na detaile. Texty, rozmery a ceny ostávajú v kóde.
 */
export default function Galerie({ onSpat }: { onSpat: () => void }) {
  const [stav, setStav] = useState<Stav | null>(null);
  const [draft, setDraft] = useState<Draft>(PRAZDNY);
  const [zalozka, setZalozka] = useState<Zalozka>("sety");
  const [hladaj, setHladaj] = useState("");
  const [uklada, setUklada] = useState(false);
  const [sprava, setSprava] = useState("");
  const [chyba, setChyba] = useState("");

  useEffect(() => {
    fetch("/api/admin/galerie", { cache: "no-store" })
      .then((r) => {
        if (r.status === 401) throw new Error("Prihlásenie vypršalo. Obnovte stránku a prihláste sa znova.");
        return r.json();
      })
      .then(setStav)
      .catch((e) => setChyba(e instanceof Error ? e.message : "Fotky sa nepodarilo načítať."));
  }, []);

  const pocetZmien = Object.values(draft.sety).reduce((n, p) => n + Object.keys(p).length, 0) + Object.keys(draft.akvaria).length;

  const akvaria = useMemo(() => {
    if (!stav) return [];
    const h = hladaj.replace(/\s+/g, "").toLowerCase();
    return stav.povodne.akvaria.filter((a) => !h || a.dim.replace(/\s+/g, "").toLowerCase().includes(h) || a.slug.includes(h));
  }, [stav, hladaj]);

  if (chyba && !stav) return <p className="ad-err">{chyba}</p>;
  if (!stav) return <p className="ad-muted">Načítavam…</p>;

  /* aktuálne fotky položky: rozpracované → uložené → pôvodné z kódu */
  const fotkySetu = (setId: string, pId: string, povodne: string[]) => {
    const d = draft.sety[setId]?.[pId];
    if (d !== undefined) return d.length ? d : povodne;
    return stav.galerie.sety[setId]?.[pId] ?? povodne;
  };
  const fotkyAkvaria = (slug: string, cover: string) => {
    const d = draft.akvaria[slug];
    if (d !== undefined) return d.length ? d : [cover];
    return stav.galerie.akvaria[slug] ?? [cover];
  };
  const vlastneSetu = (setId: string, pId: string) => {
    const d = draft.sety[setId]?.[pId];
    return d !== undefined ? d.length > 0 : Boolean(stav.galerie.sety[setId]?.[pId]);
  };
  const vlastneAkvaria = (slug: string) => {
    const d = draft.akvaria[slug];
    return d !== undefined ? d.length > 0 : Boolean(stav.galerie.akvaria[slug]);
  };

  const zmenSet = (setId: string, pId: string, fotky: string[]) =>
    setDraft((d) => ({ ...d, sety: { ...d.sety, [setId]: { ...d.sety[setId], [pId]: fotky } } }));
  const zmenAkvarium = (slug: string, fotky: string[]) => setDraft((d) => ({ ...d, akvaria: { ...d.akvaria, [slug]: fotky } }));

  const uloz = async () => {
    setUklada(true);
    setChyba("");
    try {
      const r = await fetch("/api/admin/galerie", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (r.status === 401) throw new Error("Prihlásenie vypršalo. Obnovte stránku a prihláste sa znova.");
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error(j.chyba ?? "Uloženie zlyhalo.");
      setStav((s) => (s ? { ...s, galerie: j.galerie, ulozene: j.ulozene } : s));
      setDraft(PRAZDNY);
      setSprava("Uložené. Na webe sa fotky prejavia do pár sekúnd.");
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
        <h1>Fotky setov a akvárií</h1>
        <p>
          Prvá fotka je titulná — ukazuje sa na karte v katalógu. Ostatné sa otvoria v galérii na detaile. Fotky sa
          na webe neorezávajú, zmestí sa celá zostava; najlepšie vyzerajú na výšku alebo 4 : 3 pri setoch a na šírku
          pri akváriách.
        </p>
      </header>

      {sprava && <div className="ad-banner">{sprava}</div>}
      {chyba && <div className="ad-banner is-warn">{chyba}</div>}

      <div className="kt-nastroje">
        <div className="kt-filtre" role="tablist" aria-label="Čo upravujete">
          <button type="button" className={zalozka === "sety" ? "is-on" : ""} aria-pressed={zalozka === "sety"} onClick={() => setZalozka("sety")}>
            Sety
          </button>
          <button type="button" className={zalozka === "akvaria" ? "is-on" : ""} aria-pressed={zalozka === "akvaria"} onClick={() => setZalozka("akvaria")}>
            Akváriá
          </button>
        </div>
        {zalozka === "akvaria" && (
          <input
            className="kt-vstup kt-hladaj"
            type="search"
            placeholder="Hľadať rozmer, napr. 120x50…"
            value={hladaj}
            onChange={(e) => setHladaj(e.target.value)}
            aria-label="Hľadať akvárium"
          />
        )}
      </div>

      {zalozka === "sety" && (
        <div className="kt-gal">
          {stav.povodne.sety.map((s) => (
            <article key={s.id} className="kt-gal__set">
              <header className="kt-gal__hlava">
                <b>{s.nazov}</b>
                <small>{s.podtitul}</small>
              </header>
              {s.prevedenia.map((p) => {
                const vlastne = vlastneSetu(s.id, p.id);
                return (
                  <section key={p.id} className={`kt-gal__prev${draft.sety[s.id]?.[p.id] !== undefined ? " is-zmenena" : ""}`}>
                    <div className="kt-gal__prev-hlava">
                      <b>{p.nazov}</b>
                      <span className={`ad-tag ${vlastne ? "is-b" : "is-c"}`}>{vlastne ? "Vlastné fotky" : "Pôvodné fotky"}</span>
                      {vlastne && (
                        <button type="button" className="kt-odkaz" disabled={uklada} onClick={() => zmenSet(s.id, p.id, [])}>
                          Vrátiť pôvodné
                        </button>
                      )}
                    </div>
                    <Fotky fotky={fotkySetu(s.id, p.id, p.fotky)} onZmena={(f) => zmenSet(s.id, p.id, f)} titulna popis={`${s.nazov} ${p.nazov}, fotka`} />
                  </section>
                );
              })}
            </article>
          ))}
        </div>
      )}

      {zalozka === "akvaria" && (
        <div className="kt-gal">
          {akvaria.length === 0 && <p className="ad-muted kt-prazdne">Nič nezodpovedá hľadaniu.</p>}
          {akvaria.map((a) => {
            const vlastne = vlastneAkvaria(a.slug);
            const fotky = fotkyAkvaria(a.slug, a.cover);
            return (
              <details key={a.slug} className={`kt-gal__akv${draft.akvaria[a.slug] !== undefined ? " is-zmenena" : ""}`} open={vlastne || draft.akvaria[a.slug] !== undefined}>
                <summary>
                  <span className="kt-gal__akv-foto">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={fotky[0]} alt="" loading="lazy" />
                  </span>
                  <span className="kt-gal__akv-text">
                    <b>{a.dim}</b>
                    <small>
                      {a.vol}
                      {vlastne ? ` · ${fotky.length} ${fotky.length === 1 ? "fotka" : fotky.length < 5 ? "fotky" : "fotiek"}` : a.ilustracna ? " · ilustračná fotka iného rozmeru" : " · pôvodná fotka"}
                    </small>
                  </span>
                  <span className={`ad-tag ${vlastne ? "is-b" : "is-c"}`}>{vlastne ? "Vlastné fotky" : "Pôvodná"}</span>
                </summary>
                <div className="kt-gal__akv-telo">
                  <Fotky fotky={vlastne ? fotky : []} onZmena={(f) => zmenAkvarium(a.slug, f)} titulna popis={`${a.nazov}, fotka`} />
                  {vlastne && (
                    <button type="button" className="kt-odkaz" disabled={uklada} onClick={() => zmenAkvarium(a.slug, [])}>
                      Vrátiť pôvodnú fotku
                    </button>
                  )}
                </div>
              </details>
            );
          })}
        </div>
      )}

      <div className="kt-lista">
        <div className="kt-lista__stav">
          {pocetZmien ? (
            <span>
              Neuložené zmeny: {pocetZmien}
            </span>
          ) : (
            <span className="ad-muted">{stav.ulozene ? `Naposledy uložil ${stav.ulozene.kto}` : "Bez zmien"}</span>
          )}
        </div>
        <div className="kt-lista__akcie">
          <button type="button" className="ad-btn ad-btn--ghost" disabled={!pocetZmien || uklada} onClick={() => setDraft(PRAZDNY)}>
            Zahodiť zmeny
          </button>
          <button type="button" className="ad-btn" disabled={!pocetZmien || uklada} onClick={uloz}>
            {uklada ? "Ukladám…" : "Uložiť"}
          </button>
        </div>
      </div>
    </section>
  );
}
