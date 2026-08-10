"use client";

import { useState } from "react";
import Turntable from "./Turntable";
import CabinetPreview, { type PreviewTank } from "./CabinetPreview";
import Swatch from "./Swatch";
import { AQUARIUMS, aquariumPriceValue } from "./aquariums";
import {
  CFG_DECORS,
  CFG_TIERS,
  FRAME_LOAD_KG,
  cabinetPrice,
  deeperOption,
  ledSurcharge,
  suggestTank,
  tankLoadKg,
} from "./configurator-logic";
import type { Tier } from "./products";

const FEET = [
  { id: "steel", name: "Nožičky", prem: 0 },
  { id: "wheels", name: "Kolieska", prem: 60 },
] as const;

const OWNER_EMAIL = "ahoj@aquaprime.sk";

export default function KonfiguratorFull() {
  const [tier, setTier] = useState<Tier>("premium");
  const [w, setW] = useState(120);
  const [h, setH] = useState(80);
  const [d, setD] = useState(50);
  const [decor, setDecor] = useState(CFG_DECORS[0]);
  const [feet, setFeet] = useState<(typeof FEET)[number]>(FEET[0]);
  const [led, setLed] = useState(false);
  const [withTank, setWithTank] = useState(false);
  const [tankSlug, setTankSlug] = useState<string | null>(null);
  const [view, setView] = useState<"2d" | "3d">("2d");

  const ledPrem = ledSurcharge(tier);
  const ledOn = led && ledPrem !== null;
  const price = cabinetPrice(tier, w, d, h, ledOn);
  const total = price.value + feet.prem;

  // ---- akvárium: odporúčanie sa počíta zo zvoleného pôdorysu skrinky ----
  const match = suggestTank(w, d);
  const picked = tankSlug ? AQUARIUMS.find((a) => a.slug === tankSlug) : null;
  const pickedFits = !!picked && picked.w <= w && picked.d <= d;
  const chosen = pickedFits ? picked : match.best;
  const droppedPick = !!picked && !pickedFits;
  // keď žiadna štandardná nádrž nesadne, ponúkne sa nádrž na mieru podľa pôdorysu
  const customTank = { w: Math.max(40, w - 4), d: Math.max(25, d - 4), h: 45 };
  const tankOnStage: PreviewTank = !withTank
    ? null
    : chosen
      ? { w: chosen.w, d: chosen.d, h: chosen.h, liters: chosen.liters }
      : {
          ...customTank,
          liters: Math.round((customTank.w * customTank.d * customTank.h) / 1000),
        };
  const liters = chosen ? chosen.liters : tankOnStage?.liters ?? 0;
  const loadKg = tankLoadKg(liters);
  const loadPct = Math.min(100, Math.round((loadKg / FRAME_LOAD_KG) * 100));
  const deeper = deeperOption(w, d);
  const tankPrice = chosen ? aquariumPriceValue(chosen) : null;

  // veta o pôdoryse — spomenie len rozmer, ktorý sa naozaj líši
  const diffs = chosen
    ? [
        w - chosen.w > 0 ? `o ${w - chosen.w} cm širšia` : null,
        d - chosen.d > 0 ? `o ${d - chosen.d} cm hlbšia` : null,
      ].filter(Boolean)
    : [];
  const fitNote = !chosen
    ? ""
    : diffs.length === 0
      ? "Pôdorys sedí presne — nádrž dosadne po celej ploche rámu."
      : `Skrinka je ${diffs.join(" a ")} než nádrž — akvárium nikdy nesmie pretŕčať cez rám.`;

  const dopyt = () => {
    const lines = [
      "Konfigurácia z konfigurátora AQUAPRIME",
      "",
      `Rad: ${CFG_TIERS.find((t) => t.id === tier)!.label}`,
      `Rozmery skrinky: ${w} × ${h} × ${d} cm (š × v × h)`,
      `Dekor: ${decor.name}`,
      `Podnož: ${feet.name}`,
      `LED podsvietenie: ${ledOn ? "áno" : "nie"}`,
      `Orientačná cena skrinky: ${total} €${price.exact ? "" : " (odhad)"}`,
    ];
    if (withTank) {
      lines.push(
        "",
        chosen
          ? `Akvárium: ${chosen.name} cm (${chosen.vol})`
          : `Akvárium na mieru: ${customTank.w} × ${customTank.d} × ${customTank.h} cm`,
        `Zaťaženie skrinky: ~${loadKg} kg z ${FRAME_LOAD_KG} kg`,
        chosen
          ? `Cena akvária: ${chosen.priceLabel}\nSpolu: ${total + (tankPrice ?? 0)} €`
          : "Cena akvária: na dopyt (nádrž na mieru)"
      );
    }
    window.location.href = `mailto:${OWNER_EMAIL}?subject=${encodeURIComponent(
      "Konfigurácia — AQUAPRIME"
    )}&body=${encodeURIComponent(lines.join("\n"))}`;
  };

  return (
    <div className="kfx">
      {/* ĽAVÁ karta — rad, rozmery, podnož */}
      <div className="kfx__card kfx__card--left" data-reveal="left">
        <div className="kfx__group">
          <span className="kfx__legend">
            <span className="kfx__n">01</span> Rad konštrukcie
          </span>
          <div className="kfx__tiers">
            {CFG_TIERS.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`kfx__tier${tier === t.id ? " is-on" : ""}`}
                onClick={() => setTier(t.id)}
              >
                <strong>{t.label}</strong>
                <span>{t.note}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="kfx__group">
          <span className="kfx__legend">
            <span className="kfx__n">02</span> Rozmery
          </span>
          <Slider label="Šírka" value={w} min={60} max={200} set={setW} />
          <Slider label="Výška" value={h} min={40} max={110} set={setH} />
          <Slider label="Hĺbka" value={d} min={30} max={70} set={setD} />
        </div>

        <div className="kfx__group">
          <span className="kfx__legend">
            <span className="kfx__n">03</span> Podnož
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
                {f.prem > 0 && <em> +{f.prem} €</em>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* STRED — živý náhľad */}
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
          {withTank && tankOnStage && (
            <em>
              {" "}
              + akvárium {tankOnStage.w} × {tankOnStage.d} × {tankOnStage.h}
            </em>
          )}
        </span>
        <div className="kfx__model">
          {view === "2d" ? (
            <CabinetPreview
              w={w}
              h={h}
              d={d}
              tier={tier}
              decor={decor}
              feet={feet.id}
              led={ledOn}
              tank={tankOnStage}
            />
          ) : (
            <Turntable />
          )}
        </div>
        <p className="kfx__stagenote">
          {view === "2d"
            ? "Technická skica — mení sa podľa rozmerov, radu aj dekoru."
            : "3D je zatiaľ ukážkový model jednej skrinky — na konfiguráciu nereaguje."}
        </p>
      </div>

      {/* PRAVÁ karta — dekor, LED, akvárium, cena */}
      <div className="kfx__card kfx__card--right" data-reveal>
        <div className="kfx__group">
          <span className="kfx__legend">
            <span className="kfx__n">04</span> Dekor
          </span>
          <div className="kfx__swatches">
            {CFG_DECORS.map((c) => (
              <button
                key={c.id}
                className={`kfx__sw${decor.id === c.id ? " is-on" : ""}`}
                aria-label={c.name}
                title={c.name}
                onClick={() => setDecor(c)}
                type="button"
              >
                <Swatch swatch={c.swatch} />
              </button>
            ))}
          </div>
          <span className="kfx__pick">{decor.name}</span>
        </div>

        <div className="kfx__group">
          <span className="kfx__legend">
            <span className="kfx__n">05</span> LED podsvietenie
          </span>
          {ledPrem === null ? (
            <p className="kfx__note">
              Rad Basic nemá opláštenie, do ktorého sa LED lišta osádza — vyberte
              Štandard alebo Premium.
            </p>
          ) : (
            <div className="kfx__opts">
              <button
                type="button"
                className={`kfx__opt${!led ? " is-on" : ""}`}
                onClick={() => setLed(false)}
              >
                Bez LED
              </button>
              <button
                type="button"
                className={`kfx__opt${led ? " is-on" : ""}`}
                onClick={() => setLed(true)}
              >
                S LED <em> +{ledPrem} €</em>
              </button>
            </div>
          )}
        </div>

        <div className="kfx__group">
          <span className="kfx__legend">
            <span className="kfx__n">06</span> Akvárium na skrinku
          </span>
          <div className="kfx__opts">
            <button
              type="button"
              className={`kfx__opt${!withTank ? " is-on" : ""}`}
              onClick={() => setWithTank(false)}
            >
              Len skrinka
            </button>
            <button
              type="button"
              className={`kfx__opt${withTank ? " is-on" : ""}`}
              onClick={() => setWithTank(true)}
            >
              So skrinkou aj nádržou
            </button>
          </div>

          {withTank && (
            <div className="kfx__tank">
              {chosen ? (
                <>
                  <div className="kfx__tank-head">
                    <span className="kfx__tank-tag">
                      {tankSlug && pickedFits ? "Vybrané" : "Odporúčame"}
                    </span>
                    <strong>{chosen.name} cm</strong>
                    <span className="kfx__tank-vol">{chosen.vol}</span>
                  </div>

                  <label className="kfx__selectwrap">
                    <span>Iná nádrž, ktorá sa zmestí</span>
                    <select
                      className="kfx__select"
                      value={chosen.slug}
                      onChange={(e) => setTankSlug(e.target.value)}
                    >
                      {match.fits.map((a) => (
                        <option key={a.slug} value={a.slug}>
                          {a.name} cm — {a.vol}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="kfx__load">
                    <div className="kfx__load-top">
                      <span>Zaťaženie skrinky</span>
                      <b>
                        ~{loadKg} kg / {FRAME_LOAD_KG} kg
                      </b>
                    </div>
                    <div className="kfx__load-bar">
                      <i style={{ width: `${loadPct}%` }} />
                    </div>
                  </div>

                  <p className="kfx__note">
                    {fitNote}
                    {droppedPick &&
                      " Pôvodne vybraná nádrž sa už na tento pôdorys nezmestí, tak ukazujem odporúčanú."}
                    {deeper && (
                      <>
                        {" "}
                        Pri hĺbke {deeper.d} cm by sa zmestilo akvárium{" "}
                        {deeper.dim} ({deeper.vol}).
                      </>
                    )}
                  </p>
                </>
              ) : (
                <>
                  <div className="kfx__tank-head">
                    <span className="kfx__tank-tag">Na mieru</span>
                    <strong>
                      {customTank.w} × {customTank.d} × {customTank.h} cm
                    </strong>
                    <span className="kfx__tank-vol">~{liters} l</span>
                  </div>
                  <p className="kfx__note">
                    Na tento pôdorys nemáme štandardnú nádrž — akvárium vyrobíme na
                    mieru presne pod rozmer skrinky.
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        <div className="kfx__sum">
          <div className="kfx__sumrow">
            <span>Skrinka</span>
            <b>{total.toLocaleString("sk-SK")} €</b>
          </div>
          {withTank && (
            <div className="kfx__sumrow">
              <span>Akvárium</span>
              {chosen ? (
                <b>{chosen.priceLabel}</b>
              ) : (
                <b className="kfx__sumrow--ask">na dopyt</b>
              )}
            </div>
          )}
          {withTank && tankPrice !== null && (
            <div className="kfx__sumrow kfx__sumrow--total">
              <span>Spolu</span>
              <b>
                {chosen && chosen.glass.length > 1 ? "od " : ""}
                {(total + tankPrice).toLocaleString("sk-SK")} €
              </b>
            </div>
          )}
          <span className="kfx__price-n">
            {price.exact
              ? "Cenníková cena vrátane DPH."
              : `Orientačne, počítané z cenníkového rozmeru ${price.basedOn}. Presnú cenu potvrdíme po dopyte.`}
          </span>
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
