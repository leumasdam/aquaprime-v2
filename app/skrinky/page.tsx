import Link from "next/link";
import CatalogGrid from "../CatalogGrid";

export const metadata = {
  title: "Skrinky pod akváriá — katalóg | AQUAPRIME",
  description:
    "Akvarijné skrinky AQUAPRIME s oceľovým rámom. Filtrujte podľa rozmeru, nosnosti, povrchu a kolekcie. Linea, Prestige, Signature.",
};

const FILTERS = [
  { label: "Rozmer", opts: "60 · 80 · 100 · 120 · 150 cm" },
  { label: "Nosnosť", opts: "do 350 kg · do 770 kg" },
  { label: "Povrch", opts: "čierna štruktúra · drevo · kov" },
  { label: "Kolekcia", opts: "Linea · Prestige · Signature" },
];

const COLLECTIONS = [
  {
    mod: "linea",
    name: "LINEA",
    sub: "MINIMALISTICKÁ ELEGANCIA",
    note: "Čisté línie, decentný povrch.",
  },
  {
    mod: "prestige",
    name: "PRESTIGE",
    sub: "PRÉMIOVÁ KOLEKCIA",
    note: "Bohatšie dekory a detaily.",
  },
  {
    mod: "signature",
    name: "SIGNATURE",
    sub: "VÝNIMOČNÝ DIZAJN",
    note: "LED akcent a top vyhotovenie.",
  },
];


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
            Rám, nosnosť, rozmery, kolekcie a bezpečnosť — hlavný obsah, ktorý
            rozhoduje o ďalšom kroku. Vyfiltrujte si presne to, čo unesie vaše
            akvárium.
          </p>
        </div>
      </section>

      {/* FILTRE — hlavný obsah (IA: rozmer, nosnosť, povrch, kolekcia) */}
      <section className="section">
        <div className="wrap">
          <div className="filterbar" data-reveal>
            {FILTERS.map((f) => (
              <button className="filter" key={f.label} type="button">
                <span className="filter__label">{f.label}</span>
                <span className="filter__opts">{f.opts}</span>
                <span className="filter__chev" aria-hidden>
                  ⌄
                </span>
              </button>
            ))}
            <button className="filter filter--reset" type="button">
              Vyčistiť
            </button>
          </div>
        </div>
      </section>

      {/* rýchla voľba podľa kolekcie (predvoľby, nie samostatné ciele) */}
      <section className="section catalog__collections">
        <div className="wrap">
          <div className="catalog__subhead">
            <h2 className="catalog__h2">Rýchla voľba podľa kolekcie</h2>
            <p className="catalog__sublead">
              Kolekcie sú len predvoľba filtra — všetky vedú do toho istého
              katalógu, líšia sa štýlom a vyhotovením.
            </p>
          </div>
          <div className="collection-cards">
            {COLLECTIONS.map((c, i) => (
              <a
                key={c.name}
                href="#katalog"
                className={`collection-card collection-card--${c.mod}`}
                data-reveal
                style={{ "--rd": `${i * 100}ms` } as React.CSSProperties}
              >
                <div className="collection-card__text">
                  <div className="collection-card__name">{c.name}</div>
                  <div className="collection-card__sub">{c.sub}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* produktová mriežka s interaktívnym filtrom */}
      <section className="section" id="katalog">
        <div className="wrap">
          <div className="catalog__subhead">
            <h2 className="catalog__h2">Katalóg skriniek</h2>
            <p className="catalog__sublead">
              Vzorové konfigurácie naprieč kolekciami. Konečné rozmery, povrch aj
              nosnosť doladíme podľa vášho akvária.
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
              <strong>Rozložená záťaž</strong>
              Nosnosť až 770 kg na jednu nožičku.
            </li>
            <li>
              <strong>Presná rovina</strong>
              Vyrovnanie chráni silikón a sklo nádrže.
            </li>
            <li>
              <strong>Pokoj pri váhe</strong>
              Certifikované nožičky a kontrola statiky.
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
