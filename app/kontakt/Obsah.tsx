import Link from "next/link";
import KontaktForm from "../KontaktForm";
import Drobcek from "../Drobcek";
import { AquaFishMark } from "../brand";
import { odkaz, type Jazyk } from "../jazyk";
import type { Slovnik } from "../preklady";
import "./kontakt.css";


const KANALY = [
  {
    title: "ahoj@aquaprime.sk",
    href: "mailto:ahoj@aquaprime.sk",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
        <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
        <path d="m3.6 6.5 8.4 6 8.4-6" strokeLinecap="round" />
      </svg>
    ),
  },
];
/* TELEFÓN a SHOWROOM: karty doplniť až po dodaní skutočných údajov klientom —
   vzorové číslo a neurčitý showroom sa nezverejňujú (audit 11. 9. 2026). */



export default function KontaktObsah({ t, jazyk }: { t: Slovnik; jazyk: Jazyk }) {
  const k = t.kontakt;
  return (
    <main className="sub kontakt" style={{ ["--accent" as string]: "var(--cyan)" }}>
      {/* živá voda — ambientná vrstva pod obsahom: plávajúce rybky (brand
          mark), svetlo cez vodu a stúpajúce bublinky. Čisté CSS, žiadny JS. */}
      <div className="kvoda" aria-hidden>
        <span className="kvoda__svetlo kvoda__svetlo--a" />
        <span className="kvoda__svetlo kvoda__svetlo--b" />
        <span className="kvoda__ryba kvoda__ryba--daleka">
          <AquaFishMark />
        </span>
        <span className="kvoda__ryba kvoda__ryba--blizka">
          <AquaFishMark />
        </span>
        {[...Array(6)].map((_, i) => (
          <span key={i} className="kvoda__bublina" style={{ ["--b" as string]: i }} />
        ))}
      </div>

      <section className="kontakt__head">
        <div className="sub__head-glow" />
        <div className="wrap">
          <div className="kontakt__crumb" data-reveal="fade">
            <Drobcek cesta={[{ nazov: k.drobcek }]} jazyk={jazyk} />
          </div>
          <span className="eyebrow eyebrow--rule" data-reveal="fade">
            {k.eyebrow}
          </span>
          <h1 className="kontakt__title" data-reveal>
            {k.titul}
          </h1>
          <p className="kontakt__lead" data-reveal style={{ ["--rd" as string]: "90ms" }}>
            {k.lead}
          </p>
        </div>
      </section>

      {/* Všetko ďalej stojí na jednom 12-stĺpcovom gride s jednou medzerou,
          takže karty, formulár aj otázky sedia na tie isté zvislé osi. */}
      <div className="wrap kontakt__grid" id="formular">
        {KANALY.map((c) => (
          <a href={c.href} key={c.title} className="kcard kontakt__ch" data-reveal>
            <span className="kontakt__ch-icon" aria-hidden>
              {c.icon}
            </span>
            <span className="kontakt__ch-tag">{k.emailTag}</span>
            <span className="kontakt__ch-title">{c.title}</span>
            <span className="kontakt__ch-body">{k.emailPozn}</span>
          </a>
        ))}

        <div className="kcard kontakt__formcard" data-reveal>
          <KontaktForm jazyk={jazyk} />
        </div>

        <aside className="kontakt__rail">
          <div className="kcard">
            <h2 className="kontakt__rail-title">{k.railTitul}</h2>
            <ol className="kontakt__steps">
              {k.kroky.map(([titul, popis]) => (
                <li key={titul}>
                  <strong>{titul}</strong>
                  {popis}
                </li>
              ))}
            </ol>
          </div>

          <div className="kcard kontakt__meta">
            <div>
              <span>{k.metaOtazka}</span>
              <Link href={odkaz("/konfigurator", jazyk)}>{k.metaOdkaz}</Link>{" "}
              {k.metaZvysok}
            </div>
          </div>
        </aside>

        <section className="kontakt__faq">
          <h2 className="kontakt__faq-title" data-reveal>
            {k.faqTitul}
          </h2>
          <div className="kontakt__faq-grid">
            {k.faq.map(([otazka, odpoved]) => (
              <details key={otazka} className="kcard kontakt__faq-item" data-reveal>
                <summary>
                  {otazka}
                  <span aria-hidden />
                </summary>
                <p>{odpoved}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
