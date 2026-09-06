import Link from "next/link";
import Drobcek from "../../Drobcek";
import "../kosik.css";

export const metadata = {
  title: "Platba | AQUAPRIME",
  robots: { index: false, follow: false },
};

/**
 * Návrat zo Stripe Checkoutu. Stránka nič nepotvrdzuje — o zaplatení
 * rozhoduje webhook, nie to, či sa zákazník vrátil. Preto tu hovoríme
 * „platbu spracúvame", nie „zaplatené".
 */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ stav?: string; cislo?: string }>;
}) {
  const { stav, cislo } = await searchParams;
  const zrusena = stav === "zrusena";

  return (
    <main className="sub kos" style={{ ["--accent" as string]: "var(--cyan)" }}>
      <section className="kos__head">
        <div className="sub__head-glow" />
        <div className="wrap">
          <div className="kos__crumb">
            <Drobcek cesta={[{ nazov: "Košík", href: "/kosik" }, { nazov: "Platba" }]} />
          </div>
          <span className="eyebrow eyebrow--rule">OBJEDNÁVKA</span>
          <h1 className="kos__title">{zrusena ? "Platba zrušená" : "Ďakujeme"}</h1>
        </div>
      </section>

      <div className="wrap">
        <div className="kos__done">
          <div className="kos__done-ico" aria-hidden>
            {zrusena ? "!" : "✓"}
          </div>
          <h2 className="kos__done-title">
            {zrusena ? "Platba neprebehla" : "Platbu spracúvame"}
          </h2>
          {cislo && <p className="kos__done-cislo">{cislo}</p>}
          <p className="kos__done-body">
            {zrusena ? (
              <>
                Z platby ste odstúpili a nič sme vám nestrhli. Objednávka nám
                ostáva uložená — zálohu môžete uhradiť prevodom podľa údajov
                v e-maile, alebo nám napíšte a pošleme nový platobný odkaz.
              </>
            ) : (
              <>
                Potvrdenie od banky nám môže prísť s malým oneskorením. Len čo
                dorazí, pošleme vám e-mail a spúšťame výrobu. Zvyšok sumy
                zaplatíte až pri prevzatí.
              </>
            )}
          </p>
          <div className="kos__done-akcie">
            <Link href="/skrinky" className="btn-cyan">
              Späť do katalógu <span aria-hidden>→</span>
            </Link>
            <Link href="/kontakt" className="btn-outline">
              Kontaktovať nás
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
