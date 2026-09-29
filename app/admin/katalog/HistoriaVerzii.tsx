"use client";

import { useEffect, useState } from "react";
import { historia, posli, type StavKatalogu, type Verzia } from "./api";

const cas = (iso: string) =>
  new Date(iso).toLocaleString("sk-SK", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

/**
 * Každé uloženie katalógu je v histórii. Keď sa niečo pokazí, jedným
 * klikom sa web vráti do stavu po ktoromkoľvek z nich. Aj samotný návrat
 * je nová verzia — dá sa teda vrátiť aj návrat.
 */
export default function HistoriaVerzii({
  onUlozene,
  onSpat,
}: {
  onUlozene: (stav: StavKatalogu, sprava: string) => void;
  onSpat: () => void;
}) {
  const [verzie, setVerzie] = useState<Verzia[] | null>(null);
  const [chyba, setChyba] = useState("");
  const [obnovuje, setObnovuje] = useState<string | null>(null);

  useEffect(() => {
    historia()
      .then(setVerzie)
      .catch(() => setChyba("Históriu sa nepodarilo načítať."));
  }, []);

  const obnov = async (v: Verzia) => {
    if (!window.confirm(`Vrátiť celý katalóg do stavu z ${cas(v.kedy)}? Všetky neskoršie zmeny sa tým vrátia späť (dajú sa obnoviť znova odtiaľto).`))
      return;
    setObnovuje(v.id);
    setChyba("");
    const r = await posli({ akcia: "obnov", verziaId: v.id });
    setObnovuje(null);
    if (!r.ok) {
      setChyba(r.chyba);
      return;
    }
    onUlozene(r, `Katalóg je vrátený do stavu z ${cas(v.kedy)}.`);
  };

  return (
    <section className="ad-section">
      <button type="button" className="kt-spat" onClick={onSpat}>
        ← Všetky skrinky
      </button>
      <header className="ad-head">
        <h1>História zmien</h1>
        <p>
          Posledných 40 uložení katalógu. Keď sa niečo pokazí, vráťte web do stavu pred chybou. Návrat sa dá vždy vrátiť
          späť.
        </p>
      </header>

      {chyba && <p className="ad-err">{chyba}</p>}
      {verzie === null ? (
        <p className="ad-muted">Načítavam…</p>
      ) : verzie.length === 0 ? (
        <p className="ad-muted">Katalóg ešte nikto neupravoval — web beží z pôvodných dát.</p>
      ) : (
        <ol className="kt-historia">
          {verzie.map((v, i) => (
            <li key={v.id}>
              <span className="kt-historia__cas">{cas(v.kedy)}</span>
              <span className="kt-historia__text">
                <b>{v.poznamka || "Úprava katalógu"}</b>
                <small>{v.kto}</small>
              </span>
              {i === 0 ? (
                <span className="ad-tag is-a">Aktuálna</span>
              ) : (
                <button type="button" className="kt-odkaz" onClick={() => obnov(v)} disabled={obnovuje !== null}>
                  {obnovuje === v.id ? "Obnovujem…" : "Vrátiť sem"}
                </button>
              )}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
