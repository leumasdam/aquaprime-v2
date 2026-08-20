import Drobcek from "../Drobcek";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import RealGrid from "./RealGrid";
import RealVidea from "./RealVidea";

export const metadata = {
  title: "Realizácie — priestory, kde dizajn žije | AQUAPRIME",
  description:
    "Realizácie AQUAPRIME v reálnych interiéroch — rezidencie, hotely aj kancelárie. Každá je jedinečným spojením prírody, remesla a architektúry.",
};

const VALUES = [
  {
    t: "Nadčasový dizajn",
    b: "Estetika, ktorá prevrie generácie.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M12 3 4.5 7.3v8.6L12 20.2l7.5-4.3V7.3L12 3Z" />
        <path d="M12 8.4v7.2M8.9 10.2l6.2 3.6M15.1 10.2l-6.2 3.6" />
      </svg>
    ),
  },
  {
    t: "Prírodné materiály",
    b: "Vyberáme len to najlepšie.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M12 20c-4.5-2-7-5.4-7-9.5C5 6.6 8 4 12 4s7 2.6 7 6.5c0 4.1-2.5 7.5-7 9.5Z" />
        <path d="M12 20V9M12 12.5 9 10M12 15l3-2.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    t: "Precízne spracovanie",
    b: "Remeslo v každom detaile.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="m14.5 6.5 3 3L8 19H5v-3l9.5-9.5Z" strokeLinejoin="round" />
        <path d="m12.5 8.5 3 3M16 5l3 3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    t: "Vyrobené na Slovensku",
    b: "Kvalita, na ktorú sa môžete spoľahnúť.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M12 3 5 5.8v5.4c0 4.3 3 8.1 7 9.3 4-1.2 7-5 7-9.3V5.8L12 3Z" strokeLinejoin="round" />
        <path d="m9 11.6 2.1 2.1L15 9.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function Page() {
  return (
    <main id="main" className="real">
      {/* ---- HERO so skalou ---- */}
      <section className="real-hero">
        <span className="real-hero__side" aria-hidden>
          Scroll
        </span>
        <div className="real-hero__rock" aria-hidden>
          <Image
            src="/realizacie/hero-skala.webp"
            alt=""
            fill
            priority
            sizes="(max-width: 900px) 130vw, 60vw"
          />
        </div>
        <div className="wrap real-hero__grid">
          <div className="real-hero__copy">
            <div className="pg-drobcek" data-reveal="fade">
              <Drobcek cesta={[{ nazov: "Realizácie" }]} />
            </div>
            <h1 className="real-hero__title display" data-reveal>
              Priestory,
              <br />
              kde dizajn žije
            </h1>
            <span className="real-hero__rule" aria-hidden />
            <p
              className="real-hero__lead"
              data-reveal
              style={{ "--rd": "110ms" } as CSSProperties}
            >
              Každá realizácia je jedinečným spojením prírody, remesla
              a architektúry.
            </p>
          </div>
        </div>
      </section>

      {/* ---- FILTER + PROJEKTY ---- */}
      <section className="real-projects">
        <RealGrid />
      </section>

      {/* ---- VIDEÁ z prevádzky ---- */}
      <RealVidea />

      {/* ---- HODNOTY ---- */}
      <section className="real-values">
        <div className="wrap real-values__grid">
          {VALUES.map((v, i) => (
            <div
              key={v.t}
              className="real-value"
              data-reveal
              style={{ "--rd": `${i * 80}ms` } as CSSProperties}
            >
              <span className="real-value__icon">{v.icon}</span>
              <span>
                <b>{v.t}</b>
                {v.b}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section className="sub__cta section">
        <div className="wrap sub__cta-inner" data-reveal>
          <div>
            <h2 className="sub__cta-title">Váš priestor môže byť ďalší.</h2>
            <p className="sub__cta-body">
              Pošlite nám pôdorys alebo fotku miesta — navrhneme riešenie na
              mieru vášmu interiéru.
            </p>
          </div>
          <div className="sub__cta-actions">
            <Link href="/dopyt" className="btn-cyan">
              NEZÁVÄZNÝ DOPYT <span aria-hidden>→</span>
            </Link>
            <Link href="/skrinky" className="btn-outline">
              PREZRIEŤ SKRINKY <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
