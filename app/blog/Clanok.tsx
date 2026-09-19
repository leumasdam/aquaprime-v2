import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import Drobcek from "../Drobcek";
import { SK } from "../preklady";
import { KATEGORIE, datumSk, type Clanok as TypClanok } from "./clanky";
import "./blog.css";

const BASE = "https://aquaprime.sk";

/**
 * Detail článku: hlavička s fotkou, vľavo lepkavá osnova, text, FAQ,
 * výzva na konfigurátor a súvisiace články. Štruktúrované dáta
 * (BlogPosting + BreadcrumbList + FAQPage) idú do jedného skriptu.
 */
export default function Clanok({ c, suvisiace }: { c: TypClanok; suvisiace: TypClanok[] }) {
  const t = SK.blog;
  const kat = KATEGORIE[c.category]?.sk ?? c.category;

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${BASE}/blog/${c.slug}#clanok`,
        headline: c.title,
        description: c.description,
        image: `${BASE}${c.cover}`,
        datePublished: c.date,
        dateModified: c.date,
        inLanguage: "sk-SK",
        wordCount: c.slova,
        keywords: c.keywords.join(", "),
        articleSection: kat,
        mainEntityOfPage: `${BASE}/blog/${c.slug}`,
        author: { "@type": "Organization", name: "AQUAPRIME", url: BASE },
        publisher: {
          "@type": "Organization",
          name: "AQUAPRIME",
          url: BASE,
          logo: { "@type": "ImageObject", url: `${BASE}/icon.svg` },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Domov", item: BASE },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE}/blog` },
          { "@type": "ListItem", position: 3, name: c.title, item: `${BASE}/blog/${c.slug}` },
        ],
      },
      ...(c.faq.length
        ? [
            {
              "@type": "FAQPage",
              mainEntity: c.faq.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <main id="main" className="sub blog clanok" style={{ "--accent": "var(--cyan)" } as CSSProperties}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      <header className="clanok__head section">
        <div className="sub__head-glow" />
        <div className="wrap clanok__head-in">
          <div className="pg-drobcek" data-reveal="fade">
            <Drobcek cesta={[{ nazov: t.drobcek, href: "/blog" }, { nazov: kat }]} jazyk="sk" />
          </div>
          <span className="blog-card__meta clanok__meta" data-reveal="fade">
            <span className="blog-card__kat">{kat}</span>
            <span>{datumSk(c.date)}</span>
            <span>
              {c.minut} {t.citanie}
            </span>
          </span>
          <h1 className="clanok__title" data-reveal>
            {c.title}
          </h1>
          <p className="clanok__lead" data-reveal style={{ "--rd": "90ms" } as CSSProperties}>
            {c.description}
          </p>
        </div>
        <div className="wrap">
          <div className="clanok__cover" data-reveal="scale">
            <Image src={c.cover} alt={c.coverAlt} fill priority sizes="(max-width: 900px) 92vw, 1200px" />
          </div>
        </div>
      </header>

      <div className="wrap clanok__grid">
        <aside className="clanok__bok">
          <div className="clanok__osnova">
            <span className="clanok__osnova-titul">{t.obsah}</span>
            <ol>
              {c.osnova.map((o) => (
                <li key={o.id}>
                  <a href={`#${o.id}`}>{o.text}</a>
                </li>
              ))}
              {c.faq.length > 0 && (
                <li>
                  <a href="#faq">{t.faq}</a>
                </li>
              )}
            </ol>
          </div>
          <div className="clanok__bok-cta">
            <span className="clanok__bok-cta-titul">{t.ctaTitul}</span>
            <Link href="/konfigurator" className="btn-cyan">
              {t.ctaKonfig} <span aria-hidden>→</span>
            </Link>
          </div>
        </aside>

        <article className="clanok__telo">
          <div className="clanok__html" dangerouslySetInnerHTML={{ __html: c.html }} />

          {c.faq.length > 0 && (
            <section className="clanok__faq" id="faq" aria-labelledby="faq-titul">
              <h2 id="faq-titul">{t.faq}</h2>
              <div className="clanok__faq-zoznam">
                {c.faq.map((f) => (
                  <details key={f.q} className="clanok__faq-p">
                    <summary>{f.q}</summary>
                    <p>{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          <p className="clanok__autor">
            {t.autor} · {t.aktualizovane} {datumSk(c.date)}
          </p>
        </article>
      </div>

      <section className="sub__cta section">
        <div className="wrap">
          <div className="sub__cta-inner" data-reveal="scale">
            <div>
              <h2 className="sub__cta-title">{t.ctaTitul}</h2>
              <p className="sub__cta-body">{t.ctaText}</p>
            </div>
            <div className="sub__cta-actions">
              <Link href="/konfigurator" className="btn-cyan">
                {t.ctaKonfig} <span aria-hidden>→</span>
              </Link>
              <Link href="/dopyt" className="btn-outline">
                {t.ctaDopyt} <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {suvisiace.length > 0 && (
        <section className="section blog__mriezka clanok__suvisiace">
          <div className="wrap">
            <div className="clanok__suvisiace-head">
              <h2 className="blog__mriezka-titul">{t.suvisiace}</h2>
              <Link href="/blog" className="clanok__spat">
                {t.spat} <span aria-hidden>→</span>
              </Link>
            </div>
            <div className="blog-grid">
              {suvisiace.map((s, i) => (
                <Link
                  key={s.slug}
                  href={`/blog/${s.slug}`}
                  className="blog-card"
                  data-reveal
                  style={{ "--rd": `${i * 70}ms` } as CSSProperties}
                >
                  <div className="blog-card__media">
                    <Image src={s.cover} alt={s.coverAlt} fill sizes="(max-width: 700px) 92vw, 30vw" />
                  </div>
                  <div className="blog-card__body">
                    <span className="blog-card__meta">
                      <span className="blog-card__kat">{KATEGORIE[s.category]?.sk ?? s.category}</span>
                      <span>
                        {s.minut} {t.citanie}
                      </span>
                    </span>
                    <h3 className="blog-card__title">{s.title}</h3>
                    <span className="blog-card__link">
                      {t.citat} <span aria-hidden>→</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
