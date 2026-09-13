"use client";

import { useEffect, useRef, useState } from "react";
import s from "./realizacie.module.css";
import type { Slovnik } from "../preklady";

export default function RealizacieHero({ t }: { t: Slovnik["realizacie"] }) {
  const video = useRef<HTMLVideoElement>(null);
  const manualPause = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = true;
    const sync = () => {
      if (!visible || document.hidden || reduced.matches || manualPause.current) element.pause();
      else element.play().catch(() => setPlaying(false));
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: 0.1 });
    observer.observe(element);
    document.addEventListener("visibilitychange", sync);
    reduced.addEventListener("change", sync);
    sync();
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", sync); reduced.removeEventListener("change", sync); element.pause(); };
  }, []);

  const toggle = () => {
    const element = video.current;
    if (!element) return;
    manualPause.current = !element.paused;
    if (element.paused) element.play().catch(() => setPlaying(false));
    else element.pause();
  };

  return <section className={s.coverHero} aria-labelledby="realizacie-title">
    <div className={s.coverMedia} aria-hidden="true">
      <video ref={video} className={s.coverVideo} muted loop playsInline preload="metadata" poster="/realizacie/cover-poster.webp" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setFailed(true)}>
        <source src="/video/realizacie-cover.mp4" type="video/mp4" />
      </video>
    </div>
    <div className={s.coverCopy}>
      <h1 id="realizacie-title">{t.heroTitul1}<br />{t.heroTitul2}</h1>
      <span className={s.coverRule} aria-hidden="true" />
      <p>{t.heroLead1}<br className={s.coverBreak} /> {t.heroLead2}</p>
    </div>
    {!failed && <button type="button" className={s.coverPause} onClick={toggle} aria-label={playing ? t.pozastavit : t.prehrat} title={playing ? "Pozastaviť animáciu" : "Prehrať animáciu"}>
      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">{playing ? <path d="M4 3h2v10H4zm6 0h2v10h-2z" /> : <path d="m5 2 8 6-8 6z" />}</svg>
    </button>}
  </section>;
}
