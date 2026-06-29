import Link from "next/link";

export const metadata = {
  title: "Kontakt | AQUAPRIME",
  description:
    "Ozvite sa AQUAPRIME — e-mail, telefón a showroom. Radi poradíme s akváriom, skrinkou aj technikou.",
};

const INFO = [
  { tag: "E-MAIL", title: "ahoj@aquaprime.sk", body: "Najrýchlejšia cesta k odpovedi.", href: "mailto:ahoj@aquaprime.sk" },
  { tag: "TELEFÓN", title: "+421 900 000 000", body: "Po–Pia, 9:00 – 17:00.", href: "tel:+421900000000" },
  { tag: "SHOWROOM", title: "Bratislava", body: "Návšteva po dohode termínu.", href: "/dopyt" },
];

export default function Page() {
  return (
    <main className="sub" style={{ ["--accent" as string]: "var(--cyan)" }}>
      <section className="sub__head section">
        <div className="sub__head-glow" />
        <div className="wrap">
          <span className="eyebrow eyebrow--rule sub__eyebrow" data-reveal="fade">
            KONTAKT
          </span>
          <h1 className="sub__title" data-reveal>
            Ozvite sa. Radi poradíme.
          </h1>
          <p className="sub__lead" data-reveal style={{ ["--rd" as string]: "90ms" }}>
            Či riešite prvé akvárium do obývačky alebo náročný projekt na mieru —
            sme tu pre vás. Vyberte si cestu, ktorá vám vyhovuje.
          </p>
        </div>
      </section>

      <section className="sub__cards section">
        <div className="wrap">
          <div className="sub__cards-grid">
            {INFO.map((c, i) => (
              <Link
                href={c.href}
                key={c.tag}
                className="sub__card"
                data-reveal
                style={{ ["--rd" as string]: `${i * 90}ms` }}
              >
                <span className="sub__card-tag">{c.tag}</span>
                <h3 className="sub__card-title">{c.title}</h3>
                <p className="sub__card-body">{c.body}</p>
                <span className="sub__card-arrow" aria-hidden>
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="sub__cta section">
        <div className="wrap sub__cta-inner" data-reveal>
          <div>
            <h2 className="sub__cta-title">Máte rozmery? Pošlite dopyt.</h2>
            <p className="sub__cta-body">
              Najrýchlejšie vám poradíme cez krátky formulár — typ projektu,
              rozmer a štýl.
            </p>
          </div>
          <div className="sub__cta-actions">
            <Link href="/dopyt" className="btn-cyan">
              DOPYT NA MIERU <span aria-hidden>→</span>
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
