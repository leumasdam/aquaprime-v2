"use client";

/**
 * Pás technických faktov pod hero. Na širokej obrazovke tri stĺpce
 * s veľkým číslom, na mobile swipe slider po jednom s bodkami —
 * tri stĺpčeky vedľa seba boli na telefóne nečitateľné.
 */

import { useEffect, useRef, useState } from "react";


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
  prepnut,
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
  const drahá = useRef<HTMLDivElement>(null);
  const [aktivny, setAktivny] = useState(0);

  /* bodky sledujú, ktorá karta je práve na obrazovke */
  useEffect(() => {
    const box = drahá.current;
    if (!box) return;
    const io = new IntersectionObserver(
      (zaznamy) => {
        const viditelny = zaznamy
          .filter((z) => z.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (viditelny) setAktivny(Number((viditelny.target as HTMLElement).dataset.i));
      },
      { root: box, threshold: 0.6 },
    );
    box.querySelectorAll(".fakt").forEach((k) => io.observe(k));
    return () => io.disconnect();
  }, []);

  const skoc = (i: number) => {
    const box = drahá.current;
    const karta = box?.querySelectorAll<HTMLElement>(".fakt")[i];
    if (box && karta) box.scrollTo({ left: karta.offsetLeft - box.offsetLeft, behavior: "smooth" });
  };

  return (
    <section className="fakty" aria-label={aria}>
      <div className="wrap">
        <div className="fakty__pas" ref={drahá}>
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
        </div>

        <div className="fakty__bodky" role="tablist" aria-label={prepnut}>
          {FAKTY.map((f, i) => (
            <button
              key={f.label}
              type="button"
              role="tab"
              aria-selected={i === aktivny}
              aria-label={f.label}
              className={i === aktivny ? "is-on" : ""}
              onClick={() => skoc(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
