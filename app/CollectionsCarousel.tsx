"use client";

import Link from "next/link";
import type { Jazyk } from "./jazyk";
import { SLOVNIKY } from "./preklady";
import { useEffect, useRef, useState, type CSSProperties } from "react";

type Item = {
  id: string;
  name: string;
  sub: string;
  img: string;
  href: string;
};

/**
 * Krokový nekonečný carousel — posun o jednu kartu (smooth, pauza, znova).
 * Tri kópie kariet + stredný offset (--i = i + N) umožňujú plynulý loop
 * v oboch smeroch. Loop je odolný voči preskočeniu indexu:
 *  - animRef zabráni auto-inkrementu počas reset fázy,
 *  - pauza pri skrytej karte prehliadača (setInterval by inak bežal ďalej),
 *  - záchranná normalizácia, ak by index predsa unikol z bezpečného rozsahu.
 */
export default function CollectionsCarousel({
  items,
  jazyk = "sk",
}: {
  items: Item[];
  jazyk?: Jazyk;
}) {
  const t = SLOVNIKY[jazyk].domov;
  const N = items.length;
  const slides = [...items, ...items, ...items];
  const [i, setI] = useState(0);
  const [anim, setAnim] = useState(true);
  const paused = useRef(false);
  const animRef = useRef(true);

  // auto-posun každých 2,4 s; pauza pri hover a keď je záložka v pozadí
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const onVis = () => {
      paused.current = document.hidden;
    };
    document.addEventListener("visibilitychange", onVis);
    const t = setInterval(() => {
      if (!paused.current && animRef.current) setI((x) => x + 1);
    }, 2400);
    return () => {
      clearInterval(t);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  // po dojazde na klon ticho preskoč späť do stredného setu (bez animácie)
  const onEnd = (e: React.TransitionEvent) => {
    if (e.target !== e.currentTarget || e.propertyName !== "transform") return;
    setI((prev) => {
      if (prev >= N) {
        animRef.current = false;
        setAnim(false);
        return prev - N;
      }
      if (prev < 0) {
        animRef.current = false;
        setAnim(false);
        return prev + N;
      }
      return prev;
    });
  };

  // záchranná sieť: ak index unikne z bezpečného rozsahu (napr. onEnd nezbehol),
  // normalizuj ho bez animácie — track sa nikdy nedostane do prázdna
  useEffect(() => {
    if (i > N || i < -1) {
      animRef.current = false;
      setAnim(false);
      setI(((i % N) + N) % N);
    }
  }, [i, N]);

  // po resete (anim=false) znovu zapni prechody
  useEffect(() => {
    if (anim) return;
    const r = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setAnim(true);
        animRef.current = true;
      })
    );
    return () => cancelAnimationFrame(r);
  }, [anim]);

  const go = (dir: number) => setI((x) => x + dir);

  // swipe prstom na mobile: vodorovný ťah nad 40 px posunie o jednu kartu;
  // počas dotyku stojí auto-posun, zvislý scroll stránky ostáva prehliadaču
  const touchX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
    paused.current = true;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const x0 = touchX.current;
    touchX.current = null;
    if (!document.hidden) paused.current = false;
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
  };

  return (
    <div
      className="collections__viewport"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => {
        if (!document.hidden) paused.current = false;
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{ touchAction: "pan-y" }}
    >
      <button
        type="button"
        className="coll-arrow coll-arrow--prev"
        aria-label={t.predchadzajuca}
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
                href={c.href}
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
        aria-label={t.dalsia}
        onClick={() => go(1)}
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
