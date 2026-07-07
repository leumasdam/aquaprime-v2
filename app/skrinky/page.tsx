import Link from "next/link";
import CatalogGrid from "../CatalogGrid";
import TierCards from "../TierCards";

export const metadata = {
  title: "Skrinky pod akváriá — katalóg | AQUAPRIME",
  description:
    "Akvarijné skrinky AQUAPRIME s oceľovým rámom 30 × 30 × 2 mm. Tri rady — Basic, Štandard a Premium — rozmery od 80 do 200 cm, dekory na výber.",
};

export default function SkrinkyPage() {
  return (
    <main className="catalog">
      {/* hlavička kategórie */}
      <section className="catalog__head section">
        <div className="wrap">
          <span className="eyebrow eyebrow--rule" data-reveal="fade">
            SKRINKY
          </span>
          <h1 className="catalog__title" data-reveal>
            Skrinky pod akváriá
          </h1>
          <p
            className="catalog__lead"
            data-reveal
            style={{ "--rd": "90ms" } as React.CSSProperties}
          >
            Tri rady konštrukcie — od priznaného oceľového rámu po kompletne
            opláštenú skrinku. Rozmery od 80 do 200 cm, dekory na výber,
            všetko na jednom ráme z ocele 30 × 30 mm.
          </p>
        </div>
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
