import Image from "next/image";
import Link from "next/link";
import AquaGrid from "../AquaGrid";
import Drobcek from "../Drobcek";
import { AQUARIUMS } from "../aquariums";

const HERO_FEATURES = [
  {
    label: "Sklo 4 – 12 mm",
    sub: "Hrúbka podľa objemu",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
        <rect x="3.5" y="6.5" width="17" height="11" rx="0.8" />
        <path d="M6.6 6.5 9.4 17.5M12.4 6.5 15.2 17.5" opacity="0.5" />
      </svg>
    ),
  },
  {
    label: "Objemy 37 – 1 120 l",
    sub: "47 rozmerov v cenníku",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M12 3.5c3.4 4 5.6 6.8 5.6 9.3A5.6 5.6 0 0 1 12 20.5a5.6 5.6 0 0 1-5.6-7.7c0-2.5 2.2-5.3 5.6-9.3Z" strokeLinejoin="round" />
        <path d="M7.2 14.6c1.4.9 2.8.9 4.2 0s2.8-.9 4.2 0" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Výroba na mieru",
    sub: "Aj rozmer mimo ponuky",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M3.5 9.5h17M3.5 9.5v5m17-5v5" strokeLinecap="round" />
        <path d="M7.5 9.5v2.6M12 9.5v3.4M16.5 9.5v2.6" strokeLinecap="round" opacity="0.6" />
      </svg>
    ),
  },
];

export const metadata = {
  title: "Akváriá na mieru — katalóg | AQUAPRIME",
  description:
    "Akváriá AQUAPRIME z čírého float skla, lepené profesionálnym akvaristickým silikónom. 47 rozmerov od 37 do 1 120 litrov s cenami od 38 €, sklo 4 – 12 mm, výroba na mieru.",
};

export default function AkvariaPage() {
  return (
    <main className="catalog">
      <section className="cat-hero cat-hero--aqua">
        <div className="cat-hero__bg" aria-hidden>
          <Image
            src="/img/akvaria/akvaria-hero-wide.webp"
            alt=""
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="wrap cat-hero__content">
          <div className="cat-hero__crumb" data-reveal="fade">
            <Drobcek cesta={[{ nazov: "Akváriá" }]} />
          </div>
          <h1 className="cat-hero__title display" data-reveal>
            Akváriá na mieru
          </h1>
          <p
            className="cat-hero__lead"
            data-reveal
            style={{ "--rd": "90ms" } as React.CSSProperties}
          >
            Nádrže z čírého float skla, lepené profesionálnym akvaristickým
            silikónom a vyrábané kus po kuse. Štyridsaťsedem rozmerov od 37 do
            1 120 litrov — a keď žiadny nesadne, vyrobíme presne ten váš.
          </p>
          <div
            className="cat-hero__features"
            data-reveal
            style={{ "--rd": "160ms" } as React.CSSProperties}
          >
            {HERO_FEATURES.map((f) => (
              <div key={f.label} className="cat-hero__feature">
                <span className="cat-hero__ficon">{f.icon}</span>
                <span>
                  <b>{f.label}</b>
                  {f.sub}
                </span>
              </div>
            ))}
          </div>
        </div>
        <a href="#katalog" className="cat-hero__cue" aria-label="Prejsť na katalóg">
          <span aria-hidden>⌄</span>
        </a>
      </section>

      <section className="section" id="katalog">
        <div className="wrap">
          <div className="catalog__subhead">
            <h2 className="catalog__h2">Katalóg akvárií</h2>
            <p className="catalog__sublead">
              Vyfiltrujte objem a dĺžku. Každá nádrž je vyrábaná na zákazku —
              uvedené rozmery sú overené štandardy, nie limity.
            </p>
          </div>
          <AquaGrid />
        </div>
      </section>

      {/* PREČO TAKTO VYROBENÉ — podporný blok, sesterský k „Prečo oceľový rám" */}
      <section className="section why-frame">
        <div className="wrap why-frame__grid">
          <div data-reveal="left">
            <span className="eyebrow eyebrow--rule">VÝROBA</span>
            <h2 className="why-frame__title">Na akváriu vidno každý spoj</h2>
            <p className="why-frame__body">
              Nádrž drží pohromade lepenie a rovina. Preto používame číre float
              sklo bez optických deformácií, čierny akvaristický silikón a pri
              väčších objemoch sklenené výstuhy, ktoré rozložia tlak vody po
              celej hornej hrane.
            </p>
          </div>
          <ul
            className="why-frame__points"
            data-reveal
            style={{ "--rd": "100ms" } as React.CSSProperties}
          >
            <li>
              <strong>Číre float sklo</strong>
              Vysoká priehľadnosť a verné podanie farieb.
            </li>
            <li>
              <strong>Profesionálne lepenie</strong>
              Odolný akvaristický silikón, čierna škára.
            </li>
            <li>
              <strong>Sklenené výstuhy</strong>
              Pozdĺžne, pri veľkých objemoch aj priečne.
            </li>
          </ul>
        </div>
      </section>

      {/* TERÁRIÁ — vetva, ktorá nemá katalóg, ale patrí sem */}
      <section className="section why-frame">
        <div className="wrap why-frame__grid">
          <div data-reveal="left">
            <span className="eyebrow eyebrow--rule">TERÁRIÁ</span>
            <h2 className="why-frame__title">Teráriá staviame rovnakou rukou</h2>
            <p className="why-frame__body">
              Suché aj vlhké teráriá vyrábame na mieru — s vetraním, prístupovými
              dvierkami a osvetlením podľa druhu, ktorý v nich bude bývať.
              Nemajú stálu ponuku rozmerov, tak ich riešime priamo v dopyte.
            </p>
            <Link href="/dopyt" className="btn-outline">
              DOPYT NA TERÁRIUM <span aria-hidden>→</span>
            </Link>
          </div>
          <ul
            className="why-frame__points"
            data-reveal
            style={{ "--rd": "100ms" } as React.CSSProperties}
          >
            <li>
              <strong>Vetranie a prístup</strong>
              Mriežky a dvierka podľa obyvateľa terária.
            </li>
            <li>
              <strong>Vlhké aj suché</strong>
              Paludáriá, tropické aj púštne osadenie.
            </li>
            <li>
              <strong>Rovnaké sklo</strong>
              Tá istá výroba a lepenie ako pri akváriách.
            </li>
          </ul>
        </div>
      </section>

      <section className="section catalog__cta">
        <div className="wrap catalog__cta-inner" data-reveal>
          <div>
            <h2 className="catalog__cta-title">
              Nádrž a skrinka sú jeden celok, nie dva nákupy.
            </h2>
            <p className="catalog__cta-body">
              Ku každému rozmeru vieme dodať skrinku na oceľovom ráme, ktorá váhu
              {" "}
              {AQUARIUMS[AQUARIUMS.length - 1].vol} vody unesie bezpečne.
            </p>
          </div>
          <div className="catalog__cta-actions">
            <Link href="/dopyt" className="btn-cyan">
              DOPYT NA MIERU <span aria-hidden>→</span>
            </Link>
            <Link href="/skrinky" className="btn-outline">
              Skrinky pod akváriá
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
