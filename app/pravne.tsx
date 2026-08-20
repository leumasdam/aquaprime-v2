import type { ReactNode } from "react";
import Drobcek from "./Drobcek";
import "./pravne.css";

/**
 * Spoločný obal právnych stránok (obchodné podmienky, reklamačný poriadok,
 * ochrana osobných údajov). Texty sú NÁVRH — miesta na doplnenie firemných
 * údajov sú vyznačené a stránka na to upozorňuje, kým sa nedoplnia.
 */

export function Doplnit({ co }: { co: string }) {
  return <mark className="pravne-doplnit">[DOPLNIŤ: {co}]</mark>;
}

export function PravnaStranka({
  titul,
  aktualizovane,
  children,
}: {
  titul: string;
  aktualizovane: string;
  children: ReactNode;
}) {
  return (
    <main id="main" className="pravne">
      <div className="wrap pravne__wrap">
        <header className="pravne__head">
          <div className="pg-drobcek">
            <Drobcek cesta={[{ nazov: titul }]} />
          </div>
          <h1>{titul}</h1>
          <p className="pravne__meta">Posledná aktualizácia: {aktualizovane}</p>
        </header>

        <div className="pravne__draft" role="note">
          <strong>Návrh dokumentu.</strong> Pred spustením ostrej prevádzky treba doplniť
          označené firemné údaje a text dať skontrolovať právnikovi. Do potvrdenia je
          dokument informatívny.
        </div>

        <article className="pravne__body">{children}</article>
      </div>
    </main>
  );
}
