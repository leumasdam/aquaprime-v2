"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./brand";
import { NAV } from "./nav";
import KosikTlacidlo from "./KosikTlacidlo";

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [peek, setPeek] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  /* Úvod nemá vlastnú položku v navigácii — cesta domov je logo. Na podstránke
     to sem-tam pripomenieme: krátko sa ukáže, zmizne a o chvíľu znova.
     Keď je záložka v pozadí, nepripomíname — nikto to tam nevidí. */
  useEffect(() => {
    if (pathname === "/") return;

    const TRVANIE = 4500;
    const PAUZA = 60000;
    let skryt: ReturnType<typeof setTimeout>;

    const ukaz = () => {
      if (document.hidden) return;
      setPeek(true);
      skryt = setTimeout(() => setPeek(false), TRVANIE);
    };

    const prvy = setTimeout(ukaz, 2000);
    const opakovanie = setInterval(ukaz, PAUZA);

    return () => {
      clearTimeout(prvy);
      clearTimeout(skryt);
      clearInterval(opakovanie);
      setPeek(false);
    };
  }, [pathname]);

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
    <header className={`nav${scrolled ? " is-scrolled" : ""}`}>
      <div className="wrap nav__inner">
        <div className={`nav__brandwrap${peek ? " is-peek" : ""}`}>
          <Link
            href="/"
            className="nav__brand"
            aria-label="AQUAPRIME — späť na úvodnú stránku"
            aria-describedby="nav-tip"
            onClick={() => {
              setOpen(false);
              setPeek(false);
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
            Klik sem a odplávaš naspäť na domovskú stránku
          </span>
        </div>
        <nav className="nav__links">
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`nav__link${isActive(item.href) ? " is-active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <span className="nav__lang">SK ⌄</span>
        <Link href="/konfigurator" className="nav__cta">
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
          className="btn-cyan nav__mobile-cta"
          onClick={() => setOpen(false)}
        >
          KONFIGURÁTOR <span aria-hidden>→</span>
        </Link>
      </div>
    </header>
  );
}
