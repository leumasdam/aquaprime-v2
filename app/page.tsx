import Link from "next/link";
import Configurator from "./Configurator";

// 5 ikon do spodnej lišty hero (thin-line SVG, currentColor)
const HF: Record<string, React.ReactNode> = {
  mira: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M3.5 16.5 16.5 3.5 20.5 7.5 7.5 20.5z" />
      <path d="m7 11 1.7 1.7M10.5 7.5l1.7 1.7M13.5 10.5l1.5 1.5M9.5 13.8l1.5 1.5" />
    </svg>
  ),
  material: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M6 3h12l4 6-10 12L2 9z" />
      <path d="M2 9h20M9 3 6 9l6 12M15 3l3 6-6 12" />
    </svg>
  ),
  presnost: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="3.4" />
      <path d="M12 1v3.4M12 19.6V23M1 12h3.4M19.6 12H23" />
    </svg>
  ),
  hodnota: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M12 2 4 5v6c0 5 3.4 8.2 8 9.8 4.6-1.6 8-4.8 8-9.8V5z" />
      <path d="m8.5 11.8 2.4 2.4 4.6-5" />
    </svg>
  ),
  slovensko: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M12 2 4 5v6c0 5 3.4 8.2 8 9.8 4.6-1.6 8-4.8 8-9.8V5z" />
      <path d="M12 6.4v9.4" />
      <path d="M9.2 9.3h5.6" />
      <path d="M8 12.4h8" />
    </svg>
  ),
};

const FEATURES = [
  { k: "mira", t: "NA MIERU", s: "Každý projekt navrhujeme presne podľa vašich potrieb." },
  { k: "material", t: "PRÉMIOVÉ MATERIÁLY", s: "Používame len špičkové materiály a osvedčené konštrukcie." },
  { k: "presnost", t: "TECHNICKÁ PRESNOSŤ", s: "Stabilita, funkčnosť a precízne spracovanie v každom detaile." },
  { k: "hodnota", t: "TRVÁCA HODNOTA", s: "Odolné riešenia s nadčasovým dizajnom, ktoré vydržia." },
  { k: "slovensko", t: "SLOVENSKÁ KVALITA", s: "Navrhnuté a vyrobené na Slovensku." },
];

const REVIEWS = [
  {
    quote:
      "Precízne spracovanie skrinky aj tichá technika. V obývačke to pôsobí ako nábytok, nie ako technika.",
    name: "Martin K.",
    meta: "Bratislava · 420 l set",
  },
  {
    quote:
      "Najviac oceňujem čistý dizajn a poradenstvo pri materiáloch. Celé riešenie zapadlo do interiéru.",
    name: "Jana P.",
    meta: "Trnava · Signature kabinet",
  },
  {
    quote:
      "Výborná komunikácia, presné dodanie a krásny detail pri hrane skrinky. Akvárium konečne vyniklo.",
    name: "Peter H.",
    meta: "Žilina · realizácia na mieru",
  },
];

const MODULES = [
  {
    label: "MATERIÁLY",
    title: "Prémiové povrchy",
    body: "Vyberáme len tie najkvalitnejšie materiály — odolné, nadčasové a navrhnuté pre dlhú životnosť.",
    cta: "ZOBRAZIŤ MATERIÁLY",
    href: "/materialy",
    img: "/img/mat-textures.webp",
    pos: "center",
  },
  {
    label: "REMESLO",
    title: "Technická dokonalosť",
    body: "Každý detail je výsledkom precízneho remesla, modernej technológie a vášne pre akvaristiku.",
    cta: "VIAC O VÝROBE",
    href: "/o-nas",
    img: "/img/mod-craft.webp",
    pos: "center",
  },
  {
    label: "REALIZÁCIE",
    title: "Skutočné priestory",
    body: "Pozrite si naše realizácie v reálnych interiéroch. Každý projekt je jedinečný.",
    cta: "ZOBRAZIŤ REALIZÁCIE",
    href: "/realizacie",
    img: "/img/mod-realizations.webp",
    pos: "center",
  },
];

