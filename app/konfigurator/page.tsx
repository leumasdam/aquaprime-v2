import KonfiguratorFull from "../KonfiguratorFull";
import "./konfigurator.css";

export const metadata = {
  title: "Konfigurátor skrinky | AQUAPRIME",
  description:
    "Navrhnite si akvarijnú skrinku na mieru — rozmery, povrchy, materiály a detaily s odhadom ceny.",
};

const TRUST = [
  { t: "Technická dokonalosť", s: "Precízne spracovanie do posledného detailu." },
  { t: "Prémiové materiály", s: "Vyberané pre krásu, odolnosť a dlhú životnosť." },
  { t: "Individuálny dizajn", s: "Navrhnuté presne podľa vašich predstáv." },
  { t: "Vyrobené na Slovensku", s: "Kvalita, ktorú podporujeme lokálne." },
];

export default function Page() {
  return (
    <main className="kfpage">
      <div className="wrap">
        <div className="kfx__head">
          <span className="eyebrow eyebrow--rule">KONFIGURÁTOR · NÁVRH NA MIERU</span>
          <h1 className="kfx__title">
            Navrhnite si skrinku <em>na mieru</em>.
          </h1>
          <p className="kfx__lead">
            Vyberte rozmery, povrch a nožičky — skrinku vidíte naživo v strede,
            ovládanie máte po stranách. Finálny dizajn doladíme po dopyte.
          </p>
        </div>

        <KonfiguratorFull />
        <div className="kf__trust">
          {TRUST.map((x) => (
            <div className="kf__trustitem" key={x.t}>
              <span className="kf__trust-mark" />
              <div>
                <strong>{x.t}</strong>
                <span>{x.s}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
