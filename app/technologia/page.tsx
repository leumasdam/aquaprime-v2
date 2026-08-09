import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import TurntableScroll from "../TurntableScroll";
import CountUp from "../CountUp";
import LoadCalc from "../LoadCalc";

export const metadata = {
  title: "Technológia AquaFrame — kovový rám pod akvárium | AQUAPRIME",
  description:
    "AquaFrame: zváraný oceľový rám 30×30×2 mm, ktorý nesie celé akvárium. Opláštenie LDTD 18 mm bez nosnej funkcie, kalkulačka záťaže a rozmer na mieru.",
};

const STEPS = [
  {
    img: "/materialy/detail-ram.webp",
    title: "Zváranie rámu",
    body: "Uzavreté profily 30×30×2 mm zvárané do jedného celku — žiadne skrutky, ktoré sa časom uvoľnia.",
  },
  {
    img: "/materialy/detail-kov.webp",
    title: "Rovina a kolieska",
    body: "Zváraný rám drží dokonalú rovinu základne; odolné kolieska uľahčia osadenie skrinky na miesto.",
  },
  {
    img: "/materialy/detail-struktura.webp",
    title: "Opláštenie",
    body: "LDTD 18 mm bez nosnej funkcie — dekor podľa interiéru, pevnosť sa výberom nemení.",
  },
  {
    img: "/materialy/detail-sklo.webp",
    title: "Osadenie akvária",
    body: "Sklo sadá na rovnú základňu zváraného rámu s nosnosťou dimenzovanou s rezervou.",
  },
];

const VERSUS = [
  {
    t: "Nosnú funkciu má",
    a: "drevotrieskové dosky a spoje",
    b: "zváraný oceľový rám",
  },
  {
    t: "Po rokoch pod záťažou",
    a: "priehyb dosiek, povolené spoje",
    b: "žiadna zmena — dosky nič nenesú",
  },
  {
    t: "Rovina pod sklom",
    a: "kopíruje podlahu",
    b: "presná rovina zváraného rámu + odolné kolieska",
  },
  {
    t: "Rozmer",
    a: "skladový — akvárium sa prispôsobuje",
    b: "na mieru — skrinka sa prispôsobí akváriu",
  },
];

