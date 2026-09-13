"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { druhyJazyk, type Jazyk } from "./jazyk";
import { SLOVNIKY } from "./preklady";

const KODY: Record<Jazyk, string> = { sk: "SK", en: "EN" };

/**
 * Prepínač jazyka. Zatvorený ukazuje AKTUÁLNY jazyk stránky — nie ten, na
 * ktorý sa prepne (predtým svietilo „EN" na slovenskej stránke a mýlilo to).
 * Po otvorení sú vidieť obe možnosti a aktívna je zvýraznená.
 *
 * Otvára sa hoverom (desktop) aj klikom (dotyk), preto stav aj CSS :hover.
 */
export default function JazykPrepinac({
  jazyk,
  pathname,
  variant = "nav",
  onVyber,
}: {
  jazyk: Jazyk;
  pathname: string;
  /** "nav" = rozbaľovací v lište, "mobil" = obe možnosti vedľa seba v menu */
  variant?: "nav" | "mobil";
  onVyber?: () => void;
}) {
  const t = SLOVNIKY[jazyk].nav;
  const [otvorene, setOtvorene] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!otvorene) return;
    const mimo = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOtvorene(false);
    };
    const klavesa = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOtvorene(false);
    };
    document.addEventListener("pointerdown", mimo);
    document.addEventListener("keydown", klavesa);
    return () => {
      document.removeEventListener("pointerdown", mimo);
      document.removeEventListener("keydown", klavesa);
    };
  }, [otvorene]);

  const nazov = (j: Jazyk) => (j === "sk" ? t.jazykSk : t.jazykEn);

  const moznost = (j: Jazyk) =>
    j === jazyk ? (
      <span key={j} className="jazyk__opt is-on" aria-current="true" lang={j}>
        {KODY[j]}
        <em>{`(${t.jazykAktivny})`}</em>
      </span>
    ) : (
      <Link
        key={j}
        href={druhyJazyk(pathname, jazyk)}
        className="jazyk__opt"
        hrefLang={j}
        lang={j}
        aria-label={nazov(j)}
        onClick={() => {
          setOtvorene(false);
          onVyber?.();
        }}
      >
        {KODY[j]}
      </Link>
    );

  if (variant === "mobil") {
    return (
      <div className="jazyk jazyk--mobil" role="group" aria-label={t.jazyk}>
        <span className="jazyk__popis">{t.jazyk}</span>
        <div className="jazyk__opts">{[moznost("sk"), moznost("en")]}</div>
      </div>
    );
  }

  return (
    <div
      className={`jazyk${otvorene ? " is-open" : ""}`}
      ref={box}
      role="group"
      aria-label={t.jazyk}
    >
      <button
        type="button"
        className="jazyk__btn"
        aria-expanded={otvorene}
        aria-label={`${t.jazyk}: ${nazov(jazyk)}`}
        onClick={() => setOtvorene((o) => !o)}
      >
        {KODY[jazyk]}
        <svg viewBox="0 0 10 6" aria-hidden className="jazyk__sipka">
          <path d="M1 1.2 5 4.8 9 1.2" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      </button>
      {/* poradie SK → EN je pevné, aby sa zoznam medzi jazykmi nepreskupoval */}
      <div className="jazyk__panel">{[moznost("sk"), moznost("en")]}</div>
    </div>
  );
}
