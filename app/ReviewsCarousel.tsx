"use client";

import { useEffect, useRef, useState } from "react";
import type { Jazyk } from "./jazyk";
import { SLOVNIKY } from "./preklady";

type Review = { quote: string; name: string; meta: string };

/**
 * Referencie ako ručný carousel: karty v scrollovateľnom páse so snapom,
 * malé šípky posúvajú o jednu kartu. Nahradilo automatický bežiaci pás —
 * ten sa nedal ovládať a orezával obsah na oboch stranách.
 */
export default function ReviewsCarousel({
  reviews,
  jazyk = "sk",
}: {
  reviews: Review[];
  jazyk?: Jazyk;
}) {
  const t = SLOVNIKY[jazyk].domov;
  const track = useRef<HTMLDivElement>(null);
  const [naZaciatku, setNaZaciatku] = useState(true);
  const [naKonci, setNaKonci] = useState(false);

  // stav šípok podľa reálnej polohy pásu (aj po swipe prstom či resize)
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const sync = () => {
      setNaZaciatku(el.scrollLeft <= 2);
      setNaKonci(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
    };
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", sync);
      ro.disconnect();
    };
  }, []);

  const posun = (smer: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const karta = el.querySelector<HTMLElement>(".review-card");
    const krok = karta ? karta.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: smer * krok, behavior: "smooth" });
  };

  return (
    <div className="review-cards">
      <div className="review-cards__track" ref={track}>
        {reviews.map((r) => (
          <div className="review-card" key={r.name}>
            <div className="review-card__stars">★★★★★</div>
            <p className="review-card__quote">{r.quote}</p>
            <div className="review-card__name">{r.name}</div>
            <div className="review-card__meta">{r.meta}</div>
          </div>
        ))}
      </div>
      <div className="review-cards__nav" aria-label={t.posunRef}>
        <button
          type="button"
          className="review-cards__arrow"
          onClick={() => posun(-1)}
          disabled={naZaciatku}
          aria-label={t.predchadzajuceRef}
        >
          ←
        </button>
        <button
          type="button"
          className="review-cards__arrow"
          onClick={() => posun(1)}
          disabled={naKonci}
          aria-label={t.dalsieRef}
        >
          →
        </button>
      </div>
    </div>
  );
}
