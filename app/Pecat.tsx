"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

/**
 * Pečať pôvodu v hero. Bežnému návštevníkovi je to obyčajný obrázok
 * usadený cez CSS.
 *
 * S parametrom `?pecat` v adrese sa zapne režim ladenia: pečať sa dá ťahať
 * myšou, kolieskom meniť jej veľkosť, otáčať do strany a šípkami doladiť
 * o jeden pixel.
 * Nastavenie si pamätá prehliadač a panel dole vľavo ukazuje hotový CSS blok
 * na skopírovanie. Režim funguje aj na ostrom webe, ale len pre toho, kto
 * ten parameter v adrese napíše — návštevník o ňom nevie.
 */

const KLUC = "aq-pecat";

/** otočenie držíme v rozsahu jednej otáčky, nech číslo v paneli ostane čitateľné */
const obmedz = (u: number) => Math.max(-180, Math.min(180, Math.round(u)));

type Stav = {
  /** vzdialenosť od horného okraja sekcie v px */
  top: number;
  /** vzdialenosť od pravého okraja sekcie v px */
  right: number;
  /** šírka pečate v px */
  sirka: number;
  /** krytie v percentách */
  krytie: number;
  /** otočenie v stupňoch, záporné doľava */
  uhol: number;
};

export default function Pecat({ alt }: { alt: string }) {
  const obr = useRef<HTMLImageElement>(null);
  const [ladenie, setLadenie] = useState(false);
  const [stav, setStav] = useState<Stav | null>(null);
  const [tahanie, setTahanie] = useState(false);
  const [odpis, setOdpis] = useState(false);

  /* režim sa zapne len parametrom v adrese */
  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has("pecat")) return;
    setLadenie(true);
  }, []);

  /* východzí stav: to, čo práve hovorí CSS, aby ladenie nezačalo skokom */
  useEffect(() => {
    if (!ladenie) return;
    const el = obr.current;
    const sekcia = el?.closest("section");
    if (!el || !sekcia) return;

    const ulozene = window.localStorage.getItem(KLUC);
    if (ulozene) {
      try {
        const u = JSON.parse(ulozene) as Partial<Stav>;
        setStav({ top: 0, right: 0, sirka: 120, krytie: 42, uhol: 0, ...u });
        return;
      } catch {
        /* poškodený záznam ignorujeme a odmeriame nanovo */
      }
    }
    /* Pod 1024 px je pečať skrytá a nemá rozmer. Meranie by vtedy vrátilo
       nuly, tak ho odložíme, kým okno nie je dosť široké. */
    const zmeraj = () => {
      const r = el.getBoundingClientRect();
      if (r.width < 1) return false;
      const s = getComputedStyle(el);
      const rs = sekcia.getBoundingClientRect();
      setStav({
        top: Math.round(r.top - rs.top),
        right: Math.round(rs.right - r.right),
        sirka: Math.round(r.width),
        krytie: Math.round(parseFloat(s.opacity) * 100),
        uhol: 0,
      });
      return true;
    };
    if (zmeraj()) return;
    const skus = () => {
      if (zmeraj()) window.removeEventListener("resize", skus);
    };
    window.addEventListener("resize", skus);
    return () => window.removeEventListener("resize", skus);
  }, [ladenie]);

  useEffect(() => {
    if (!ladenie || !stav) return;
    window.localStorage.setItem(KLUC, JSON.stringify(stav));
  }, [ladenie, stav]);

  /* ťahanie myšou */
  const zaciatok = useCallback(
    (e: React.PointerEvent<HTMLImageElement>) => {
      if (!ladenie || !stav) return;
      e.preventDefault();
      const el = e.currentTarget;
      el.setPointerCapture(e.pointerId);
      setTahanie(true);
      const x0 = e.clientX;
      const y0 = e.clientY;
      const s0 = { ...stav };
      const posun = (ev: PointerEvent) => {
        setStav({
          ...s0,
          /* doprava sa pečať posúva zmenšením odsadenia od pravého okraja */
          right: Math.round(s0.right - (ev.clientX - x0)),
          top: Math.round(s0.top + (ev.clientY - y0)),
        });
      };
      const koniec = () => {
        setTahanie(false);
        window.removeEventListener("pointermove", posun);
        window.removeEventListener("pointerup", koniec);
      };
      window.addEventListener("pointermove", posun);
      window.addEventListener("pointerup", koniec);
    },
    [ladenie, stav]
  );

  /* koliesko mení veľkosť, šípky doladia o pixel */
  useEffect(() => {
    if (!ladenie) return;
    const koliesko = (e: WheelEvent) => {
      if (!obr.current?.matches(":hover")) return;
      e.preventDefault();
      const smer = Math.sign(e.deltaY);
      setStav((s) => {
        if (!s) return s;
        if (e.shiftKey) return { ...s, uhol: obmedz(s.uhol - smer * 2) };
        return { ...s, sirka: Math.max(40, Math.min(360, s.sirka - smer * 4)) };
      });
    };
    const klaves = (e: KeyboardEvent) => {
      const krok = e.shiftKey ? 10 : 1;
      const zmeny: Record<string, (s: Stav) => Stav> = {
        ArrowLeft: (s) => ({ ...s, right: s.right + krok }),
        ArrowRight: (s) => ({ ...s, right: s.right - krok }),
        ArrowUp: (s) => ({ ...s, top: s.top - krok }),
        ArrowDown: (s) => ({ ...s, top: s.top + krok }),
        ",": (s) => ({ ...s, uhol: obmedz(s.uhol - krok) }),
        ".": (s) => ({ ...s, uhol: obmedz(s.uhol + krok) }),
      };
      const z = zmeny[e.key];
      if (!z) return;
      e.preventDefault();
      setStav((s) => (s ? z(s) : s));
    };
    window.addEventListener("wheel", koliesko, { passive: false });
    window.addEventListener("keydown", klaves);
    return () => {
      window.removeEventListener("wheel", koliesko);
      window.removeEventListener("keydown", klaves);
    };
  }, [ladenie]);

  const css = stav
    ? `.hero__pecat {\n  top: ${stav.top}px;\n  right: ${stav.right}px;\n  width: ${stav.sirka}px;\n  opacity: ${(stav.krytie / 100).toFixed(2)};\n  transform: rotate(${stav.uhol}deg);\n}`
    : "";

  const styl: CSSProperties | undefined =
    ladenie && stav
      ? {
          top: `${stav.top}px`,
          right: `${stav.right}px`,
          width: `${stav.sirka}px`,
          opacity: stav.krytie / 100,
          transform: `rotate(${stav.uhol}deg)`,
          cursor: tahanie ? "grabbing" : "grab",
          pointerEvents: "auto",
          touchAction: "none",
          outline: "1px dashed rgba(0,154,192,.6)",
          outlineOffset: "6px",
        }
      : undefined;

  return (
    <>
      <Image
        ref={obr}
        src="/img/pecat-slovensko.webp"
        alt={alt}
        width={640}
        height={640}
        className="hero__pecat"
        style={styl}
        onPointerDown={zaciatok}
        draggable={false}
      />

      {ladenie && stav && (
        <div className="pecat-panel">
          <b>Pečať — ladenie polohy</b>
          <p>
            Ťahaj myšou · koliesko mení veľkosť · Shift a koliesko otáča ·
            šípky posúvajú po pixeli, čiarka a bodka otáčajú (so Shiftom po desiatich)
          </p>
          <label>
            Krytie <i>{stav.krytie} %</i>
            <input
              type="range"
              min={5}
              max={100}
              value={stav.krytie}
              onChange={(e) => setStav({ ...stav, krytie: Number(e.target.value) })}
            />
          </label>
          <label>
            Otočenie <i>{stav.uhol > 0 ? `+${stav.uhol}` : stav.uhol}°</i>
            <input
              type="range"
              min={-180}
              max={180}
              value={stav.uhol}
              onChange={(e) => setStav({ ...stav, uhol: Number(e.target.value) })}
            />
          </label>
          <pre>{css}</pre>
          <div className="pecat-panel__akcie">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(css).then(
                  () => {
                    setOdpis(true);
                    window.setTimeout(() => setOdpis(false), 1600);
                  },
                  () => null
                );
              }}
            >
              {odpis ? "Skopírované" : "Kopírovať CSS"}
            </button>
            <button
              type="button"
              className="pecat-panel__tichy"
              onClick={() => {
                window.localStorage.removeItem(KLUC);
                window.location.reload();
              }}
            >
              Späť na pôvodné
            </button>
          </div>
        </div>
      )}
    </>
  );
}
