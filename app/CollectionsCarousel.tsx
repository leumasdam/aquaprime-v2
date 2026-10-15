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
 * Nekonečný carousel bez resetov. Index `i` rastie/klesá bez obmedzenia;
 * zobrazuje sa okno kariet okolo neho (abs. index i-N … i+2N), každá
 * karta má kľúč podľa absolútneho indexu a posúva sa vlastným transformom.
 * Nová karta sa primontuje rovno na svojom mieste mimo obrazu (bez animácie),
 * existujúce sa plynulo presunú — preto nikdy nepreskočí „na začiatok",
 * ani pri rýchlom klikaní na šípky (15. 10. 2026).
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
  const [i, setI] = useState(0);
  const paused = useRef(false);

  // auto-posun každých 2,4 s; pauza pri hover a keď je záložka v pozadí
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const onVis = () => {
      paused.current = document.hidden;
    };
    document.addEventListener("visibilitychange", onVis);
    const t = setInterval(() => {
      if (!paused.current) setI((x) => x + 1);
    }, 2400);
    return () => {
      clearInterval(t);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const go = (dir: number) => setI((x) => x + dir);

  // okno absolútnych indexov: N kariet vľavo mimo obrazu, N viditeľných/napravo, N rezerva
  const okno: number[] = [];
  for (let a = i - N; a < i + 2 * N; a++) okno.push(a);
  const polozka = (a: number) => items[((a % N) + N) % N];

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
        <div className="collections__track">
          {okno.map((a) => {
            const c = polozka(a);
            const real = a >= i && a < i + 3;
            return (
              <div key={a} className="ccard-slot" style={{ "--p": a - i } as CSSProperties}>
                <Link href={c.href} className="ccard" aria-hidden={real ? undefined : true} tabIndex={real ? undefined : -1}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.img} alt={c.name} className="ccard__img" />
                  <span className="ccard__overlay">
                    <span className="ccard__name">{c.name}</span>
                    <span className="ccard__sub">{c.sub}</span>
                  </span>
                </Link>
              </div>
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
