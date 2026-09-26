"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./brand";
import { NAV } from "./nav";
import { jazykZCesty, odkaz } from "./jazyk";
import JazykPrepinac from "./JazykPrepinac";
import { SLOVNIKY } from "./preklady";
import KosikTlacidlo from "./KosikTlacidlo";

/* Poradie stránok zľava doprava — z neho sa počíta smer prechodu.
   Cieľ napravo od aktuálnej = obsah odletí doľava a nový priletí sprava. */
const PORADIE: Record<string, number> = {
  "/": 0,
  "/skrinky": 1,
  "/akvaria": 2,
  "/sety": 3,
  "/technologia": 4,
  "/realizacie": 5,
  "/blog": 6,
  "/kontakt": 7,
  "/konfigurator": 8,
  "/kosik": 9,
};

function indexStranky(pathname: string): number {
  if (pathname === "/") return 0;
  const zhoda = Object.keys(PORADIE)
    .filter((p) => p !== "/" && pathname.startsWith(p))
    .sort((a, b) => b.length - a.length)[0];
  return zhoda ? PORADIE[zhoda] : 0;
}

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const jazyk = jazykZCesty(pathname);
  const t = SLOVNIKY[jazyk];
  /* odkazy aj porovnanie aktívnej položky bežia v aktuálnom jazyku */
  const l = (href: string) => odkaz(href, jazyk);
  const isActive = (href: string) =>
    href === "/" ? pathname === l("/") : pathname.startsWith(l(href));

  /* na anglickej verzii je domovom /en — inak by logo viedlo späť do SK */
  const jeDomov = pathname === l("/");

  const tu = indexStranky(pathname);
  const smer = (href: string): string[] | undefined => {
    const ciel = PORADIE[href] ?? 0;
    if (ciel === tu) return undefined;
    return [ciel > tu ? "nav-dopredu" : "nav-dozadu"];
  };

  /* Cestu domov drží drobček „Domov" na podstránkach — je stále na mieste a
     nič nevyskakuje. Bublina pri logu preto ostáva len ako popiska na hover;
     samovoľné pripomínanie by teraz iba prekrývalo drobčeka. */

  useEffect(() => {
    // prevziať menu od pred-hydratačného mini-handlera z layoutu:
    // ak ho používateľ stihol otvoriť, zosynchronizovať React stav
    (window as unknown as { __aqNavZije?: boolean }).__aqNavZije = true;
    if (document.querySelector(".nav__mobile")?.classList.contains("is-open")) {
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    /* lišta hore pri otvorenom menu stráca pozadie, nech logo leží na zábere */
    document.body.classList.toggle("menu-otvorene", open);
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("menu-otvorene");
    };
  }, [open]);

  return (
    <>
    <header className={`nav${scrolled ? " is-scrolled" : ""}`} style={{ viewTransitionName: "site-header" }}>
      <div className="wrap nav__inner">
        <div className="nav__brandwrap">
          <Link
            href={l("/")}
            className="nav__brand"
            transitionTypes={jeDomov ? undefined : ["nav-dozadu"]}
            aria-label={t.nav.logoPopis}
            aria-describedby={jeDomov ? undefined : "nav-tip"}
            onClick={(e) => {
              setOpen(false);
              // po kliku pustiť fokus, inak :focus-within drží bublinu
              // zobrazenú aj po dopravení na domovskú stránku
              e.currentTarget.blur();
            }}
          >
            <Logo />
          </Link>
          {/* doma bublina nemá čo hovoriť — „naspäť domov" už si */}
          {!jeDomov && (
            <span className="nav__tip" id="nav-tip" role="tooltip">
              <span className="nav__tip-ico" aria-hidden>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M4 11 12 4.5 20 11" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6.5 9.6V19h11V9.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              {t.nav.spatNaUvod}
            </span>
          )}
        </div>
        <nav className="nav__links">
          {NAV.map((item) => (
            <Link
              key={item.kluc}
              href={l(item.href)}
              transitionTypes={smer(item.href)}
              className={`nav__link${isActive(item.href) ? " is-active" : ""}`}
            >
              {t.nav[item.kluc]}
            </Link>
          ))}
        </nav>
        <JazykPrepinac jazyk={jazyk} pathname={pathname} />
        <Link
          href={l("/konfigurator")}
          transitionTypes={smer("/konfigurator")}
          className="nav__cta"
        >
          {t.nav.konfigurator}
        </Link>
        <KosikTlacidlo />
        <button
          className={`nav__burger${open ? " is-open" : ""}`}
          aria-label={open ? t.nav.zavrietMenu : t.nav.otvoritMenu}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>

      {/* menu je zámerne MIMO headera — view-transition-name na headeri
          vynucuje paint containment a fixed menu vnútri by sa na časti
          prehliadačov (Safari) orezalo na výšku lišty */}
      <div
        className={`nav__mobile${open ? " is-open" : ""}`}
        /* zatvorené menu nesmie ostať v poradí prechádzania klávesnicou —
           samotná priehľadnosť ho skryje len pre oko, nie pre tabulátor */
        aria-hidden={!open}
        inert={!open}
        // inline štýly namiesto spoliehania sa na class-match: pri prvom
        // otvorení po načítaní stránky prehliadač pravidlo .is-open aplikoval
        // až s ~1s oneskorením (menu pôsobilo mŕtvo). Inline platí okamžite,
        // CSS transition na base triede animuje aj zmeny inline hodnôt.
        style={{
          opacity: open ? 1 : 0,
          transform: open ? "none" : "translateY(-10px)",
          pointerEvents: open ? "auto" : "none",
        }}
      >
        <nav className="nav__mobile-links">
          {NAV.map((item, i) => (
            <Link
              key={item.kluc}
              href={l(item.href)}
              transitionTypes={smer(item.href)}
              className={`nav__mobile-link${isActive(item.href) ? " is-active" : ""}`}
              style={{ "--i": i } as React.CSSProperties}
              onClick={() => setOpen(false)}
            >
              <span>{t.nav[item.kluc]}</span>
              <span className="nav__mobile-arr" aria-hidden>
                →
              </span>
            </Link>
          ))}
        </nav>
        <Link
          href={l("/konfigurator")}
          transitionTypes={smer("/konfigurator")}
          className="btn-cyan nav__mobile-cta"
          onClick={() => setOpen(false)}
        >
          <svg className="nav__mobile-cta-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" />
            <circle cx="9" cy="7" r="2" fill="currentColor" stroke="none" />
            <circle cx="15" cy="12" r="2" fill="currentColor" stroke="none" />
            <circle cx="8" cy="17" r="2" fill="currentColor" stroke="none" />
          </svg>
          {t.nav.konfigurator} <span aria-hidden>→</span>
        </Link>
        <JazykPrepinac
          jazyk={jazyk}
          pathname={pathname}
          variant="mobil"
          onVyber={() => setOpen(false)}
        />
        {/* spodná lišta so štyrmi cieľmi — ako v natívnej aplikácii */}
        <nav className="nav__mobile-tabs" aria-label={t.nav.taby.join(", ")}>
          {(
            [
              ["/", t.nav.taby[0], "M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"],
              ["/skrinky", t.nav.taby[1], "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"],
              ["/kosik", t.nav.taby[2], "M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 8H6.5M9 20a1 1 0 1 0 0-.1M17 20a1 1 0 1 0 0-.1"],
              ["/kontakt", t.nav.taby[3], "M4 6h16v12H4zM4 7l8 6 8-6"],
            ] as [string, string, string][]
          ).map(([href, popis, cesta]) => (
            <Link
              key={href}
              href={l(href)}
              transitionTypes={smer(href)}
              className={`nav__mobile-tab${isActive(href) ? " is-active" : ""}`}
              onClick={() => setOpen(false)}
            >
              <span className="nav__mobile-tab-ico" aria-hidden>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
                  <path d={cesta} />
                </svg>
              </span>
              {popis}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
