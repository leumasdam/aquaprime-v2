"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type TouchEvent } from "react";
import type { Jazyk } from "./jazyk";
import { SLOVNIKY } from "./preklady";

/**
 * Veľké zobrazenie fotiek — na celú obrazovku, s prepínaním šípkami,
 * klávesnicou, potiahnutím na mobile a radom náhľadov dole.
 * Používa ju galéria skriniek, setov aj akvárií.
 */
export default function Lightbox({
  fotky,
  index,
  alt,
  jazyk,
  onZmena,
  onZavri,
}: {
  fotky: string[];
  index: number;
  alt: string;
  jazyk: Jazyk;
  onZmena: (i: number) => void;
  onZavri: () => void;
}) {
  const t = SLOVNIKY[jazyk].realizacie;
  const dialog = useRef<HTMLDialogElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const [vstup, setVstup] = useState(true);
  const n = fotky.length;
  const i = Math.max(0, Math.min(index, n - 1));
  const posun = (d: number) => n > 1 && onZmena((i + d + n) % n);

  useEffect(() => {
    const d = dialog.current;
    if (!d || d.open) return;
    d.showModal();
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => setVstup(false), 20);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
      if (d.open) d.close();
    };
  }, []);

  const touchStart = (e: TouchEvent) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const touchEnd = (e: TouchEvent) => {
    if (!touch.current) return;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    touch.current = null;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) posun(dx < 0 ? 1 : -1);
  };

  return (
    <dialog
      ref={dialog}
      className={`lb${vstup ? " lb--vstup" : ""}`}
      aria-label={alt}
      onCancel={(e) => {
        e.preventDefault();
        onZavri();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onZavri();
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          posun(1);
        }
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          posun(-1);
        }
      }}
    >
      <button type="button" className="lb__zavri" aria-label={t.zavriet} onClick={onZavri} autoFocus>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      </button>

      <div className="lb__plocha" onTouchStart={touchStart} onTouchEnd={touchEnd} onClick={(e) => { if (e.target === e.currentTarget) onZavri(); }}>
        <div className="lb__foto" key={fotky[i]}>
          <Image src={fotky[i]} alt={alt} fill priority sizes="100vw" />
        </div>
      </div>

      {n > 1 && (
        <>
          <button type="button" className="lb__sipka lb__sipka--spat" aria-label={t.predchadzajuca} onClick={() => posun(-1)}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <button type="button" className="lb__sipka lb__sipka--dalej" aria-label={t.nasledujuca} onClick={() => posun(1)}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div className="lb__spodok">
            <span className="lb__pocet" aria-live="polite">
              {i + 1} / {n}
            </span>
            <div className="lb__nahlady">
              {fotky.map((src, k) => (
                <button
                  key={src}
                  type="button"
                  className={`lb__nahlad${k === i ? " is-on" : ""}`}
                  onClick={() => onZmena(k)}
                  aria-label={`${SLOVNIKY[jazyk].produkt.fotografia} ${k + 1}`}
                  aria-current={k === i ? "true" : undefined}
                >
                  <Image src={src} alt="" fill sizes="72px" />
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </dialog>
  );
}
