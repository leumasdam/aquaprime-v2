import Image from "next/image";
import Link from "next/link";
import CatalogGrid from "../CatalogGrid";
import Drobcek from "../Drobcek";
import Fakty from "./Fakty";

export const metadata = {
  title: "Skrinky pod akváriá — katalóg | AQUAPRIME",
  description:
    "Akvarijné skrinky AQUAPRIME s oceľovým rámom 30 × 30 × 2 mm. Tri rady — Basic, Štandard a Premium — rozmery od 80 do 200 cm, dekory na výber.",
};

export default function SkrinkyPage() {
  return (
    <main className="catalog">
      {/* hero s fotkou — text centrovaný nad skrinkou */}
      <section className="cat-hero cat-hero--interier">
        {/* široký interiér pre desktop */}
        <div className="cat-hero__bg" aria-hidden>
          <Image
            src="/skrinky/skrinky-hero-7.webp"
            alt=""
            fill
            priority
            sizes="100vw"
          />
        </div>
        {/* zvislý tmavý render pre mobil — text sadá do tmy nad skrinkou */}
        <div className="cat-hero__bg cat-hero__bg--m" aria-hidden>
          <Image
            src="/skrinky/skrinky-hero-mobil.webp"
            alt=""
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="wrap cat-hero__content">
          <div className="cat-hero__crumb" data-reveal="fade">
            <Drobcek cesta={[{ nazov: "Skrinky" }]} />
          </div>
          <h1 className="cat-hero__title display" data-reveal>
            Pevnosť ocele.
            <br />
            Krásny dizajn.
          </h1>
          <p
            className="cat-hero__lead"
            data-reveal
            style={{ "--rd": "90ms" } as React.CSSProperties}
          >
            Oceľové rámy, ktoré unesú aj tie najväčšie akváriá.
          </p>
          <a
            href="#katalog"
            className="cat-hero__odkaz"
            data-reveal
            style={{ "--rd": "140ms" } as React.CSSProperties}
          >
            Prezrieť kolekcie <span aria-hidden>↓</span>
          </a>
        </div>
        <a href="#katalog" className="cat-hero__cue" aria-label="Prejsť na katalóg">
          <span aria-hidden>⌄</span>
        </a>
      </section>

      <Fakty />

      {/* produktová mriežka s interaktívnym filtrom */}
      <section className="section" id="katalog">
        <div className="wrap">
          <div className="catalog__subhead">
            <h2 className="catalog__h2">Katalóg skriniek</h2>
            <p className="catalog__sublead">
              Rady sa líšia mierou opláštenia — konštrukcia pod nimi je vždy
              rovnaká: zváraný oceľový rám. Konečný rozmer, dekor aj detaily
              doladíme podľa vášho akvária.
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
              Odolné kolieska a kontrola roviny pri montáži.
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
