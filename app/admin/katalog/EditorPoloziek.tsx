"use client";

import { useCallback, useEffect, useMemo, useState, type ComponentType, type ReactNode } from "react";
import HistoriaVerzii from "./HistoriaVerzii";
import { nacitajPolozky, posliPolozky, type KolekciaPoloziek, type StavPoloziek } from "./api";
import "./katalog.css";

type Pohlad<T> = { typ: "zoznam" } | { typ: "polozka"; id: string | null; predloha?: T } | { typ: "historia" };

export type FormularProps<T> = {
  povodna: T | null;
  predloha?: T;
  zoznam: T[];
  onUlozene: (stav: StavPoloziek<T>, sprava: string, id: string | null) => void;
  onSpat: () => void;
};

/**
 * Zoznam + formulár + história pre kolekciu položiek (akváriá, sety) —
 * rovnaké správanie ako editor skriniek: hľadanie, filter zverejnené /
 * rozpracované, zmena poradia, kópia, nová položka.
 */
export default function EditorPoloziek<T extends { skryta?: boolean }>({
  kolekcia,
  nazov,
  popis,
  jednotne,
  id,
  meno,
  kopia,
  hladatText,
  riadok,
  Formular,
}: {
  kolekcia: KolekciaPoloziek;
  nazov: string;
  popis: string;
  /** „akvárium" / „akváriá" / „akvárií" */
  jednotne: [string, string, string];
  id: (t: T) => string;
  meno: (t: T) => string;
  /** z položky urobí rozpracovanú kópiu s voľnou adresou */
  kopia: (t: T, obsadene: string[]) => T;
  hladatText: (t: T) => string;
  /** obsah riadku v zozname: fotka, texty, cena */
  riadok: (t: T) => { foto: string; titul: string; podtitul: string; vpravo: ReactNode };
  Formular: ComponentType<FormularProps<T>>;
}) {
  const [stav, setStav] = useState<StavPoloziek<T> | null>(null);
  const [chyba, setChyba] = useState("");
  const [pohlad, setPohlad] = useState<Pohlad<T>>({ typ: "zoznam" });
  const [sprava, setSprava] = useState("");
  const [verzia, setVerzia] = useState(0);
  const [filter, setFilter] = useState<"vsetky" | "skryte">("vsetky");
  const [hladaj, setHladaj] = useState("");
  const [poradie, setPoradie] = useState<string[] | null>(null);
  const [uklada, setUklada] = useState(false);

  const obnov = useCallback(() => {
    setChyba("");
    nacitajPolozky<T>(kolekcia)
      .then(setStav)
      .catch((e) =>
        setChyba(e instanceof Error && e.message === "odhlaseny" ? "Prihlásenie vypršalo. Obnovte stránku a prihláste sa znova." : "Zoznam sa nepodarilo načítať."),
      );
  }, [kolekcia]);
  useEffect(obnov, [obnov]);
  useEffect(() => {
    if (!sprava) return;
    const t = window.setTimeout(() => setSprava(""), 6000);
    return () => window.clearTimeout(t);
  }, [sprava]);

  const chod = (p: Pohlad<T>) => {
    setPohlad(p);
    window.scrollTo({ top: 0 });
  };
  const poUlozeni = (novy: StavPoloziek<T>, text: string, idUlozenej?: string | null) => {
    setStav(novy);
    setSprava(text);
    setVerzia((v) => v + 1);
    if (idUlozenej) chod({ typ: "polozka", id: idUlozenej });
    else chod({ typ: "zoznam" });
  };

  const polozky = useMemo(() => stav?.polozky ?? [], [stav]);
  const podla = useMemo(() => new Map(polozky.map((p) => [id(p), p])), [polozky, id]);
  const zobrazene = useMemo(() => {
    if (poradie) return poradie.map((s) => podla.get(s)!).filter(Boolean);
    const h = hladaj.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/\s+/g, "");
    return polozky.filter((p) => {
      if (filter === "skryte" && !p.skryta) return false;
      if (!h) return true;
      return hladatText(p).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/\s+/g, "").includes(h);
    });
  }, [polozky, poradie, podla, hladaj, filter, hladatText]);
  const skryte = polozky.filter((p) => p.skryta).length;

  const ulozPoradie = async () => {
    if (!poradie) return;
    setUklada(true);
    const r = await posliPolozky<T>(kolekcia, { akcia: "poradie", idcka: poradie });
    setUklada(false);
    if (!r.ok) {
      setSprava(r.chyba);
      return;
    }
    poUlozeni(r, "Poradie je uložené.", null);
    setPoradie(null);
  };
  const presun = (i: number, smer: -1 | 1) => {
    if (!poradie) return;
    const j = i + smer;
    if (j < 0 || j >= poradie.length) return;
    const n = [...poradie];
    [n[i], n[j]] = [n[j], n[i]];
    setPoradie(n);
  };

  if (chyba)
    return (
      <section className="ad-section">
        <div className="ad-banner is-warn">
          {chyba}{" "}
          <button type="button" className="kt-odkaz" onClick={obnov}>
            Skúsiť znova
          </button>
        </div>
      </section>
    );
  if (!stav) return <p className="ad-muted">Načítavam…</p>;

  return (
    <>
      {!stav.uloziskoPripravene && <div className="ad-banner is-warn">Úložisko nie je nastavené, zmeny sa nedajú uložiť. Chýba premenná BLOB_READ_WRITE_TOKEN.</div>}

      {pohlad.typ === "zoznam" && (
        <section className="ad-section">
          <header className="ad-head">
            <h1>{nazov}</h1>
            <p>{popis}</p>
          </header>

          <div className="kt-suhrn">
            <span>
              <b>{polozky.length}</b> {polozky.length === 1 ? jednotne[0] : polozky.length < 5 ? jednotne[1] : jednotne[2]}
            </span>
            <span>
              <b>{polozky.length - skryte}</b> na webe
            </span>
            {skryte > 0 && (
              <span>
                <b>{skryte}</b> rozpracovaných
              </span>
            )}
            <span className="kt-suhrn__ulozene">{stav.ulozene ? `Naposledy uložil ${stav.ulozene.kto}` : "Zatiaľ bez úprav — web beží z pôvodných dát"}</span>
          </div>

          <div className="kt-nastroje">
            {poradie ? (
              <>
                <span className="kt-nastroje__info">Zmeňte poradie šípkami. Takto budú položky zoradené aj na webe.</span>
                <button type="button" className="ad-btn ad-btn--ghost" onClick={() => setPoradie(null)} disabled={uklada}>
                  Zrušiť
                </button>
                <button type="button" className="ad-btn" onClick={ulozPoradie} disabled={uklada}>
                  {uklada ? "Ukladám…" : "Uložiť poradie"}
                </button>
              </>
            ) : (
              <>
                <input className="kt-vstup kt-hladaj" type="search" placeholder="Hľadať…" value={hladaj} onChange={(e) => setHladaj(e.target.value)} aria-label="Hľadať" />
                {skryte > 0 && (
                  <div className="kt-filtre" role="group" aria-label="Filter">
                    <button type="button" className={filter === "vsetky" ? "is-on" : ""} onClick={() => setFilter("vsetky")}>
                      Všetky
                    </button>
                    <button type="button" className={filter === "skryte" ? "is-on" : ""} onClick={() => setFilter("skryte")}>
                      Rozpracované
                    </button>
                  </div>
                )}
                <div className="kt-nastroje__vpravo">
                  <button type="button" className="kt-odkaz" onClick={() => setPoradie(polozky.map(id))}>
                    Poradie
                  </button>
                  <button type="button" className="kt-odkaz" onClick={() => chod({ typ: "historia" })}>
                    História
                  </button>
                  <button type="button" className="ad-btn" onClick={() => chod({ typ: "polozka", id: null })}>
                    + {nazov === "Sety" ? "Nový set" : "Nové akvárium"}
                  </button>
                </div>
              </>
            )}
          </div>

          {zobrazene.length === 0 ? (
            <p className="ad-muted kt-prazdne">Nič nezodpovedá hľadaniu.</p>
          ) : (
            <ul className="kt-skrinky">
              {zobrazene.map((p, i) => {
                const r = riadok(p);
                return (
                  <li key={id(p)} className={`kt-skrinka${p.skryta ? " is-skryta" : ""}`}>
                    <button type="button" className="kt-skrinka__otvor" onClick={() => !poradie && chod({ typ: "polozka", id: id(p) })} disabled={Boolean(poradie)}>
                      <span className="kt-skrinka__foto">
                        {r.foto ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={r.foto} alt="" loading="lazy" />
                        ) : (
                          <span className="kt-skrinka__bez">bez fotky</span>
                        )}
                      </span>
                      <span className="kt-skrinka__text">
                        <b>{r.titul}</b>
                        <small>{r.podtitul}</small>
                      </span>
                      <span className="kt-skrinka__cena">{r.vpravo}</span>
                      <span className={`ad-tag ${p.skryta ? "is-off" : "is-a"}`}>{p.skryta ? "Rozpracované" : "Na webe"}</span>
                    </button>
                    {poradie ? (
                      <span className="kt-skrinka__poradie">
                        <button type="button" onClick={() => presun(i, -1)} disabled={i === 0} aria-label="Vyššie">
                          ↑
                        </button>
                        <button type="button" onClick={() => presun(i, 1)} disabled={i === zobrazene.length - 1} aria-label="Nižšie">
                          ↓
                        </button>
                      </span>
                    ) : (
                      <button type="button" className="kt-odkaz kt-skrinka__kopia" onClick={() => chod({ typ: "polozka", id: null, predloha: kopia(p, polozky.map(id)) })} title="Vytvoriť novú položku podľa tejto">
                        Kópia
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}

      {pohlad.typ === "polozka" && (
        <Formular
          key={`${pohlad.id ?? "nova"}-${verzia}`}
          povodna={pohlad.id ? (podla.get(pohlad.id) ?? null) : null}
          predloha={pohlad.predloha}
          zoznam={polozky}
          onUlozene={(s, text, idUlozenej) => poUlozeni(s, text, idUlozenej)}
          onSpat={() => chod({ typ: "zoznam" })}
        />
      )}

      {pohlad.typ === "historia" && (
        <HistoriaVerzii
          kolekcia={kolekcia}
          spat={`← Všetky ${jednotne[1]}`}
          onUlozene={() => undefined}
          onSpat={() => chod({ typ: "zoznam" })}
          obnov={async (verziaId) => {
            const r = await posliPolozky<T>(kolekcia, { akcia: "obnov", verziaId });
            if (!r.ok) return r.chyba;
            poUlozeni(r, "Zoznam je vrátený do staršej verzie.", null);
            return null;
          }}
        />
      )}

      {sprava && (
        <div className="kt-toast" role="status">
          {sprava}
          <button type="button" onClick={() => setSprava("")} aria-label="Zavrieť">
            ×
          </button>
        </div>
      )}
    </>
  );
}
