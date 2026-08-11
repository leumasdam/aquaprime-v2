import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import {
  AQUARIUMS,
  GENERIC_FEATURES,
  GENERIC_LEAD,
  getAquarium,
  matchingCabinets,
} from "../../aquariums";
import AquariumCard from "../../AquariumCard";
import ProductCard from "../../ProductCard";
import DoKosika from "../../DoKosika";
import Drobcek from "../../Drobcek";

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
    description: `${a.name} cm s objemom ${a.vol} z čírého float skla ${a.glass
      .map((g) => `${g.mm} mm`)
      .join(" alebo ")}, cena ${a.priceLabel}. Vyrábame na zákazku.`,
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
            description: a.lead ?? GENERIC_LEAD,
            offers: {
              "@type": "Offer",
              price: a.priceValue,
              priceCurrency: "EUR",
              availability: "https://schema.org/MadeToOrder",
            },
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
          <div data-reveal="fade">
            <Drobcek
              cesta={[{ nazov: "Akváriá", href: "/akvaria" }, { nazov: a.name }]}
            />
          </div>
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
                {a.coverIllustrative && (
                  <span className="pgal__illu" title="Fotka je z iného rozmeru">
                    Ilustračné foto — iný rozmer
                  </span>
                )}
              </div>
              <p className="pgal__note">
                {a.coverIllustrative
                  ? "Ilustračná fotka iného rozmeru — nádrž vyrábame presne v uvedených rozmeroch."
                  : "Vizualizácia nádrže — osadenie a aquascape sú ilustračné."}
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
                {a.priceLabel}
                <span className="pdetail__price-led">
                  {a.glass.length > 1
                    ? `vrátane DPH · ${a.glass
                        .map((g) => `${g.mm} mm ${g.price}`)
                        .join(" · ")}`
                    : "vrátane DPH · nádrž vyrábame na zákazku"}
                </span>
              </div>
              <p className="pdetail__desc">{a.lead ?? GENERIC_LEAD}</p>
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
                  <dt>Hrúbka skla</dt>
                  <dd>{a.glass.map((g) => `${g.mm} mm`).join(" alebo ")}</dd>
                </div>
                <div>
                  <dt>Materiál</dt>
                  <dd>číre float sklo</dd>
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
                {a.use && (
                  <div>
                    <dt>Použitie</dt>
                    <dd>{a.use}</dd>
                  </div>
                )}
              </dl>
              <ul className="pdetail__features">
                {(a.features ?? GENERIC_FEATURES).map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <div className="pdetail__actions">
                <DoKosika
                  polozka={{
                    id: `akvarium-${a.slug}-${a.glass[0].mm}`,
                    druh: "akvarium",
                    slug: a.slug,
                    nazov: `${a.name} cm`,
                    variant: `${a.vol} · sklo ${a.glass[0].mm} mm`,
                    cena: a.priceValue,
                    obrazok: a.cover,
                  }}
                />
                <Link href="/dopyt" className="btn-outline">
                  Nezáväzný dopyt <span aria-hidden>→</span>
                </Link>
              </div>
              {a.glass.length > 1 && (
                <p className="pdetail__note">
                  Do košíka ide verzia so sklom {a.glass[0].mm} mm za{" "}
                  {a.glass[0].price}. Hrubšie sklo ({a.glass[1].mm} mm,{" "}
                  {a.glass[1].price}) doladíme pri potvrdení objednávky.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* zvyšok popisu od klienta — len pri rozmeroch, ku ktorým text dodal */}
      {a.body && a.body.length > 0 && (
        <section className="section pdetail__story">
          <div className="wrap">
            <div className="pdetail__story-inner" data-reveal>
              {a.body.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>
          </div>
        </section>
      )}

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
