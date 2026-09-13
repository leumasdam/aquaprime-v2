import Image from "next/image";
import { INSTAGRAM_PROFIL, INSTAGRAM_MENO } from "./site-config";
import type { Slovnik } from "./preklady";

/**
 * Ukážka instagramového profilu na domovskej stránke.
 *
 * Zámerne to nie je živý plugin: oficiálne API si žiada token, ktorý sa musí
 * každé dva mesiace obnovovať, a hotové widgety ťahajú cudzí skript, ktorý
 * spomaľuje stránku a sleduje návštevníkov. Dlaždice sú preto statické,
 * rovnaké ako v profile, a každá vedie na Instagram.
 */
const DLAZDICE = [
  "/instagram/01-priestor.webp",
  "/instagram/02-obyvacka.webp",
  "/instagram/03-znacka.webp",
  "/instagram/04-tricko.webp",
  "/instagram/05-dekor.webp",
  "/instagram/06-detail.webp",
  "/instagram/07-na-mieru.webp",
  "/instagram/08-taska.webp",
  "/instagram/09-podpis.webp",
];

function IkonaIg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.4" cy="6.6" r="1.2" fill="currentColor" />
    </svg>
  );
}

export default function InstagramPas({ t }: { t: Slovnik }) {
  const i = t.instagram;
  return (
    <section className="iggrid section" aria-labelledby="ig-titul">
      <div className="wrap">
        <header className="iggrid__head">
          <a
            className="iggrid__ucet"
            href={INSTAGRAM_PROFIL}
            target="_blank"
            rel="noreferrer noopener"
            data-reveal="left"
          >
            <span className="iggrid__avatar" aria-hidden>
              <IkonaIg className="iggrid__avatar-ico" />
            </span>
            <span className="iggrid__ucet-text">
              <span className="eyebrow eyebrow--rule">{i.eyebrow}</span>
              <strong className="iggrid__meno">{INSTAGRAM_MENO}</strong>
            </span>
          </a>
          <div className="iggrid__copy" data-reveal>
            <h2 className="iggrid__titul" id="ig-titul">
              {i.titul}
            </h2>
            <p className="iggrid__lead">{i.lead}</p>
          </div>
        </header>

        <ul className="iggrid__mriezka">
          {DLAZDICE.map((src, idx) => (
            <li key={src} data-reveal="scale" style={{ ["--rd" as string]: `${idx * 55}ms` }}>
              <a
                href={INSTAGRAM_PROFIL}
                target="_blank"
                rel="noreferrer noopener"
                className="iggrid__dlazdica"
                aria-label={`${i.altPrefix}: ${i.alt[idx]}`}
              >
                <Image
                  src={src}
                  alt={i.alt[idx]}
                  fill
                  sizes="(max-width: 640px) 33vw, (max-width: 1100px) 30vw, 300px"
                />
                <span className="iggrid__hover" aria-hidden>
                  <IkonaIg className="iggrid__hover-ico" />
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="iggrid__foot" data-reveal>
          <a
            className="btn-outline iggrid__cta"
            href={INSTAGRAM_PROFIL}
            target="_blank"
            rel="noreferrer noopener"
          >
            <IkonaIg className="iggrid__cta-ico" />
            {i.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
