import Drobcek from "../Drobcek";
import KonfiguratorFull from "../KonfiguratorFull";
import type { Jazyk } from "../jazyk";
import type { Slovnik } from "../preklady";
import "./konfigurator.css";

export default function KonfiguratorObsah({ t, jazyk }: { t: Slovnik; jazyk: Jazyk }) {
  const k = t.konfigurator;
  return (
    <main className="kfpage">
      <div className="wrap">
        <div className="kfx__head">
          <div className="pg-drobcek">
            <Drobcek cesta={[{ nazov: k.drobcek }]} jazyk={jazyk} />
          </div>
          <h1 className="kfx__title">
            {k.titul1} <em>{k.titulEm}</em>.
          </h1>
          <p className="kfx__lead">{k.lead}</p>
        </div>
        <KonfiguratorFull jazyk={jazyk} />
      </div>
    </main>
  );
}
