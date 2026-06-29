import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

export type SubCard = { tag?: string; title: string; body: string };

export type SubpageProps = {
  eyebrow: string;
  title: string;
  lead: string;
  accent?: string;
  main: {
    label: string;
    title: string;
    body: string;
    points: { t: string; b: string }[];
    ctaLabel: string;
    caHref: string;
  };
  cardsTitle?: string;
  cards: SubCard[];
  cta: { title: string; body: string; href: string; label: string };
  children?: ReactNode;
};

export default function Subpage(p: SubpageProps) {
  return (
    <main
      className="sub"
      style={{ "--accent": p.accent ?? "var(--cyan)" } as CSSProperties}
    >
      <section className="sub__head section">
        <div className="sub__head-glow" />
        <div className="wrap">
          <span className="eyebrow eyebrow--rule sub__eyebrow" data-reveal="fade">
            {p.eyebrow}
          </span>
          <h1 className="sub__title" data-reveal>
            {p.title}
          </h1>
          <p
            className="sub__lead"
            data-reveal
            style={{ "--rd": "90ms" } as CSSProperties}
          >
            {p.lead}
          </p>
        </div>
      </section>

      <section className="sub__main section">
        <div className="wrap sub__main-grid">
          <div className="sub__main-copy" data-reveal="left">
            <span className="sub__main-label">{p.main.label}</span>
            <h2 className="sub__main-title">{p.main.title}</h2>
            <p className="sub__main-body">{p.main.body}</p>
            <Link href={p.main.caHref} className="btn-cyan">
              {p.main.ctaLabel} <span aria-hidden>→</span>
            </Link>
          </div>
          <ul
            className="sub__points"
            data-reveal
            style={{ "--rd": "110ms" } as CSSProperties}
          >
            {p.main.points.map((pt, i) => (
              <li key={i} className="sub__point">
                <span className="sub__point-n">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <strong>{pt.t}</strong>
                  {pt.b}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {p.children}

      <section className="sub__cards section">
        <div className="wrap">
          {p.cardsTitle && (
            <h2 className="sub__cards-title" data-reveal>
              {p.cardsTitle}
            </h2>
          )}
          <div className="sub__cards-grid">
            {p.cards.map((c, i) => (
              <article
                className="sub__card"
                key={i}
                data-reveal
                style={{ "--rd": `${i * 90}ms` } as CSSProperties}
              >
                {c.tag && <span className="sub__card-tag">{c.tag}</span>}
                <h3 className="sub__card-title">{c.title}</h3>
                <p className="sub__card-body">{c.body}</p>
                <span className="sub__card-arrow" aria-hidden>
                  →
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sub__cta section">
        <div className="wrap sub__cta-inner" data-reveal>
          <div>
            <h2 className="sub__cta-title">{p.cta.title}</h2>
            <p className="sub__cta-body">{p.cta.body}</p>
          </div>
          <div className="sub__cta-actions">
            <Link href={p.cta.href} className="btn-cyan">
              {p.cta.label} <span aria-hidden>→</span>
            </Link>
            <Link href="/" className="btn-outline">
              <span aria-hidden>←</span> Domov
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