export default function Page() {
  return (
    <main id="main" className="tech" style={{ "--accent": "var(--cyan)" } as CSSProperties}>
      {/* ---- HERO s renderom rám → skrinka ---- */}
      <section className="tech-hero section">
        <div className="tech-hero__bg" aria-hidden>
          <Image
            src="/technologia/hero-aquaframe-wide.webp"
            alt=""
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="wrap tech-hero__grid">
          <div className="construct__copy tech-hero__copy" data-reveal="left">
            <span className="construct__eyebrow">
              <span className="construct__eyebrow-rule" />
              TECHNOLÓGIA · AQUAFRAME
            </span>
            <h1 className="construct__title">
              AquaFrame. Rám,
              <br />
              ktorý nesie <em>všetko</em>.
            </h1>
            <p className="construct__body">
              Bežný nábytok nesie váhu doskami — a stovky litrov vody ho časom
              prehnú. My sme nosnú úlohu zverili zváranému oceľovému rámu
              a dizajn oplášteniu. Vyzerá ako nábytok, nesie ako konštrukcia.
            </p>
            <div className="tech-chips" data-reveal style={{ "--rd": "120ms" } as CSSProperties}>
              <span className="tech-chip">Profil 30×30×2 mm</span>
              <span className="tech-chip">LDTD 18 mm</span>
              <span className="tech-chip">Vyrobené na Slovensku</span>
            </div>
            <div className="construct__actions">
              <Link href="/konfigurator" className="btn-cyan">
                ZOSTAVIŤ SKRINKU <span aria-hidden>→</span>
              </Link>
              <Link href="/dopyt" className="construct__link">
                alebo nezáväzný dopyt na mieru
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---- ČÍSLA ---- */}
      <section className="tech-stats">
        <div className="wrap tech-stats__grid">
          {[
            { to: 770, unit: "kg", label: "nosnosť referenčného rámu" },
            { to: 30, unit: "×30 mm", label: "uzavretý oceľový profil" },
            { to: 2, unit: "mm", label: "hrúbka steny profilu" },
            { to: 18, unit: "mm", label: "opláštenie LDTD" },
          ].map((s, i) => (
            <div
              key={s.label}
              className="tech-stat"
              data-reveal
              style={{ "--rd": `${i * 80}ms` } as CSSProperties}
            >
              <span className="tech-stat__n">
                <CountUp to={s.to} />
                <small>{s.unit}</small>
              </span>
              <span className="tech-stat__label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ---- 360° MODEL ---- */}
      <section className="construct section">
        <div className="wrap construct__grid">
          <div className="construct__showcase" data-reveal="scale">
            <TurntableScroll />
          </div>
          <div className="construct__copy" data-reveal>
            <span className="construct__eyebrow">
              <span className="construct__eyebrow-rule" />
              MODEL · 360°
            </span>
            <h2 className="construct__title">
              Otočte si kostru,
              <br />
              ktorú inak <em>neuvidíte</em>.
            </h2>
            <p className="construct__body">
              Presne tento zváraný rám sa skrýva v každej našej skrinke —
              po opláštení z neho vidno len dokonalú rovinu pod akváriom.
            </p>
          </div>
        </div>
      </section>

      {/* ---- KALKULAČKA ZÁŤAŽE ---- */}
      <section className="tech-calc section" id="kalkulacka">
        <div className="wrap">
          <h2 className="eyebrow tech-heading" data-reveal="fade">
            Kalkulačka záťaže
          </h2>
          <p className="tech-lead" data-reveal>
            Koľko v skutočnosti váži vaše akvárium? Nastavte rozmery — voda je
            len začiatok.
          </p>
          <div data-reveal style={{ "--rd": "110ms" } as CSSProperties}>
            <LoadCalc />
          </div>
        </div>
      </section>

      {/* ---- TIMELINE: ako vzniká ---- */}
      <section className="tech-tl section">
        <div className="wrap">
          <h2 className="eyebrow tech-heading" data-reveal="fade">
            Ako vzniká AquaFrame
          </h2>
          <p className="tech-lead" data-reveal>
            Štyri kroky od surovej ocele po akvárium v dokonalej rovine.
          </p>
          <div className="tech-tl__track" data-reveal="fade">
            <span className="tech-tl__line" aria-hidden />
            <div className="tech-tl__nodes">
              {STEPS.map((s, i) => (
                <article
                  key={s.title}
                  className="tech-tl__node"
                  data-reveal
                  style={{ "--rd": `${200 + i * 260}ms` } as CSSProperties}
                >
                  <div className="tech-tl__thumb">
                    <Image
                      src={s.img}
                      alt={s.title}
                      fill
                      sizes="(max-width: 900px) 40vw, 18vw"
                    />
                  </div>
                  <span className="tech-tl__dot" aria-hidden />
                  <h3>
                    <em>0{i + 1}</em> {s.title}
                  </h3>
                  <p>{s.body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---- POROVNANIE ---- */}
      <section className="tech-versus section">
        <div className="wrap">
          <h2 className="eyebrow tech-heading" data-reveal="fade">
            Prečo nie obyčajná komoda
          </h2>
          <div className="tech-versus__grid">
            <div className="tech-versus__col" data-reveal>
              <h3>Bežný nábytok</h3>
              <ul>
                {VERSUS.map((r) => (
                  <li key={r.t}>
                    <span className="tech-versus__t">{r.t}</span>
                    {r.a}
                  </li>
                ))}
              </ul>
            </div>
            <div
              className="tech-versus__col tech-versus__col--aq"
              data-reveal
              style={{ "--rd": "120ms" } as CSSProperties}
            >
              <h3>AquaFrame</h3>
              <ul>
                {VERSUS.map((r) => (
                  <li key={r.t}>
                    <span className="tech-versus__t">{r.t}</span>
                    {r.b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section className="sub__cta section">
        <div className="wrap sub__cta-inner" data-reveal>
          <div>
            <h2 className="sub__cta-title">Unesie aj to vaše.</h2>
            <p className="sub__cta-body">
              Zostavte si skrinku s rámom AquaFrame — alebo si najprv vyberte
              dekor opláštenia.
            </p>
          </div>
          <div className="sub__cta-actions">
            <Link href="/konfigurator" className="btn-cyan">
              KONFIGURÁTOR <span aria-hidden>→</span>
            </Link>
            <Link href="/materialy" className="btn-outline">
              VYBRAŤ DEKOR <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
