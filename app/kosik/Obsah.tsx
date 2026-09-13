import KosikObsah from "./KosikObsah";
import Drobcek from "../Drobcek";
import type { Jazyk } from "../jazyk";
import type { Slovnik } from "../preklady";
import "./kosik.css";

export default function KosikStranka({ t, jazyk }: { t: Slovnik; jazyk: Jazyk }) {
  const k = t.kosik;
  return (
    <main className="sub kos" style={{ ["--accent" as string]: "var(--cyan)" }}>
      <section className="kos__head">
        <div className="sub__head-glow" />
        <div className="wrap">
          <div className="kos__crumb">
            <Drobcek cesta={[{ nazov: k.drobcek }]} jazyk={jazyk} />
          </div>
          <span className="eyebrow eyebrow--rule">{k.eyebrow}</span>
          <h1 className="kos__title">{k.titul}</h1>
        </div>
      </section>
      <div className="wrap">
        <KosikObsah jazyk={jazyk} />
      </div>
    </main>
  );
}
