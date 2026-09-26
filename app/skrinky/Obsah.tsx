import Link from "next/link";
import CatalogGrid from "../CatalogGrid";
import Kaustika from "../Kaustika";
import { odkaz, type Jazyk } from "../jazyk";
import type { Slovnik } from "../preklady";
import Drobcek from "../Drobcek";
import SvetloHero from "../SvetloHero";
import Fakty from "./Fakty";


export default function SkrinkyObsah({ t, jazyk }: { t: Slovnik; jazyk: Jazyk }) {
  const k = t.katalog;
  const l = (h: string) => odkaz(h, jazyk);
  return (
    <main className="catalog">
      {/* HERO — rovnaká zostava ako na akváriách: video cez celú sekciu,
          text sadá do jeho stmavenej spodnej časti. */}
      <section className="vhero vhero--bocny" id="hero">
        <div className="vhero__media" aria-hidden>
          <SvetloHero tma="/skrinky/hero-tma.webp" svetlo="/skrinky/hero-svetlo.webp" />
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
              <span className="vhero__odkaz-text">{k.heroCta}</span>
              <span aria-hidden>↗</span>
            </a>
            <Link href={l("/konfigurator")} className="vhero__odkaz vhero__odkaz--tichy">
              <span className="vhero__odkaz-text">{k.heroCtaMieru}</span>
              <span aria-hidden>↗</span>
            </Link>
          </div>
        </div>
      </section>

      <Fakty polozky={k.fakty} aria={k.faktyAria} prepnut={k.faktyPrepnut} />

      {/* produktová mriežka s interaktívnym filtrom */}
      <section className="section" id="katalog">
        <div className="wrap">
          <div className="catalog__subhead">
            <h2 className="catalog__h2">{k.katalogTitul}</h2>
            <p className="catalog__sublead">
              {k.katalogLead}
            </p>
          </div>
          <CatalogGrid jazyk={jazyk} />
        </div>
      </section>

      {/* PREČO OCEĽOVÝ RÁM — podporný blok */}
      <section className="section why-frame" id="preco-ram">
        <div className="wrap why-frame__grid">
          <div data-reveal="left">
            <span className="eyebrow eyebrow--rule">{k.precoEyebrow}</span>
            <h2 className="why-frame__title">{k.precoTitul}</h2>
            <p className="why-frame__body">{k.precoText}</p>
          </div>
          <ul
            className="why-frame__points"
            data-reveal
            style={{ "--rd": "100ms" } as React.CSSProperties}
          >
            {k.precoBody.map(([titul, popis]) => (
              <li key={titul}>
                <strong>{titul}</strong>
                {popis}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA na dopyt alebo detail */}
      <section className="section catalog__cta" id="cta">
        <div className="wrap catalog__cta-inner" data-reveal>
          <div>
            <h2 className="catalog__cta-title">{k.ctaTitul}</h2>
            <p className="catalog__cta-body">{k.ctaText}</p>
          </div>
          <div className="catalog__cta-actions">
            <Link href={l("/dopyt")} className="btn-cyan">
              {k.ctaTlacidlo} <span aria-hidden>→</span>
            </Link>
            <Link href={l("/")} className="btn-outline">
              {k.ctaSpat}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
