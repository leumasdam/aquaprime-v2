import Image from "next/image";
import Link from "next/link";
import CatalogGrid from "../CatalogGrid";
import TierCards from "../TierCards";

const HERO_FEATURES = [
  {
    label: "Oceľová konštrukcia",
    sub: "30 × 30 mm",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
        <rect x="5" y="5" width="14" height="14" rx="1" />
        <rect x="8.2" y="8.2" width="7.6" height="7.6" rx="0.5" />
      </svg>
    ),
  },
  {
    label: "Prémiové povrchy",
    sub: "7 dekorov na výber",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M4.5 9.5 12 5l7.5 4.5L12 14 4.5 9.5Z" strokeLinejoin="round" />
        <path d="m4.5 14 7.5 4.5L19.5 14" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Testovaná nosnosť",
    sub: "Až 770 kg",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M12 3 5 5.8v5.4c0 4.3 3 8.1 7 9.3 4-1.2 7-5 7-9.3V5.8L12 3Z" strokeLinejoin="round" />
        <path d="m9 11.6 2.1 2.1L15 9.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export const metadata = {
  title: "Skrinky pod akváriá — katalóg | AQUAPRIME",
  description:
    "Akvarijné skrinky AQUAPRIME s oceľovým rámom 30 × 30 × 2 mm. Tri rady — Basic, Štandard a Premium — rozmery od 80 do 200 cm, dekory na výber.",
};

export default function SkrinkyPage() {
  return (
    <main className="catalog">
      {/* hero s fotkou — text centrovaný nad skrinkou */}
      <section className="cat-hero">
        <div className="cat-hero__bg" aria-hidden>
          <Image
            src="/skrinky/skrinky-hero-4.webp"
            alt=""
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="wrap cat-hero__content">
          <span className="cat-hero__eyebrow" data-reveal="fade">
            SKRINKY
          </span>
          <h1 className="cat-hero__title display" data-reveal>
            Skrinky pod akváriá
          </h1>
          <p
            className="cat-hero__lead"
            data-reveal
            style={{ "--rd": "90ms" } as React.CSSProperties}
          >
            Tri rady konštrukcie — od priznaného oceľového rámu po kompletne
            opláštenú skrinku. Rozmery od 80 do 200 cm, dekory na výber,
            všetko na jednom ráme z ocele 30 × 30 mm.
          </p>
          <div
            className="cat-hero__features"
            data-reveal
            style={{ "--rd": "160ms" } as React.CSSProperties}
          >
            {HERO_FEATURES.map((f) => (
              <div key={f.label} className="cat-hero__feature">
                <span className="cat-hero__ficon">{f.icon}</span>
                <span>
                  <b>{f.label}</b>
                  {f.sub}
                </span>
              </div>
            ))}
          </div>
          <div
            className="cat-hero__actions"
            data-reveal
            style={{ "--rd": "220ms" } as React.CSSProperties}
          >
            <a href="#katalog" className="btn-cyan">
              PREZRIEŤ KATALÓG <span aria-hidden>↓</span>
            </a>
            <Link href="/konfigurator" className="construct__link">
              alebo si zostavte vlastnú
            </Link>
          </div>
        </div>
        <a href="#katalog" className="cat-hero__cue" aria-label="Prejsť na katalóg">
          <span aria-hidden>⌄</span>
        </a>
      </section>

      {/* rýchla voľba podľa radu (predvolí filter v katalógu) */}
      <section className="section catalog__collections">
        <div className="wrap">
          <div className="catalog__subhead">
            <h2 className="catalog__h2">Rýchla voľba podľa radu</h2>
            <p className="catalog__sublead">
              Rady sa líšia mierou opláštenia — konštrukcia pod nimi je vždy
              rovnaká: zváraný oceľový rám.
            </p>
          </div>
          <TierCards />
        </div>
      </section>

      {/* produktová mriežka s interaktívnym filtrom */}
      <section className="section" id="katalog">
        <div className="wrap">
          <div className="catalog__subhead">
            <h2 className="catalog__h2">Katalóg skriniek</h2>
            <p className="catalog__sublead">
              Vyfiltrujte rad a šírku. Konečný rozmer, dekor aj detaily
              doladíme podľa vášho akvária — vyrábame na mieru.
            </p>
          </div>
          <CatalogGrid />
        </div>
      </section>

      {/* PREČO OCEĽOVÝ RÁM — podporný blok */}
      <section className="section why-frame">
        <div className="wrap why-frame__grid">
          <div data-reveal="left">
            <span className="eyebrow eyebrow--rule">KONŠTRUKCIA</span>
            <h2 className="why-frame__title">Prečo je oceľový rám dôležitý</h2>
            <p className="why-frame__body">
              Akvárium s objemom v stovkách litrov je extrémna statická záťaž.
              Bežná skrinka ju neunesie bezpečne. Oceľový rám rozloží váhu,
              udrží rovinu skla a chráni techniku aj podlahu.
            </p>
          </div>
          <ul
            className="why-frame__points"
            data-reveal
            style={{ "--rd": "100ms" } as React.CSSProperties}
          >
            <li>
              <strong>Masívny profil</strong>
              Uzavreté oceľové profily 30 × 30 × 2 mm.
            </li>
            <li>
              <strong>Presná rovina</strong>
              Vyrovnanie chráni silikón a sklo nádrže.
            </li>
            <li>
              <strong>Pokoj pri váhe</strong>
              Výškovo nastaviteľné nožičky a kontrola roviny.
            </li>
          </ul>
        </div>
      </section>

      {/* CTA na dopyt alebo detail */}
      <section className="section catalog__cta">
        <div className="wrap catalog__cta-inner" data-reveal>
          <div>
            <h2 className="catalog__cta-title">Neviete, ktorý rozmer zvládne vaše akvárium?</h2>
            <p className="catalog__cta-body">
              Pošlite nám objem a rozmery — navrhneme rám, povrch aj techniku na
              mieru.
            </p>
          </div>
          <div className="catalog__cta-actions">
            <Link href="/dopyt" className="btn-cyan">
              DOPYT NA MIERU <span aria-hidden>→</span>
            </Link>
            <Link href="/" className="btn-outline">
              ← Späť na úvod
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
