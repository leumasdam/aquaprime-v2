"use client";

import { useEffect } from "react";

/**
 * Pri prechode medzi stránkami zastaví všetky videá na pozadí.
 *
 * Prehliadač si pred prechodom odfotí celú starú stránku. Bežiace video je
 * pri tom zďaleka najdrahšie — na úvodnej stránke predĺžilo odfotenie asi
 * o sekundu v Chrome a výrazne viac v Safari, kde prechod pôsobil, akoby
 * stránka zamrzla. Zastavené video sa odfotí ako obyčajný obrázok.
 *
 * Videá sa už nerozbiehajú: stará stránka sa aj tak zahodí a na novej si
 * ich spustí PozadieVideo sám.
 */
export default function PauzaPriPrechode() {
  useEffect(() => {
    const zastav = () => {
      document.querySelectorAll("video").forEach((v) => {
        if (!v.paused) v.pause();
      });
    };
    const klik = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      // len prechody v rámci webu na inú adresu — kotvy na tej istej stránke nie
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      zastav();
    };
    document.addEventListener("click", klik, true);
    window.addEventListener("popstate", zastav);
    return () => {
      document.removeEventListener("click", klik, true);
      window.removeEventListener("popstate", zastav);
    };
  }, []);

  return null;
}
