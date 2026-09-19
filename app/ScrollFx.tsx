"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Sleduje všetky [data-reveal] prvky a po vstupe do viewportu ich označí
 * (animáciu rieši CSS). Re-skenuje pri každej zmene routy, aby fungoval aj
 * pri client-side navigácii.
 *
 * Označenie ide cez atribút data-in, nie len cez triedu: className si React
 * pri prekreslení prepíše celý, takže prvok, ktorý si mení modifikátor za
 * behu (napr. galéria pri prepnutí na LED), by o triedu prišiel a zostal
 * neviditeľný. Trieda .is-in sa pridáva tiež, viažu sa na ňu ďalšie efekty.
 */
function oznac(el: HTMLElement) {
  el.dataset.in = "";
  el.classList.add("is-in");
}

export default function ScrollFx() {
  const pathname = usePathname();

  useEffect(() => {
    let io: IntersectionObserver | null = null;
    const raf = requestAnimationFrame(() => {
      const els = Array.from(
        document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-in])")
      );
      if (!("IntersectionObserver" in window) || els.length === 0) {
        els.forEach((el) => oznac(el));
        return;
      }
      /* Prah 14 % platí pre bežné bloky. Vysoký prvok (formulár na Kontakte
         je dlhší než obrazovka telefónu) by 14 % svojej výšky nikdy naraz
         neukázal a po načítaní zostal neviditeľný, kým človek nescrolloval.
         Stačí preto aj 120 px viditeľnej výšky. */
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            const dost = e.intersectionRatio >= 0.14 || e.intersectionRect.height >= 120;
            if (e.isIntersecting && dost) {
              oznac(e.target as HTMLElement);
              io?.unobserve(e.target);
            }
          });
        },
        { threshold: [0, 0.14], rootMargin: "0px 0px -7% 0px" }
      );
      els.forEach((el) => io!.observe(el));
    });
    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
    };
  }, [pathname]);

  return null;
}
