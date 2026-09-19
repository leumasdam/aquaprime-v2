"use client";

/**
 * Pás technických faktov pod hero. Na širokej obrazovke tri stĺpce,
 * na telefóne pás po jednej karte v rovnakej stavbe ako fakty pod hero
 * na Akváriách: ikona vľavo, tučný názov, popis pod ním.
 */

import PasKarusel from "../PasKarusel";


/* Ikony v poradí položiek zo slovníka: rám, vyhotovenia, nožičky. */
const IKONY = [
  (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" key="ram">
      <rect x="5" y="5" width="14" height="14" rx="1" />
      <rect x="8.2" y="8.2" width="7.6" height="7.6" rx="0.5" />
    </svg>
  ),
  (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" key="vyhotovenia">
      <rect x="3.5" y="6" width="17" height="12" rx="1" />
      <path d="M9.2 6v12M14.8 6v12" />
    </svg>
  ),
  (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" key="nozicky">
      <path d="M4 8.5h16v4H4z" />
      <path d="M6.5 12.5v5M17.5 12.5v5" strokeLinecap="round" />
      <path d="M4.8 18.5h3.4M15.8 18.5h3.4" strokeLinecap="round" />
    </svg>
  ),
];

export default function Fakty({
  polozky,
  aria,
  prepnut: _prepnut,
}: {
  polozky: [string, string, string, string][];
  aria: string;
  prepnut: string;
}) {
  const FAKTY = polozky.map(([label, hodnota, jednotka, pozn], i) => ({
    label,
    hodnota,
    jednotka,
    pozn,
    ikona: IKONY[i],
  }));

  return (
    <section className="fakty" aria-label={aria}>
      <div className="wrap">
        {/* na telefóne pás po jednej karte, posúva sa sám — ako fakty na Akváriách */}
        <PasKarusel className="fakty__pas" interval={3000}>
          {FAKTY.map((f, i) => (
            <article className="fakt" key={f.label} data-i={i} data-reveal style={{ "--rd": `${i * 90}ms` } as React.CSSProperties}>
              <span className="fakt__ikona" aria-hidden>{f.ikona}</span>
              <span className="fakt__label">{f.label}</span>
              <p className="fakt__riadok">
                <span className="fakt__hodnota">
                  {f.hodnota}
                  <em>{f.jednotka}</em>
                </span>
                <span className="fakt__pozn">{f.pozn}</span>
              </p>
            </article>
          ))}
        </PasKarusel>
      </div>
    </section>
  );
}
