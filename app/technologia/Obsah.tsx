import Drobcek from "../Drobcek";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import TurntableScroll from "../TurntableScroll";
import CountUp from "../CountUp";
import LoadCalc from "../LoadCalc";
import PozadieVideo from "../PozadieVideo";
import PasKarusel from "../PasKarusel";
import VideoNaScroll from "../VideoNaScroll";
import { odkaz, type Jazyk } from "../jazyk";
import type { Slovnik } from "../preklady";


/* Obrázky krokov výroby; texty prichádzajú zo slovníka a poradie musí sedieť
   s `konstrukcia.postup`: návrh → zváranie → opláštenie → osadenie. */
const STEP_IMGS = [
  "/technologia/postup-01-navrh.webp",
  "/technologia/postup-02-vyroba.webp",
  "/technologia/postup-03-oplastenie.webp",
  "/technologia/postup-04-osadenie.webp",
];

/* Opis vlastnej konštrukcie (audit 11. 9. 2026 nahradil porovnanie
   s „bežným nábytkom", ktoré nebolo podložené). */

/* ikony k trom číslam: profil, hrúbka steny, opláštenie — kreslené rovnako
   ako ikony faktov na Akváriách, tenkou linkou */
const CISLA_IKONY = [
  <svg key="profil" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
    <rect x="4" y="4" width="16" height="16" rx="1" />
    <rect x="7.5" y="7.5" width="9" height="9" rx="0.6" opacity="0.5" />
  </svg>,
  <svg key="stena" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
    <path d="M4 5v14M20 5v14" strokeLinecap="round" />
    <path d="M7 12h10M9 9.5 7 12l2 2.5M15 9.5l2 2.5-2 2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
  </svg>,
  <svg key="plast" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
    <path d="M4 8.5 12 4l8 4.5-8 4.5z" strokeLinejoin="round" />
    <path d="M4 12.5 12 17l8-4.5M4 16.5 12 21l8-4.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" />
  </svg>,
];

