import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { PRODUCTS, getProduct } from "../../products";

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
    title: `${p.name} — ${p.collection}`,
    description: `${p.name}: ${p.dim}, nosnosť ${p.load}, objem ${p.vol}. ${p.desc}`,
  };
}

const ACCENT: Record<string, string> = {
  linea: "var(--cyan)",
  prestige: "var(--cyan)",
  signature: "var(--cyan)",
};

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();
  const related = PRODUCTS.filter((x) => x.slug !== p.slug).slice(0, 3);
  const priceNum = p.price.replace(/[^\d]/g, "");

  return (
    <main
      className="sub pdetail"
      style={{ "--accent": ACCENT[p.mod] } as CSSProperties}
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
            ...(priceNum
              ? {
                  offers: {
                    "@type": "Offer",
                    priceCurrency: "EUR",
                    price: priceNum,
                    availability: "https://schema.org/InStock",
                  },
                }
              : {}),
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
            <div
              className={`pdetail__media product__media product__media--${p.mod}`}
              data-reveal="scale"
            >
              <span className="product__badge">{p.collection}</span>
            </div>
            <div
              className="pdetail__info"
              data-reveal="left"
              style={{ "--rd": "80ms" } as CSSProperties}
            >
              <span className="pdetail__coll">{p.collection}</span>
              <h1 className="pdetail__name">{p.name}</h1>
              <div className="pdetail__price">{p.price}</div>
              <p className="pdetail__desc">{p.desc}</p>
              <dl className="pdetail__specs">
                <div>
                  <dt>Rozmer</dt>
                  <dd>{p.dim}</dd>
                </div>
                <div>
                  <dt>Nosnosť</dt>
                  <dd>{p.load}</dd>
                </div>
                <div>
                  <dt>Objem akvária</dt>
                  <dd>{p.vol}</dd>
                </div>
                <div>
                  <dt>Kolekcia</dt>
                  <dd>{p.collection}</dd>
                </div>
              </dl>
              <div className="pdetail__actions">
                <Link href="/dopyt" className="btn-cyan">
                  DOPYT NA MIERU <span aria-hidden>→</span>
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
              <Link
                href={`/skrinky/${r.slug}`}
                className="product"
                key={r.slug}
                data-reveal
                style={{ "--rd": `${i * 80}ms` } as CSSProperties}
              >
                <div className={`product__media product__media--${r.mod}`}>
                  <span className="product__badge">{r.collection}</span>
                </div>
                <div className="product__body">
                  <h3 className="product__name">{r.name}</h3>
                  <div className="product__specs">
                    <span>
                      <i>Rozmer</i>
                      {r.dim}
                    </span>
                    <span>
                      <i>Nosnosť</i>
                      {r.load}
                    </span>
                  </div>
                  <div className="product__foot">
                    <span className="product__price">{r.price}</span>
                    <span className="product__cta">
                      Detail <span aria-hidden>→</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
