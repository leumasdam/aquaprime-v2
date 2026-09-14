"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Swatch from "./Swatch";
import {
  CFG_SIZES,
  CFG_TIERS,
  ledOf,
  priceOf,
  productFor,
} from "./configurator-logic";
import { nafoteneDekory, type Tier } from "./products";
import { dekorNazov, odkaz, radText, type Jazyk } from "./jazyk";
import { SLOVNIKY } from "./preklady";

/**
 * Mini-konfigurátor na homepade — zámerne len tri voľby (rad, rozmer, dekor).
 * Podnož, LED a akvárium patria do plného konfigurátora; tu ide o to ukázať
 * reálny produkt a cenu na pár klikov, nie zopakovať celú stránku.
 */
export default function Configurator({ jazyk = "sk" }: { jazyk?: Jazyk }) {
  const t = SLOVNIKY[jazyk].domov;
  const tp = SLOVNIKY[jazyk].produkt;
  const [tier, setTier] = useState<Tier>("premium");
  const [sizeKey, setSizeKey] = useState(CFG_SIZES[0].key);
  const [decorId, setDecorId] = useState<string | null>(null);

  const size = CFG_SIZES.find((s) => s.key === sizeKey)!;
  const product = productFor(tier, size)!;
  // bez vlastnej voľby ukáž najlepšie zdokumentovaný dekor
  /* konfigurátor ukazuje fotku, tak ponúka len nafotené dekory */
  const dekory = nafoteneDekory(product);
  const decor =
    dekory.find((x) => x.id === decorId) ??
    dekory.find((x) => !x.inherited) ??
    dekory.find((x) => x.illuFrom === "rozmer") ??
    dekory[0];
  const price = priceOf(product, false);
  const ledPrem = ledOf(product);

  return (
    <div className="cfg__grid">
      {/* náhľad — reálna fotka z katalógu */}
      <div className="cfg__preview" data-reveal="scale">
        <div className="cfg__shot">
          <Image
            key={decor.images[0]}
            src={decor.images[0]}
            alt={`${radText(product.name, jazyk)} — ${SLOVNIKY[jazyk].spolocne.altDekor} ${dekorNazov(decor.name, jazyk)}`}
            fill
            sizes="(max-width: 900px) 92vw, 46vw"
          />
          {decor.inherited &&
            (decor.illuFrom === "schema" ? (
                  <span className="pgal__illu">{tp.schema}</span>
                ) : decor.illuFrom === "rad" ? (
              <span className="pgal__illu">{tp.inyRad}</span>
                ) : decor.illuFrom === "dvierka" ? (
              <span className="pgal__illu">
                {tp.fotoDvierok.replace("{n}", String(decor.illuDvierka))}
              </span>
            ) : (
              <span className="pgal__illu pgal__illu--size">
                {decor.illuSize ? `${tp.fotoRozmeru} ${decor.illuSize}` : tp.inyRozmer}
              </span>
            ))}
        </div>
        <p className="cfg__hint">
          {radText(product.tierLabel, jazyk)} · {product.dim} ·{" "}
          {dekorNazov(decor.name, jazyk)}
        </p>
      </div>

      {/* ovládanie */}
      <div className="cfg__panel" data-reveal>
        <div className="cfg__field">
          <span className="cfg__legend">
            <span className="cfg__n">01</span> {t.cfgKroky.rad}
          </span>
          <div className="cfg__feet-opts">
            {CFG_TIERS.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`cfg__opt${tier === t.id ? " is-on" : ""}`}
                onClick={() => setTier(t.id)}
                title={SLOVNIKY[jazyk].spolocne.radPoznamky[t.id]}
              >
                {radText(t.label, jazyk)}
              </button>
            ))}
          </div>
        </div>

        <div className="cfg__field">
          <span className="cfg__legend">
            <span className="cfg__n">02</span> {t.cfgKroky.rozmer}
          </span>
          <div className="cfg__sizes">
            {CFG_SIZES.map((s) => (
              <button
                key={s.key}
                type="button"
                className={`cfg__opt cfg__opt--size${
                  sizeKey === s.key ? " is-on" : ""
                }`}
                onClick={() => setSizeKey(s.key)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="cfg__field">
          <span className="cfg__legend">
            <span className="cfg__n">03</span> {t.cfgKroky.dekor}
          </span>
          <div className="cfg__swatches">
            {dekory.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`cfg__swatch${decor.id === c.id ? " is-on" : ""}`}
                aria-label={dekorNazov(c.name, jazyk)}
                title={dekorNazov(c.name, jazyk)}
                onClick={() => setDecorId(c.id)}
              >
                <Swatch swatch={c.swatch} />
              </button>
            ))}
          </div>
        </div>

        <div className="cfg__summary">
          <div className="cfg__price">
            <span className="cfg__price-label">{t.cfgCena}</span>
            <span className="cfg__price-val">
              {price.toLocaleString("sk-SK")} €
            </span>
            <span className="cfg__price-note">
              {t.cfgDph}
              {ledPrem !== null ? ` · ${t.cfgSLed} +${ledPrem} €` : ""}
            </span>
          </div>
          <div className="cfg__actions">
            <Link
              href={odkaz(`/konfigurator?rad=${tier}&rozmer=${size.key}&dekor=${decor.id}`, jazyk)}
              className="btn-cyan cfg__submit"
            >
              {t.cfgDoladit} <span aria-hidden>→</span>
            </Link>
            <Link href={odkaz(`/skrinky/${product.slug}`, jazyk)} className="cfg__detail">
              {t.cfgDetail}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
