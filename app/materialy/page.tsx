import Drobcek from "../Drobcek";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

export const metadata = {
  title: "Materiály a povrchy | AQUAPRIME",
  description:
    "Precízne materiály. Nadčasové povrchy. Matte black, smoky grey, brushed steel, white stone, walnut wood a clear glass — povrchy testované na vlhkosť aj čas.",
};

const DETAILS = [
  {
    img: "/materialy/detail-ram.webp",
    title: "Oceľová konštrukcia",
    body: "Pevný vnútorný rám navrhnutý pre vysoké a dlhodobé zaťaženie.",
  },
  {
    img: "/materialy/detail-licovanie.webp",
    title: "Presné lícovanie",
    body: "Konštrukcia a opláštenie tvoria čistý celok bez rušivých spojov.",
  },
  {
    img: "/materialy/detail-struktura.webp",
    title: "Materiál podľa vás",
    body: "Od matných povrchov po výrazné drevodekory, zladené s priestorom.",
  },
  {
    img: "/materialy/detail-technika.webp",
    title: "Skrytá technika",
    body: "Priechody pre kabeláž, filtráciu a vybavenie mimo pohľadu.",
  },
];

const QUALITIES = [
  {
    label: "Vlhkostná odolnosť",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M12 3.5c2.9 3.6 5.5 6.7 5.5 9.9a5.5 5.5 0 1 1-11 0c0-3.2 2.6-6.3 5.5-9.9Z" />
        <path d="M9.2 14.5a2.9 2.9 0 0 0 2.6 2.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Stabilita materiálov",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M12 3 5 5.8v5.4c0 4.3 3 8.1 7 9.3 4-1.2 7-5 7-9.3V5.8L12 3Z" />
        <path d="m9 11.6 2.1 2.1L15 9.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Ľahká údržba",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5v4.5l3 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Dlhá životnosť",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M4.5 8.2 12 4l7.5 4.2v7.6L12 20l-7.5-4.2V8.2Z" />
        <path d="M4.5 8.2 12 12.3l7.5-4.1M12 12.3V20" />
      </svg>
    ),
  },
];

const COMBOS = [
  {
    img: "/materialy/kombo-black-walnut.webp",
    a: "Matte Black",
    b: "Walnut Wood",
  },
  {
    img: "/materialy/kombo-grey-steel.webp",
    a: "Smoky Grey",
    b: "Brushed Steel",
  },
  {
    img: "/materialy/kombo-stone-black.webp",
    a: "White Stone",
    b: "Matte Black",
  },
  {
    img: "/materialy/kombo-walnut-grey.webp",
    a: "Walnut Wood",
    b: "Smoky Grey",
  },
  {
    img: "/materialy/kombo-steel-glass.webp",
    a: "Brushed Steel",
    b: "Clear Glass",
  },
];

const INTERIORS = [
  "/materialy/interier-1.webp",
  "/materialy/interier-2.webp",
  "/materialy/interier-3.webp",
  "/materialy/interier-4.webp",
  "/materialy/interier-5.webp",
];

