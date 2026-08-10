"use client";

import { useState } from "react";
import Turntable from "./Turntable";
import CabinetPreview, { type PreviewTank } from "./CabinetPreview";
import Swatch from "./Swatch";
import {
  CFG_DECORS,
  CFG_TIERS,
  cabinetPrice,
  suggestTank,
} from "./configurator-logic";
import type { Tier } from "./products";

const FEET = [
  { id: "steel", name: "Nožičky", premium: 0 },
  { id: "wheels", name: "Kolieska", premium: 60 },
] as const;

const OWNER_EMAIL = "ahoj@aquaprime.sk";

/** Mini-konfigurátor na homepage — bez detailov, ale s rovnakou cenou aj náhľadom ako /konfigurator. */
export default function Configurator() {
  const [tier, setTier] = useState<Tier>("premium");
  const [w, setW] = useState(120);
  const [h, setH] = useState(80);
  const [d, setD] = useState(50);
  const [decor, setDecor] = useState(CFG_DECORS[0]);
  const [feet, setFeet] = useState<(typeof FEET)[number]>(FEET[0]);
  const [withTank, setWithTank] = useState(false);
  const [view, setView] = useState<"2d" | "3d">("2d");

  const price = cabinetPrice(tier, w, d, h, false).value + feet.premium;
  const match = suggestTank(w, d);
  const tank: PreviewTank =
    withTank && match.best
      ? {
          w: match.best.w,
          d: match.best.d,
          h: match.best.h,
          liters: match.best.liters,
        }
      : null;

  const dopyt = () => {
    const body = [
      "Konfigurácia skrinky AQUAPRIME:",
      `Rad: ${CFG_TIERS.find((t) => t.id === tier)!.label}`,
      `Rozmery: ${w} × ${h} × ${d} cm (š × v × h)`,
      `Dekor: ${decor.name}`,
      `Podnož: ${feet.name}`,
      `Orientačná cena skrinky: ${price} €`,
      withTank && match.best
        ? `Akvárium: ${match.best.name} cm (${match.best.vol}) — ${match.best.priceLabel}`
        : "",
    ]
      .filter(Boolean)
      .join("\n");
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
            <CabinetPreview
              w={w}
              h={h}
              d={d}
              tier={tier}
              decor={decor}
              feet={feet.id}
              led={false}
              tank={tank}
            />
          ) : (
            <div className="cfg__3d">
              <Turntable />
            </div>
          )}
        </div>
        <p className="cfg__hint">
          {view === "2d"
            ? "Technická skica — reaguje na rozmery, rad aj dekor."
            : "3D je zatiaľ ukážkový model jednej skrinky — na konfiguráciu nereaguje."}
        </p>
      </div>

      {/* ---- OVLÁDANIE ---- */}
      <div className="cfg__panel" data-reveal>
        <div className="cfg__field">
          <span className="cfg__legend">
            <span className="cfg__n">01</span> Rad
          </span>
          <div className="cfg__feet-opts">
            {CFG_TIERS.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`cfg__opt${tier === t.id ? " is-on" : ""}`}
                onClick={() => setTier(t.id)}
                title={t.note}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="cfg__field">
          <span className="cfg__legend">
            <span className="cfg__n">02</span> Rozmery
          </span>
          <Slider label="Šírka" value={w} min={60} max={200} onChange={setW} />
          <Slider label="Výška" value={h} min={40} max={110} onChange={setH} />
          <Slider label="Hĺbka" value={d} min={30} max={70} onChange={setD} />
        </div>

        <div className="cfg__field">
          <span className="cfg__legend">
            <span className="cfg__n">03</span> Dekor
          </span>
          <div className="cfg__swatches">
            {CFG_DECORS.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`cfg__swatch${decor.id === c.id ? " is-on" : ""}`}
                aria-label={c.name}
                title={c.name}
                onClick={() => setDecor(c)}
              >
                <Swatch swatch={c.swatch} />
              </button>
            ))}
          </div>
          <span className="cfg__pick">{decor.name}</span>
        </div>

        <div className="cfg__field">
          <span className="cfg__legend">
            <span className="cfg__n">04</span> Podnož
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

        {match.best && (
          <div className="cfg__field">
            <span className="cfg__legend">
              <span className="cfg__n">05</span> Akvárium
            </span>
            <button
              type="button"
              className={`cfg__opt cfg__opt--wide${withTank ? " is-on" : ""}`}
              onClick={() => setWithTank((v) => !v)}
            >
              {withTank ? "✓ " : "+ "}
              {match.best.name} cm · {match.best.vol} · {match.best.priceLabel}
            </button>
            <span className="cfg__pick">
              Odporúčaná nádrž na tento pôdorys.
            </span>
          </div>
        )}

        <div className="cfg__summary">
          <div className="cfg__price">
            <span className="cfg__price-label">Orientačná cena skrinky</span>
            <span className="cfg__price-val">
              {price.toLocaleString("sk-SK")} €
            </span>
            <span className="cfg__price-note">
              {withTank && match.best
                ? `vrátane DPH · akvárium ${match.best.priceLabel} navyše`
                : "vrátane DPH · presná po dopyte"}
            </span>
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
