// ZÁLOHA pôvodnej sekcie „Konštrukcia / 3D model" (proof 3D).
// Nahradená mini-konfigurátorom (Configurator.tsx). Sem uložené pre prípadné vrátenie.
import Link from "next/link";
import Turntable from "./Turntable";

export default function Proof3D() {
  return (
    <section className="construct section">
      <div className="wrap construct__grid">
        <div className="construct__showcase" data-reveal="scale">
          <Turntable />
        </div>

        <div className="construct__copy" data-reveal>
          <span className="construct__eyebrow">
            <span className="construct__eyebrow-rule" />
            KONŠTRUKCIA · NOSNOSŤ
          </span>
          <h2 className="construct__title">
            Skrytá oceľová kostra,
            <br />
            ktorá unesie aj <em>770 kg</em>.
          </h2>
          <p className="construct__body">
            Bežná skrinka sa pod stovkami litrov vody prehne. Náš oceľový rám
            rozloží váhu a drží sklo v dokonalej rovine — pôsobí ako nábytok,
            ale unesie akvárium.
          </p>

          <div className="construct__actions">
            <Link href="/skrinky" className="btn-cyan construct__cta">
              POZRIEŤ SKRINKY <span aria-hidden>→</span>
            </Link>
            <Link href="/dopyt" className="construct__link">
              alebo nezáväzný dopyt na mieru
            </Link>
          </div>
        </div>
      </div>

      <div className="wrap construct__steps">
        {[
          "Hmotnosť ako základ",
          "Záťaž pod kontrolou",
          "Povrch podľa interiéru",
          "Riešenie na mieru",
        ].map((label, i) => (
          <div
            className="cstep"
            key={label}
            data-reveal
            style={{ "--rd": `${i * 90}ms` } as React.CSSProperties}
          >
            <span className="cstep__n">0{i + 1}</span>
            <span className="cstep__label">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
