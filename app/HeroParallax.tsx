"use client";

import { useEffect } from "react";

// Scroll-driven zoom/pan na mobilnej hero fotke (split). Renderuje nič.
export default function HeroParallax() {
  useEffect(() => {
    if (!window.matchMedia("(max-width: 600px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const bg = document.querySelector(".hero__bg2") as HTMLElement | null;
    const hero = document.querySelector(".hero") as HTMLElement | null;
    if (!bg || !hero) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const h = hero.offsetHeight || 1;
      const p = Math.min(Math.max(window.scrollY / h, 0), 1);
      bg.style.backgroundSize = `auto ${116 + p * 90}%`;
      bg.style.backgroundPositionY = `${34 + p * 38}%`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