const CTILES = [
  {
    label: "MATERIÁLY",
    title: "Prémiové povrchy",
    desc: "Vyberáme len tie najkvalitnejšie materiály — odolné, nadčasové a navrhnuté pre dlhú životnosť.",
    cta: "ZOBRAZIŤ MATERIÁLY",
    href: "/materialy",
    img: "/img/tile-materialy.webp",
  },
  {
    label: "REMESLO",
    title: "Technická dokonalosť",
    desc: "Každý detail je výsledkom precízneho remesla, modernej technológie a vášne pre akvaristiku.",
    cta: "VIAC O VÝROBE",
    href: "/o-nas",
    img: "/img/tile-remeslo.webp",
  },
  {
    label: "REALIZÁCIE",
    title: "Skutočné priestory",
    desc: "Pozrite si naše realizácie v reálnych interiéroch. Každý projekt je jedinečný.",
    cta: "ZOBRAZIŤ REALIZÁCIE",
    href: "/realizacie",
    img: "/img/tile-realizacie.webp",
  },
];

const COLLECTIONS = [
  { name: "Basic", sub: "Minimalistická elegancia", img: "/img/col-basic.webp" },
  { name: "Standard", sub: "Prémiová kolekcia", img: "/img/col-standard.webp" },
  { name: "Premium", sub: "Výnimočný dizajn", img: "/img/col-premium.webp" },
];

