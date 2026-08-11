"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./brand";
import { NAV } from "./nav";
import KosikTlacidlo from "./KosikTlacidlo";

/* Poradie stránok zľava doprava — z neho sa počíta smer prechodu.
   Cieľ napravo od aktuálnej = obsah odletí doľava a nový priletí sprava. */
const PORADIE: Record<string, number> = {
  "/": 0,
  "/skrinky": 1,
  "/akvaria": 2,
  "/technologia": 3,
  "/realizacie": 4,
  "/kontakt": 5,
  "/konfigurator": 6,
  "/kosik": 7,
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
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

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
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className={`nav${scrolled ? " is-scrolled" : ""}`} style={{ viewTransitionName: "site-header" }}>
      <div className="wrap nav__inner">
        <div className="nav__brandwrap">
          <Link
            href="/"
            className="nav__brand"
            transitionTypes={pathname === "/" ? undefined : ["nav-dozadu"]}
            aria-label="AQUAPRIME — späť na úvodnú stránku"
            aria-describedby="nav-tip"
            onClick={() => {
              setOpen(false);
            }}
          >
            <Logo />
          </Link>
          <span className="nav__tip" id="nav-tip" role="tooltip">
            <span className="nav__tip-ico" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M4 11 12 4.5 20 11" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6.5 9.6V19h11V9.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            Odplávaj naspäť domov
          </span>
        </div>
        <nav className="nav__links">
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              transitionTypes={smer(item.href)}
              className={`nav__link${isActive(item.href) ? " is-active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <span className="nav__lang">SK ⌄</span>
        <Link
          href="/konfigurator"
          transitionTypes={smer("/konfigurator")}
          className="nav__cta"
        >
          KONFIGURÁTOR
        </Link>
        <KosikTlacidlo />
        <button
          className={`nav__burger${open ? " is-open" : ""}`}
          aria-label={open ? "Zavrieť menu" : "Otvoriť menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div className={`nav__mobile${open ? " is-open" : ""}`}>
        <nav className="nav__mobile-links">
          {NAV.map((item, i) => (
            <Link
              key={item.label}
              href={item.href}
              transitionTypes={smer(item.href)}
              className="nav__mobile-link"
              style={{ "--i": i } as React.CSSProperties}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/konfigurator"
          transitionTypes={smer("/konfigurator")}
          className="btn-cyan nav__mobile-cta"
          onClick={() => setOpen(false)}
        >
          KONFIGURÁTOR <span aria-hidden>→</span>
        </Link>
      </div>
    </header>
  );
}
