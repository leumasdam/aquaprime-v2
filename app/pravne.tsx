import type { ReactNode } from "react";
import Drobcek from "./Drobcek";
import type { Jazyk } from "./jazyk";
import "./pravne.css";

/**
 * Spoločný obal právnych stránok (obchodné podmienky, reklamačný poriadok,
 * ochrana osobných údajov). Texty sú NÁVRH — miesta na doplnenie firemných
 * údajov sú vyznačené a stránka na to upozorňuje, kým sa nedoplnia.
 */

export function Doplnit({ co, en }: { co: string; en?: boolean }) {
  return <mark className="pravne-doplnit">[{en ? "TO ADD" : "DOPLNIŤ"}: {co}]</mark>;
}

/** Miesto, kde je text pripravený, ale musí ho potvrdiť prevádzkovateľ alebo právnik. */
export function Overit({ co, en }: { co: string; en?: boolean }) {
  return <mark className="pravne-overit">[{en ? "TO VERIFY" : "NA OVERENIE"}: {co}]</mark>;
}

export function PravnaStranka({
  titul,
  aktualizovane,
  jazyk = "sk",
  children,
}: {
  titul: string;
  aktualizovane: string;
  jazyk?: Jazyk;
  children: ReactNode;
}) {
  const en = jazyk === "en";
  return (
    <main id="main" className="pravne">
      <div className="wrap pravne__wrap">
        <header className="pravne__head">
          <div className="pg-drobcek">
            <Drobcek cesta={[{ nazov: titul }]} jazyk={jazyk} />
          </div>
          <h1>{titul}</h1>
          <p className="pravne__meta">
            {en ? "Last updated: " : "Posledná aktualizácia: "}
            {aktualizovane}
          </p>
        </header>

        <div className="pravne__draft" role="note">
          {en ? (
            <>
              <strong>Draft document.</strong> The places marked in yellow are waiting for
              the operator&rsquo;s company details, the blue ones for confirmation of the
              actual process or for a legal review. Until then the document is
              informative only. This English text is a courtesy translation; the Slovak
              version is the binding one.
            </>
          ) : (
            <>
              <strong>Návrh dokumentu.</strong> Žlto označené miesta čakajú na firemné
              údaje prevádzkovateľa, modré na potvrdenie skutočného procesu alebo na
              právnu kontrolu. Dokument je do potvrdenia informatívny a nenahrádza záväzné
              znenie.
            </>
          )}
        </div>

        <article className="pravne__body">{children}</article>
      </div>
    </main>
  );
}
