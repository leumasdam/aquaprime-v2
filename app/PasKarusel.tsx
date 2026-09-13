"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Vodorovný pás, ktorý sa sám prepína na ďalšiu kartu.
 *
 * Používa sa na dvojicu faktov pod hero sekciou: na telefóne je vidno vždy
 * jednu kartu a pás sa raz za čas posunie na ďalšiu. Keď doň človek siahne,
 * prepínanie sa na chvíľu zastaví, aby mu nepodbiehalo pod prstom.
 */
const INTERVAL = 5200;      // ako často sa posunie
const PAUZA = 9000;         // ticho po dotyku

export default function PasKarusel({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const pas = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = pas.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let rucne = 0;
    const oznacRucne = () => {
      rucne = Date.now();
    };
    el.addEventListener("pointerdown", oznacRucne);
    el.addEventListener("wheel", oznacRucne, { passive: true });
    el.addEventListener("touchstart", oznacRucne, { passive: true });

    const casovac = window.setInterval(() => {
      // beží len kým je pás na obrazovke a naozaj sa má čo posúvať
      if (Date.now() - rucne < PAUZA) return;
      if (el.scrollWidth - el.clientWidth < 20) return;
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      const naKonci = el.scrollLeft >= el.scrollWidth - el.clientWidth - 4;
      el.scrollTo({ left: naKonci ? 0 : el.scrollLeft + el.clientWidth, behavior: "smooth" });
    }, INTERVAL);

    return () => {
      window.clearInterval(casovac);
      el.removeEventListener("pointerdown", oznacRucne);
      el.removeEventListener("wheel", oznacRucne);
      el.removeEventListener("touchstart", oznacRucne);
    };
  }, []);

  return (
    <div className={className} ref={pas}>
      {children}
    </div>
  );
}
