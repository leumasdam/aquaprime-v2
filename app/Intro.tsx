"use client";

import { Logo } from "./brand";

/**
 * Krátke intro pri načítaní: logo sa vynorí spod vlny a plocha sa
 * rozplynie do stránky. Trvá pod sekundu. Ide pri každom novom otvorení
 * webu (zadaná adresa, klik odinakiaľ), nie pri obnovení karty ani pri
 * návrate späť — to rozhoduje skript v hlavičke podľa typu navigácie.
 *
 * Značka je v HTML od servera a všetko riadi CSS animácia, takže sa
 * nestane, že by stránka najprv preblikla a intro nabehlo až po nej.
 * Skript v hlavičke pridá <html> triedu bez-intra, keď intro už bolo,
 * a CSS ho vtedy vôbec nevykreslí.
 */
export default function Intro() {
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
