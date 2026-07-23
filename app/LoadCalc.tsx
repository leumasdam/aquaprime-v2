"use client";

import Link from "next/link";
import { useState } from "react";

// Orientačný výpočet záťaže akvária: voda (1 kg/l) + sklo (~15 %) + substrát a dekor (~10 %).
// Referenčná nosnosť rámu zodpovedá claimu "unesie aj 770 kg" z homepage.
const CAPACITY = 770;

const PRESETS = [
  { label: "100×40", w: 100, d: 40 },
  { label: "120×40", w: 120, d: 40 },
  { label: "150×50", w: 150, d: 50 },
  { label: "160×60", w: 160, d: 60 },
  { label: "200×50", w: 200, d: 50 },
];

export default function LoadCalc() {
  const [w, setW] = useState(120);
  const [d, setD] = useState(40);
  const [h, setH] = useState(50);

  const liters = Math.round((w * d * h) / 1000);
  const water = liters;
  const glass = Math.round(liters * 0.15);
  const deco = Math.round(liters * 0.1);
  const total = water + glass + deco;
  const pct = Math.round((total / CAPACITY) * 100);
  const over = total > CAPACITY;

  const preset = PRESETS.find((p) => p.w === w && p.d === d);

  return (
    <div className="lcalc">
      <div className="lcalc__controls">
        <div className="lcalc__presets" role="group" aria-label="Rozmery z ponuky">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              className={`lcalc__preset${preset === p ? " is-active" : ""}`}
              onClick={() => {
                setW(p.w);
                setD(p.d);
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {(
          [
            { id: "w", label: "Dĺžka akvária", val: w, set: setW, min: 60, max: 250 },
            { id: "d", label: "Hĺbka akvária", val: d, set: setD, min: 30, max: 80 },
            { id: "h", label: "Výška vodného stĺpca", val: h, set: setH, min: 30, max: 80 },
          ] as const
        ).map((c) => (
          <label key={c.id} className="lcalc__row">
            <span className="lcalc__label">
              {c.label}
              <b>{c.val} cm</b>
            </span>
            <input
              type="range"
              min={c.min}
              max={c.max}
              value={c.val}
              onChange={(e) => c.set(Number(e.target.value))}
              aria-label={c.label}
            />
          </label>
        ))}

        <p className="lcalc__note">
          Orientačný výpočet: voda 1 kg/l, sklo ≈ 15 %, substrát a dekor ≈ 10 %.
          Presné dimenzovanie rámu robíme pri návrhu.
        </p>
      </div>

      <div className="lcalc__result">
        <svg className="lcalc__tank" viewBox="0 0 120 70" aria-hidden>
          {(() => {
            /* rozmery vizuálu odvodené zo sliderov */
            const tw = 44 + ((w - 60) / 190) * 64; // šírka akvária 44–108
            const th = 14 + ((h - 30) / 50) * 30; // výška akvária 14–44
            const tx = (120 - tw) / 2;
            const bottom = 52;
            const top = bottom - th;
            return (
              <g>
                {/* skrinka pod akváriom */}
                <rect className="lcalc__tank-cab" x={tx - 3} y={bottom} width={tw + 6} height={12} rx="1" />
                <rect className="lcalc__tank-led" x={tx - 3} y={bottom} width={tw + 6} height={1.2} />
                {/* voda */}
                <rect className="lcalc__tank-water" x={tx + 1.5} y={top + 3} width={tw - 3} height={th - 4.5} />
                <rect className="lcalc__tank-surface" x={tx + 1.5} y={top + 3} width={tw - 3} height={1} />
                {/* bublinky */}
                <circle className="lcalc__bubble" style={{ "--bx": "0s" } as React.CSSProperties} cx={tx + tw * 0.3} cy={bottom - 4} r="1" />
                <circle className="lcalc__bubble" style={{ "--bx": "1.1s" } as React.CSSProperties} cx={tx + tw * 0.55} cy={bottom - 3} r="0.7" />
                <circle className="lcalc__bubble" style={{ "--bx": "2s" } as React.CSSProperties} cx={tx + tw * 0.78} cy={bottom - 5} r="0.85" />
                {/* sklo */}
                <rect className="lcalc__tank-glass" x={tx} y={top} width={tw} height={th} rx="0.5" />
              </g>
            );
          })()}
        </svg>
        <span className="lcalc__result-label">Celková záťaž skrinky</span>
        <span className="lcalc__total">
          ≈ {total} <small>kg</small>
        </span>
        <span className="lcalc__breakdown">
          {liters} l vody · sklo ≈ {glass} kg · substrát ≈ {deco} kg
        </span>

        <div
          className="lcalc__bar"
          role="meter"
          aria-valuemin={0}
          aria-valuemax={CAPACITY}
          aria-valuenow={Math.min(total, CAPACITY)}
          aria-label="Využitie nosnosti referenčného rámu"
        >
          <i style={{ width: `${Math.min(pct, 100)}%` }} data-over={over || undefined} />
        </div>

        {over ? (
          <p className="lcalc__verdict lcalc__verdict--over">
            Nad referenčnú radu — rám nadimenzujeme individuálne.{" "}
            <Link href="/dopyt">Napíšte nám rozmery →</Link>
          </p>
        ) : (
          <p className="lcalc__verdict">
            AquaFrame to unesie <b>s rezervou {100 - pct} %</b> referenčnej
            nosnosti {CAPACITY} kg.
          </p>
        )}
      </div>
    </div>
  );
}
