"use client";

import { useRef, useState } from "react";
import { type Jazyk } from "./jazyk";
import { SLOVNIKY } from "./preklady";

const FRAMES = 25;
const SRCS = Array.from({ length: FRAMES }, (_, i) => `/img/tt/${i}.webp`);

// callout: dot = bod na modeli [x%,y%], lbl = koniec čiary / popisok [x%,y%]
const CALLOUTS: { kluc: "bodZarovnanie" | "bodOcel" | "bodNozicky"; dot: number[]; lbl: number[]; align: string }[] = [
  { kluc: "bodZarovnanie", dot: [55, 22], lbl: [80, 7], align: "left" },
  { kluc: "bodOcel", dot: [30, 45], lbl: [6, 24], align: "left" },
  { kluc: "bodNozicky", dot: [60, 57], lbl: [74, 90], align: "left" },
];

export default function Turntable({ jazyk = "sk" }: { jazyk?: Jazyk }) {
  const txt = SLOVNIKY[jazyk].spolocne;
  const [frame, setFrame] = useState(0);
  const drag = useRef(false);
  const lastX = useRef(0);
  const acc = useRef(0);

  const rotate = (delta: number) =>
    setFrame((f) => (((f + delta) % FRAMES) + FRAMES) % FRAMES);

  const onDown = (e: React.PointerEvent) => {
    drag.current = true;
    lastX.current = e.clientX;
    acc.current = 0;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    acc.current += e.clientX - lastX.current;
    lastX.current = e.clientX;
    const step = 12;
    while (Math.abs(acc.current) >= step) {
      const dir = acc.current > 0 ? -1 : 1;
      rotate(dir);
      acc.current -= acc.current > 0 ? step : -step;
    }
  };
  const onUp = () => {
    drag.current = false;
  };

  return (
    <div className="turntable">
      <div
        className="turntable__stage"
        role="img"
        aria-label={txt.ramAria}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
      >
        {SRCS.map((s, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={s}
            alt={i === 0 ? txt.ramAlt : ""}
            draggable={false}
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
            className="turntable__frame"
            style={{ opacity: i === frame ? 1 : 0 }}
          />
        ))}

        <div className="callouts" aria-hidden="true">
          <svg
            className="callouts__lines"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {CALLOUTS.map((c, i) => (
              <line
                key={i}
                className="cline"
                style={{ "--i": i } as React.CSSProperties}
                x1={c.dot[0]}
                y1={c.dot[1]}
                x2={c.lbl[0]}
                y2={c.lbl[1]}
                pathLength={1}
              />
            ))}
          </svg>
          {CALLOUTS.map((c, i) => (
            <span
              key={`d${i}`}
              className="cdot"
              style={
                { left: `${c.dot[0]}%`, top: `${c.dot[1]}%`, "--i": i } as React.CSSProperties
              }
            />
          ))}
          {CALLOUTS.map((c, i) => (
            <span
              key={`l${i}`}
              className={`clabel clabel--${c.align}`}
              style={
                { left: `${c.lbl[0]}%`, top: `${c.lbl[1]}%`, "--i": i } as React.CSSProperties
              }
            >
              {txt[c.kluc]}
            </span>
          ))}
        </div>
      </div>

      <div className="turntable__control">
        <button
          type="button"
          className="turntable__arrow"
          aria-label={txt.otocitDolava}
          onClick={() => rotate(-1)}
        >
          ‹
        </button>
        <input
          className="turntable__slider"
          type="range"
          min={0}
          max={FRAMES - 1}
          value={frame}
          onChange={(e) => setFrame(Number(e.target.value))}
          aria-label={txt.otocitModel}
        />
        <button
          type="button"
          className="turntable__arrow"
          aria-label={txt.otocitDoprava}
          onClick={() => rotate(1)}
        >
          ›
        </button>
      </div>
      <span className="turntable__hint">{txt.otacajTahom}</span>
    </div>
  );
}
