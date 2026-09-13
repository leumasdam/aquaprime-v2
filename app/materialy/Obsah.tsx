import Drobcek from "../Drobcek";
import { dekorNazov, odkaz, type Jazyk } from "../jazyk";
import type { Slovnik } from "../preklady";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";


/* Obrázky detailov; texty prichádzajú zo slovníka. */
const DETAIL_IMGS = [
  "/materialy/detail-ram.webp",
  "/materialy/detail-licovanie.webp",
  "/materialy/detail-struktura.webp",
  "/materialy/detail-technika.webp",
];


const COMBOS = [
  {
    img: "/materialy/kombo-black-walnut.webp",
    a: "Black Matt",
    b: "Orech",
  },
  {
    img: "/materialy/kombo-grey-steel.webp",
    a: "Artisan",
    b: "Antracit",
  },
  {
    img: "/materialy/kombo-stone-black.webp",
    a: "Cool White",
    b: "Black Matt",
  },
  {
    img: "/materialy/kombo-walnut-grey.webp",
    a: "Dub Hunton",
    b: "Black Matt",
  },
  {
    img: "/materialy/kombo-steel-glass.webp",
    a: "Antracit",
    b: "číre sklo",
  },
];

const INTERIORS = [
  "/materialy/interier-1.webp",
  "/materialy/interier-2.webp",
  "/materialy/interier-3.webp",
  "/materialy/interier-4.webp",
  "/materialy/interier-5.webp",
];

export default function MaterialyObsah({ t, jazyk }: { t: Slovnik; jazyk: Jazyk }) {
  const m = t.materialy;
  const l = (h: string) => odkaz(h, jazyk);
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
          {m.bok}
        </span>
        <div className="wrap mat-hero__grid">
          <div className="mat-hero__copy">
            <div className="pg-drobcek" data-reveal="fade">
              <Drobcek cesta={[{ nazov: m.drobcek }]} jazyk={jazyk} />
            </div>
            <h1 className="mat-hero__title display" data-reveal>
              {m.titul1}
              <br />
              {m.titul2} <em>{m.titulEm}</em>.
            </h1>
            <p
              className="mat-hero__lead"
              data-reveal
              style={{ "--rd": "90ms" } as CSSProperties}
            >
              {m.lead}
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
              {m.znacka}
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
                <strong>{m.filozofiaTitul}</strong>
                <p>{m.filozofiaText}</p>
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
              {m.detailyTitul}
            </h2>
            <div className="mat-details__grid">
              {DETAIL_IMGS.map((img, i) => (
                <article
                  key={m.detaily[i][0]}
                  className="mat-detail"
                  data-reveal
                  style={{ "--rd": `${i * 70}ms` } as CSSProperties}
                >
                  <Image
                    src={img}
                    alt={m.detaily[i][0]}
                    fill
                    sizes="(max-width: 768px) 50vw, 16vw"
                  />
                  <div className="mat-detail__cap">
                    <h3>{m.detaily[i][0]}</h3>
                    <p>{m.detaily[i][1]}</p>
                  </div>
                </article>
              ))}
              <aside
                className="mat-quality"
                data-reveal
                style={{ "--rd": "280ms" } as CSSProperties}
              >
                <div className="mat-quality__copy">
                  <h3 className="eyebrow">{m.starostlivostTitul}</h3>
                  <p>{m.starostlivostText}</p>
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
                {m.kombinacieTitul}
              </h2>
              <p>{m.kombinacieText}</p>
              <Link href={l("/skrinky")} className="btn-outline mat-combos__cta">
                {m.kombinacieCta} <span aria-hidden>→</span>
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
                      alt={m.komboAlt
                        .replace("{a}", dekorNazov(c.a, jazyk))
                        .replace("{b}", dekorNazov(c.b, jazyk))}
                      fill
                      sizes="(max-width: 768px) 50vw, 14vw"
                    />
                  </div>
                  <h3>
                    {dekorNazov(c.a, jazyk)}
                    <span>+ {dekorNazov(c.b, jazyk)}</span>
                  </h3>
                </article>
              ))}
            </div>
          </section>

          {/* Aplikácie v interiéri */}
          <section className="mat-interiors">
            <div className="mat-interiors__intro" data-reveal="left">
              <h2 className="eyebrow mat-panel__heading">
                {m.interiereTitul}
              </h2>
              <p>{m.interiereText}</p>
              <Link href={l("/realizacie")} className="mat-interiors__link">
                {m.interiereCta} <span aria-hidden>→</span>
              </Link>
            </div>
            <div className="mat-interiors__strip" data-reveal>
              {INTERIORS.map((src, i) => (
                <div key={src} className="mat-interiors__item">
                  <Image
                    src={src}
                    alt={`${m.interierAlt} ${i + 1}`}
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
