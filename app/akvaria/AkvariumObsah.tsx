import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { AQUARIUMS, matchingCabinets, type Aquarium } from "../aquariums";
import { odkaz, type Jazyk } from "../jazyk";
import {
  akvariumNazov,
  akvariumPouzitie,
  akvariumVystuhy,
} from "../aquariums-en";
import type { Slovnik } from "../preklady";
import AquariumCard from "../AquariumCard";
import ProductCard from "../ProductCard";
import DoKosika from "../DoKosika";
import Drobcek from "../Drobcek";
import { VT } from "../vt";

export default function AkvariumObsah({
  a,
  t,
  jazyk,
}: {
  a: Aquarium;
  t: Slovnik;
  jazyk: Jazyk;
}) {
  const ta = t.akvarium;
  const l = (h: string) => odkaz(h, jazyk);
  const nazov = akvariumNazov(a, jazyk);
  const vystuhy = akvariumVystuhy(a, jazyk);
  const pouzitie = akvariumPouzitie(a, jazyk);

  const cabinets = matchingCabinets(a);
  // jednotný vecný popis (audit textov 11. 9. 2026) — dlhé marketingové odseky
  // od klienta sa nezobrazujú, parametre a cena ostávajú samostatne
  const popis = ta.popis.replace("{dim}", a.dim);
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
            name: `${nazov} cm`,
            description: popis,
            offers: {
              "@type": "Offer",
              price: a.priceValue,
              priceCurrency: "EUR",
              availability: "https://schema.org/MadeToOrder",
            },
            category: ta.schemaKategoria,
            brand: { "@type": "Brand", name: "AQUAPRIME" },
            material: ta.schemaMaterial,
            image: [`https://aquaprime.sk${a.cover}`],
          }),
        }}
      />
      <section className="section pdetail__top">
        <div className="sub__head-glow" />
        <div className="wrap">
          <div data-reveal="fade">
            <Drobcek
              cesta={[{ nazov: t.akvaria.drobcek, href: l("/akvaria") }, { nazov }]}
            jazyk={jazyk}
            />
          </div>
          <div className="pdetail__grid">
            <div className="pgal pgal--scene" data-reveal="scale">
              {/* rovnaké meno má karta v katalógu — z nej sa sem premorfuje */}
              <VT name={`a-${a.slug}`} share="vt-morph">
              <div className="pgal__main">
                <Image
                  src={a.cover}
                  alt={`${nazov} cm — ${ta.alt}`}
                  fill
                  priority
                  sizes="(max-width: 820px) 92vw, 48vw"
                />
                <span className="product__badge product__badge--aqua">
                  {a.vol}
                </span>
                {a.coverIllustrative && (
                  <span className="pgal__illu">{ta.ilustracna}</span>
                )}
              </div>
              </VT>
              <p className="pgal__note">
                {a.coverIllustrative ? ta.ilustracnaPozn : ta.vizualizaciaPozn}
              </p>
            </div>

            <div
              className="pdetail__info"
              data-reveal="left"
              style={{ "--rd": "80ms" } as CSSProperties}
            >
              <span className="pdetail__coll">{ta.coll}</span>
              <h1 className="pdetail__name">{nazov} cm</h1>
              <div className="pdetail__price">
                {a.priceLabel}
                <span className="pdetail__price-led">
                  {a.glass.length > 1
                    ? `${ta.dphVarianty} · ${a.glass
                        .map((g) => `${g.mm} mm ${g.price}`)
                        .join(" · ")}`
                    : ta.dph}
                </span>
              </div>
              <p className="pdetail__desc">{popis}</p>
              <dl className="pdetail__specs">
                <div>
                  <dt>{ta.rozmer}</dt>
                  <dd>{a.dim}</dd>
                </div>
                <div>
                  <dt>{ta.objem}</dt>
                  <dd>{a.vol}</dd>
                </div>
                <div>
                  <dt>{ta.sklo}</dt>
                  <dd>{a.glass.map((g) => `${g.mm} mm`).join(` ${ta.aleboSklo} `)}</dd>
                </div>
                <div>
                  <dt>{ta.material}</dt>
                  <dd>{ta.materialHodnota}</dd>
                </div>
                <div>
                  <dt>{ta.silikon}</dt>
                  <dd>{ta.silikonHodnota}</dd>
                </div>
                {vystuhy && (
                  <div>
                    <dt>{ta.vystuhy}</dt>
                    <dd>{vystuhy}</dd>
                  </div>
                )}
                {pouzitie && (
                  <div>
                    <dt>{ta.pouzitie}</dt>
                    <dd>{pouzitie}</dd>
                  </div>
                )}
              </dl>
              <ul className="pdetail__features">
                {ta.vlastnosti.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <p className="pdetail__note">{ta.poznamkaObjem}</p>
              <div className="pdetail__actions">
                <DoKosika
                  popis={ta.doKosika}
                  jazyk={jazyk}
                  polozka={{
                    id: `akvarium-${a.slug}-${a.glass[0].mm}`,
                    druh: "akvarium",
                    slug: a.slug,
                    nazov: `${nazov} cm`,
                    variant: `${a.vol} · sklo ${a.glass[0].mm} mm`,
                    cena: a.priceValue,
                    obrazok: a.cover,
                  }}
                />
                <Link href={l("/dopyt")} className="btn-outline">
                  {ta.dopyt} <span aria-hidden>→</span>
                </Link>
              </div>
              {a.glass.length > 1 && (
                <p className="pdetail__note">
                  {ta.hrubsie
                    .replace("{mm}", String(a.glass[0].mm))
                    .replace("{cena}", a.glass[0].price)
                    .replace("{mm2}", String(a.glass[1].mm))
                    .replace("{cena2}", a.glass[1].price)}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* zvyšok popisu od klienta — len pri rozmeroch, ku ktorým text dodal */}

      {cabinets.length === 0 && (
        <section className="section catalog__cta">
          <div className="wrap catalog__cta-inner" data-reveal>
            <div>
              <h2 className="catalog__cta-title">{ta.naMieruTitul}</h2>
              <p className="catalog__cta-body">
                {ta.naMieruText.replace("{w}", String(a.w))}
              </p>
            </div>
            <div className="catalog__cta-actions">
              <Link href={l("/konfigurator")} className="btn-cyan">
                {ta.naMieruCta} <span aria-hidden>→</span>
              </Link>
              <Link href={l("/skrinky")} className="btn-outline">
                {ta.naMieruKatalog}
              </Link>
            </div>
          </div>
        </section>
      )}

      {cabinets.length > 0 && (
        <section className="sub__cards section">
          <div className="wrap">
            <h2 className="sub__cards-title" data-reveal>
              {ta.skrinkyTitul}
            </h2>
            <p className="catalog__sublead" data-reveal>
              {ta.skrinkyLead.replace("{w}", String(a.w))}{" "}
              <Link href={l("/dopyt")}>{ta.skrinkyOdkaz}</Link>.
            </p>
            <div className="product-grid">
              {cabinets.slice(0, 3).map((c, i) => (
                <ProductCard key={c.slug} p={c} reveal delay={i * 80} jazyk={jazyk} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="sub__cards section">
        <div className="wrap">
          <h2 className="sub__cards-title" data-reveal>
            {ta.dalsie}
          </h2>
          <div className="product-grid">
            {related.map((r, i) => (
              <AquariumCard key={r.slug} a={r} reveal delay={i * 80} jazyk={jazyk} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
