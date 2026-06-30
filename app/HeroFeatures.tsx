"use client";

import { useEffect, useRef, useState } from "react";

const HF: Record<string, React.ReactNode> = {
  mira: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M3.5 16.5 16.5 3.5 20.5 7.5 7.5 20.5z" />
      <path d="m7 11 1.7 1.7M10.5 7.5l1.7 1.7M13.5 10.5l1.5 1.5M9.5 13.8l1.5 1.5" />
    </svg>
  ),
  material: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M6 3h12l4 6-10 12L2 9z" />
      <path d="M2 9h20M9 3 6 9l6 12M15 3l3 6-6 12" />
    </svg>
  ),
  presnost: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="3.4" />
      <path d="M12 1v3.4M12 19.6V23M1 12h3.4M19.6 12H23" />
    </svg>
  ),
  hodnota: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M12 2 4 5v6c0 5 3.4 8.2 8 9.8 4.6-1.6 8-4.8 8-9.8V5z" />
      <path d="m8.5 11.8 2.4 2.4 4.6-5" />
    </svg>
  ),
  slovensko: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M12 2 4 5v6c0 5 3.4 8.2 8 9.8 4.6-1.6 8-4.8 8-9.8V5z" />
      <path d="M12 6.4v9.4" />
      <path d="M9.2 9.3h5.6" />
      <path d="M8 12.4h8" />
    </svg>
  ),
};

const FEATURES = [
  { k: "mira", t: "NA MIERU", s: "Každý projekt navrhujeme presne podľa vašich potrieb." },
  { k: "material", t: "PRÉMIOVÉ MATERIÁLY", s: "Používame len špičkové materiály a osvedčené konštrukcie." },
  { k: "presnost", t: "TECHNICKÁ PRESNOSŤ", s: "Stabilita, funkčnosť a precízne spracovanie v každom detaile." },
  { k: "hodnota", t: "TRVÁCA HODNOTA", s: "Odolné riešenia s nadčasovým dizajnom, ktoré vydržia." },
  { k: "slovensko", t: "SLOVENSKÁ KVALITA", s: "Navrhnuté a vyrobené na Slovensku." },
];

export default function HeroFeatures() {
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedUntil = useRef(0);

  // auto-advance (desktop aj mobil; cyan zvýraznenie je na mobile vypnuté cez CSS)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (Date.now() < pausedUntil.current) return;
      setActive((a) => (a + 1) % FEATURES.length);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  // posuň aktívnu položku do pohľadu (auto-swipe)
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const item = track.children[active] as HTMLElement | undefined;
    if (!item) return;
    const padL = parseFloat(getComputedStyle(track).scrollPaddingLeft || "0") || 0;
    const delta =
      item.getBoundingClientRect().left - track.getBoundingClientRect().left;
    track.scrollTo({
      left: Math.max(0, track.scrollLeft + delta - padL),
      behavior: "smooth",
    });
  }, [active]);

  const pause = () => {
    pausedUntil.current = Date.now() + 6000;
  };

  // manuálny swipe → sync na najbližšiu položku (po pauze)
  const onScroll = () => {
    if (Date.now() >= pausedUntil.current) return; // ignoruj programový scroll
    const track = trackRef.current;
    if (!track) return;
    const padL = parseFloat(getComputedStyle(track).scrollPaddingLeft || "0") || 0;
    const trackLeft = track.getBoundingClientRect().left;
    let nearest = 0;
    let best = Infinity;
    for (let i = 0; i < track.children.length; i++) {
      const el = track.children[i] as HTMLElement;
      const d = Math.abs(el.getBoundingClientRect().left - trackLeft - padL);
      if (d < best) {
        best = d;
        nearest = i;
      }
    }
    setActive(nearest);
  };

  return (
    <div
      className="wrap hero__bar-inner"
      ref={trackRef}
      onPointerDown={pause}
      onWheel={pause}
      onScroll={onScroll}
    >
      {FEATURES.map((f, i) => (
        <div className={`hfeat${i === active ? " is-active" : ""}`} key={f.k}>
          <span className="hfeat__ring">{HF[f.k]}</span>
          <span className="hfeat__txt">
            <span className="hfeat__t">{f.t}</span>
            <span className="hfeat__s">{f.s}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
