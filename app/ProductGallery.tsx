"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Product } from "./products";
import Swatch from "./Swatch";
import { VT } from "./vt";

type Svetlo = "bez" | "zlta" | "modra";

/**
 * Počet dvierok podľa šírky (zadanie klienta): pod 120 cm dve, od 120 tri,
 * 200 cm štyri. Musí sedieť s scripts/foto-dvierka.mjs, podľa ktorého sa
 * vyberajú fotky.
 */
const dvierkaPreSirku = (w: number) => (w < 120 ? 2 : w >= 200 ? 4 : 3);

const SVETLA: { id: Svetlo; label: string; bodka?: string }[] = [
  { id: "bez", label: "Bez LED" },
  { id: "zlta", label: "Teplá biela", bodka: "#ffd9a0" },
  { id: "modra", label: "Modrá", bodka: "#5fb8ff" },
];

/** Galéria detailu produktu — hlavná fotka, thumbnaily a prepínač dekorov. */
export default function ProductGallery({ p }: { p: Product }) {
  const [decorIdx, setDecorIdx] = useState(0);
  const [imgIdx, setImgIdx] = useState(0);
  const [svetlo, setSvetlo] = useState<Svetlo>("bez");
  const decor = p.decors[decorIdx];

  /* preklik z katalógu s LED filtrom (?led=zlta&dekor=…) — detail sa má
     otvoriť v tom istom stave, aký bol na karte, nie v základnom */
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const dekor = q.get("dekor");
    const i = dekor ? p.decors.findIndex((d) => d.id === dekor) : -1;
    if (i >= 0) setDecorIdx(i);
    const led = q.get("led");
    if (led === "zlta" || led === "modra") setSvetlo(led);
  }, [p]);

  /* dostupné farby podsvietenia pre tento dekor */
  const svetla = SVETLA.filter((s) => s.id === "bez" || decor.led?.[s.id as "zlta" | "modra"]?.length);
  const aktivne: Svetlo = svetla.some((s) => s.id === svetlo) ? svetlo : "bez";
  const zoznam = aktivne === "bez" ? decor.images : (decor.led?.[aktivne] ?? decor.images);
  const img = zoznam[Math.min(imgIdx, zoznam.length - 1)];
  const vizualizacia = aktivne !== "bez";

  // zvolený dekor potrebuje aj tlačidlo do košíka vedľa galérie
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("aq:decor", {
        detail: { id: decor.id, name: decor.name, image: decor.images[0] },
      })
    );
  }, [decor]);

  return (
    <div className={`pgal${vizualizacia ? " pgal--scene" : ""}`} data-reveal="scale">
      {/* rovnaké meno má karta v katalógu — z nej sa sem premorfuje */}
      <VT name={`p-${p.slug}`} share="vt-morph">
      <div className="pgal__main">
        <Image
          key={img}
          src={img}
          alt={`${p.name} — dekor ${decor.name}`}
          fill
          priority
          sizes="(max-width: 820px) 92vw, 48vw"
        />
        <span className={`product__badge product__badge--${p.tier}`}>
          {p.tierLabel}
        </span>
        {vizualizacia ? (
          <span className="pgal__illu pgal__illu--led" title="Vizualizácia podsvietenia">
            Vizualizácia LED
          </span>
        ) : (
          decor.inherited &&
          (decor.illuFrom === "rad" ? (
            <span className="pgal__illu" title="Tento dekor máme nafotený len na inom rade">
              Ilustračné foto — iný rad
            </span>
          ) : decor.illuFrom === "dvierka" ? (
            <span
              className="pgal__illu"
              title="Tento dekor máme nafotený len v inom počte dvierok"
            >
              Foto {decor.illuDvierka}-dverového vyhotovenia
            </span>
          ) : (
            <span
              className="pgal__illu pgal__illu--size"
              title="Tá istá skrinka a dekor, len kratšie vyhotovenie"
            >
              {decor.illuSize
                ? `Foto rozmeru ${decor.illuSize}`
                : "Foto iného rozmeru"}
            </span>
          ))
        )}
      </div>
      </VT>

      {svetla.length > 1 && (
        <div className="pgal__led" role="group" aria-label="Podsvietenie">
          <span className="pgal__led-label">Podsvietenie</span>
          <div className="pgal__led-vyber">
            {svetla.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`pgal__ledbtn${s.id === aktivne ? " is-on" : ""}`}
                aria-pressed={s.id === aktivne}
                onClick={() => {
                  setSvetlo(s.id);
                  setImgIdx(0);
                }}
              >
                {s.bodka && <span className="pgal__ledbod" style={{ background: s.bodka }} aria-hidden />}
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {zoznam.length > 1 && (
        <div className="pgal__thumbs">
          {zoznam.map((src, i) => (
            <button
              key={src}
              type="button"
              className={`pgal__thumb${i === imgIdx ? " is-on" : ""}`}
              onClick={() => setImgIdx(i)}
              aria-label={`Fotografia ${i + 1}`}
            >
              <Image src={src} alt="" fill sizes="64px" />
            </button>
          ))}
        </div>
      )}

      {p.decors.length > 1 && (
        <div className="pgal__decorbar">
          <div className="pgal__decor-head">
            <span className="pgal__decor-label">Dekor</span>
            <span className="pgal__decor-name">{decor.name}</span>
          </div>
          <div className="pgal__decors" role="group" aria-label="Dekor">
            {p.decors.map((d, i) => (
              <button
                key={d.id}
                type="button"
                title={d.name}
                aria-label={d.name}
                aria-pressed={i === decorIdx}
                className={`pgal__decorbtn${i === decorIdx ? " is-on" : ""}`}
                onClick={() => {
                  setDecorIdx(i);
                  setImgIdx(0);
                }}
              >
                <Swatch swatch={d.swatch} />
              </button>
            ))}
          </div>
        </div>
      )}

      {vizualizacia ? (
        <p className="pgal__note">
          Vizualizácia podsvietenia v {dvierkaPreSirku(p.w)}-dverovom vyhotovení.
          LED lišta je priplácaná voľba{p.priceLed ? ` — cena s podsvietením ${p.priceLed}` : ""}.
        </p>
      ) : (
        decor.inherited && (
          <p className="pgal__note">
            {decor.illuFrom === "rad"
              ? "Ilustračné fotografie — tento dekor máme zatiaľ nafotený len na inom rade konštrukcie."
              : decor.illuFrom === "dvierka"
                ? `Fotografie zachytávajú ${decor.illuDvierka}-dverové vyhotovenie. Skrinka ${p.dim} má ${dvierkaPreSirku(p.w)} dvierka — v tomto vyhotovení ju zatiaľ nemáme nafotenú, konštrukcia aj povrch sú však zhodné.`
                : decor.illuSize
                  ? `Fotografie zachytávajú rovnakú skrinku v tomto dekore, len v dĺžke ${decor.illuSize}. Konštrukcia aj povrch sú zhodné.`
                  : "Fotografie zachytávajú tento dekor na skrinkách iných rozmerov. Konštrukcia aj povrch sú zhodné."}
          </p>
        )
      )}
    </div>
  );
}
