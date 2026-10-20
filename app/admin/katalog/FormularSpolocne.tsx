"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { odtlacok, type Chyba } from "../../katalog/kontrola";
import { posliPolozky, type KolekciaPoloziek, type StavPoloziek } from "./api";

/**
 * Spoločná logika formulárov akvária a setu: rozpracovaný stav, kontrola
 * naživo v dvoch úrovniach (rozpracované / zverejnené), uloženie, zmazanie,
 * varovanie pri odchode a lišta s tlačidlami. Formulár skrinky má vlastnú
 * staršiu implementáciu s rovnakým správaním.
 */
export function usePolozka<T extends { skryta?: boolean }>({
  kolekcia,
  povodna,
  predloha,
  nova,
  id,
  normalizuj,
  chyby: spocitajChyby,
  onUlozene,
}: {
  kolekcia: KolekciaPoloziek;
  povodna: T | null;
  predloha?: T;
  nova: () => T;
  id: (t: T) => string;
  normalizuj: (t: T) => T;
  /** chyby položky v kontexte zoznamu (kolízie adries) */
  chyby: (t: T) => Chyba[];
  onUlozene: (stav: StavPoloziek<T>, sprava: string, id: string | null) => void;
}) {
  const [draft, setDraft] = useState<T>(() => structuredClone(povodna ?? predloha ?? nova()));
  const [uklada, setUklada] = useState(false);
  const [dotknute, setDotknute] = useState(false);
  const [serverChyba, setServerChyba] = useState<{ sprava: string; chyby: Chyba[]; konflikt: boolean } | null>(null);

  const vychodzi = useMemo(() => JSON.stringify(normalizuj(povodna ?? predloha ?? nova())), [povodna, predloha, nova, normalizuj]);
  const normalizovana = useMemo(() => normalizuj(draft), [draft, normalizuj]);
  const zmenene = JSON.stringify(normalizovana) !== vychodzi || !povodna;
  const neulozene = povodna ? zmenene : dotknute;

  useEffect(() => {
    if (!neulozene) return;
    const h = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [neulozene]);

  const { chyby, chybyKonceptu } = useMemo(
    () => ({
      chyby: spocitajChyby({ ...normalizovana, skryta: false }),
      chybyKonceptu: spocitajChyby({ ...normalizovana, skryta: true }),
    }),
    [normalizovana, spocitajChyby],
  );
  const chybyPola = (pole: string) => chyby.filter((c) => c.pole === pole);

  const zmen = (z: Partial<T> | ((d: T) => T)) => {
    setServerChyba(null);
    setDotknute(true);
    setDraft((d) => (typeof z === "function" ? z(d) : { ...d, ...z }));
  };

  const uloz = async (zverejnit?: boolean) => {
    const polozka = normalizuj({ ...draft, skryta: zverejnit === undefined ? draft.skryta : !zverejnit });
    if (!polozka.skryta && chyby.length) {
      setServerChyba({ sprava: "Na zverejnenie treba najprv doplniť označené polia.", chyby: [], konflikt: false });
      return;
    }
    setUklada(true);
    setServerChyba(null);
    const r = await posliPolozky<T>(kolekcia, {
      akcia: "uloz",
      povodneId: povodna ? id(povodna) : null,
      polozka,
      odtlacok: povodna ? odtlacok(povodna) : null,
    });
    setUklada(false);
    if (!r.ok) {
      setServerChyba({ sprava: r.chyba, chyby: r.chyby, konflikt: r.konflikt });
      return;
    }
    onUlozene(r, polozka.skryta ? "Uložené ako rozpracované — na webe sa zatiaľ neukáže." : "Uložené. Na webe sa zmena prejaví do pár sekúnd.", id(polozka));
  };

  const zmaz = async (meno: string) => {
    if (!povodna) return;
    if (!window.confirm(`Naozaj zmazať ${meno}? Zmazanie sa dá vrátiť v histórii verzií.`)) return;
    setUklada(true);
    const r = await posliPolozky<T>(kolekcia, { akcia: "zmaz", id: id(povodna), odtlacok: odtlacok(povodna) });
    setUklada(false);
    if (!r.ok) {
      setServerChyba({ sprava: r.chyba, chyby: r.chyby, konflikt: r.konflikt });
      return;
    }
    onUlozene(r, `${meno} — zmazané.`, null);
  };

  return { draft, zmen, uklada, zmenene, neulozene, chyby, chybyKonceptu, chybyPola, serverChyba, uloz, zmaz };
}

export function ChybaServera({ chyba }: { chyba: { sprava: string; chyby: Chyba[]; konflikt: boolean } | null }) {
  if (!chyba) return null;
  return (
    <div className="ad-banner is-warn" role="alert">
      <b>{chyba.sprava}</b>
      {chyba.chyby.length > 0 && (
        <ul className="kt-chyby">
          {chyba.chyby.map((c, i) => (
            <li key={i}>{c.sprava}</li>
          ))}
        </ul>
      )}
      {chyba.konflikt && (
        <button type="button" className="ad-btn ad-btn--ghost" onClick={() => window.location.reload()}>
          Obnoviť editor
        </button>
      )}
    </div>
  );
}

/** Lišta s uložením — rovnaká logika ako pri skrinke (rozpracované / zverejniť / skryť). */
export function ListaUlozenia({
  skryta,
  jeNova,
  naWebe,
  odkaz,
  uklada,
  zmenene,
  neulozene,
  chyby,
  chybyKonceptu,
  onUloz,
  onZmaz,
}: {
  skryta: boolean;
  jeNova: boolean;
  naWebe: boolean;
  odkaz: string;
  uklada: boolean;
  zmenene: boolean;
  neulozene: boolean;
  chyby: number;
  chybyKonceptu: number;
  onUloz: (zverejnit?: boolean) => void;
  onZmaz: () => void;
}): ReactNode {
  return (
    <div className="kt-lista">
      <div className="kt-lista__stav">
        {chyby ? (
          <span className="ad-err">{skryta ? `Pred zverejnením treba doplniť: ${chyby}` : `Uloženiu bráni: ${chyby}`}</span>
        ) : neulozene ? (
          <span>Neuložené zmeny</span>
        ) : (
          <span className="ad-muted">Bez zmien</span>
        )}
      </div>
      <div className="kt-lista__akcie">
        {!jeNova && (
          <button type="button" className="kt-odkaz kt-odkaz--nebezpecne" onClick={onZmaz} disabled={uklada}>
            Zmazať
          </button>
        )}
        {naWebe && (
          <a className="kt-odkaz" href={odkaz} target="_blank" rel="noreferrer">
            Zobraziť na webe ↗
          </a>
        )}
        {skryta ? (
          <>
            <button
              type="button"
              className="ad-btn ad-btn--ghost"
              onClick={() => onUloz()}
              disabled={uklada || (!zmenene && !jeNova) || chybyKonceptu > 0}
            >
              Uložiť rozpracované
            </button>
            <button type="button" className="ad-btn" onClick={() => onUloz(true)} disabled={uklada || chyby > 0} title={chyby ? "Najprv doplňte označené polia" : undefined}>
              {uklada ? "Ukladám…" : "Zverejniť na webe"}
            </button>
          </>
        ) : (
          <>
            <button type="button" className="ad-btn ad-btn--ghost" onClick={() => onUloz(false)} disabled={uklada}>
              Skryť z webu
            </button>
            <button type="button" className="ad-btn" onClick={() => onUloz()} disabled={uklada || !zmenene || chyby > 0}>
              {uklada ? "Ukladám…" : "Uložiť"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/** Pole formulára s chybami pod ním. */
export function Pole({ nazov, chyby, children, pozn, uzke }: { nazov: ReactNode; chyby?: Chyba[]; children: ReactNode; pozn?: ReactNode; uzke?: boolean }) {
  return (
    <label className={`kt-pole${uzke ? " kt-pole--uzke" : ""}${chyby?.length ? " is-chyba" : ""}`}>
      <span>{nazov}</span>
      {children}
      {pozn && <small className="ad-muted">{pozn}</small>}
      {chyby?.map((c, i) => (
        <em key={i}>{c.sprava}</em>
      ))}
    </label>
  );
}
