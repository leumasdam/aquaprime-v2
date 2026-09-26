import Image from "next/image";
import Link from "next/link";
import Drobcek from "../Drobcek";
import DopytForm from "../DopytForm";
import CountUp from "../CountUp";
import LoadCalc from "../LoadCalc";
import { odkaz, type Jazyk } from "../jazyk";
import type { Slovnik } from "../preklady";


/* Poradie stránky = cesta zákazníka:
   1. formulár (hlavná akcia) s tromi krokmi vedľa
   2. pás čísel (dôvera)
   3. kalkulačka záťaže — pomôcka, ktorá rozmery pošle rovno do formulára
   4. reálne realizácie (dôkaz)
   5. iné cesty + časté otázky (pochybnosti) */


/* Fakty s počítadlom ako na /technologia — čísla nabehnú, keď sa dostanú do záberu. */

/* Reálne fotky z realizácií — nie rendery; popisky sú v slovníku. */
const REAL_IMGS = [
  "/realizacie/galeria/antracit.webp",
  "/realizacie/galeria/dubovy-interier.webp",
  "/realizacie/galeria/biela-hotova.webp",
  "/realizacie/galeria/biela-montaz.webp",
];


export default function DopytObsah({ t, jazyk }: { t: Slovnik; jazyk: Jazyk }) {
  const d = t.dopyt;
  const l = (h: string) => odkaz(h, jazyk);
  const ALT = [d.altAntracit, d.altDub, d.altBiela, d.altMontaz];
  return (
    <main className="sub dopyt-page" style={{ ["--accent" as string]: "var(--cyan)" }}>
      {/* ===== 1. HLAVIČKA — kroky vľavo, formulár vpravo, reálny záber za tým ===== */}
      <section className="dopyt-head">
        <div className="dopyt-head__bg" aria-hidden>
          <Image
            src="/img/hero-room.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="dopyt-head__img"
          />
        </div>
        <div className="wrap dopyt__layout">
          <div className="dopyt__intro">
            <div className="pg-drobcek" data-reveal="fade">
              <Drobcek cesta={[{ nazov: d.drobcek }]} jazyk={jazyk} />
            </div>
            <span className="eyebrow eyebrow--rule dopyt-head__eyebrow" data-reveal="fade">
              {d.eyebrow}
            </span>
            <h1 className="sub__title" data-reveal>
              {d.titul}
            </h1>
            <p className="sub__lead" data-reveal style={{ ["--rd" as string]: "90ms" }}>
              {d.lead}
            </p>

            <ol className="dopyt-steps" data-reveal style={{ ["--rd" as string]: "160ms" }}>
              {d.kroky.map(([titul, popis], i) => (
                <li className="dopyt-step" key={titul}>
                  <span className="dopyt-step__n">{`0${i + 1}`}</span>
                  <div>
                    <strong className="dopyt-step__t">{titul}</strong>
                    <p className="dopyt-step__b">{popis}</p>
                  </div>
                </li>
              ))}
            </ol>

            <p className="dopyt-head__hint" data-reveal style={{ ["--rd" as string]: "220ms" }}>
              {d.napoveda1} <a href="#kalkulacka">{d.napovedaOdkaz}</a>{" "}
              {d.napoveda2}
            </p>
          </div>

          <div className="dopyt__panel" data-reveal style={{ ["--rd" as string]: "120ms" }}>
            <DopytForm jazyk={jazyk} />
          </div>
        </div>
      </section>

      {/* ===== 2. ČÍSLA ===== */}
      <section className="dopyt-band">
        <ul className="wrap dopyt-fakty">
          {d.fakty.map(([hodnota, unit, label], i) => (
            <li key={label} data-reveal style={{ ["--rd" as string]: `${i * 80}ms` }}>
              <b>
                {/^\d+$/.test(hodnota) ? <CountUp to={Number(hodnota)} /> : hodnota}
                {unit && <small> {unit}</small>}
              </b>
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ===== 3. KALKULAČKA ZÁŤAŽE ===== */}
      <section className="dopyt-calc section" id="kalkulacka">
        <div className="wrap">
          <div className="dopyt-sec__head" data-reveal>
            <span className="eyebrow eyebrow--rule">{d.kalkulackaEyebrow}</span>
            <h2 className="dopyt-sec__title">{d.kalkulackaTitul}</h2>
            <p className="dopyt-sec__lead">
              {d.kalkulackaLead}
            </p>
          </div>
          <div data-reveal style={{ ["--rd" as string]: "110ms" }}>
            <LoadCalc naDopyt jazyk={jazyk} />
          </div>
        </div>
      </section>

      {/* ===== 4. REALIZÁCIE ===== */}
      <section className="dopyt-real section">
        <div className="wrap">
          <div className="dopyt-real__head" data-reveal>
            <div>
              <span className="eyebrow eyebrow--rule">{d.realizacieEyebrow}</span>
              <h2 className="dopyt-sec__title">{d.realizacieTitul}</h2>
            </div>
            <Link href={l("/realizacie")} className="dopyt-real__more">
              {d.realizacieCta} <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="dopyt-real__grid">
            {REAL_IMGS.map((src, i) => (
              <Link
                href={l("/realizacie")}
                className="dopyt-real__item"
                key={src}
                data-reveal="scale"
                style={{ ["--rd" as string]: `${i * 70}ms` }}
              >
                <Image src={src} alt={ALT[i]} fill sizes="(max-width: 767px) 50vw, 25vw" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 5. INÁ CESTA + FAQ ===== */}
      <section className="dopyt-alt section">
        <div className="wrap dopyt-alt__grid">
          <div className="dopyt-alt__cards">
            <Link href={l("/konfigurator")} className="dopyt-alt__card" data-reveal>
              <div className="dopyt-alt__thumb">
                <Image src="/img/cabinet.webp" alt={d.altKonfig} fill sizes="220px" />
              </div>
              <div className="dopyt-alt__body">
                <span className="dopyt-alt__tag">{d.konfigTag}</span>
                <strong className="dopyt-alt__t">{d.konfigTitul}</strong>
                <p className="dopyt-alt__b">{d.konfigText}</p>
                <span className="dopyt-alt__link">
                  {d.konfigCta} <span aria-hidden>→</span>
                </span>
              </div>
            </Link>
            <div className="dopyt-alt__card dopyt-alt__card--kontakt" data-reveal style={{ ["--rd" as string]: "90ms" }}>
              <div className="dopyt-alt__body">
                <span className="dopyt-alt__tag">{d.napisatTag}</span>
                <strong className="dopyt-alt__t">{d.napisatTitul}</strong>
                <p className="dopyt-alt__b">{d.napisatText}</p>
                <a href="mailto:patrikranda225@gmail.com" className="dopyt-alt__mail">
                  patrikranda225@gmail.com
                </a>
                <Link href={l("/kontakt")} className="dopyt-alt__link">
                  {d.napisatCta} <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="dopyt-faq" data-reveal style={{ ["--rd" as string]: "140ms" }}>
            <span className="eyebrow eyebrow--rule">{d.faqEyebrow}</span>
            <h2 className="dopyt-sec__title dopyt-faq__title">{d.faqTitul}</h2>
            {d.faq.map(([otazka, odpoved]) => (
              <details className="dopyt-faq__item" key={otazka}>
                <summary>
                  {otazka}
                  <span className="dopyt-faq__plus" aria-hidden />
                </summary>
                <p>{odpoved}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
