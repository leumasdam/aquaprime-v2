"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Drobcek from "../Drobcek";
import { odkaz, type Jazyk } from "../jazyk";
import { SLOVNIKY, type Slovnik } from "../preklady";

/**
 * Hero realizácií. Od 20. 9. 2026 stojí na rovnakej zostave ako skrinky
 * a akváriá (trieda .vhero): záber cez celú sekciu, text sadá do jeho
 * stmavenej spodnej časti, drobček, pätkový titulok s tyrkysovou bodkou,
 * vyplnená primárna výzva a tichý odkaz vedľa nej.
 *
 * Oproti ostatným hero sekciám ostáva navyše tlačidlo na pozastavenie
 * záberu — video beží v slučke a používateľ ho musí vedieť zastaviť.
 */
export default function RealizacieHero({
  t,
  jazyk = "sk",
}: {
  t: Slovnik["realizacie"];
  jazyk?: Jazyk;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const rucneZastavene = useRef(false);
  const [bezi, setBezi] = useState(false);
  const [zlyhalo, setZlyhalo] = useState(false);
  const scroll = SLOVNIKY[jazyk].domov.scroll;

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    /* Safari na iPhone sa pri rozhodovaní, či smie video spustiť bez dotyku,
       pozerá na atribúty, nie na vlastnosti nastavené Reactom. */
    element.muted = true;
    element.setAttribute("muted", "");
    element.setAttribute("playsinline", "");
    const tlmene = window.matchMedia("(prefers-reduced-motion: reduce)");
    let vidno = true;
    const zosulaď = () => {
      if (!vidno || document.hidden || tlmene.matches || rucneZastavene.current) element.pause();
      else element.play().catch(() => setBezi(false));
    };
    const sledovac = new IntersectionObserver(
      ([zaznam]) => {
        vidno = zaznam.isIntersecting;
        zosulaď();
      },
      { threshold: 0.1 }
    );
    sledovac.observe(element);
    document.addEventListener("visibilitychange", zosulaď);
    tlmene.addEventListener("change", zosulaď);
    zosulaď();
    return () => {
      sledovac.disconnect();
      document.removeEventListener("visibilitychange", zosulaď);
      tlmene.removeEventListener("change", zosulaď);
      element.pause();
    };
  }, []);

  const prepni = () => {
    const element = video.current;
    if (!element) return;
    rucneZastavene.current = !element.paused;
    if (element.paused) element.play().catch(() => setBezi(false));
    else element.pause();
  };

  const drobcek = [{ nazov: t.drobcek }];

  return (
    <section className="vhero" id="hero" aria-labelledby="realizacie-title">
      <div className="vhero__media" aria-hidden>
        <video
          ref={video}
          className="vhero__video vhero__video--sirokouhle"
          loop
          preload="metadata"
          poster="/realizacie/cover-poster.webp"
          onPlay={() => setBezi(true)}
          onPause={() => setBezi(false)}
          onError={() => setZlyhalo(true)}
        >
          <source src="/video/realizacie-cover.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="hero__scroll-v vhero__scroll" aria-hidden>
        <span className="hero__scroll-word">{scroll}</span>
        <span className="hero__scroll-line" />
        <span className="hero__scroll-arr">↓</span>
      </div>

      <div className="wrap vhero__crumb">
        <Drobcek cesta={drobcek} jazyk={jazyk} />
      </div>

      <div className="wrap vhero__in">
        {/* na telefóne stojí drobček nad záberom, od tabletu nahrádza
            tyrkysový nadpisok — vždy je viditeľný práve jeden */}
        <div className="vhero__crumb vhero__crumb--v-texte">
          <Drobcek cesta={drobcek} jazyk={jazyk} />
        </div>
        <span className="vhero__eyebrow">{t.drobcek}</span>
        <h1 className="vhero__title display vhero__title--siroky" id="realizacie-title">
          {t.heroTitul1}
          {/* od notebooku titulok stojí v dvoch riadkoch podľa zmyslu vety,
              na telefóne si ho zalomí šírka sama */}
          <br className="vhero__zlom" />{" "}
          {t.heroTitul2}
          <span className="vhero__bodka" aria-hidden>
            .
          </span>
        </h1>
        <p className="vhero__lead">
          {t.heroLead1} {t.heroLead2}
        </p>
        <div className="vhero__odkazy">
          <a href="#galeria" className="vhero__odkaz">
            <span className="vhero__odkaz-text">{t.heroCta}</span>
            <span aria-hidden>↗</span>
          </a>
          <Link href={odkaz("/dopyt", jazyk)} className="vhero__odkaz vhero__odkaz--tichy">
            <span className="vhero__odkaz-text">{t.chcem}</span>
            <span aria-hidden>↗</span>
          </Link>
        </div>
      </div>

      {!zlyhalo && (
        <button
          type="button"
          className="vhero__pauza"
          onClick={prepni}
          aria-label={bezi ? t.pozastavit : t.prehrat}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            {bezi ? <path d="M4 3h2v10H4zm6 0h2v10h-2z" /> : <path d="m5 2 8 6-8 6z" />}
          </svg>
        </button>
      )}
    </section>
  );
}
