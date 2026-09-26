"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { odkaz, type Jazyk } from "../jazyk";
import type { Slovnik } from "../preklady";
import type { Prevedenie, Set } from "../sety";
import Swatch from "../Swatch";

/** Rovnaká kadencia ako na kartách skriniek: náhodná pauza z tohto rozpätia. */
const PAUZA_MIN_MS = 6000;
const PAUZA_MAX_MS = 15000;

/**
 * Karta setu — vizuálne tá istá karta ako v katalógu skriniek (triedy
 * .product), náhľad sa pomaly strieda cez prevedenia a hover na vzorke
 * ukáže vybrané. Odkaz vedie na detail setu v tom istom prevedení.
 */
export default function SetCard({
  set,
  t,
  jazyk,
  delay = 0,
}: {
  set: Set;
  t: Slovnik["sety"];
  jazyk: Jazyk;
  delay?: number;
}) {
  const [hover, setHover] = useState<Prevedenie | null>(null);
  const [auto, setAuto] = useState(0);
  const [pauza, setPauza] = useState(false);
  const karta = useRef<HTMLAnchorElement>(null);
  const cyklus = set.prevedenia;

  useEffect(() => {
    if (cyklus.length < 2 || pauza) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = karta.current;
    if (!el) return;
    let timer: number | undefined;
    const stop = () => {
      if (timer !== undefined) window.clearTimeout(timer);
      timer = undefined;
    };
    const dalsia = () => {
      timer = window.setTimeout(() => {
        setAuto((i) => (i + 1) % cyklus.length);
        dalsia();
      }, PAUZA_MIN_MS + Math.random() * (PAUZA_MAX_MS - PAUZA_MIN_MS));
    };
    const io = new IntersectionObserver(
      ([z]) => {
        stop();
        if (z.isIntersecting) dalsia();
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      stop();
    };
  }, [cyklus.length, pauza]);

  const aktivne = hover ?? cyklus[auto % cyklus.length];
  const nahlad = aktivne.fotky[0];
  const posledna = useRef(nahlad);
  const predosla = posledna.current !== nahlad ? posledna.current : null;
  useEffect(() => {
    posledna.current = nahlad;
  }, [nahlad]);

  const velkosti = "(max-width: 700px) 92vw, (max-width: 1100px) 46vw, 30vw";

  return (
    <Link
      ref={karta}
      href={odkaz(`/sety/${set.id}?prevedenie=${aktivne.id}`, jazyk)}
      className="product product--in set-karta"
      style={{ "--rd": `${delay}ms` } as CSSProperties}
      onMouseEnter={() => setPauza(true)}
      onMouseLeave={() => {
        setPauza(false);
        setHover(null);
      }}
    >
      <div className="product__media product__media--photo">
        {predosla && (
          <Image
            key={`predosla-${predosla}`}
            src={predosla}
            alt=""
            aria-hidden
            className="product__foto--prec"
            fill
            sizes={velkosti}
          />
        )}
        <Image
          key={nahlad}
          src={nahlad}
          alt={`${set.nazov} — ${aktivne.nazov}`}
          className={predosla ? "product__foto--nova" : undefined}
          fill
          sizes={velkosti}
        />
        <span className="product__badge product__badge--set">{t.kategorie[set.kategoria]}</span>
        {set.novinka && <span className="product__stitok">{t.novinka}</span>}
      </div>
      <div className="product__body">
        <h3 className="product__name">{set.nazov}</h3>
        <div className="product__decors" title={aktivne.nazov}>
          {cyklus.map((p) => (
            <span
              key={p.id}
              className={`product__decor${aktivne.id === p.id ? " is-on" : ""}`}
              onMouseEnter={() => setHover(p)}
              aria-label={p.nazov}
            >
              <Swatch swatch={p.swatch} className="swatch--dot" />
            </span>
          ))}
        </div>
        <div className="product__specs">
          <span>
            <i>{t.skrinka}</i>
            {set.skrinka}
          </span>
          <span>
            <i>{t.akvarium}</i>
            {set.objem} l
          </span>
        </div>
        <div className="product__foot">
          <span className="product__price">{set.cena === null ? t.cenaNaDopyt : `${set.cena} €`}</span>
          <span className="product__cta">
            {t.detail} <span aria-hidden>→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
