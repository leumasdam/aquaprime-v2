"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/**
 * Záber, ktorý sa rozsvieti pri pohybe stránky a hore zase zhasne.
 *
 * Sú to dve fotky tej istej scény, zhasnutá a rozsvietená, položené na sebe.
 * Pohyb zo samého vrchu prepne krytie vrchnej na plné a zvyšok dobehne
 * prechod v CSS, takže rozsvietenie prebehne celé bez ohľadu na dĺžku
 * skrolovania. Návrat na vrch scénu opäť zhasne.
 *
 * V pokoji nie je scéna úplne tmavá — pri nule by hero pôsobil ako čierna
 * plocha, preto sa začína na šestine svetla.
 */
const POKOJ = 0.3;

export default function SvetloHero({
  tma,
  svetlo,
  className,
}: {
  tma: string;
  svetlo: string;
  className?: string;
}) {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--svetlo", "1");
      return;
    }

    // Rozhoduje jediná vec: či je stránka na samom vrchu. Prvý pohyb izbu
    // rozsvieti celú, návrat hore ju zase zhasne. Zámerne to nie je viazané
    // na prejdenú dráhu — pri viazaní nábeh dobiehal až mimo hero sekcie.
    let svieti = -1;
    const uprav = () => {
      const ma = window.scrollY > 8 ? 1 : 0;
      if (ma === svieti) return;
      svieti = ma;
      el.style.setProperty("--svetlo", ma ? "1" : String(POKOJ));
    };

    uprav();
    window.addEventListener("scroll", uprav, { passive: true });
    return () => window.removeEventListener("scroll", uprav);
  }, []);

  return (
    <div className={`svetlo${className ? " " + className : ""}`} ref={box} aria-hidden>
      <Image className="svetlo__vrstva" src={tma} alt="" fill priority sizes="100vw" />
      <Image
        className="svetlo__vrstva svetlo__vrstva--zapnute"
        src={svetlo}
        alt=""
        fill
        priority
        sizes="100vw"
      />
    </div>
  );
}