export default function Page() {
  return (
    <main id="main" className="mat">
      {/* ---- HERO ---- */}
      <section className="mat-hero section">
        <div className="mat-hero__bg" aria-hidden>
          <Image
            src="/materialy/hero-bg3.webp"
            alt=""
            fill
            priority
            sizes="100vw"
          />
        </div>
        <span className="mat-hero__side" aria-hidden>
          Materiály
        </span>
        <div className="wrap mat-hero__grid">
          <div className="mat-hero__copy">
            <div className="pg-drobcek" data-reveal="fade">
              <Drobcek cesta={[{ nazov: "Materiály" }]} />
            </div>
            <h1 className="mat-hero__title display" data-reveal>
              Precízne materiály.
              <br />
              <em>Nadčasové</em> povrchy.
            </h1>
            <p
              className="mat-hero__lead"
              data-reveal
              style={{ "--rd": "90ms" } as CSSProperties}
            >
              Každý materiál je starostlivo vybraný pre svoju odolnosť, krásu
              a schopnosť podčiarknuť minimalistický dizajn našich skriniek.
              Povrchy, ktoré pôsobia luxusne – dnes aj o desať rokov.
            </p>
            <p
              className="mat-hero__badge"
              data-reveal
              style={{ "--rd": "140ms" } as CSSProperties}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                aria-hidden
              >
                <path d="M12 3 4.5 7.3v8.6L12 20.2l7.5-4.3V7.3L12 3Z" />
                <path d="M12 8.4v7.2M8.9 10.2l6.2 3.6M15.1 10.2l-6.2 3.6" />
              </svg>
              Navrhnuté na Slovensku
            </p>
            <aside
              className="mat-hero__philosophy"
              data-reveal
              style={{ "--rd": "190ms" } as CSSProperties}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                aria-hidden
              >
                <path d="M3 8.5c2.2-1.8 4.3-1.8 6.5 0s4.3 1.8 6.5 0 3.7-1.6 5 0M3 13c2.2-1.8 4.3-1.8 6.5 0s4.3 1.8 6.5 0 3.7-1.6 5 0M3 17.5c2.2-1.8 4.3-1.8 6.5 0s4.3 1.8 6.5 0 3.7-1.6 5 0" strokeLinecap="round" />
              </svg>
              <div>
                <strong>Naša filozofia</strong>
                <p>
                  Veríme, že dokonalé akvárium si zaslúži rovnako dokonalý
                  základ. Prepájame technickú precíznosť s prírodnými
                  materiálmi a vytvárame tak skrinky, ktoré sú funkčné,
                  odolné a vizuálne harmonické.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ---- PANEL: detaily / kombinácie / interiér ---- */}
      <div className="wrap">
        <div className="mat-panel">
          {/* Detaily, ktoré rozhodujú */}
          <section className="mat-details">
            <h2 className="eyebrow mat-panel__heading" data-reveal="fade">
              Detaily, ktoré nesú celok
            </h2>
            <div className="mat-details__grid">
              {DETAILS.map((d, i) => (
                <article
                  key={d.title}
                  className="mat-detail"
                  data-reveal
                  style={{ "--rd": `${i * 70}ms` } as CSSProperties}
                >
                  <Image
                    src={d.img}
                    alt={d.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 16vw"
                  />
                  <div className="mat-detail__cap">
                    <h3>{d.title}</h3>
                    <p>{d.body}</p>
                  </div>
                </article>
              ))}
              <aside
                className="mat-quality"
                data-reveal
                style={{ "--rd": "280ms" } as CSSProperties}
              >
                <div className="mat-quality__copy">
                  <h3 className="eyebrow">Odolnosť a kvalita</h3>
                  <p>
                    Materiály testované na vlhkosť, teplotné zmeny
                    a každodenné používanie. Vyrobené tak, aby vydržali.
                  </p>
                  <ul>
                    {QUALITIES.map((q) => (
                      <li key={q.label}>
                        <span className="mat-quality__icon">{q.icon}</span>
                        {q.label}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mat-quality__img" aria-hidden>
                  <Image
                    src="/materialy/kvapka.webp"
                    alt=""
                    fill
                    sizes="(max-width: 982px) 100vw, 20vw"
                  />
                </div>
              </aside>
            </div>
          </section>

          {/* Kombinácie, ktoré ladia */}
          <section className="mat-combos">
            <div className="mat-combos__intro" data-reveal="left">
              <h2 className="eyebrow mat-panel__heading">
                Kombinácie, ktoré ladia
              </h2>
              <p>
                Premyslené párovanie materiálov vytvára harmóniu, ktorá
                podčiarkne váš interiér.
              </p>
              <Link href="/realizacie" className="btn-outline mat-combos__cta">
                Inšpirácie <span aria-hidden>→</span>
              </Link>
            </div>
            <div className="mat-combos__grid">
              {COMBOS.map((c, i) => (
                <article
                  key={c.a + c.b}
                  className="mat-combo"
                  data-reveal
                  style={{ "--rd": `${i * 70}ms` } as CSSProperties}
                >
                  <div className="mat-combo__img">
                    <Image
                      src={c.img}
                      alt={`Kombinácia materiálov ${c.a} a ${c.b}`}
                      fill
                      sizes="(max-width: 768px) 50vw, 14vw"
                    />
                  </div>
                  <h3>
                    {c.a}
                    <span>+ {c.b}</span>
                  </h3>
                </article>
              ))}
            </div>
          </section>

          {/* Aplikácie v interiéri */}
          <section className="mat-interiors">
            <div className="mat-interiors__intro" data-reveal="left">
              <h2 className="eyebrow mat-panel__heading">
                Aplikácie v interiéri
              </h2>
              <p>
                Pozrite si, ako materiály ožívajú v skutočných realizáciách
                a rôznych štýloch interiéru.
              </p>
              <Link href="/realizacie" className="mat-interiors__link">
                Zobraziť realizácie <span aria-hidden>→</span>
              </Link>
            </div>
            <div className="mat-interiors__strip" data-reveal>
              {INTERIORS.map((src, i) => (
                <div key={src} className="mat-interiors__item">
                  <Image
                    src={src}
                    alt={`Materiály AQUAPRIME v interiéri — realizácia ${i + 1}`}
                    fill
                    sizes="(max-width: 768px) 72vw, 15vw"
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
