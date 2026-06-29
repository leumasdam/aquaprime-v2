import Link from "next/link";

export const metadata = {
  title: "Stránka sa nenašla",
};

export default function NotFound() {
  return (
    <main className="sub notfound" style={{ ["--accent" as string]: "var(--cyan)" }}>
      <section className="sub__head section notfound__sec">
        <div className="sub__head-glow" />
        <div className="wrap notfound__inner">
          <span className="eyebrow eyebrow--rule notfound__code">404</span>
          <h1 className="sub__title">Táto stránka odplávala.</h1>
          <p className="sub__lead">
            Možno sme ju presunuli, alebo nikdy neexistovala. Vráťme sa na pevnú
            zem — alebo rovno k skrinkám.
          </p>
          <div className="notfound__actions">
            <Link href="/" className="btn-cyan">
              <span aria-hidden>←</span> Domov
            </Link>
            <Link href="/skrinky" className="btn-outline">
              Pozrieť skrinky <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
