import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import Drobcek from "../Drobcek";
import { odkaz, type Jazyk } from "../jazyk";
import type { Slovnik } from "../preklady";
import type { Set } from "../sety";
import Swatch from "../Swatch";

/**
 * Detail setu: vizuál vľavo, parametre, prevedenia, pre koho a cena vpravo.
 * Rovnaký blok stál pôvodne priamo na stránke Sety, teraz má vlastnú adresu
 * /sety/<id>, na ktorú vedú karty z katalógu.
 */
export default function SetDetail({ set, t, jazyk }: { set: Set; t: Slovnik; jazyk: Jazyk }) {
  const k = t.sety;
  const l = (h: string) => odkaz(h, jazyk);
  return (
    <main className="sub sety" style={{ "--accent": "var(--cyan)" } as CSSProperties}>
      <section className="section sety__detail">
        <div className="sub__head-glow" />
        <div className="wrap">
          <div className="pg-drobcek" data-reveal="fade">
            <Drobcek
              cesta={[{ nazov: k.drobcek, href: l("/sety") }, { nazov: set.nazov }]}
              jazyk={jazyk}
            />
          </div>

          <article className="set" id={set.id} data-reveal>
            <div className="set__media">
              <Image
                src={set.obrazok}
                alt={`${set.nazov} — ${set.podtitul[jazyk]}`}
                fill
                priority
                sizes="(max-width: 899px) 92vw, 44vw"
              />
            </div>

            <div className="set__body">
              <div className="set__hlava">
                {set.novinka && <span className="set__stitok">{k.novinka}</span>}
                <span className="set__eyebrow">{set.podtitul[jazyk]}</span>
                <h1 className="set__title">
                  {set.nazov}
                  <span className="set__bodka" aria-hidden>
                    .
                  </span>
                </h1>
                {set.popis[jazyk].map((odsek) => (
                  <p key={odsek} className="set__text">
                    {odsek}
                  </p>
                ))}
              </div>

              <dl className="set__specs">
                <div>
                  <dt>{k.skrinka}</dt>
                  <dd>{set.skrinka}</dd>
                </div>
                <div>
                  <dt>{k.akvarium}</dt>
                  <dd>{set.akvarium}</dd>
                </div>
                <div>
                  <dt>{k.sklo}</dt>
                  <dd>{set.sklo[jazyk]}</dd>
                </div>
                <div>
                  <dt>{k.objem}</dt>
                  <dd>{set.objem} l</dd>
                </div>
              </dl>

              <div className="set__prevedenia">
                <span className="set__label">{k.prevedenia}</span>
                <p className="set__prevedenia-text">{k.prevedeniaText}</p>
                <ul>
                  {set.prevedenia.map((p) => (
                    <li key={p.id}>
                      <Swatch swatch={p.swatch} className="swatch--dot" />
                      <span>{p.nazov}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="set__prekoho">
                <span className="set__label">{k.preKoho}</span>
                <ul>
                  {set.preKoho[jazyk].map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>

              <div className="set__pata">
                <div className="set__cena">
                  <b>{set.cena === null ? k.cenaNaDopyt : `${set.cena} €`}</b>
                  <small>{set.cena === null ? k.cenaPozn : k.cenaSDph}</small>
                </div>
                <div className="set__akcie">
                  <Link href={l(`/dopyt?set=${set.id}`)} className="btn-cyan">
                    {k.cta} <span aria-hidden>→</span>
                  </Link>
                  <Link href={l("/kontakt")} className="btn-outline">
                    {k.ctaKontakt}
                  </Link>
                </div>
              </div>
            </div>
          </article>

          <p className="sety__dalsie" data-reveal>
            <Link href={l("/sety")}>{k.spatNaSety}</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
