"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type TouchEvent } from "react";
import { createPortal } from "react-dom";
import type { Jazyk } from "./jazyk";
import { SLOVNIKY } from "./preklady";

/**
 * Veľké zobrazenie fotiek — na celú obrazovku, s prepínaním šípkami,
 * klávesnicou, potiahnutím na mobile a radom náhľadov dole.
 * Používa ju galéria skriniek, setov aj akvárií.
 */
/**
 * Fotka má object-fit: contain v prvku cez celú plochu — prvok <img> teda
 * zaberá aj prázdne okolie. Či bod leží na samotnej fotke, prepočítame
 * z jej skutočných rozmerov.
 */
function mimoFotky(img: HTMLImageElement, x: number, y: number): boolean {
  const r = img.getBoundingClientRect();
  const nw = img.naturalWidth;
  const nh = img.naturalHeight;
  if (!nw || !nh || !r.width || !r.height) return false;
  const k = Math.min(r.width / nw, r.height / nh);
  const w = nw * k;
  const h = nh * k;
  const x0 = r.left + (r.width - w) / 2;
  const y0 = r.top + (r.height - h) / 2;
  return x < x0 || x > x0 + w || y < y0 || y > y0 + h;
}

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
    /* modálny dialóg ide do „top layer" — mimo galérie, ktorá má pri
       odhalení transformáciu (position: fixed by sa inak počítalo od nej) */
    try {
      d.showModal();
    } catch {
      d.setAttribute("open", "");
    }
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

  if (typeof document === "undefined") return null;
  return createPortal(
    <dialog
      ref={dialog}
      className={`lb${vstup ? " lb--vstup" : ""}`}
      aria-label={alt}
      onCancel={(e) => {
        e.preventDefault();
        onZavri();
      }}
      onClick={(e) => {
        /* klik kamkoľvek mimo fotky a tlačidiel zatvára — ako krížik */
        const t = e.target as HTMLElement;
        if (t.closest("button")) return;
        if (t.tagName === "IMG" && mimoFotky(t as HTMLImageElement, e.clientX, e.clientY) === false) return;
        onZavri();
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

      <div className="lb__plocha" onTouchStart={touchStart} onTouchEnd={touchEnd}>
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
    </dialog>,
    document.body,
  );
}
