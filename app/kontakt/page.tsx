import Link from "next/link";
import KontaktForm from "../KontaktForm";
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

const FAQ = [
  {
    q: "Ako dlho trvá výroba?",
    a: "Bežné rozmery z cenníka zvládneme spravidla do dvoch až troch týždňov. Atypický rozmer alebo kompletná zostava s opláštenou skrinkou si vyžiada o niečo viac — presný termín potvrdíme v ponuke.",
  },
  {
    q: "Viete vyrobiť rozmer, ktorý v cenníku nie je?",
    a: "Áno, na mieru vyrábame prakticky akýkoľvek rozmer. Cenník je prehľad overených veľkostí, nie zoznam limitov. Napíšte rozmer do formulára — hore sa vám hneď dopočíta objem aj zaťaženie.",
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
      <section className="sub__head section">
        <div className="sub__head-glow" />
        <div className="wrap">
          <span className="eyebrow eyebrow--rule sub__eyebrow" data-reveal="fade">
            KONTAKT
          </span>
          <h1 className="sub__title" data-reveal>
            Ozvite sa. Radi poradíme.
          </h1>
          <p className="sub__lead" data-reveal style={{ ["--rd" as string]: "90ms" }}>
            Či riešite prvé akvárium do obývačky alebo náročný projekt na mieru —
            napíšte nám rozmer a zvyšok si formulár dopočíta sám.
          </p>
        </div>
      </section>

      <section className="section kontakt__channels">
        <div className="wrap">
          <div className="kontakt__grid">
            {KANALY.map((c, i) => (
              <a
                href={c.href}
                key={c.tag}
                className="kontakt__card"
                data-reveal
                style={{ ["--rd" as string]: `${i * 90}ms` }}
              >
                <span className="kontakt__icon" aria-hidden>
                  {c.icon}
                </span>
                <span className="kontakt__tag">{c.tag}</span>
                <h2 className="kontakt__card-title">{c.title}</h2>
                <p className="kontakt__card-body">{c.body}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section kontakt__main" id="formular">
        <div className="wrap kontakt__layout">
          <aside className="kontakt__aside" data-reveal="left">
            <h2 className="kontakt__aside-title">Čo sa stane po odoslaní</h2>
            <ol className="kontakt__steps">
              <li>
                <strong>Ozveme sa vám</strong>
                Do 24 hodín v pracovný deň, na e-mail alebo telefón — podľa toho,
                čo vyplníte.
              </li>
              <li>
                <strong>Doladíme zadanie</strong>
                Rozmer, dekor, technika a termín. Keď treba, poradíme aj to, čo si
                objednať nemusíte.
              </li>
              <li>
                <strong>Pošleme ponuku</strong>
                S presnou cenou a termínom výroby. Nezáväzne — nič neplatíte
                vopred.
              </li>
            </ol>
            <div className="kontakt__meta">
              <div>
                <span>Fakturačné údaje</span>
                AQUAPRIME s. r. o. · IČO 00 000 000
              </div>
              <div>
                <span>Kde nás nájdete</span>
                Bratislava · návšteva po dohode
              </div>
            </div>
            <p className="kontakt__aside-note">
              Máte hotový návrh?{" "}
              <Link href="/konfigurator">Zostavte si ho v konfigurátore</Link> a
              pošlite rovno odtiaľ.
            </p>
          </aside>

          <div className="kontakt__panel" data-reveal>
            <KontaktForm />
          </div>
        </div>
      </section>

      <section className="section kontakt__faq">
        <div className="wrap">
          <h2 className="kontakt__faq-title" data-reveal>
            Časté otázky
          </h2>
          <div className="kontakt__faq-list">
            {FAQ.map((f, i) => (
              <details
                key={f.q}
                className="kontakt__faq-item"
                data-reveal
                style={{ ["--rd" as string]: `${i * 60}ms` }}
              >
                <summary>
                  {f.q}
                  <span aria-hidden />
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
