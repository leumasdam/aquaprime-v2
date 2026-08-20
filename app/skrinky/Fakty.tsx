"use client";

/**
 * Pás technických faktov pod hero. Na širokej obrazovke tri stĺpce
 * s veľkým číslom, na mobile swipe slider po jednom s bodkami —
 * tri stĺpčeky vedľa seba boli na telefóne nečitateľné.
 */

import { useEffect, useRef, useState } from "react";

const FAKTY = [
  {
    label: "Oceľová konštrukcia",
    hodnota: "30 × 30",
    jednotka: "mm",
    pozn: "Zváraný uzavretý profil so stenou 2 mm. Váhu nesie kov, nie plášť.",
    ikona: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <rect x="5" y="5" width="14" height="14" rx="1" />
        <rect x="8.2" y="8.2" width="7.6" height="7.6" rx="0.5" />
      </svg>
    ),
  },
  {
    label: "Prémiové povrchy",
    hodnota: "7",
    jednotka: "dekorov",
    pozn: "LDTD 18 mm s precízne olepenými hranami — od matnej čiernej po dub.",
    ikona: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M4.5 9.5 12 5l7.5 4.5L12 14 4.5 9.5Z" strokeLinejoin="round" />
        <path d="m4.5 14 7.5 4.5L19.5 14" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Testovaná nosnosť",
    hodnota: "770",
    jednotka: "kg",
    pozn: "Rám dimenzovaný s rezervou na plnú nádrž aj s pieskom a kameňmi.",
    ikona: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M12 3 5 5.8v5.4c0 4.3 3 8.1 7 9.3 4-1.2 7-5 7-9.3V5.8L12 3Z" strokeLinejoin="round" />
        <path d="m9 11.6 2.1 2.1L15 9.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function Fakty() {
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
    <section className="fakty" aria-label="Technické parametre">
      <div className="wrap">
        <div className="fakty__pas" ref={drahá}>
          {FAKTY.map((f, i) => (
            <article className="fakt" key={f.label} data-i={i} data-reveal style={{ "--rd": `${i * 90}ms` } as React.CSSProperties}>
              <span className="fakt__ikona" aria-hidden>{f.ikona}</span>
              <span className="fakt__label">{f.label}</span>
              <span className="fakt__hodnota">
                {f.hodnota}
                <em>{f.jednotka}</em>
              </span>
              <p className="fakt__pozn">{f.pozn}</p>
            </article>
          ))}
        </div>

        <div className="fakty__bodky" role="tablist" aria-label="Prepnúť parameter">
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
