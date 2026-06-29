"use client";

import { useState } from "react";
import Turntable from "./Turntable";

const COLORS = [
  { id: "black", name: "Matte Black", css: "#0e0e0f", prem: 0 },
  { id: "grey", name: "Smoky Grey", css: "#41464a", prem: 40 },
  {
    id: "steel",
    name: "Brushed Steel",
    css: "linear-gradient(120deg,#9aa0a3,#c9cdcf 45%,#7f8589)",
    prem: 150,
  },
  { id: "white", name: "White Stone", css: "#dedbd4", prem: 90 },
  {
    id: "walnut",
    name: "Walnut Wood",
    css: "linear-gradient(120deg,#3a271a,#5a3d28 50%,#3a271a)",
    prem: 150,
  },
  { id: "icy", name: "Icy Blue", css: "#2f6f80", prem: 120 },
];

const FEET = [
  { id: "steel", name: "Oceľové nožičky", prem: 0 },
  { id: "wheels", name: "Kolieska", prem: 60 },
];

export default function KonfiguratorFull() {
  const [w, setW] = useState(120);
  const [h, setH] = useState(80);
  const [d, setD] = useState(50);
  const [color, setColor] = useState(COLORS[0]);
  const [feet, setFeet] = useState(FEET[0]);
  const [view, setView] = useState<"2d" | "3d">("2d");

  const price =
    Math.round((1490 + w * 4 + h * 3 + d * 3 + color.prem + feet.prem) / 10) * 10;

  const dopyt = () => {
    const body = `Konfigurácia AQUAPRIME:\nRozmery: ${w}×${h}×${d} cm\nPovrch: ${color.name}\nNožičky: ${feet.name}\nOdhad: € ${price}`;
    window.location.href = `mailto:ahoj@aquaprime.sk?subject=${encodeURIComponent(
      "Konfigurácia — AQUAPRIME"
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="kfx">
      {/* ĽAVÁ floating karta — rozmery + nožičky */}
      <div className="kfx__card kfx__card--left" data-reveal="left">
        <div className="kfx__group">
          <span className="kfx__legend">
            <span className="kfx__n">01</span> Rozmery
          </span>
          <Slider label="Šírka" value={w} min={60} max={200} set={setW} />
          <Slider label="Výška" value={h} min={40} max={110} set={setH} />
          <Slider label="Hĺbka" value={d} min={30} max={70} set={setD} />
        </div>
        <div className="kfx__group">
          <span className="kfx__legend">
            <span className="kfx__n">02</span> Nožičky
          </span>
          <div className="kfx__opts">
            {FEET.map((f) => (
              <button
                key={f.id}
                className={`kfx__opt${feet.id === f.id ? " is-on" : ""}`}
                onClick={() => setFeet(f)}
                type="button"
              >
                {f.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* STRED — skrinka vo voľnom priestore */}
      <div className="kfx__stage" data-reveal="scale">
        <div className="kfx__glow" />
        <div className="kfx__toggle">
          <button
            className={view === "2d" ? "is-on" : ""}
            onClick={() => setView("2d")}
            type="button"
          >
            2D
          </button>
          <button
            className={view === "3d" ? "is-on" : ""}
            onClick={() => setView("3d")}
            type="button"
          >
            3D
          </button>
        </div>
        <span className="kfx__dimtag">
          {w} × {h} × {d} cm
        </span>
        <div className="kfx__model">
          {view === "2d" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/img/cabinet.webp" alt="Skrinka AQUAPRIME" className="kfx__photo" />
          ) : (
            <Turntable />
          )}
        </div>
      </div>

      {/* PRAVÁ floating karta — povrch + cena + CTA */}
      <div className="kfx__card kfx__card--right" data-reveal>
        <div className="kfx__group">
          <span className="kfx__legend">
            <span className="kfx__n">03</span> Povrch
          </span>
          <div className="kfx__swatches">
            {COLORS.map((c) => (
              <button
                key={c.id}
                className={`kfx__sw${color.id === c.id ? " is-on" : ""}`}
                style={{ background: c.css }}
                aria-label={c.name}
                title={c.name}
                onClick={() => setColor(c)}
                type="button"
              />
            ))}
          </div>
          <span className="kfx__pick">{color.name}</span>
        </div>

        <div className="kfx__price">
          <span className="kfx__price-l">Odhadovaná cena</span>
          <span className="kfx__price-v">€ {price.toLocaleString("sk-SK")}</span>
          <span className="kfx__price-n">vrátane DPH · presná po dopyte</span>
        </div>
        <button type="button" className="btn-cyan kfx__send" onClick={dopyt}>
          ODOSLAŤ DOPYT <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  set,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  set: (v: number) => void;
}) {
  return (
    <label className="kfx__slider">
      <span className="kfx__slider-top">
        <span>{label}</span>
        <span className="kfx__slider-v">{value} cm</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => set(Number(e.target.value))}
        style={
          { "--p": `${((value - min) / (max - min)) * 100}%` } as React.CSSProperties
        }
      />
    </label>
  );
}
