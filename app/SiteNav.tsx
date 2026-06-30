"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./brand";
import { NAV } from "./nav";

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

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
        <Link
          href="/"
          className="nav__brand"
          aria-label="AQUAPRIME — domov"
          onClick={() => setOpen(false)}
        >
          <Logo />
        </Link>
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
