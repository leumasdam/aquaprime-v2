"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import Drobcek from "../Drobcek";
import { odkaz, type Jazyk } from "../jazyk";
import { SLOVNIKY, type Slovnik } from "../preklady";
import { SETY } from "../sety";

/** Kde v zábere stojí ktoré prevedenie (vodorovný stred panelu v % šírky). */
const OHNISKA = [18, 50, 82];
/** Farba LED pod akváriom v danom prevedení — svieti v ráme aktívneho čipu. */
const LED = ["#f1c27a", "#f1c27a", "#4aa8ff"];
const INTERVAL_MS = 4200;

/**
 * Hero setov: záber s tromi prevedeniami Scape 60 stojí vpravo a kamera sa
 * pomaly presúva z jedného na druhé — priblíži sa na aktívny panel a čip
 * s jeho názvom sa rozsvieti farbou LED. Klik na čip preberie riadenie.
 */
export default function SetyHero({ t, jazyk }: { t: Slovnik; jazyk: Jazyk }) {
  const k = t.sety;
  const set = SETY[0];
  const l = (h: string) => odkaz(h, jazyk);
  const [i, setI] = useState(0);
  const [rucne, setRucne] = useState(false);

  useEffect(() => {
    if (rucne) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(
      () => setI((x) => (x + 1) % set.prevedenia.length),
      INTERVAL_MS
    );
    return () => window.clearInterval(id);
  }, [rucne, set.prevedenia.length]);

  const aktivne = set.prevedenia[i];

  return (
    <section
      className="vhero vhero--bocny sety-hero"
      id="sety-hero"
      aria-labelledby="sety-title"
      style={{ "--ohnisko-x": `${OHNISKA[i]}%`, "--led": LED[i] } as CSSProperties}
    >
      <div className="vhero__media sety-hero__media" aria-hidden>
        {/* jediný 158 kB webp — bez optimalizátora, nech hero nečaká na srcset */}
        <Image src={set.obrazok} alt="" fill priority unoptimized className="sety-hero__zaber" />
      </div>

      <div className="hero__scroll-v vhero__scroll" aria-hidden>
        <span className="hero__scroll-word">{SLOVNIKY[jazyk].domov.scroll}</span>
        <span className="hero__scroll-line" />
        <span className="hero__scroll-arr">↓</span>
      </div>

      <div className="wrap vhero__crumb">
        <Drobcek cesta={[{ nazov: k.drobcek }]} jazyk={jazyk} />
      </div>

      <div className="wrap vhero__in">
        <div className="vhero__crumb vhero__crumb--v-texte">
          <Drobcek cesta={[{ nazov: k.drobcek }]} jazyk={jazyk} />
        </div>
        <span className="vhero__eyebrow sety-hero__eyebrow">
          {set.nazov}
          <span className="sety-hero__eyebrow-delic" aria-hidden>
            ·
          </span>
          <span className="sety-hero__eyebrow-prevedenie" key={aktivne.id}>
            {aktivne.nazov}
          </span>
        </span>
        <h1 className="vhero__title display vhero__title--siroky" id="sety-title">
          {k.heroTitul}
          <span className="vhero__bodka" aria-hidden>
            .
          </span>
        </h1>
        <p className="vhero__lead">{k.heroLead}</p>
        <div className="vhero__odkazy">
          <a href={`#${set.id}`} className="vhero__odkaz">
            <span className="vhero__odkaz-text">{k.heroCta}</span>
            <span aria-hidden>↗</span>
          </a>
          <Link href={l(`/dopyt?set=${set.id}`)} className="vhero__odkaz vhero__odkaz--tichy">
            <span className="vhero__odkaz-text">{k.cta}</span>
            <span aria-hidden>↗</span>
          </Link>
        </div>
      </div>

      <div className="sety-hero__vyber" role="group" aria-label={k.prevedenia}>
        {set.prevedenia.map((p, j) => (
          <button
            key={p.id}
            type="button"
            className={`sety-hero__chip${j === i ? " is-on" : ""}`}
            aria-pressed={j === i}
            onClick={() => {
              setI(j);
              setRucne(true);
            }}
          >
            <span className="sety-hero__chip-farba" style={{ background: p.swatch[0] }} />
            <span className="sety-hero__chip-text">{p.nazov}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
