"use client";

import { useEffect } from "react";

/**
 * Drobné interakcie pre myš: hlavné tlačidlá sa priťahujú ku kurzoru a
 * produktové karty sa za ním jemne nakláňajú, akoby plávali.
 *
 * Beží len tam, kde je kurzor (nie dotyk) a kde používateľ nemá obmedzený
 * pohyb. Používa vlastnosť `translate` a Web Animations API, takže sa
 * nebije s existujúcimi transform a transition pravidlami v CSS.
 */
const MAGNET = ".btn-cyan, .hero__btn, .vhero__odkaz:not(.vhero__odkaz--tichy), .ck__btn--hlavny, .nav__cta";
const KARTA = ".product";
const DOSAH = 6; // px, o koľko sa tlačidlo najviac posunie
const NAKLON = 4; // deg, najväčší náklon karty

export default function Mikro() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const vrat = (el: HTMLElement, vlastnost: "translate" | "transform") => {
      const z = el.style[vlastnost];
      if (!z) return;
      const ciel = vlastnost === "translate" ? "0px 0px" : "";
      el.animate([{ [vlastnost]: z }, { [vlastnost]: ciel || "none" }], {
        duration: 420,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      });
      el.style[vlastnost] = "";
    };

    const pohyb = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t?.closest) return;

      const tl = t.closest<HTMLElement>(MAGNET);
      if (tl) {
        const r = tl.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        tl.style.translate = `${(dx * DOSAH).toFixed(1)}px ${(dy * DOSAH).toFixed(1)}px`;
      }

      const k = t.closest<HTMLElement>(KARTA);
      if (k) {
        const r = k.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        // karta je pri hoveri v CSS zdvihnutá o 6 px — držíme to aj tu
        k.style.transform = `perspective(900px) rotateX(${(-py * NAKLON).toFixed(2)}deg) rotateY(${(px * NAKLON).toFixed(2)}deg) translateY(-6px)`;
      }
    };

    const odchod = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t?.closest) return;
      const kam = e.relatedTarget as HTMLElement | null;
      const tl = t.closest<HTMLElement>(MAGNET);
      if (tl && !(kam && tl.contains(kam))) vrat(tl, "translate");
      const k = t.closest<HTMLElement>(KARTA);
      if (k && !(kam && k.contains(kam))) vrat(k, "transform");
    };

    document.addEventListener("pointermove", pohyb, { passive: true });
    document.addEventListener("pointerout", odchod, { passive: true });
    return () => {
      document.removeEventListener("pointermove", pohyb);
      document.removeEventListener("pointerout", odchod);
    };
  }, []);

  return null;
}
