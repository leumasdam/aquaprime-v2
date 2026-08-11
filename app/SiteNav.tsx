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
     to raz za návštevu jemne pripomenieme, potom už len na prejdenie myšou. */
  useEffect(() => {
    if (pathname === "/") return;
    let seen = false;
    try {
      seen = sessionStorage.getItem("aq:navtip") === "1";
    } catch {
      seen = true;
    }
    if (seen) return;
    const show = setTimeout(() => {
      setPeek(true);
      try {
        sessionStorage.setItem("aq:navtip", "1");
      } catch {
        /* ignore */
      }
    }, 1400);
    const hide = setTimeout(() => setPeek(false), 6200);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
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
            Logo je cesta domov
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
        <KosikTlacidlo />
        <Link href="/konfigurator" className="nav__cta">
          KONFIGURÁTOR
        </Link>
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
