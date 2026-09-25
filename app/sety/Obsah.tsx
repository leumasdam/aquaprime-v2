import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { cenaText, odkaz, type Jazyk } from "../jazyk";
import type { Slovnik } from "../preklady";
import { SETY } from "../sety";
import SetyHero from "./SetyHero";
import Swatch from "../Swatch";

/**
 * Stránka Sety — hotové dvojice skrinka + akvárium. Hore hero so záberom
 * prevedení (SetyHero), pod ním stojí každý set ako jeden široký blok:
 * vizuál vľavo, parametre a výzvy vpravo.
 */
export default function SetyObsah({ t, jazyk }: { t: Slovnik; jazyk: Jazyk }) {
  const k = t.sety;
  const l = (h: string) => odkaz(h, jazyk);
  return (
    <main className="catalog sety" style={{ "--accent": "var(--cyan)" } as CSSProperties}>
      <SetyHero t={t} jazyk={jazyk} />

      <section className="section sety__zoznam" id="sety">
        <div className="wrap sety__uvod">
          <span className="sety__eyebrow">{k.eyebrow}</span>
          <h2 className="sety__titul">{k.titul}</h2>
          <p className="sety__lead">{k.lead}</p>
        </div>
        <div className="wrap">
          {SETY.map((set, i) => (
            <article
              key={set.id}
              className="set"
              id={set.id}
              data-reveal
              style={{ "--rd": `${i * 80}ms` } as CSSProperties}
            >
              <div className="set__media">
                <Image
                  src={set.obrazok}
                  alt={`${set.nazov} — ${set.podtitul[jazyk]}`}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 899px) 92vw, 44vw"
                />
              </div>

              <div className="set__body">
                <div className="set__hlava">
                  {set.novinka && <span className="set__stitok">{k.novinka}</span>}
                  <span className="set__eyebrow">{set.podtitul[jazyk]}</span>
                  <h2 className="set__title">
                    {set.nazov}
                    <span className="set__bodka" aria-hidden>
                      .
                    </span>
                  </h2>
                  <p className="set__text">{set.popis[jazyk]}</p>
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
                  <ul>
                    {set.prevedenia.map((p) => (
                      <li key={p.id}>
                        <Swatch swatch={p.swatch} className="swatch--dot" />
                        <span>
                          {p.nazov}
                          <small>
                            {k.led} {p.led[jazyk]}
                          </small>
                        </span>
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
                    <b>{set.cena === null ? k.cenaNaDopyt : cenaText(`${set.cena} €`, jazyk)}</b>
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
          ))}

          <p className="sety__dalsie" data-reveal>
            {k.dalsie}{" "}
            <Link href={l("/dopyt")}>{k.dalsieOdkaz}</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
