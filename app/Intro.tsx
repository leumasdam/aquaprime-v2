"use client";

import { useEffect } from "react";
import { Logo } from "./brand";

/**
 * Krátke intro pri načítaní: logo sa vynorí spod vlny a plocha sa
 * rozplynie do stránky. Trvá pod sekundu. Neukazuje sa pri každom
 * obnovení — po zobrazení má 20-minútovú pauzu, potom nabehne znova.
 *
 * Značka je v HTML od servera a všetko riadi CSS animácia, takže sa
 * nestane, že by stránka najprv preblikla a intro nabehlo až po nej.
 * Skript v hlavičke pridá <html> triedu bez-intra, keď intro už bolo,
 * a CSS ho vtedy vôbec nevykreslí.
 */
export default function Intro() {
  useEffect(() => {
    // čas zapíš len keď intro naozaj bežalo — inak by ho každé obnovenie
    // v pauze predlžovalo donekonečna
    if (document.documentElement.classList.contains("bez-intra")) return;
    try {
      window.localStorage.setItem("aq-intro", String(Date.now()));
    } catch {
      /* súkromné okno — intro sa ukáže znova, nič vážne */
    }
  }, []);

  return (
    <div className="intro" aria-hidden="true">
      <div className="intro__stred">
        <Logo className="intro__logo" />
        <svg className="intro__vlna" viewBox="0 0 240 12" preserveAspectRatio="none">
          <path d="M0 6C20 0 40 0 60 6S100 12 120 6 160 0 180 6 220 12 240 6" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </div>
    </div>
  );
}
