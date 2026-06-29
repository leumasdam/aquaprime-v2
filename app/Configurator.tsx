"use client";

import { useState } from "react";
import Turntable from "./Turntable";

const COLORS = [
  { id: "black", name: "Matte Black", css: "#1b1b1c", premium: 0 },
  { id: "grey", name: "Smoky Grey", css: "#474b4e", premium: 0 },
  {
    id: "steel",
    name: "Brushed Steel",
    css: "linear-gradient(120deg,#9aa0a3,#c9cdcf 45%,#7f8589)",
    premium: 180,
  },
  { id: "white", name: "White Stone", css: "#d6d3cc", premium: 90 },
  {
    id: "walnut",
    name: "Walnut",
    css: "linear-gradient(120deg,#3a271a,#5a3d28 50%,#3a271a)",
    premium: 150,
  },
  { id: "icy", name: "Icy Blue", css: "#2f6f80", premium: 120 },
];

const FEET = [
  { id: "steel", name: "Oceľové nožičky", premium: 0 },
  { id: "wheels", name: "Kolieska", premium: 60 },
];

const OWNER_EMAIL = "ahoj@aquaprime.sk";

export default function Configurator() {
  const [w, setW] = useState(120);
  const [h, setH] = useState(80);
  const [d, setD] = useState(50);
  const [color, setColor] = useState(COLORS[0]);
  const [feet, setFeet] = useState(FEET[0]);
  const [view, setView] = useState<"2d" | "3d">("2d");

  const price =
    Math.round((520 + w * 5 + h * 4 + d * 4 + color.premium + feet.premium) / 10) *
    10;

  const dopyt = () => {
    const body = [
      `Konfigurácia skrinky AQUAPRIME:`,
      `Rozmery: ${w} × ${h} × ${d} cm (š × v × h)`,
      `Povrch: ${color.name}`,
      `Nožičky: ${feet.name}`,
      `Odhadovaná cena: € ${price.toLocaleString("sk-SK")}`,
    ].join("\n");
    window.location.href = `mailto:${OWNER_EMAIL}?subject=${encodeURIComponent(
      "Dopyt z konfigurátora — AQUAPRIME"
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="cfg__grid">
      {/* ---- NÁHĽAD ---- */}
      <div className="cfg__preview" data-reveal="scale">
        <div className="cfg__toolbar">
          <div className="cfg__toggle">
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
          <span className="cfg__dimtag">
            {w} × {h} × {d} cm
          </span>
        </div>

        <div className="cfg__stage">
          {view === "2d" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="cfg__photo"
              src="/img/cabinet.webp"
              alt="Skrinka AQUAPRIME"
            />
          ) : (
            <div className="cfg__3d">
              <Turntable />
            </div>
          )}
        </div>
        <p className="cfg__hint">
          {view === "2d"
            ? "Reálna fotka skrinky — farebné varianty pribudnú."
            : "3D ukážka konštrukcie — reálne modely každej skrinky doplníme."}
        </p>
      </div>

      {/* ---- OVLÁDANIE ---- */}
      <div className="cfg__panel" data-reveal>
        <div className="cfg__field">
          <span className="cfg__legend">
            <span className="cfg__n">01</span> Rozmery
          </span>
          <Slider label="Šírka" value={w} min={60} max={200} onChange={setW} />
          <Slider label="Výška" value={h} min={40} max={110} onChange={setH} />
          <Slider label="Hĺbka" value={d} min={30} max={70} onChange={setD} />
        </div>

        <div className="cfg__field">
          <span className="cfg__legend">
            <span className="cfg__n">02</span> Povrch
          </span>
          <div className="cfg__swatches">
            {COLORS.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`cfg__swatch${color.id === c.id ? " is-on" : ""}`}
                style={{ background: c.css }}
                aria-label={c.name}
                title={c.name}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
          <span className="cfg__pick">{color.name}</span>
        </div>

        <div className="cfg__field">
          <span className="cfg__legend">
            <span className="cfg__n">03</span> Nožičky
          </span>
          <div className="cfg__feet-opts">
            {FEET.map((f) => (
              <button
                key={f.id}
                type="button"
                className={`cfg__opt${feet.id === f.id ? " is-on" : ""}`}
                onClick={() => setFeet(f)}
              >
                {f.name}
              </button>
            ))}
          </div>
        </div>

        <div className="cfg__summary">
          <div className="cfg__price">
            <span className="cfg__price-label">Odhadovaná cena</span>
            <span className="cfg__price-val">
              € {price.toLocaleString("sk-SK")}
            </span>
            <span className="cfg__price-note">vrátane DPH · presná po dopyte</span>
          </div>
          <button type="button" className="btn-cyan cfg__submit" onClick={dopyt}>
            ODOSLAŤ DOPYT <span aria-hidden>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="cfg__slider">
      <span className="cfg__slider-top">
        <span>{label}</span>
        <span className="cfg__slider-val">{value} cm</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={
          { "--p": `${((value - min) / (max - min)) * 100}%` } as React.CSSProperties
        }
      />
    </label>
  );
}
