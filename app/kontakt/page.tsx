import Link from "next/link";
import KontaktForm from "../KontaktForm";
import Drobcek from "../Drobcek";
import "./kontakt.css";

export const metadata = {
  title: "Kontakt | AQUAPRIME",
  description:
    "Ozvite sa AQUAPRIME — e-mail, telefón a showroom v Bratislave. Formulár si sám dopočíta objem, hrúbku skla aj vhodnú skrinku k vášmu rozmeru.",
};

const KANALY = [
  {
    tag: "E-MAIL",
    title: "ahoj@aquaprime.sk",
    body: "Odpovedáme spravidla do 24 hodín v pracovný deň.",
    href: "mailto:ahoj@aquaprime.sk",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
        <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
        <path d="m3.6 6.5 8.4 6 8.4-6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    tag: "TELEFÓN",
    title: "+421 900 000 000",
    body: "Po – Pia, 9:00 – 17:00. Poradíme aj cez telefón.",
    href: "tel:+421900000000",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path
          d="M6.2 3.8h3l1.5 3.7-2 1.4a11 11 0 0 0 5.4 5.4l1.4-2 3.7 1.5v3a1.6 1.6 0 0 1-1.8 1.6C10.6 17.7 6.3 13.4 4.6 5.6A1.6 1.6 0 0 1 6.2 3.8Z"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    tag: "SHOWROOM",
    title: "Bratislava",
    body: "Nádrže aj skrinky si pozriete naživo — po dohode termínu.",
    href: "#formular",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11Z" strokeLinejoin="round" />
        <circle cx="12" cy="10" r="2.6" />
      </svg>
    ),
  },
];

const KROKY = [
  {
    t: "Ozveme sa vám",
    b: "Do 24 hodín v pracovný deň, na e-mail alebo telefón — podľa toho, čo vyplníte.",
  },
  {
    t: "Doladíme zadanie",
    b: "Rozmer, dekor, technika a termín. Keď treba, poradíme aj to, čo si objednať nemusíte.",
  },
  {
    t: "Pošleme ponuku",
    b: "S presnou cenou a termínom výroby. Nezáväzne — nič neplatíte vopred.",
  },
];

const FAQ = [
  {
    q: "Ako dlho trvá výroba?",
    a: "Bežné rozmery z cenníka zvládneme spravidla do dvoch až troch týždňov. Atypický rozmer alebo kompletná zostava s opláštenou skrinkou si vyžiada o niečo viac — presný termín potvrdíme v ponuke.",
  },
  {
    q: "Viete vyrobiť rozmer, ktorý v cenníku nie je?",
    a: "Áno, na mieru vyrábame prakticky akýkoľvek rozmer. Cenník je prehľad overených veľkostí, nie zoznam limitov. Napíšte rozmer do formulára — hneď sa vám dopočíta objem aj zaťaženie.",
  },
  {
    q: "Musím kúpiť nádrž aj skrinku spolu?",
    a: "Nemusíte, ale navrhujeme ich ako jeden celok. Akvárium s objemom v stovkách litrov je extrémna statická záťaž a rám ju musí niesť po celej ploche dna — preto nádrž nikdy nesmie pretŕčať cez pôdorys skrinky.",
  },
  {
    q: "Doručujete aj mimo Bratislavy?",
    a: "Áno, po celom Slovensku. Pri veľkých nádržiach riešime dopravu individuálne vrátane vynesenia a osadenia na mieste — napíšte nám adresu a poschodie.",
  },
];

export default function Page() {
  return (
    <main className="sub kontakt" style={{ ["--accent" as string]: "var(--cyan)" }}>
      <section className="kontakt__head">
        <div className="sub__head-glow" />
        <div className="wrap">
          <div className="kontakt__crumb" data-reveal="fade">
            <Drobcek cesta={[{ nazov: "Kontakt" }]} />
          </div>
          <span className="eyebrow eyebrow--rule" data-reveal="fade">
            KONTAKT
          </span>
          <h1 className="kontakt__title" data-reveal>
            Ozvite sa. Radi poradíme.
          </h1>
          <p className="kontakt__lead" data-reveal style={{ ["--rd" as string]: "90ms" }}>
            Či riešite prvé akvárium do obývačky alebo náročný projekt na mieru —
            napíšte nám rozmer a zvyšok si formulár dopočíta sám.
          </p>
        </div>
      </section>

      {/* Všetko ďalej stojí na jednom 12-stĺpcovom gride s jednou medzerou,
          takže karty, formulár aj otázky sedia na tie isté zvislé osi. */}
      <div className="wrap kontakt__grid" id="formular">
        {KANALY.map((c) => (
          <a href={c.href} key={c.tag} className="kcard kontakt__ch" data-reveal>
            <span className="kontakt__ch-icon" aria-hidden>
              {c.icon}
            </span>
            <span className="kontakt__ch-tag">{c.tag}</span>
            <span className="kontakt__ch-title">{c.title}</span>
            <span className="kontakt__ch-body">{c.body}</span>
          </a>
        ))}

        <div className="kcard kontakt__formcard" data-reveal>
          <KontaktForm />
        </div>

        <aside className="kontakt__rail">
          <div className="kcard">
            <h2 className="kontakt__rail-title">Čo sa stane po odoslaní</h2>
            <ol className="kontakt__steps">
              {KROKY.map((k) => (
                <li key={k.t}>
                  <strong>{k.t}</strong>
                  {k.b}
                </li>
              ))}
            </ol>
          </div>

          <div className="kcard kontakt__meta">
            <div>
              <span>Fakturačné údaje</span>
              AQUAPRIME s. r. o. · IČO 00 000 000
            </div>
            <div>
              <span>Kde nás nájdete</span>
              Bratislava · návšteva po dohode
            </div>
            <div>
              <span>Máte hotový návrh?</span>
              <Link href="/konfigurator">Zostavte si ho v konfigurátore</Link> a
              pošlite rovno odtiaľ.
            </div>
          </div>
        </aside>

        <section className="kontakt__faq">
          <h2 className="kontakt__faq-title" data-reveal>
            Časté otázky
          </h2>
          <div className="kontakt__faq-grid">
            {FAQ.map((f) => (
              <details key={f.q} className="kcard kontakt__faq-item" data-reveal>
                <summary>
                  {f.q}
                  <span aria-hidden />
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
