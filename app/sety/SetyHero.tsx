"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import Drobcek from "../Drobcek";
import type { Jazyk } from "../jazyk";
import { SLOVNIKY, type Slovnik } from "../preklady";
import { SETY } from "../sety";

/** Záber interiéru s prázdnym miestom pre skrinku (rozmer súboru). */
const POZADIE = { src: "/img/sety/krevety-hero.webp", w: 2794, h: 831 };
/** Kde v zábere stojí skrinka: stred na šírku, horná hrana akvária a
    spodok skrinky — podiely z rozmeru záberu. Výrez prevedenia sa naň lepí. */
const SKRINKA = { cx: 0.574, top: 0.1, bot: 0.918 };
/** Ktorý bod záberu drží pri orezaní (ako object-position) — desktop / telefón. */
const OHNISKO = { d: [0.35, 0], m: [0.585, 0.6] } as const;
/** Na desktope je záber o kúsok väčší a posadený nižšie: vrch akvária tak
    nie je nalepený na lištu. Pás pod lištou, ktorý záber nepokryje, drží
    farba sekcie — vrch scény je aj tak takmer čierny. */
const PRIBLIZENIE = { d: 1, m: 1 } as const;
const POSUN_Y = { d: 48, m: 0 } as const;
const INTERVAL_MS = 4200;

type Javisko = { x: number; y: number; w: number; h: number };

/**
 * Hero setov podľa návrhu z 26. 9. 2026: interiér cez celú sekciu, v ňom
 * stojí skrinka s akváriom vo zvolenom prevedení, vpravo stĺpec náhľadov
 * a dole lišta s čipmi. Prevedenia sú samostatné výrezy, ktoré sa
 * prelínajú presne na mieste skrinky v zábere.
 *
 * Záber sa kreslí ako „javisko“ s rozmerom, aký by mal pri object-fit: cover,
 * a výrez sa polohuje v percentách javiska — tak sedí na skrinke pri každej
 * šírke okna, aj keď je záber orezaný zboku alebo zhora.
 */
export default function SetyHero({ t, jazyk }: { t: Slovnik; jazyk: Jazyk }) {
  const k = t.sety;
  const set = SETY[0];
  const sekcia = useRef<HTMLElement>(null);
  const [i, setI] = useState(1);
  const [rucne, setRucne] = useState(false);
  const [javisko, setJavisko] = useState<Javisko | null>(null);

  useEffect(() => {
    const el = sekcia.current;
    if (!el) return;
    const prepocitaj = () => {
      const W = el.clientWidth;
      const H = el.clientHeight;
      const mobil = window.matchMedia("(max-width: 767px)").matches;
      const [px, py] = mobil ? OHNISKO.m : OHNISKO.d;
      const s = Math.max(W / POZADIE.w, H / POZADIE.h) * (mobil ? PRIBLIZENIE.m : PRIBLIZENIE.d);
      const w = POZADIE.w * s;
      const h = POZADIE.h * s;
      setJavisko({ x: (W - w) * px, y: (H - h) * py + (mobil ? POSUN_Y.m : POSUN_Y.d), w, h });
    };
    prepocitaj();
    const ro = new ResizeObserver(prepocitaj);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (rucne) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(
      () => setI((x) => (x + 1) % set.prevedenia.length),
      INTERVAL_MS
    );
    return () => window.clearInterval(id);
  }, [rucne, set.prevedenia.length]);

  const vyber = (j: number) => {
    setI(j);
    setRucne(true);
  };

  const style = {
    ...(javisko
      ? {
          "--st-x": `${javisko.x}px`,
          "--st-y": `${javisko.y}px`,
          "--st-w": `${javisko.w}px`,
          "--st-h": `${javisko.h}px`,
        }
      : {}),
    "--sk-cx": `${SKRINKA.cx * 100}%`,
    "--sk-top": `${SKRINKA.top * 100}%`,
    "--sk-h": `${(SKRINKA.bot - SKRINKA.top) * 100}%`,
  } as CSSProperties;

  return (
    <section
      ref={sekcia}
      className={`vhero sety-hero${javisko ? " is-zmerane" : ""}`}
      id="sety-hero"
      aria-labelledby="sety-title"
      style={style}
    >
      <div className="vhero__media" aria-hidden>
        <div className="sety-hero__javisko">
          <Image
            src={POZADIE.src}
            alt=""
            fill
            priority
            unoptimized
            className="sety-hero__pozadie"
          />
          <div className="sety-hero__produkt">
            {set.prevedenia.map((p, j) => (
              <Image
                key={p.id}
                src={p.obrazok}
                alt=""
                fill
                unoptimized
                priority={j === 1}
                className={`sety-hero__kus${j === i ? " is-on" : ""}`}
              />
            ))}
          </div>
        </div>
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
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>

      {/* stĺpec náhľadov vpravo — každý ukazuje jedno prevedenie */}
      <div className="sety-hero__nahlady" role="group" aria-label={k.prevedenia}>
        {set.prevedenia.map((p, j) => (
          <button
            key={p.id}
            type="button"
            className={`sety-hero__nahlad${j === i ? " is-on" : ""}`}
            aria-pressed={j === i}
            aria-label={p.nazov}
            onClick={() => vyber(j)}
          >
            <Image src={p.obrazok} alt="" fill unoptimized sizes="120px" />
          </button>
        ))}
      </div>

      <div className="sety-hero__vyber" role="group" aria-label={k.prevedenia}>
        {set.prevedenia.map((p, j) => (
          <button
            key={p.id}
            type="button"
            className={`sety-hero__chip${j === i ? " is-on" : ""}`}
            aria-pressed={j === i}
            onClick={() => vyber(j)}
          >
            <span className="sety-hero__chip-farba" style={{ background: p.swatch[0] }} />
            <span className="sety-hero__chip-text">{p.nazov}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
