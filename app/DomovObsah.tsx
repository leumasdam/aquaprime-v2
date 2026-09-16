import Link from "next/link";
import { odkaz, type Jazyk } from "./jazyk";
import type { Slovnik } from "./preklady";
import CollectionsCarousel from "./CollectionsCarousel";
import ReviewsCarousel from "./ReviewsCarousel";
import Configurator from "./Configurator";
import HeroFeatures from "./HeroFeatures";
import ProductCard from "./ProductCard";
import { PRODUCTS } from "./products";
import InstagramPas from "./InstagramPas";

// najpredávanejší rozmer podľa klienta: 120 × 40 × 80 (covery v bielej)
const FEATURED_SLUGS = [
  "premium-120x40x80",
  "standard-120x40x80",
  "basic-120x40x80",
];
const FEATURED = FEATURED_SLUGS
  .map((s) => PRODUCTS.find((p) => p.slug === s))
  .filter((p): p is (typeof PRODUCTS)[number] => Boolean(p));



/* Obrázky a odkazy kariet; texty prichádzajú zo slovníka. */
const MODULE_MEDIA = [
  { href: "/materialy", img: "/img/mat-textures.webp", pos: "center" },
  { href: "/technologia", img: "/img/mod-craft.webp", pos: "center" },
  { href: "/realizacie", img: "/img/mod-realizations.webp", pos: "center" },
] as const;


// reálne fotky skriniek (požiadavka klienta) + PREMIUM LED s jeho fotkou
// reálne interiérové fotky skriniek s akváriom (4:3, tmavá atmosféra)
/* Obrázky kolekcií; názvy a popisy prichádzajú zo slovníka. */
const COLLECTION_IMGS: { id: string; img: string; href?: string }[] = [
  { id: "basic", img: "/img/products/kat-basic-v3.webp" },
  { id: "standard", img: "/img/products/kat-standard-v3.webp" },
  { id: "premium", img: "/img/products/kat-premium-v3.webp" },
  {
    id: "led",
    img: "/img/products/led/led-black-matt-zlta-3d-01.webp",
    href: "/skrinky?rad=led#katalog",
  },
];