export default function Home() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero__bg2" aria-hidden="true" />
        <span className="hero__kg" aria-hidden="true">350+ kg</span>
        <div className="hero__scroll-v" aria-hidden="true">
          <span className="hero__scroll-word">SCROLL</span>
          <span className="hero__scroll-line" />
          <span className="hero__scroll-arr">↓</span>
        </div>

        <div className="wrap hero__inner">
          <div className="hero__content">
            <span className="hero__eyebrow">
              <span className="hero__eyebrow-rule" />
              LUXUSNÉ AKVÁRIÁ. DOKONALÉ V KAŽDOM DETAILE.
            </span>
            <h1 className="hero__title">
              Viac než akvárium.
              <br />
              Majstrovské dielo.
            </h1>
            <p className="hero__body">
              Prémiové akváriové skrinky na mieru spájajú minimalistický dizajn,
              precízne spracovanie a najkvalitnejšie materiály. Navrhnuté pre
              stabilitu, navrhnuté pre váš interiér. Vyrobené na Slovensku.
            </p>
            <div className="hero__ctas">
              <Link href="/skrinky" className="hero__btn">
                <span className="hero__btn-label">OBJAVTE KOLEKCIE</span>
                <span className="hero__btn-arr" aria-hidden>
                  →
                </span>
              </Link>
              <Link href="/konfigurator" className="hero__ghost">
                <svg
                  className="hero__ghost-ico"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M12 3 20.5 7.75 20.5 16.25 12 21 3.5 16.25 3.5 7.75Z" />
                  <path d="M12 12 3.5 7.75" />
                  <path d="M12 12 20.5 7.75" />
                  <path d="M12 12 12 21" />
                </svg>
                KONFIGUROVAŤ NA MIERU
              </Link>
            </div>
          </div>
        </div>

        <div className="hero__bar">
          <div className="wrap hero__bar-inner">
            {FEATURES.map((f) => (
              <div className="hfeat" key={f.k}>
                <span className="hfeat__ring">{HF[f.k]}</span>
                <span className="hfeat__txt">
                  <span className="hfeat__t">{f.t}</span>
                  <span className="hfeat__s">{f.s}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== KOLEKCIE — Vyberte si svoju kolekciu ===== */}
      <section className="collections section">
        <div className="wrap collections__grid">
          <div className="collections__head" data-reveal="left">
            <span className="eyebrow eyebrow--rule">SKRINKY</span>
            <h2 className="collections__title">
              Vyberte si svoju kolekciu
            </h2>
          </div>
          <div className="collections__cards">
            {COLLECTIONS.map((c, i) => (
              <Link
                href="/skrinky"
                className="ccard"
                key={c.name}
                data-reveal
                style={{ "--rd": `${i * 90}ms` } as React.CSSProperties}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.img} alt={c.name} className="ccard__img" />
                <span className="ccard__overlay">
                  <span className="ccard__name">{c.name}</span>
                  <span className="ccard__sub">{c.sub}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== KOMPAKTNÉ DLAŽDICE (pod hero) ===== */}
      <section className="ctiles section">
        <div className="wrap">
          {CTILES.map((t, i) => (
            <Link
              href={t.href}
              className="ctile"
              key={t.label}
              data-reveal
              style={{ "--rd": `${i * 90}ms` } as React.CSSProperties}
            >
              <div className="ctile__text">
                <span className="ctile__label">{t.label}</span>
                <h3 className="ctile__title">{t.title}</h3>
                <p className="ctile__desc">{t.desc}</p>
                <span className="ctile__cta">
                  {t.cta} <span aria-hidden>→</span>
                </span>
              </div>
              <div className="ctile__media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.img} alt={t.title} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== MINI-KONFIGURÁTOR ===== */}
      <section className="cfg section">
        <div className="wrap">
          <div className="cfg__head" data-reveal>
            <span className="cfg__eyebrow">
              <span className="cfg__eyebrow-rule" />
              KONFIGURÁTOR · NÁVRH NA MIERU
            </span>
            <h2 className="cfg__title">
              Navrhnite si skrinku <em>za pár sekúnd</em>.
            </h2>
            <p className="cfg__lead">
              Vyberte rozmery, povrch a nožičky — uvidíte náhľad aj odhad ceny.
              Finálny dizajn a technické detaily doladíme spolu po dopyte.
            </p>
          </div>

          <Configurator />
        </div>

        <div className="wrap construct__steps">
          {[
            "Hmotnosť ako základ",
            "Záťaž pod kontrolou",
            "Povrch podľa interiéru",
            "Riešenie na mieru",
          ].map((label, i) => (
            <div
              className="cstep"
              key={label}
              data-reveal
              style={{ "--rd": `${i * 90}ms` } as React.CSSProperties}
            >
              <span className="cstep__n">0{i + 1}</span>
              <span className="cstep__label">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ===== DÔKAZ KVALITY — obrázkové karty (prekliky na subpages) ===== */}
      <section className="modules section">
        <div className="wrap modules__grid">
          {MODULES.map((m, i) => (
            <Link
              href={m.href}
              className="module"
              key={m.label}
              data-reveal
              style={{ "--rd": `${i * 110}ms` } as React.CSSProperties}
            >
              <span
                className="module__bg"
                style={{
                  backgroundImage: `url(${m.img})`,
                  backgroundPosition: m.pos,
                }}
              />
              <span className="module__shade" />
              <span className="module__content">
                <span className="module__label">{m.label}</span>
                <span className="module__title">{m.title}</span>
                <span className="module__text">{m.body}</span>
                <span className="module__cta">
                  {m.cta} <span aria-hidden>→</span>
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== ĎALŠIE VETVY — akváriá & teráriá + doplnky & technika ===== */}
      <section className="pathways section">
        <div className="wrap">
          <div className="pathways__head" data-reveal>
            <div>
              <div className="pathways__eyebrow">HLAVNÉ PRODUKTOVÉ VETVY</div>
              <h2 className="pathways__title">
                Ďalší krok musí byť rovnako jasný ako navbar.
              </h2>
              <p className="pathways__lead">
                Landing page neposiela človeka do abstraktných kategórií. Ukáže
                iba dve jasné vetvy — a každá vie presne, kam patrí.
              </p>
            </div>
            <div className="navbar-echo">
              <div className="navbar-echo__label">NAVBAR PREKLIKY</div>
              <div className="navbar-echo__line" />
              <div className="navbar-echo__item">AKVÁRIÁ & TERÁRIÁ</div>
              <div className="navbar-echo__item">DOPLNKY & TECHNIKA</div>
            </div>
          </div>

          <div className="pathways__cards">
            <Link
              href="/akvaria-teraria"
              className="pathway pathway--aqua"
              data-reveal
            >
              <div className="pathway__media" />
              <div className="pathway__accent" />
              <div className="pathway__body">
                <div className="pathway__tag">NA MIERU</div>
                <h3 className="pathway__name">Akváriá & teráriá</h3>
                <p className="pathway__desc">
                  Nádrže na mieru pre akvaristiku aj teraristiku. Spoločná
                  subpage, jasné parametre a cesta ku konfigurácii.
                </p>
                <div className="pathway__foot">
                  <span className="pathway__btn">OTVORIŤ VETVU</span>
                  <span className="pathway__url">/akvaria-teraria</span>
                </div>
              </div>
            </Link>

            <Link
              href="/doplnky-technika"
              className="pathway pathway--tech"
              data-reveal
              style={{ "--rd": "120ms" } as React.CSSProperties}
            >
              <div className="pathway__media" />
              <div className="pathway__accent" />
              <div className="pathway__body">
                <div className="pathway__tag">TECHNIKA</div>
                <h3 className="pathway__name">Doplnky & technika</h3>
                <p className="pathway__desc">
                  Osvetlenie, filtrácia a príslušenstvo majú vlastnú kategóriu.
                  Nepatria do nádrží — majú vlastnú cestu.
                </p>
                <div className="pathway__foot">
                  <span className="pathway__btn">POZRIEŤ TECHNIKU</span>
                  <span className="pathway__url">/doplnky-technika</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== DÔVERA — referencie ===== */}
      <section className="reviews section">
        <div className="wrap reviews__grid">
          <div className="reviews__head" data-reveal="left">
            <span className="eyebrow eyebrow--rule">REFERENCIE</span>
            <h2 className="reviews__title">DÔVERA V DETAILOCH</h2>
            <p className="reviews__intro">
              Krátke hodnotenia od klientov, ktorí riešili akvárium ako súčasť
              interiéru, nie ako kompromis.
            </p>
          </div>
          <div className="review-cards">
            {REVIEWS.map((r, i) => (
              <div
                className="review-card"
                key={r.name}
                data-reveal
                style={{ "--rd": `${i * 110}ms` } as React.CSSProperties}
              >
                <div className="review-card__stars">★★★★★</div>
                <p className="review-card__quote">{r.quote}</p>
                <div className="review-card__name">{r.name}</div>
                <div className="review-card__meta">{r.meta}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DOPYT — finálny konverzný blok ===== */}
      <section className="final section">
        <div className="wrap">
          <div className="final__eyebrow" data-reveal="fade">
            DÔVERA A DOPYT
          </div>
          <h2 className="final__title" data-reveal>
            Pred odoslaním dopytu musí klient cítiť pokoj.
          </h2>
          <div className="final__grid" data-reveal style={{ "--rd": "100ms" } as React.CSSProperties}>
            <div className="final-review">
              <div className="final-review__stars">★★★★★</div>
              <p className="final-review__quote">
                Konečne riešenie, pri ktorom sa nebojím váhy akvária.
              </p>
              <div className="final-review__who">Majiteľ 450 l akvária</div>
            </div>
            <div className="final-review">
              <div className="final-review__stars">★★★★★</div>
              <p className="final-review__quote">
                Materiál aj konštrukcia zapadli do interiéru.
              </p>
              <div className="final-review__who">Realizácia Bratislava</div>
            </div>
            <div className="final-cta">
              <h3 className="final-cta__title">Pošlite rozmery akvária</h3>
              <p className="final-cta__body">
                Navrhneme skrinku, rám, povrch aj technické riešenie podľa
                objemu, štýlu a priestoru.
              </p>
              <Link href="/dopyt" className="btn-cyan">
                DOPYT NA MIERU <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
