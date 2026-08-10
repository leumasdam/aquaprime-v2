import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import {
  AQUARIUMS,
  getAquarium,
  matchingCabinets,
} from "../../aquariums";
import AquariumCard from "../../AquariumCard";
import ProductCard from "../../ProductCard";

export function generateStaticParams() {
  return AQUARIUMS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = getAquarium(slug);
  if (!a) return { title: "Akvárium sa nenašlo" };
  return {
    title: `${a.name} cm (${a.vol}) — akvárium na mieru | AQUAPRIME`,
    description: `${a.name} cm s objemom ${a.vol} z čírého float skla. ${a.lead.slice(0, 110)}…`,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = getAquarium(slug);
  if (!a) notFound();

  const cabinets = matchingCabinets(a);
  // súvisiace nádrže: najbližšie objemom
  const related = AQUARIUMS.filter((x) => x.slug !== a.slug)
    .sort((x, y) => Math.abs(x.liters - a.liters) - Math.abs(y.liters - a.liters))
    .slice(0, 3);

  return (
    <main
      className="sub pdetail"
      style={{ "--accent": "var(--cyan)" } as CSSProperties}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: `${a.name} cm`,
            description: a.lead,
            category: "Akváriá na mieru",
            brand: { "@type": "Brand", name: "AQUAPRIME" },
            material: "Číre float sklo",
            image: [`https://aquaprime.sk${a.cover}`],
          }),
        }}
      />
      <section className="section pdetail__top">
        <div className="sub__head-glow" />
        <div className="wrap">
          <nav className="pdetail__crumb" data-reveal="fade">
            <Link href="/akvaria">Akváriá</Link>
            <span aria-hidden>/</span>
            <em>{a.name}</em>
          </nav>
          <div className="pdetail__grid">
            <div className="pgal pgal--scene" data-reveal="scale">
              <div className="pgal__main">
                <Image
                  src={a.cover}
                  alt={`${a.name} cm — akvárium na mieru z čírého float skla`}
                  fill
                  priority
                  sizes="(max-width: 820px) 92vw, 48vw"
                />
                <span className="product__badge product__badge--aqua">
                  {a.vol}
                </span>
              </div>
              <p className="pgal__note">
                Vizualizácia nádrže — osadenie a aquascape sú ilustračné.
              </p>
            </div>

            <div
              className="pdetail__info"
              data-reveal="left"
              style={{ "--rd": "80ms" } as CSSProperties}
            >
              <span className="pdetail__coll">AKVÁRIUM — výroba na mieru</span>
              <h1 className="pdetail__name">{a.name} cm</h1>
              <div className="pdetail__price">
                {a.price ?? "Cena na dopyt"}
                <span className="pdetail__price-led">
                  {a.price
                    ? "vrátane DPH · nádrž vyrábame na zákazku"
                    : "cenu pripravíme podľa rozmeru a hrúbky skla"}
                </span>
              </div>
              <p className="pdetail__desc">{a.lead}</p>
              <dl className="pdetail__specs">
                <div>
                  <dt>Rozmer (D × Š × V)</dt>
                  <dd>{a.dim}</dd>
                </div>
                <div>
                  <dt>Objem</dt>
                  <dd>{a.vol}</dd>
                </div>
                <div>
                  <dt>Materiál</dt>
                  <dd>číre float sklo{a.glass ? ` ${a.glass} mm` : ""}</dd>
                </div>
                <div>
                  <dt>Farba silikónu</dt>
                  <dd>čierna</dd>
                </div>
                {a.braces && (
                  <div>
                    <dt>Výstuhy</dt>
                    <dd>{a.braces}</dd>
                  </div>
                )}
                <div>
                  <dt>Použitie</dt>
                  <dd>{a.use}</dd>
                </div>
              </dl>
              <ul className="pdetail__features">
                {a.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <div className="pdetail__actions">
                <Link href="/dopyt" className="btn-cyan">
                  NEZÁVÄZNÝ DOPYT <span aria-hidden>→</span>
                </Link>
                <Link href="/akvaria" className="btn-outline">
                  <span aria-hidden>←</span> Späť na katalóg
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* zvyšok popisu od klienta — pod hlavnou zostavou, nech neruší specs */}
      <section className="section pdetail__story">
        <div className="wrap">
          <div className="pdetail__story-inner" data-reveal>
            {a.body.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {cabinets.length === 0 && (
        <section className="section catalog__cta">
          <div className="wrap catalog__cta-inner" data-reveal>
            <div>
              <h2 className="catalog__cta-title">
                Skrinku na tento rozmer vyrobíme na mieru.
              </h2>
              <p className="catalog__cta-body">
                Katalóg skriniek začína na šírke 100 cm — pre {a.w} cm nádrž
                zostavíme rám aj plášť podľa vášho priestoru.
              </p>
            </div>
            <div className="catalog__cta-actions">
              <Link href="/konfigurator" className="btn-cyan">
                ZOSTAVIŤ SKRINKU <span aria-hidden>→</span>
              </Link>
              <Link href="/skrinky" className="btn-outline">
                Pozrieť katalóg skriniek
              </Link>
            </div>
          </div>
        </section>
      )}

      {cabinets.length > 0 && (
        <section className="sub__cards section">
          <div className="wrap">
            <h2 className="sub__cards-title" data-reveal>
              Skrinky pod tento rozmer
            </h2>
            <p className="catalog__sublead" data-reveal>
              Skrinky so šírkou {a.w} cm — váhu nesie zváraný oceľový rám
              30 × 30 × 2 mm.
            </p>
            <div className="product-grid">
              {cabinets.slice(0, 3).map((c, i) => (
                <ProductCard key={c.slug} p={c} reveal delay={i * 80} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="sub__cards section">
        <div className="wrap">
          <h2 className="sub__cards-title" data-reveal>
            Ďalšie nádrže
          </h2>
          <div className="product-grid">
            {related.map((r, i) => (
              <AquariumCard key={r.slug} a={r} reveal delay={i * 80} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
