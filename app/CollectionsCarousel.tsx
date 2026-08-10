"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";

type Item = { id: string; name: string; sub: string; img: string };

/**
 * Krokový nekonečný carousel — posun o jednu kartu (smooth, pauza, znova).
 * Tri kópie kariet + stredný offset umožňujú plynulý loop v oboch smeroch
 * (auto-posun aj manuálne šípky).
 */
export default function CollectionsCarousel({ items }: { items: Item[] }) {
  const N = items.length;
  const slides = [...items, ...items, ...items]; // ľavé klony | reálne | pravé klony
  const [i, setI] = useState(0);
  const [anim, setAnim] = useState(true);
  const paused = useRef(false);

  const go = (dir: number) => setI((x) => x + dir);

  // auto-posun každých 3,4 s (pauza pri hover / interakcii)
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const t = setInterval(() => {
      if (!paused.current) setI((x) => x + 1);
    }, 2400);
    return () => clearInterval(t);
  }, []);

  // po dojazde na klon ticho preskoč späť do stredného setu (bez animácie)
  const onEnd = (e: React.TransitionEvent) => {
    if (e.target !== e.currentTarget || e.propertyName !== "transform") return;
    if (i >= N) {
      setAnim(false);
      setI((x) => x - N);
    } else if (i < 0) {
      setAnim(false);
      setI((x) => x + N);
    }
  };
  useEffect(() => {
    if (anim) return;
    const r = requestAnimationFrame(() =>
      requestAnimationFrame(() => setAnim(true))
    );
    return () => cancelAnimationFrame(r);
  }, [anim]);

  return (
    <div
      className="collections__viewport"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      <button
        type="button"
        className="coll-arrow coll-arrow--prev"
        aria-label="Predchádzajúca kolekcia"
        onClick={() => go(-1)}
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M15 5 8 12l7 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="collections__cards">
        <div
          className="collections__track"
          style={
            { "--i": i + N, transition: anim ? undefined : "none" } as CSSProperties
          }
          onTransitionEnd={onEnd}
        >
          {slides.map((c, idx) => {
            const real = idx >= N && idx < N * 2;
            return (
              <Link
                key={idx}
                href={`/skrinky?rad=${c.id}`}
                className="ccard"
                aria-hidden={real ? undefined : true}
                tabIndex={real ? undefined : -1}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.img} alt={c.name} className="ccard__img" />
                <span className="ccard__overlay">
                  <span className="ccard__name">{c.name}</span>
                  <span className="ccard__sub">{c.sub}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        className="coll-arrow coll-arrow--next"
        aria-label="Ďalšia kolekcia"
        onClick={() => go(1)}
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
