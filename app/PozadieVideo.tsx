"use client";

import { useEffect, useRef } from "react";

/**
 * Dekoratívne video na pozadí sekcie. Prehráva sa len kým je na obrazovke,
 * rešpektuje „prefers-reduced-motion" a kým sa nezačne prehrávať, drží
 * miesto poster. Nie je to obsah, preto je pre čítačky skryté.
 */
export default function PozadieVideo({
  src,
  poster,
  className,
}: {
  src: string;
  poster: string;
  className?: string;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const nahlad = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    /* React vykreslí `muted` len ako vlastnosť, nie ako atribút. Safari na
       iPhone sa pri rozhodovaní, či smie video spustiť bez dotyku, pozerá na
       atribút, takže bez neho prehrávanie ticho odmietne. */
    element.muted = true;
    element.setAttribute("muted", "");
    element.setAttribute("autoplay", "");
    element.setAttribute("webkit-playsinline", "");
    element.setAttribute("playsinline", "");

    /* Keby prehliadač spustenie odmietol (napríklad iPhone v režime šetrenia
       energie), video by ostalo stáť s ikonou prehrať. Skúsime to preto znova
       pri prvom dotyku či posune stránky. */
    const znovaSkus = () => {
      element.play().then(odpoj).catch(() => null);
    };
    const odpoj = () => {
      document.removeEventListener("pointerdown", znovaSkus);
      document.removeEventListener("touchstart", znovaSkus);
      document.removeEventListener("scroll", znovaSkus);
    };
    const schovajNahlad = () => {
      const n = nahlad.current;
      if (n) n.style.opacity = "0";
    };
    element.addEventListener("playing", schovajNahlad);

    document.addEventListener("pointerdown", znovaSkus, { passive: true });
    document.addEventListener("touchstart", znovaSkus, { passive: true });
    document.addEventListener("scroll", znovaSkus, { passive: true });
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const sync = () => {
      if (!visible || document.hidden || reduced.matches) element.pause();
      else element.play().catch(() => null);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0.15 }
    );
    observer.observe(element);
    document.addEventListener("visibilitychange", sync);
    reduced.addEventListener("change", sync);
    return () => {
      odpoj();
      element.removeEventListener("playing", schovajNahlad);
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      reduced.removeEventListener("change", sync);
      element.pause();
    };
  }, []);

  return (
    <>
      {/* Kým video nebeží, prekrýva ho ten istý záber ako statický obrázok.
          Safari na iPhone totiž nad zastaveným videom kreslí vlastné tlačidlo
          prehrať a v režime šetrenia energie ho spustiť nedovolí. */}
      <img
        ref={nahlad}
        className={className}
        src={poster}
        alt=""
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, zIndex: 1, transition: "opacity .4s ease" }}
      />
    <video
      ref={video}
      className={className}
      poster={poster}
      muted
      loop
      autoPlay
      playsInline
      controls={false}
      disablePictureInPicture
      preload="metadata"
      aria-hidden="true"
      tabIndex={-1}
    >
      <source src={src} type="video/mp4" />
    </video>
    </>
  );
}
