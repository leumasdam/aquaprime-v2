"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import Turntable from "./Turntable";
import CabinetPreview, { type PreviewTank } from "./CabinetPreview";
import Swatch from "./Swatch";
import { AQUARIUMS } from "./aquariums";
import {
  CFG_SIZES,
  CFG_TIERS,
  FRAME_LOAD_KG,
  deeperOption,
  ledOf,
  priceOf,
  productFor,
  suggestTank,
  tankLoadKg,
  toCfgDecor,
} from "./configurator-logic";
import type { Tier } from "./products";

const FEET = [
  { id: "steel", name: "Nožičky", prem: 0 },
  { id: "wheels", name: "Kolieska", prem: 60 },
] as const;

const OWNER_EMAIL = "ahoj@aquaprime.sk";

export default function KonfiguratorFull() {
  const [tier, setTier] = useState<Tier>("premium");
  const [sizeKey, setSizeKey] = useState(CFG_SIZES[0].key);
  const [decorId, setDecorId] = useState<string | null>(null);
  const [feet, setFeet] = useState<(typeof FEET)[number]>(FEET[0]);
  const [led, setLed] = useState(false);
  const [withTank, setWithTank] = useState(false);
  const [tankSlug, setTankSlug] = useState<string | null>(null);
  const [view, setView] = useState<"foto" | "skica" | "3d">("foto");

  const size = CFG_SIZES.find((s) => s.key === sizeKey)!;
  const product = productFor(tier, size)!;
  const { w, d, h } = size;

  // dekor sa drží naprieč zmenou radu, len ak ho daný produkt naozaj má;
  // bez voľby ukáž ten, ku ktorému existuje reálna fotka tohto rozmeru
  const decor =
    product.decors.find((x) => x.id === decorId) ??
    product.decors.find((x) => !x.inherited) ??
    product.decors[0];
  const cfgDecor = toCfgDecor(decor);

  const ledPrem = ledOf(product);
  const ledOn = led && ledPrem !== null;
  const total = priceOf(product, ledOn) + feet.prem;

  /* ---- akvárium podľa pôdorysu skrinky ---- */
  const match = suggestTank(w, d);
  const picked = tankSlug ? AQUARIUMS.find((a) => a.slug === tankSlug) : null;
  const pickedFits = !!picked && picked.w <= w && picked.d <= d;
  const chosen = pickedFits ? picked : match.best;
  const droppedPick = !!picked && !pickedFits;
  const tankOnStage: PreviewTank =
    withTank && chosen
      ? { w: chosen.w, d: chosen.d, h: chosen.h, liters: chosen.liters }
      : null;
  const liters = chosen?.liters ?? 0;
  const loadKg = tankLoadKg(liters);
  const loadPct = Math.min(100, Math.round((loadKg / FRAME_LOAD_KG) * 100));
  const deeper = deeperOption(w, d);
  const tankPrice = chosen?.priceValue ?? null;

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

  const foto = useMemo(() => decor.images[0], [decor]);

  const zapnutNadrz = (on: boolean) => {
    setWithTank(on);
    // fotka zostavu s nádržou ukázať nevie — skica áno
    if (on && view === "foto") setView("skica");
  };

  const dopyt = () => {
    const lines = [
      "Konfigurácia z konfigurátora AQUAPRIME",
      "",
      `Produkt: ${product.name}`,
      `Rad: ${product.tierLabel} — ${product.tierNote}`,
      `Rozmer: ${product.dim}`,
      `Dekor: ${decor.name}`,
      `Podnož: ${feet.name}`,
      `LED podsvietenie: ${ledOn ? "áno" : "nie"}`,
      `Cena skrinky: ${total} €`,
    ];
    if (withTank && chosen) {
      lines.push(
        "",
        `Akvárium: ${chosen.name} cm (${chosen.vol}) — ${chosen.priceLabel}`,
        `Zaťaženie skrinky: ~${loadKg} kg z ${FRAME_LOAD_KG} kg`,
        `Spolu: ${total + (tankPrice ?? 0)} €`
      );
    }
    window.location.href = `mailto:${OWNER_EMAIL}?subject=${encodeURIComponent(
      `Konfigurácia ${product.name} — AQUAPRIME`
    )}&body=${encodeURIComponent(lines.join("\n"))}`;
  };

  return (
    <div className="kfx">
      {/* ĽAVÁ karta — rad, rozmer, podnož */}
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
            <span className="kfx__n">02</span> Rozmer
          </span>
          <div className="kfx__sizes">
            {CFG_SIZES.map((s) => (
              <button
                key={s.key}
                type="button"
                className={`kfx__size${sizeKey === s.key ? " is-on" : ""}`}
                onClick={() => setSizeKey(s.key)}
              >
                {s.label}
                <em>cm</em>
              </button>
            ))}
          </div>
          <p className="kfx__note">
            Toto sú rozmery, ktoré vyrábame sériovo.{" "}
            <Link href="/kontakt">Potrebujete iný?</Link> Vyrobíme ho na mieru.
          </p>
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

      {/* STRED — fotka z katalógu, skica alebo 3D */}
      <div className="kfx__stage" data-reveal="scale">
        <div className="kfx__glow" />
        <div className="kfx__toggle">
          {(["foto", "skica", "3d"] as const).map((v) => (
            <button
              key={v}
              className={view === v ? "is-on" : ""}
              onClick={() => setView(v)}
              type="button"
            >
              {v === "foto" ? "FOTO" : v === "skica" ? "SKICA" : "3D"}
            </button>
          ))}
        </div>
        <span className="kfx__dimtag">
          {product.dim}
          {withTank && chosen && <em> + akvárium {chosen.dim}</em>}
        </span>
        <div className="kfx__model">
          {view === "foto" ? (
            <div className="kfx__shot">
              <Image
                key={foto}
                src={foto}
                alt={`${product.name} — dekor ${decor.name}`}
                fill
                sizes="(max-width: 980px) 92vw, 46vw"
                priority
              />
              {decor.inherited && (
                <span className="pgal__illu">Ilustračné foto — iný rozmer</span>
              )}
            </div>
          ) : view === "skica" ? (
            <CabinetPreview
              w={w}
              h={h}
              d={d}
              tier={tier}
              decor={cfgDecor}
              feet={feet.id}
              led={ledOn}
              tank={tankOnStage}
            />
          ) : (
            <Turntable />
          )}
        </div>
        <p className="kfx__stagenote">
          {view === "foto"
            ? decor.inherited
              ? "Fotka rovnakého dekoru na inom rozmere — tvar a konštrukcia sú zhodné."
              : "Reálna fotka produktu z katalógu."
            : view === "skica"
              ? withTank
                ? "Skica zostavy — fotka skrinku s nádržou ukázať nevie."
                : "Technická skica — mení sa podľa rozmeru, radu aj dekoru."
              : "3D je zatiaľ ukážkový model jednej skrinky — na konfiguráciu nereaguje."}
        </p>
      </div>

      {/* PRAVÁ karta — dekor, LED, akvárium, cena */}
      <div className="kfx__card kfx__card--right" data-reveal>
        <div className="kfx__group">
          <span className="kfx__legend">
            <span className="kfx__n">04</span> Dekor
            <em>{product.decors.length} k tomuto rozmeru</em>
          </span>
          <div className="kfx__swatches">
            {product.decors.map((c) => (
              <button
                key={c.id}
                className={`kfx__sw${decor.id === c.id ? " is-on" : ""}`}
                aria-label={c.name}
                title={c.name}
                onClick={() => setDecorId(c.id)}
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
              onClick={() => zapnutNadrz(false)}
            >
              Len skrinka
            </button>
            <button
              type="button"
              className={`kfx__opt${withTank ? " is-on" : ""}`}
              onClick={() => zapnutNadrz(true)}
            >
              So skrinkou aj nádržou
            </button>
          </div>

          {withTank && chosen && (
            <div className="kfx__tank">
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
                      {a.name} cm — {a.vol} — {a.priceLabel}
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
                    Pri hĺbke {deeper.d} cm by sa zmestilo akvárium {deeper.dim} (
                    {deeper.vol}).
                  </>
                )}
              </p>
            </div>
          )}
        </div>

        <div className="kfx__sum">
          <div className="kfx__sumrow">
            <span>Skrinka</span>
            <b>{total.toLocaleString("sk-SK")} €</b>
          </div>
          {withTank && chosen && (
            <>
              <div className="kfx__sumrow">
                <span>Akvárium</span>
                <b>{chosen.priceLabel}</b>
              </div>
              <div className="kfx__sumrow kfx__sumrow--total">
                <span>Spolu</span>
                <b>
                  {chosen.glass.length > 1 ? "od " : ""}
                  {(total + (tankPrice ?? 0)).toLocaleString("sk-SK")} €
                </b>
              </div>
            </>
          )}
          <span className="kfx__price-n">
            Cenníková cena vrátane DPH.{" "}
            <Link href={`/skrinky/${product.slug}`}>Detail skrinky</Link>
          </span>
        </div>
        <button type="button" className="btn-cyan kfx__send" onClick={dopyt}>
          ODOSLAŤ DOPYT <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  );
}