export default function DomovObsah({ t, jazyk }: { t: Slovnik; jazyk: Jazyk }) {
  const l = (h: string) => odkaz(h, jazyk);
  const d = t.domov;
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="hero" id="hero">
        {/* Úzky pruh v priestore, ktorý hore nad fotkou uvoľnil jej nábeh —
            len na mobile, na desktope tam fotka siaha až pod lištu. */}
        <div className="hero__pruh">
          <span className="hero__pruh-text">{d.pruhText}</span>
          <Link href={l("/kontakt")} className="hero__pruh-odkaz">
            {d.pruhOdkaz} <span aria-hidden>→</span>
          </Link>
        </div>
        <div className="hero__bg2" aria-hidden="true">
          <video
            className="hero__video"
            autoPlay
            muted
            loop
            playsInline
            poster="/img/hero-water-poster.webp"
          >
            <source src="/video/hero-water.webm" type="video/webm" />
            <source src="/video/hero-water.mp4" type="video/mp4" />
          </video>
          <video
            className="hero__video-d"
            autoPlay
            muted
            loop
            playsInline
            poster="/img/hero-water-poster.webp"
          >
            <source src="/video/hero-water.webm" type="video/webm" />
            <source src="/video/hero-water.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="hero__scroll-v" aria-hidden="true">
          <span className="hero__scroll-word">{d.scroll}</span>
          <span className="hero__scroll-line" />
          <span className="hero__scroll-arr">↓</span>
        </div>

        <div className="wrap hero__inner">
          <div className="hero__content">
            <span className="hero__eyebrow">
              <span className="hero__eyebrow-rule" />
              <span className="hero__eyebrow-text hero__eyebrow-text--d">{d.eyebrow}</span>
              <span className="hero__eyebrow-text hero__eyebrow-text--m">{d.eyebrowM}</span>
            </span>
            <h1 className="hero__title">
              {d.titul1}
              <br />
              {/* na telefóne je bodka tyrkysová ako na podstránkach, inde dedí farbu */}
              {d.titul2.replace(/\.$/, "")}
              {d.titul2.endsWith(".") && (
                <span className="hero__bodka" aria-hidden>
                  .
                </span>
              )}
            </h1>
            {/* Dlhý odsek na počítači, krátky na telefóne — CSS ukáže vždy len jeden. */}
            <p className="hero__body hero__body--dlhy">{d.lead}</p>
            <p className="hero__body hero__body--kratky">{d.leadKratky}</p>
            <div className="hero__ctas">
              <a href="#kolekcie" className="hero__btn">
                <span className="hero__btn-label hero__btn-label--d">{d.ctaKolekcie}</span>
                <span className="hero__btn-label hero__btn-label--m">{d.ctaKolekcieM}</span>
                <span className="hero__btn-arr" aria-hidden>
                  ↓
                </span>
              </a>
              <Link href={l("/konfigurator")} className="hero__ghost">
                <svg
                  className="hero__ghost-ico"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M12 3 20.5 7.75 20.5 16.25 12 21 3.5 16.25 3.5 7.75Z" />
                  <path d="M12 12 3.5 7.75" />
                  <path d="M12 12 20.5 7.75" />
                  <path d="M12 12 12 21" />
                </svg>
                <span className="hero__ghost-label hero__ghost-label--d">{d.ctaKonfigurator}</span>
                <span className="hero__ghost-label hero__ghost-label--m">{d.ctaKonfiguratorM}</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="hero__bar">
          <HeroFeatures polozky={d.vlastnosti} />
        </div>
      </section>

      {/* ===== BEZPEČNOSŤ A NOSNOSŤ (rovno pod hero) ===== */}
      <section className="safety section" id="bezpecnost">
        <div className="safety__bg" aria-hidden="true" />
        <div className="wrap safety__grid">
          <div className="safety__text" data-reveal="left">
            <span className="safety__eyebrow">
              <span className="safety__eyebrow-rule" />
              {d.konstrukciaEyebrow}
            </span>
            <h2 className="safety__title">{d.konstrukciaTitul}</h2>
            <p className="safety__body">{d.konstrukciaText}</p>
          </div>
          <div className="safety__stats" data-reveal>
            {d.fakty.map(([hodnota, popis]) => (
              <div className="sstat" key={popis}>
                <span className="sstat__line" />
                <span className="sstat__val">{hodnota}</span>
                <span className="sstat__label">{popis}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== KOLEKCIE — Vyberte si svoju kolekciu ===== */}
      <section className="collections section" id="kolekcie">
        <div className="wrap collections__grid">
          <div className="collections__head" data-reveal="left">
            <span className="eyebrow eyebrow--rule">{d.kolekcieEyebrow}</span>
            <h2 className="collections__title">{d.kolekcieTitul}</h2>
          </div>
          <CollectionsCarousel
            items={COLLECTION_IMGS.map((c, i) => ({
              ...c,
              name: d.kolekcie[i][0],
              sub: d.kolekcie[i][1],
              href: l(c.href ?? `/skrinky?rad=${c.id}#katalog`),
            }))}
            jazyk={jazyk}
          />
        </div>
      </section>

      {/* ===== DÔKAZ KVALITY — obrázkové karty (prekliky na subpages) ===== */}
      <section className="modules section" id="moduly">
        <div className="wrap modules__grid">
          {MODULE_MEDIA.map((m, i) => (
            <Link
              href={l(m.href)}
              className="module"
              key={d.moduly[i].label}
              data-reveal
              style={{ "--rd": `${i * 110}ms` } as React.CSSProperties}
            >
              <span
                className="module__bg"
                style={{
                  backgroundImage: `url(${m.img})`,
                  backgroundPosition: m.pos,
                }}
              />
              <span className="module__shade" />
              <span className="module__content">
                <span className="module__label">{d.moduly[i].label}</span>
                <span className="module__title">{d.moduly[i].title}</span>
                <span className="module__text">{d.moduly[i].body}</span>
                <span className="module__cta">
                  {d.moduly[i].cta} <span aria-hidden>→</span>
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== MINI-KONFIGURÁTOR ===== */}
      <section className="cfg section" id="konfigurator">
        <div className="wrap">
          <div className="cfg__head" data-reveal>
            <span className="cfg__eyebrow">
              <span className="cfg__eyebrow-rule" />
              {d.cfgEyebrow}
            </span>
            <h2 className="cfg__title">{d.cfgTitul}</h2>
            <p className="cfg__lead">{d.cfgLead}</p>
          </div>

          <Configurator jazyk={jazyk} />
        </div>

        {/* LED zapaľovanie: po linke prebehne impulz a postupne zapína body */}
        <div className="wrap construct__steps" data-reveal="fade">
          {d.kroky.map((label, i) => (
            <div
              className="cstep"
              key={label}
              style={{ "--cd": `${120 + i * 260}ms` } as React.CSSProperties}
            >
              <span className="cstep__n">0{i + 1}</span>
              <span className="cstep__label">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS — vybrané kusy z katalógu ===== */}
      <section className="featured section" id="vybrane">
        <div className="wrap">
          <div className="featured__head" data-reveal>
            <div>
              <span className="eyebrow eyebrow--rule">{d.vybraneEyebrow}</span>
              <h2 className="featured__title">{d.vybraneTitul}</h2>
              <p className="featured__lead">{d.vybraneLead}</p>
            </div>
            <Link href={l("/skrinky")} className="featured__all">
              {d.vybraneCta} <span aria-hidden>→</span>
            </Link>
          </div>

          <div className="product-grid featured__grid">
            {FEATURED.map((p, i) => (
              <ProductCard key={p.slug} p={p} reveal delay={i * 90} jazyk={jazyk} />
            ))}
          </div>
        </div>
      </section>


      {/* ===== ĎALŠIE VETVY — akváriá & teráriá + doplnky & technika ===== */}
      <section className="pathways section">
        <div className="wrap">
          <div className="pathways__head" data-reveal>
            <div>
              <div className="pathways__eyebrow">{d.vetvyEyebrow}</div>
              <h2 className="pathways__title">{d.vetvyTitul}</h2>
              <p className="pathways__lead">{d.vetvyLead}</p>
            </div>
          </div>

          <div className="pathways__cards">
            <Link
              href={l("/akvaria")}
              className="pathway pathway--aqua"
              data-reveal
            >
              <div className="pathway__media" />
              <div className="pathway__accent" />
              <div className="pathway__body">
                <div className="pathway__tag">{d.vetvaAkvariaTag}</div>
                <h3 className="pathway__name">{d.vetvaAkvariaTitul}</h3>
                <p className="pathway__desc">{d.vetvaAkvariaText}</p>
                <div className="pathway__foot">
                  <span className="pathway__btn">{d.vetvaAkvariaCta}</span>
                </div>
              </div>
            </Link>

            {/* Technika ešte nie je v ponuke — karta bez prekliku, so štítkom ČOSKORO */}
            <div
              className="pathway pathway--tech pathway--soon"
              data-reveal
              style={{ "--rd": "120ms" } as React.CSSProperties}
              aria-disabled="true"
            >
              <div className="pathway__media" />
              <div className="pathway__accent" />
              <div className="pathway__body">
                <div className="pathway__tag">
                  {d.vetvaTechnikaTag}{" "}
                  <span className="pathway__soon">{d.vetvaTechnikaCoskoro}</span>
                </div>
                <h3 className="pathway__name">{d.vetvaTechnikaTitul}</h3>
                <p className="pathway__desc">{d.vetvaTechnikaText}</p>
                <div className="pathway__foot">
                  <span className="pathway__btn pathway__btn--soon">{d.vetvaTechnikaCta}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== DÔVERA — referencie ===== */}
      <section className="reviews section">
        <div className="wrap reviews__grid">
          <div className="reviews__head" data-reveal="left">
            <span className="eyebrow eyebrow--rule">{d.recenzieEyebrow}</span>
            <h2 className="reviews__title">{d.recenzieTitul}</h2>
            <p className="reviews__intro">{d.recenzieLead}</p>
          </div>
          <ReviewsCarousel reviews={d.recenzie} jazyk={jazyk} />
        </div>
      </section>

      {/* ===== INSTAGRAM — ukážka profilu ===== */}
      <InstagramPas t={t} />

      {/* ===== DOPYT — finálny konverzný blok (zakomentované, neskôr) =====
      <section className="final section">
        <div className="wrap">
          <div className="final__eyebrow" data-reveal="fade">
            DÔVERA A DOPYT
          </div>
          <h2 className="final__title" data-reveal>
            Pred odoslaním dopytu musí klient cítiť pokoj.
          </h2>
          <div className="final__grid final__grid--cta-only" data-reveal style={{ "--rd": "100ms" } as React.CSSProperties}>
            <div className="final-cta">
              <h3 className="final-cta__title">Pošlite rozmery akvária</h3>
              <p className="final-cta__body">
                Navrhneme skrinku, rám, povrch aj technické riešenie podľa
                objemu, štýlu a priestoru.
              </p>
              <Link href="/dopyt" className="btn-cyan">
                DOPYT NA MIERU <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
      */}
    </>
  );
}
