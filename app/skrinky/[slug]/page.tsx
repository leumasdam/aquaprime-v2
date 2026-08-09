import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { PRODUCTS, getProduct, type Tier } from "../../products";
import ProductGallery from "../../ProductGallery";
import ProductCard from "../../ProductCard";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return { title: "Skrinka sa nenašla" };
  return {
    title: `${p.name} — skrinka pod akvárium | AQUAPRIME`,
    description: `${p.name} (${p.tierNote.toLowerCase()}): ${p.dim}, pre akvárium ${p.vol}. ${p.desc}`,
  };
}

const ACCENT: Record<Tier, string> = {
  premium: "var(--gold)",
  standard: "var(--cyan)",
  basic: "#8ea9b4",
};

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();
  // súvisiace: najprv zvyšok radu, potom ostatné
  const related = [
    ...PRODUCTS.filter((x) => x.tier === p.tier && x.slug !== p.slug),
    ...PRODUCTS.filter((x) => x.tier !== p.tier),
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
            name: p.name,
            description: p.desc,
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
          <nav className="pdetail__crumb" data-reveal="fade">
            <Link href="/skrinky">Skrinky</Link>
            <span aria-hidden>/</span>
            <em>{p.name}</em>
          </nav>
          <div className="pdetail__grid">
            <ProductGallery p={p} />
            <div
              className="pdetail__info"
              data-reveal="left"
              style={{ "--rd": "80ms" } as CSSProperties}
            >
              <span className="pdetail__coll">
                {p.tierLabel} — {p.tierNote}
              </span>
              <h1 className="pdetail__name">{p.name}</h1>
              <div className="pdetail__price">
                Cena {p.price}
                {p.priceLed && (
                  <span className="pdetail__price-led">
                    s LED podsvietením {p.priceLed}
                  </span>
                )}
              </div>
              <p className="pdetail__desc">{p.desc}</p>
              <dl className="pdetail__specs">
                <div>
                  <dt>Rozmer (Š × H × V)</dt>
                  <dd>{p.dim}</dd>
                </div>
                <div>
                  <dt>Vhodné akvárium</dt>
                  <dd>{p.aquarium}</dd>
                </div>
                <div>
                  <dt>Orientačný objem</dt>
                  <dd>{p.vol}</dd>
                </div>
                <div>
                  <dt>Rám</dt>
                  <dd>oceľ 30 × 30 × 2 mm</dd>
                </div>
              </dl>
              <ul className="pdetail__features">
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <div className="pdetail__actions">
                <Link href="/dopyt" className="btn-cyan">
                  NEZÁVÄZNÝ DOPYT <span aria-hidden>→</span>
                </Link>
                <Link href="/skrinky" className="btn-outline">
                  <span aria-hidden>←</span> Späť na katalóg
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sub__cards section">
        <div className="wrap">
          <h2 className="sub__cards-title" data-reveal>
            Súvisiace skrinky
          </h2>
          <div className="product-grid">
            {related.map((r, i) => (
              <ProductCard key={r.slug} p={r} reveal delay={i * 80} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
