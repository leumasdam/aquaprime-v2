"use client";

import { useEffect, useRef } from "react";

/**
 * Dvojica záberov, ktorá reaguje na smer skrolovania.
 *
 * Na Konštrukcii sa rám pri pohybe nadol opláštia a pri pohybe nahor sa
 * rovnakou cestou vyzlečie. Prehliadač nevie prehrávať video pozpiatku, preto
 * sú to dva súbory: jeden nafotený dopredu, druhý ten istý pozpiatku. Pri
 * zmene smeru sa druhý nastaví na zrkadlový čas a prepne sa naň. Prehráva sa
 * teda vždy dopredu, čo je plynulé aj na telefóne — pretáčanie po snímkoch
 * trhalo obraz a na konci nahrávky sa občas vôbec nechytilo.
 */
export default function VideoNaScroll({
  src,
  srcSpat,
  poster,
  className,
}: {
  src: string;
  /** ten istý záber pozpiatku */
  srcSpat: string;
  poster: string;
  className?: string;
}) {
  const vpred = useRef<HTMLVideoElement>(null);
  const spat = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const a = vpred.current;
    const b = spat.current;
    if (!a || !b) return;

    const dlzka = () => (Number.isFinite(a.duration) ? a.duration : 1.13);
    const zrkadlo = (v: HTMLVideoElement) => Math.max(0, dlzka() - v.currentTime);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const koniec = () => {
        a.currentTime = dlzka() - 0.05;
      };
      if (a.readyState >= 1) koniec();
      else a.addEventListener("loadedmetadata", koniec, { once: true });
      return;
    }

    /** true = beží opláštenie, false = beží vyzliekanie */
    let dopredu = true;

    const prepni = (naDopredu: boolean) => {
      const bezi = naDopredu ? a : b;
      const stoji = naDopredu ? b : a;
      if (naDopredu !== dopredu) {
        bezi.currentTime = zrkadlo(stoji);
        dopredu = naDopredu;
      }
      stoji.pause();
      stoji.style.opacity = "0";
      bezi.style.opacity = "1";
      if (bezi.currentTime < dlzka() - 0.05) bezi.play().catch(() => null);
    };

    let poslednaY = window.scrollY;
    const uprav = () => {
      const y = window.scrollY;
      const smer = y - poslednaY;
      poslednaY = y;
      if (smer > 1) prepni(true);
      else if (smer < -1 || y <= 8) prepni(false);
    };

    a.pause();
    b.pause();
    b.style.opacity = "0";
    window.addEventListener("scroll", uprav, { passive: true });
    return () => window.removeEventListener("scroll", uprav);
  }, []);

  return (
    <>
      <video ref={vpred} className={className} muted playsInline preload="auto" poster={poster}>
        <source src={src} type="video/mp4" />
      </video>
      <video ref={spat} className={className} muted playsInline preload="auto" aria-hidden>
        <source src={srcSpat} type="video/mp4" />
      </video>
    </>
  );
}
