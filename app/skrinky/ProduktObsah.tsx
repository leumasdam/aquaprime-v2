import Link from "next/link";
import type { CSSProperties } from "react";
import { PRODUCTS, type Product, type Tier } from "../products";
import { odkaz, podorysText, radText, type Jazyk } from "../jazyk";
import type { Slovnik } from "../preklady";
import ProductGallery from "../ProductGallery";
import ProductCard from "../ProductCard";
import SkrinkaDoKosika from "../SkrinkaDoKosika";
import Drobcek from "../Drobcek";

const ACCENT: Record<Tier, string> = {
  premium: "var(--gold)",
  standard: "var(--cyan)",
  basic: "#8ea9b4",
};

export default function ProduktObsah({
  p,
  t,
  jazyk,
}: {
  p: Product;
  t: Slovnik;
  jazyk: Jazyk;
}) {
  const tp = t.produkt;
  /* popis a vlastnosti sú v dátach po slovensky — na /en ich skladáme
     zo šablóny pre daný rad, aby sa nemuseli duplikovať pri každom modeli */
  const popis =
    jazyk === "sk" ? p.desc : t.spolocne.radPopis[p.tier].replace("{rozmer}", p.dim);
  const vlastnosti = jazyk === "sk" ? p.features : t.spolocne.radVlastnosti[p.tier];
  const l = (h: string) => odkaz(h, jazyk);
  // súvisiace: najprv zvyšok radu, potom ostatné
  const related = [
    ...PRODUCTS.filter((x: Product) => x.tier === p.tier && x.slug !== p.slug),
    ...PRODUCTS.filter((x: Product) => x.tier !== p.tier),
  ].slice(0, 3);

  return (
    <main
      className="sub pdetail"
      style={{ "--accent": ACCENT[p.tier] } as CSSProperties}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: radText(p.name, jazyk),
            description: popis,
            category: "Akvarijné skrinky",
            brand: { "@type": "Brand", name: "AQUAPRIME" },
            image: p.decors[0].images.map(
              (src) => `https://aquaprime.sk${src}`
            ),
          }),
        }}
      />
      <section className="section pdetail__top">
        <div className="sub__head-glow" />
        <div className="wrap">
          <div data-reveal="fade">
            <Drobcek
              cesta={[{ nazov: tp.drobcek, href: l("/skrinky") }, { nazov: radText(p.name, jazyk) }]}
            jazyk={jazyk}
            />
          </div>
          <div className="pdetail__grid">
            {/* key: pri prechode na iný produkt sa galéria založí nanovo (dekor, fotka, LED) */}
            <ProductGallery key={p.slug} p={p} jazyk={jazyk} />
            <div
              className="pdetail__info"
              data-reveal="left"
              style={{ "--rd": "80ms" } as CSSProperties}
            >
              <span className="pdetail__coll">
                {radText(p.tierLabel, jazyk)} —{" "}
                {t.spolocne.radPoznamky[p.tier]}
              </span>
              <h1 className="pdetail__name">{radText(p.name, jazyk)}</h1>
              <div className="pdetail__price">
                {tp.cena} {p.price}
                {p.priceLed && (
                  <span className="pdetail__price-led">
                    {tp.sLed} {p.priceLed}
                  </span>
                )}
              </div>
              <p className="pdetail__desc">{popis}</p>
              <dl className="pdetail__specs">
                <div>
                  <dt>{tp.rozmer}</dt>
                  <dd>{p.dim}</dd>
                </div>
                <div>
                  <dt>{tp.podorys}</dt>
                  <dd>{podorysText(p.aquarium, jazyk)}</dd>
                </div>
                <div>
                  <dt>{tp.vyhotovenie}</dt>
                  <dd>{t.spolocne.radPoznamky[p.tier]}</dd>
                </div>
                <div>
                  <dt>{tp.ram}</dt>
                  <dd>{tp.ramHodnota}</dd>
                </div>
                <div>
                  <dt>{tp.nozicky}</dt>
                  <dd>{tp.nozickyHodnota}</dd>
                </div>
              </dl>
              <ul className="pdetail__features">
                {vlastnosti.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <div className="pdetail__actions">
                <SkrinkaDoKosika key={p.slug} p={p} popis={tp.doKosika} jazyk={jazyk} />
                <Link href={l("/dopyt")} className="btn-outline">
                  {tp.opytatSa} <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sub__cards section">
        <div className="wrap">
          <h2 className="sub__cards-title" data-reveal>
            {tp.suvisiace}
          </h2>
          <div className="product-grid">
            {related.map((r, i) => (
              <ProductCard key={r.slug} p={r} reveal delay={i * 80} jazyk={jazyk} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
