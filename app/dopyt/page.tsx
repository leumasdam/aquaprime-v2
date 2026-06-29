import DopytForm from "../DopytForm";

export const metadata = {
  title: "Dopyt na mieru | AQUAPRIME",
  description:
    "Začnite projekt. Pošlite typ projektu, rozmery a štýl — navrhneme skrinku, rám, povrch aj techniku na mieru.",
};

const TRUST = [
  { t: "Oceľový rám", b: "Nosnosť až 770 kg na nožičku." },
  { t: "Výroba na Slovensku", b: "Kontrola kvality a krátka cesta." },
  { t: "Dopyt bez záväzku", b: "Najprv návrh, rozhodnutie je na vás." },
];

export default function Page() {
  return (
    <main className="sub" style={{ ["--accent" as string]: "var(--cyan)" }}>
      <section className="sub__head section">
        <div className="sub__head-glow" />
        <div className="wrap dopyt__layout">
          <div className="dopyt__intro">
            <span className="eyebrow eyebrow--rule sub__eyebrow" data-reveal="fade">
              DOPYT NA MIERU
            </span>
            <h1 className="sub__title" data-reveal>
              Začnite projekt v pár krokoch.
            </h1>
            <p className="sub__lead" data-reveal style={{ ["--rd" as string]: "90ms" }}>
              Krátky formulár zistí typ projektu, rozmer a preferovaný štýl.
              Zvyšok doladíme spolu — bez tlaku a bez záväzku.
            </p>
            <ul className="dopyt__trust" data-reveal style={{ ["--rd" as string]: "160ms" }}>
              {TRUST.map((x) => (
                <li key={x.t}>
                  <span className="dopyt__trust-dot" />
                  <span>
                    <strong>{x.t}</strong>
                    {x.b}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="dopyt__panel" data-reveal style={{ ["--rd" as string]: "120ms" }}>
            <DopytForm />
          </div>
        </div>
      </section>
    </main>
  );
}
