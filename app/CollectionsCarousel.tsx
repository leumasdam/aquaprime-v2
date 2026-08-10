"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";

type Item = { id: string; name: string; sub: string; img: string };

/**
 * Krokový nekonečný carousel — posunie sa o jednu kartu, smooth, počká a znova.
 * Klony prvých kariet na konci zabezpečia plynulý loop bez viditeľného skoku.
 */
export default function CollectionsCarousel({ items }: { items: Item[] }) {
  const N = items.length;
  const CLONES = 3; // koľko kariet je naraz vidno
  const slides = [...items, ...items.slice(0, CLONES)];
  const [i, setI] = useState(0);
  const [anim, setAnim] = useState(true);
  const paused = useRef(false);

  // auto-posun každých 3,4 s (pauza pri hover)
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const t = setInterval(() => {
      if (!paused.current) setI((x) => x + 1);
    }, 3400);
    return () => clearInterval(t);
  }, []);

  // po dojazde na klon ticho preskoč späť na reálnu pozíciu (bez animácie)
  const onEnd = (e: React.TransitionEvent) => {
    if (e.target !== e.currentTarget || e.propertyName !== "transform") return;
    if (i >= N) {
      setAnim(false);
      setI((x) => x - N);
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
      className="collections__cards"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      <div
        className="collections__track"
        style={
          { "--i": i, transition: anim ? undefined : "none" } as CSSProperties
        }
        onTransitionEnd={onEnd}
      >
        {slides.map((c, idx) => {
          const clone = idx >= N;
          return (
            <Link
              key={idx}
              href={`/skrinky?rad=${c.id}`}
              className="ccard"
              aria-hidden={clone || undefined}
              tabIndex={clone ? -1 : undefined}
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
  );
}
