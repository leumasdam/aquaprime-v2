import Link from "next/link";
import AquaGrid from "../AquaGrid";
import Kaustika from "../Kaustika";
import { odkaz, type Jazyk } from "../jazyk";
import type { Slovnik } from "../preklady";
import Drobcek from "../Drobcek";
import PozadieVideo from "../PozadieVideo";
import PasKarusel from "../PasKarusel";
import { AQUARIUMS } from "../aquariums";

const HERO_FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
        <rect x="3.5" y="6.5" width="17" height="11" rx="0.8" />
        <path d="M6.6 6.5 9.4 17.5M12.4 6.5 15.2 17.5" opacity="0.5" />
      </svg>
    ),
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M12 3.5c3.4 4 5.6 6.8 5.6 9.3A5.6 5.6 0 0 1 12 20.5a5.6 5.6 0 0 1-5.6-7.7c0-2.5 2.2-5.3 5.6-9.3Z" strokeLinejoin="round" />
        <path d="M7.2 14.6c1.4.9 2.8.9 4.2 0s2.8-.9 4.2 0" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M3.5 9.5h17M3.5 9.5v5m17-5v5" strokeLinecap="round" />
        <path d="M7.5 9.5v2.6M12 9.5v3.4M16.5 9.5v2.6" strokeLinecap="round" opacity="0.6" />
      </svg>
    ),
  },
  {
    /* tabuľa skla so zrkadlovým odleskom — číre float sklo */
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
        <rect x="4.5" y="4.5" width="15" height="15" rx="0.8" />
        <path d="M8 16.5 16.5 8M12.5 17 17 12.5" strokeLinecap="round" opacity="0.55" />
      </svg>
    ),
  },
];


export default function AkvariaObsah({ t, jazyk }: { t: Slovnik; jazyk: Jazyk }) {
  const k = t.akvaria;
  const l = (h: string) => odkaz(h, jazyk);
  return (
    <main className="catalog">
      {/* HERO — video cez celú plochu, text sadá do tmy pri jeho spodnej
          hrane. Rozloženie podľa návrhu klienta (13. 9. 2026). */}
      <section className="vhero" id="hero">
        <div className="vhero__media" aria-hidden>
          <PozadieVideo
            src="/video/akvaria-hero.mp4"
            poster="/img/akvaria/akvaria-hero-poster.webp"
            className="vhero__video"
          />
        </div>
        <Kaustika />
        <div className="hero__scroll-v vhero__scroll" aria-hidden>
          <span className="hero__scroll-word">{t.domov.scroll}</span>
          <span className="hero__scroll-line" />
          <span className="hero__scroll-arr">↓</span>
        </div>
        <div className="wrap vhero__crumb">
          <Drobcek cesta={[{ nazov: k.drobcek }]} jazyk={jazyk} />
        </div>
        <div className="wrap vhero__in">
          {/* Drobček je v zostave dvakrát: na telefóne stojí hore nad záberom,
              od tabletu nahrádza tyrkysový nadpisok nad titulkom. Vždy je
              viditeľný len jeden, ten druhý je vypnutý cez display. */}
          <div className="vhero__crumb vhero__crumb--v-texte">
            <Drobcek cesta={[{ nazov: k.drobcek }]} jazyk={jazyk} />
          </div>
          <span className="vhero__eyebrow">{k.drobcek}</span>
          <h1 className="vhero__title display">
            {k.heroTitul}
            <span className="vhero__bodka" aria-hidden>
              .
            </span>
          </h1>
          <p className="vhero__lead">{k.heroLeadKratky}</p>
          <div className="vhero__odkazy">
            <a href="#katalog" className="vhero__odkaz">
              <span className="vhero__odkaz-text">{k.heroCtaRozmer}</span>
              <span aria-hidden>↗</span>
            </a>
            <Link href={l("/dopyt")} className="vhero__odkaz vhero__odkaz--tichy">
              <span className="vhero__odkaz-text">{k.heroCtaMieru}</span>
              <span aria-hidden>↗</span>
            </Link>
          </div>
        </div>
      </section>

      <PasKarusel className="wrap vhero__fakty">
        {HERO_FEATURES.map((f, i) => (
          <div key={k.heroBody[i][0]} className="vhero__fakt">
            <span className="vhero__fikona">{f.icon}</span>
            <span className="vhero__ftext">
              <b>{k.heroBody[i][0]}</b>
              {k.heroBody[i][1]}
            </span>
          </div>
        ))}
      </PasKarusel>

      <section className="section" id="katalog">
        <div className="wrap">
          <div className="catalog__subhead">
            <h2 className="catalog__h2">{k.katalogTitul}</h2>
            <p className="catalog__sublead">
              {k.katalogLead}
            </p>
          </div>
          <AquaGrid jazyk={jazyk} />
        </div>
      </section>

      {/* PREČO TAKTO VYROBENÉ — podporný blok, sesterský k „Prečo oceľový rám" */}
      <section className="section why-frame">
        <div className="wrap why-frame__grid">
          <div data-reveal="left">
            <span className="eyebrow eyebrow--rule">{k.vyrobaEyebrow}</span>
            <h2 className="why-frame__title">{k.vyrobaTitul}</h2>
            <p className="why-frame__body">{k.vyrobaText}</p>
          </div>
          <ul
            className="why-frame__points"
            data-reveal
            style={{ "--rd": "100ms" } as React.CSSProperties}
          >
            {k.vyrobaBody.map(([titul, popis]) => (
              <li key={titul}>
                <strong>{titul}</strong>
                {popis}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* TERÁRIÁ — vetva, ktorá nemá katalóg, ale patrí sem */}
      <section className="section why-frame">
        <div className="wrap why-frame__grid">
          <div data-reveal="left">
            <span className="eyebrow eyebrow--rule">{k.terariaEyebrow}</span>
            <h2 className="why-frame__title">{k.terariaTitul}</h2>
            <p className="why-frame__body">{k.terariaText}</p>
            <Link href={l("/dopyt")} className="btn-outline">
              {k.terariaCta} <span aria-hidden>→</span>
            </Link>
          </div>
          <ul
            className="why-frame__points"
            data-reveal
            style={{ "--rd": "100ms" } as React.CSSProperties}
          >
            {k.terariaBody.map(([titul, popis]) => (
              <li key={titul}>
                <strong>{titul}</strong>
                {popis}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section catalog__cta" id="cta">
        <div className="wrap catalog__cta-inner" data-reveal>
          <div>
            <h2 className="catalog__cta-title">{k.ctaTitul}</h2>
            <p className="catalog__cta-body">{k.ctaText}</p>
          </div>
          <div className="catalog__cta-actions">
            <Link href={l("/skrinky")} className="btn-cyan">
              {k.ctaSkrinky} <span aria-hidden>→</span>
            </Link>
            <Link href={l("/dopyt")} className="btn-outline">
              {k.ctaNavrh}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
