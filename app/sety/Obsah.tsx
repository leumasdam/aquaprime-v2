import type { CSSProperties } from "react";
import type { Jazyk } from "../jazyk";
import type { Slovnik } from "../preklady";
import SetyHero from "./SetyHero";
import SetyKatalog from "./Katalog";

/**
 * Stránka Sety — hotové dvojice skrinka + akvárium. Hore hero so záberom
 * prevedení (SetyHero), pod ním úvod a katalóg: prepínač kategórií a karty
 * setov v rovnakej mriežke ako skrinky. Detail setu má vlastnú stránku.
 */
export default function SetyObsah({ t, jazyk }: { t: Slovnik; jazyk: Jazyk }) {
  const k = t.sety;
  return (
    <main className="catalog sety" style={{ "--accent": "var(--cyan)" } as CSSProperties}>
      <SetyHero t={t} jazyk={jazyk} />

      <section className="section sety__zoznam" id="sety">
        <div className="wrap sety__uvod">
          <span className="sety__eyebrow">{k.eyebrow}</span>
          <h2 className="sety__titul">{k.titul}</h2>
          <p className="sety__lead">{k.lead}</p>
        </div>
        <div className="wrap">
          <SetyKatalog t={k} jazyk={jazyk} />
        </div>
      </section>
    </main>
  );
}
