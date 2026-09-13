import Link from "next/link";
import { AquaFishMark } from "./brand";
import { odkaz, type Jazyk } from "./jazyk";
import type { Slovnik } from "./preklady";

export default function NenajdeneObsah({ t, jazyk }: { t: Slovnik; jazyk: Jazyk }) {
  const n = t.nenajdene;
  return (
    <main className="sub notfound" style={{ ["--accent" as string]: "var(--cyan)" }}>
      <section className="sub__head section notfound__sec">
        <div className="sub__head-glow" />
        <AquaFishMark className="notfound__fish" />
        <div className="wrap notfound__inner">
          <span className="eyebrow eyebrow--rule notfound__code">404</span>
          <h1 className="sub__title">{n.titul}</h1>
          <p className="sub__lead">{n.lead}</p>
          <div className="notfound__actions">
            <Link href={odkaz("/", jazyk)} className="btn-cyan">
              <span aria-hidden>←</span> {n.domov}
            </Link>
            <Link href={odkaz("/skrinky", jazyk)} className="btn-outline">
              {n.skrinky} <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