export default function KonstrukciaObsah({ t, jazyk }: { t: Slovnik; jazyk: Jazyk }) {
  const k = t.konstrukcia;
  const l = (h: string) => odkaz(h, jazyk);
  return (
    <main id="main" className="tech" style={{ "--accent": "var(--cyan)" } as CSSProperties}>
      {/* ---- HERO s renderom rám → skrinka ---- */}
      <section className="tech-hero section" id="hero">
        {/* video nesie hero vo všetkých šírkach */}
        <div className="tech-hero__video" aria-hidden>
          {/* opláštenie kopíruje skrolovanie — nahrávka je skrátená presne
              po okamih, kde je skrinka hotová */}
          <VideoNaScroll
            src="/video/technologia-hero.mp4"
            srcSpat="/video/technologia-hero-rev.mp4"
            poster="/technologia/technologia-hero-poster.webp"
            className="tech-hero__video-el"
          />
        </div>
        <div className="wrap tech-hero__crumb">
          <Drobcek cesta={[{ nazov: k.drobcek }]} jazyk={jazyk} />
        </div>
        <div className="wrap tech-hero__grid">
          <div className="construct__copy tech-hero__copy" data-reveal="left">
            {/* Rovnako ako na skrinkách a akváriách: na telefóne stojí drobček
                nad záberom, od notebooku ide do textového bloku nad titulok.
                Vždy je viditeľný práve jeden. */}
            <div className="tech-hero__crumb tech-hero__crumb--v-texte">
              <Drobcek cesta={[{ nazov: k.drobcek }]} jazyk={jazyk} />
            </div>
            {/* rovnaké triedy ako hero skriniek, akvárií a realizácií — jeden
                titulok, jeden perex, jedna dvojica výziev */}
            <h1 className="vhero__title display">
              {k.titul1}
              <sup className="tm">™</sup>
              <br />
              {k.titul2} <em>{k.titulEm}</em>
              <span className="vhero__bodka" aria-hidden>
                .
              </span>
            </h1>
            <p className="vhero__lead">{k.lead}</p>
            <div className="vhero__odkazy">
              <Link href={l("/skrinky")} className="vhero__odkaz">
                <span className="vhero__odkaz-text">{k.ctaSkrinka}</span>
                <span aria-hidden>↗</span>
              </Link>
              <Link href={l("/dopyt")} className="vhero__odkaz vhero__odkaz--tichy">
                <span className="vhero__odkaz-text">{k.ctaDopyt}</span>
                <span aria-hidden>↗</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---- ČÍSLA ---- */}
      <section className="tech-stats" id="cisla">
        {/* na telefóne pás po jednom údaji, posúva sa sám */}
        <PasKarusel className="wrap tech-stats__grid" interval={3000}>
          {k.cisla.map(([hodnota, unit, label], i) => (
            (() => {
              const s = { to: Number(hodnota), unit, label };
              return (
            <div
              key={s.label}
              className="tech-stat"
              data-reveal
              style={{ "--rd": `${i * 80}ms` } as CSSProperties}
            >
              {/* ikona len na telefóne — karta má rovnakú stavbu ako fakty pod hero na Akváriách */}
              <span className="tech-stat__ikona" aria-hidden>
                {CISLA_IKONY[i]}
              </span>
              <span className="tech-stat__text">
                <span className="tech-stat__n">
                  <CountUp to={s.to} />
                  <small>{s.unit}</small>
                </span>
                <span className="tech-stat__label">{s.label}</span>
              </span>
            </div>
              );
            })()
          ))}
        </PasKarusel>
      </section>

      {/* ---- 360° MODEL ---- */}
      <section className="construct section" id="model">
        <div className="wrap construct__grid">
          <div className="construct__showcase" data-reveal="scale">
            <TurntableScroll jazyk={jazyk} />
          </div>
          <div className="construct__copy" data-reveal>
            <span className="construct__eyebrow">
              <span className="construct__eyebrow-rule" />
              {k.modelEyebrow}
            </span>
            <h2 className="construct__title">
              {k.modelTitul1}
              <br />
              <em>{k.modelTitul2}</em>.
            </h2>
            <p className="construct__body">{k.modelText}</p>
          </div>
        </div>
      </section>

      {/* ---- KALKULAČKA ZÁŤAŽE ---- */}
      <section className="tech-calc section" id="kalkulacka">
        <div className="wrap">
          <h2 className="eyebrow tech-heading" data-reveal="fade">
            {k.kalkulackaTitul}
          </h2>
          <p className="tech-lead" data-reveal>
            {k.kalkulackaLead}
          </p>
          <div data-reveal style={{ "--rd": "110ms" } as CSSProperties}>
            <LoadCalc jazyk={jazyk} />
          </div>
        </div>
      </section>

      {/* ---- TIMELINE: ako vzniká ---- */}
      <section className="tech-tl section" id="postup">
        <div className="wrap">
          <h2 className="eyebrow tech-heading" data-reveal="fade">
            {k.postupTitul}
          </h2>
          <p className="tech-lead" data-reveal>
            {k.postupLead}
          </p>
          <div className="tech-tl__track" data-reveal="fade">
            <span className="tech-tl__line" aria-hidden />
            <div className="tech-tl__nodes">
              {STEP_IMGS.map((img, i) => (
                <article
                  key={k.postup[i][0]}
                  className="tech-tl__node"
                  data-reveal
                  style={{ "--rd": `${200 + i * 260}ms` } as CSSProperties}
                >
                  <div className="tech-tl__thumb">
                    <Image
                      src={img}
                      alt={k.postup[i][0]}
                      fill
                      sizes="(max-width: 900px) 40vw, 18vw"
                    />
                  </div>
                  <span className="tech-tl__dot" aria-hidden />
                  <h3>
                    <em>0{i + 1}</em> {k.postup[i][0]}
                  </h3>
                  <p>{k.postup[i][1]}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---- POROVNANIE ---- */}
      <section className="tech-versus section" id="porovnanie">
        <div className="wrap">
          <h2 className="eyebrow tech-heading" data-reveal="fade">
            {k.zlozenieTitul}
          </h2>
          <div className="tech-versus__grid tech-versus__grid--single">
            <div
              className="tech-versus__col tech-versus__col--aq"
              data-reveal
              style={{ "--rd": "120ms" } as CSSProperties}
            >
              <h3>{k.zlozenieNadpis}</h3>
              <ul>
                {k.zlozenie.map(([titul, popis]) => (
                  <li key={titul}>
                    <span className="tech-versus__t">{titul}</span>
                    {popis}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section className="sub__cta section">
        <div className="wrap sub__cta-inner sub__cta-inner--video" data-reveal>
          <div className="sub__cta-media" aria-hidden>
            <PozadieVideo
              src="/video/konstrukcia-cta.mp4"
              poster="/technologia/cta-poster.webp"
              className="sub__cta-video"
            />
          </div>
          <div>
            <h2 className="sub__cta-title">{k.ctaTitul}</h2>
            <p className="sub__cta-body">{k.ctaText}</p>
          </div>
          <div className="sub__cta-actions">
            <Link href={l("/konfigurator")} className="btn-cyan">
              {k.ctaKonfig} <span aria-hidden>→</span>
            </Link>
            <Link href={l("/materialy")} className="btn-outline">
              {k.ctaDekor} <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
