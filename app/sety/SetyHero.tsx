"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Drobcek from "../Drobcek";
import type { Jazyk } from "../jazyk";
import { SLOVNIKY, type Slovnik } from "../preklady";
import { SETY } from "../sety";

const INTERVAL_MS = 5200;

/**
 * Hero setov: záber krevetária v interiéri cez celú sekciu, text vľavo na
 * stmavenej strane. Prevedenia sa samy pomaly striedajú a vpravo stojí
 * stĺpec náhľadov, ktorým sa dá prepnúť ručne.
 *
 * Od 26. 9. 2026 sú to skutočné zábery od klienta, nie výrezy skladané do
 * pozadia — preto stačí obyčajné prelínanie fotiek.
 */
export default function SetyHero({ t, jazyk }: { t: Slovnik; jazyk: Jazyk }) {
  const k = t.sety;
  const set = SETY[0];
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

  const vyber = (j: number) => {
    setI(j);
    setRucne(true);
  };

  return (
    <section className="vhero sety-hero" id="sety-hero" aria-labelledby="sety-title">
      <div className="vhero__media" aria-hidden>
        {set.prevedenia.map((p, j) => (
          <Image
            key={p.id}
            src={p.fotky[0]}
            alt=""
            fill
            priority={j === 0}
            sizes="100vw"
            className={`sety-hero__zaber${j === i ? " is-on" : ""}`}
          />
        ))}
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
          <a href="#sety" className="vhero__odkaz">
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
            <Image src={p.fotky[0]} alt="" fill sizes="120px" />
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
