import Link from "next/link";
import Drobcek from "../../Drobcek";
import { odkaz, type Jazyk } from "../../jazyk";
import type { Slovnik } from "../../preklady";
import "../kosik.css";

/**
 * Návrat zo Stripe Checkoutu. Stránka nič nepotvrdzuje — o zaplatení
 * rozhoduje webhook, nie to, či sa zákazník vrátil. Preto tu hovoríme
 * „platbu spracúvame", nie „zaplatené".
 */
export default function PlatbaObsah({
  t,
  jazyk,
  stav,
  cislo,
}: {
  t: Slovnik;
  jazyk: Jazyk;
  stav?: string;
  cislo?: string;
}) {
  const p = t.platba;
  const zrusena = stav === "zrusena";

  return (
    <main className="sub kos" style={{ ["--accent" as string]: "var(--cyan)" }}>
      <section className="kos__head">
        <div className="sub__head-glow" />
        <div className="wrap">
          <div className="kos__crumb">
            <Drobcek
              cesta={[
                { nazov: p.drobcekKosik, href: odkaz("/kosik", jazyk) },
                { nazov: p.drobcek },
              ]}
              jazyk={jazyk}
            />
          </div>
          <span className="eyebrow eyebrow--rule">{p.eyebrow}</span>
          <h1 className="kos__title">{zrusena ? p.titulZrusena : p.titulOk}</h1>
        </div>
      </section>

      <div className="wrap">
        <div className="kos__done">
          <div className="kos__done-ico" aria-hidden>
            {zrusena ? "!" : "✓"}
          </div>
          <h2 className="kos__done-title">
            {zrusena ? p.podtitulZrusena : p.podtitulOk}
          </h2>
          {cislo && <p className="kos__done-cislo">{cislo}</p>}
          <p className="kos__done-body">{zrusena ? p.textZrusena : p.textOk}</p>
          <div className="kos__done-akcie">
            <Link href={odkaz("/skrinky", jazyk)} className="btn-cyan">
              {p.spatDoKatalogu} <span aria-hidden>→</span>
            </Link>
            <Link href={odkaz("/kontakt", jazyk)} className="btn-outline">
              {p.kontaktovat}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
