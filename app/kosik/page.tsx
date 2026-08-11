import KosikObsah from "./KosikObsah";
import Drobcek from "../Drobcek";
import "./kosik.css";

export const metadata = {
  title: "Košík | AQUAPRIME",
  description: "Objednávka skriniek a akvárií AQUAPRIME.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <main className="sub kos" style={{ ["--accent" as string]: "var(--cyan)" }}>
      <section className="kos__head">
        <div className="sub__head-glow" />
        <div className="wrap">
          <div className="kos__crumb">
            <Drobcek cesta={[{ nazov: "Košík" }]} />
          </div>
          <span className="eyebrow eyebrow--rule">OBJEDNÁVKA</span>
          <h1 className="kos__title">Košík</h1>
        </div>
      </section>
      <div className="wrap">
        <KosikObsah />
      </div>
    </main>
  );
}
