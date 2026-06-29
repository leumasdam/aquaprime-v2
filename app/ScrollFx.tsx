"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Sleduje všetky [data-reveal] prvky a po vstupe do viewportu im pridá
 * triedu .is-in (animáciu rieši CSS). Re-skenuje pri každej zmene routy,
 * aby fungoval aj pri client-side navigácii.
 */
export default function ScrollFx() {
  const pathname = usePathname();

  useEffect(() => {
    let io: IntersectionObserver | null = null;
    const raf = requestAnimationFrame(() => {
      const els = Array.from(
        document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)")
      );
      if (!("IntersectionObserver" in window) || els.length === 0) {
        els.forEach((el) => el.classList.add("is-in"));
        return;
      }
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("is-in");
              io?.unobserve(e.target);
            }
          });
        },
        { threshold: 0.14, rootMargin: "0px 0px -7% 0px" }
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
