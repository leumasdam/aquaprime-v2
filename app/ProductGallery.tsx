"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Product } from "./products";
import { dvierkaPreSirku } from "./cabinet-construction";
import Swatch from "./Swatch";
import { VT } from "./vt";
import { dekorNazov, radText, type Jazyk } from "./jazyk";
import { SLOVNIKY } from "./preklady";

type Svetlo = "bez" | "zlta" | "modra";

const SVETLA: { id: Svetlo; label: string; bodka?: string }[] = [
  { id: "bez", label: "bezLed" },
  { id: "zlta", label: "teplaBiela", bodka: "#ffd9a0" },
  { id: "modra", label: "modra", bodka: "#5fb8ff" },
];

/** Galéria detailu produktu — hlavná fotka, thumbnaily a prepínač dekorov. */
export default function ProductGallery({ p, jazyk = "sk" }: { p: Product; jazyk?: Jazyk }) {
  const tp = SLOVNIKY[jazyk].produkt;
  const [decorIdx, setDecorIdx] = useState(0);
  const [imgIdx, setImgIdx] = useState(0);
  const [svetlo, setSvetlo] = useState<Svetlo>("bez");
  // Index prežíva klientský preklik na iný produkt (rovnaká route) — produkt
  // s menším počtom dekorov by inak dostal undefined a galéria by spadla.
  const decor = p.decors[decorIdx] ?? p.decors[0];

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
  const i = Math.max(0, Math.min(imgIdx, zoznam.length - 1));
  const img = zoznam[i];
  const vizualizacia = aktivne !== "bez";
  /* dekor z ponuky, ktorý ešte nie je nafotený — namiesto fotky placeholder */
  const chyba = Boolean(decor.chyba) || !img;

  /* Keď je vyplnené illuIdx, časť galérie je prevzatá a časť vlastná —
     štítok potom patrí len konkrétnym fotkám, nie celému dekoru. */
  const prevzata = decor.illuIdx ? decor.illuIdx.includes(i) : Boolean(decor.inherited);

  // zvolený dekor potrebuje aj tlačidlo do košíka vedľa galérie
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("aq:decor", {
        detail: {
          id: decor.id,
          name: decor.name,
          image: decor.images[0] ?? p.cover,
          chyba: Boolean(decor.chyba),
        },
      })
    );
  }, [decor, p.cover]);

  return (
    <div className={`pgal${vizualizacia ? " pgal--scene" : ""}`} data-reveal="scale">
      {/* rovnaké meno má karta v katalógu — z nej sa sem premorfuje */}
      <VT name={`p-${p.slug}`} share="vt-morph">
      <div className={`pgal__main${chyba ? " pgal__main--chyba" : ""}`}>
        {chyba ? (
          <span className="pgal__prazdno" aria-hidden>
            <span className="pgal__prazdno-ram" />
            <span className="pgal__prazdno-text">{tp.chybaStitok}</span>
          </span>
        ) : (
          <Image
            key={img}
            src={img}
            alt={`${radText(p.name, jazyk)} — ${SLOVNIKY[jazyk].spolocne.altDekor} ${dekorNazov(decor.name, jazyk)}`}
            fill
            priority
            sizes="(max-width: 820px) 92vw, 48vw"
          />
        )}
        <span className={`product__badge product__badge--${p.tier}`}>
          {radText(p.tierLabel, jazyk)}
        </span>
        {chyba ? null : vizualizacia ? (
          <span className="pgal__illu pgal__illu--led" title={tp.titulkaLed}>
            {tp.vizualizaciaLed}
          </span>
        ) : (
          prevzata &&
          (decor.illuFrom === "schema" ? (
            <span className="pgal__illu">{tp.schema}</span>
          ) : decor.illuFrom === "rad" ? (
            <span className="pgal__illu" title={tp.titulkaRad}>
              {tp.inyRad}
            </span>
          ) : decor.illuFrom === "dvierka" ? (
            <span
              className="pgal__illu"
              title={tp.titulkaDvierka}
            >
              {tp.fotoDvierok.replace("{n}", String(decor.illuDvierka))}
            </span>
          ) : (
            <span
              className="pgal__illu pgal__illu--size"
              title={tp.titulkaRozmer}
            >
              {decor.illuSize
                ? `${tp.fotoRozmeru} ${decor.illuSize}`
                : tp.inyRozmer}
            </span>
          ))
        )}
      </div>
      </VT>

      {svetla.length > 1 && (
        <div className="pgal__led" role="group" aria-label={tp.podsvietenie}>
          <span className="pgal__led-label">{tp.podsvietenie}</span>
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
                {tp[s.label as "bezLed" | "teplaBiela" | "modra"]}
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
              aria-label={`${tp.fotografia} ${i + 1}`}
            >
              <Image src={src} alt="" fill sizes="64px" />
            </button>
          ))}
        </div>
      )}

      {p.decors.length > 1 && (
        <div className="pgal__decorbar">
          <div className="pgal__decor-head">
            <span className="pgal__decor-label">{tp.dekor}</span>
            <span className="pgal__decor-name">{dekorNazov(decor.name, jazyk)}</span>
          </div>
          <div className="pgal__decors" role="group" aria-label={tp.dekor}>
            {p.decors.map((d, i) => (
              <button
                key={d.id}
                type="button"
                title={
                  d.chyba
                    ? `${dekorNazov(d.name, jazyk)} — ${tp.chybaTitulka}`
                    : dekorNazov(d.name, jazyk)
                }
                aria-label={dekorNazov(d.name, jazyk)}
                aria-pressed={i === decorIdx}
                className={`pgal__decorbtn${i === decorIdx ? " is-on" : ""}${
                  d.chyba ? " pgal__decorbtn--chyba" : ""
                }`}
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

      {chyba ? (
        <p className="pgal__note pgal__note--chyba">
          {tp.chybaPozn
            .replace("{dekor}", dekorNazov(decor.name, jazyk))
            .replace("{rozmer}", p.dim)}
        </p>
      ) : vizualizacia ? (
        <p className="pgal__note">
          {tp.poznLed.replace("{n}", String(dvierkaPreSirku(p.w)))}
          {p.priceLed ? tp.poznLedCena.replace("{cena}", p.priceLed) : ""}.
        </p>
      ) : (
        prevzata && (
          <p className="pgal__note">
            {decor.illuFrom === "schema"
              ? tp.poznSchema.replace("{rozmer}", p.dim)
              : decor.illuFrom === "rad"
                ? tp.poznRad
                    .replace("{rad}", radText(p.tierLabel, jazyk))
                    .replace("{pozn}", SLOVNIKY[jazyk].spolocne.radPoznamky[p.tier])
                : decor.illuFrom === "dvierka"
                  ? tp.poznDvierka
                      .replace("{n}", String(decor.illuDvierka))
                      .replace("{rozmer}", p.dim)
                      .replace("{m}", String(dvierkaPreSirku(p.w)))
                  : decor.illuSize
                    ? tp.poznRozmer
                        .replace("{foteny}", decor.illuSize)
                        .replace("{rozmer}", p.dim)
                    : tp.poznInyRozmer.replace("{rozmer}", p.dim)}
          </p>
        )
      )}
    </div>
  );
}
