import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import Drobcek from "../Drobcek";
import { odkaz, type Jazyk } from "../jazyk";
import { SLOVNIKY } from "../preklady";
import { KATEGORIE, datumSk, type Clanok } from "./clanky";
import "./blog.css";

/**
 * Zoznam článkov. Prvý (najnovší) je veľký, ostatné v mriežke.
 * Články sú zatiaľ len po slovensky — anglická verzia ukazuje ten istý
 * zoznam s anglickým rámom a poznámkou, odkazy vedú na slovenský text.
 */
export default function BlogZoznam({ clanky, jazyk = "sk" }: { clanky: Clanok[]; jazyk?: Jazyk }) {
  const t = SLOVNIKY[jazyk].blog;
  const [prvy, ...dalsie] = clanky;
  const href = (c: Clanok) => `/blog/${c.slug}`;
  const kat = (c: Clanok) => KATEGORIE[c.category]?.[jazyk] ?? c.category;

  return (
    <main id="main" className="sub blog" style={{ "--accent": "var(--cyan)" } as CSSProperties}>
      <section className="sub__head section">
        <div className="sub__head-glow" />
        <div className="wrap">
          <div className="pg-drobcek" data-reveal="fade">
            <Drobcek cesta={[{ nazov: t.drobcek }]} jazyk={jazyk} />
          </div>
          <span className="eyebrow eyebrow--rule sub__eyebrow" data-reveal="fade">
            {t.eyebrow}
          </span>
          <h1 className="sub__title" data-reveal>
            {t.titul}
          </h1>
          <p className="sub__lead" data-reveal style={{ "--rd": "90ms" } as CSSProperties}>
            {t.lead}
          </p>
          {t.enPozn && <p className="blog__en-pozn">{t.enPozn}</p>}
        </div>
      </section>

      {prvy && (
        <section className="section blog__hlavny">
          <div className="wrap">
            <Link href={odkaz(href(prvy), "sk")} className="blog-hero" data-reveal="scale">
              <div className="blog-hero__media">
                <Image
                  src={prvy.cover}
                  alt={prvy.coverAlt}
                  fill
                  priority
                  sizes="(max-width: 860px) 92vw, 58vw"
                />
              </div>
              <div className="blog-hero__body">
                <span className="blog-card__meta">
                  <span className="blog-card__kat">{kat(prvy)}</span>
                  <span>{datumSk(prvy.date)}</span>
                  <span>
                    {prvy.minut} {t.citanie}
                  </span>
                </span>
                <h2 className="blog-hero__title">{prvy.title}</h2>
                <p className="blog-hero__text">{prvy.description}</p>
                <span className="blog-card__link">
                  {t.citat} <span aria-hidden>→</span>
                </span>
              </div>
            </Link>
          </div>
        </section>
      )}

      <section className="section blog__mriezka">
        <div className="wrap">
          <h2 className="blog__mriezka-titul" data-reveal="fade">
            {t.vsetky}
          </h2>
          <div className="blog-grid">
            {dalsie.map((c, i) => (
              <Link
                key={c.slug}
                href={odkaz(href(c), "sk")}
                className="blog-card"
                data-reveal
                style={{ "--rd": `${(i % 3) * 70}ms` } as CSSProperties}
              >
                <div className="blog-card__media">
                  <Image src={c.cover} alt={c.coverAlt} fill sizes="(max-width: 700px) 92vw, (max-width: 1100px) 46vw, 30vw" />
                </div>
                <div className="blog-card__body">
                  <span className="blog-card__meta">
                    <span className="blog-card__kat">{kat(c)}</span>
                    <span>
                      {c.minut} {t.citanie}
                    </span>
                  </span>
                  <h3 className="blog-card__title">{c.title}</h3>
                  <p className="blog-card__text">{c.description}</p>
                  <span className="blog-card__link">
                    {t.citat} <span aria-hidden>→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="sub__cta section">
        <div className="wrap">
          <div className="sub__cta-inner" data-reveal="scale">
            <div>
              <h2 className="sub__cta-title">{t.ctaTitul}</h2>
              <p className="sub__cta-body">{t.ctaText}</p>
            </div>
            <div className="sub__cta-actions">
              <Link href={odkaz("/konfigurator", jazyk)} className="btn-cyan">
                {t.ctaKonfig} <span aria-hidden>→</span>
              </Link>
              <Link href={odkaz("/dopyt", jazyk)} className="btn-outline">
                {t.ctaDopyt} <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
