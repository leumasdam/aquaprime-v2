"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import type { Decor, Product } from "./products";
import { dekorNazov, odkaz as odkazJazyk, radText, type Jazyk } from "./jazyk";
import { SLOVNIKY } from "./preklady";
import Swatch from "./Swatch";
import { VT } from "./vt";

/** Zdieľaná produktová karta — katalóg, home featured aj súvisiace na detaile. */
export default function ProductCard({
  p,
  delay = 0,
  reveal = false,
  entered = false,
  foto,
  znacka,
  stitok,
  odkazParam,
  jazyk = "sk",
}: {
  p: Product;
  delay?: number;
  /** scroll-reveal animácia (home / detail) */
  reveal?: boolean;
  /** okamžitý vstup pri prepnutí filtra (katalóg) */
  entered?: boolean;
  /** iná titulná fotka než p.cover — napr. LED vizualizácia pri filtri */
  foto?: string;
  /** prepíše štítok radu vľavo hore — LED dlaždica nesie vlastný rad */
  znacka?: string;
  /** doplnkový štítok cez fotku (vysvetľuje, prečo je iná) */
  stitok?: string;
  /** query pre detail, nech sa otvorí v tom istom stave ako karta */
  odkazParam?: string;
  /** jazyk odkazu na detail */
  jazyk?: Jazyk;
}) {
  // hover / fokus na vzorke dekoru prepne náhľad na jeho titulnú fotku;
  // preklik potom otvorí detail rovno v tom dekore
  const s = SLOVNIKY[jazyk].spolocne;
  const [dekor, setDekor] = useState<Decor | null>(null);
  const nahlad = foto ?? dekor?.images[0] ?? p.cover;
  const odkazParametre = odkazParam ?? (dekor ? `?dekor=${dekor.id}` : "");
  return (
    <Link
      href={odkazJazyk(`/skrinky/${p.slug}${odkazParametre}`, jazyk)}
      className={`product${entered ? " product--in" : ""}`}
      {...(reveal ? { "data-reveal": "" } : {})}
      style={{ "--rd": `${delay}ms` } as CSSProperties}
    >
      {/* rovnaké meno má galéria na detaile — karta sa doň premorfuje */}
      <VT name={`p-${p.slug}${znacka ? "-led" : ""}`} share="vt-morph">
        <div
          className={`product__media product__media--photo${foto ? " product__media--led" : ""}`}
        >
          <Image
            key={nahlad}
            src={nahlad}
            alt={
              foto
                ? `${radText(p.name, jazyk)} — ${s.altLed}`
                : dekor
                  ? `${radText(p.name, jazyk)} — ${s.altDekor} ${dekorNazov(dekor.name, jazyk)}`
                  : `${radText(p.name, jazyk)} — ${s.altSkrinka}`
            }
            fill
            sizes="(max-width: 700px) 92vw, (max-width: 1100px) 46vw, 30vw"
          />
          <span
            className={`product__badge product__badge--${znacka ? "led" : p.tier}`}
          >
            {znacka ?? radText(p.tierLabel, jazyk)}
          </span>
          {stitok && <span className="product__stitok">{stitok}</span>}
        </div>
      </VT>
      <div className="product__body">
        <h3 className="product__name">
          {/* LED dlaždica stojí v mriežke vedľa tej istej skrinky bez
              podsvietenia, tak nesie rad v názve: PREMIUM LED 100 × 40 × 80 */}
          {znacka
            ? radText(p.name, jazyk).replace(/^(\S+)/, `$1 ${znacka}`)
            : radText(p.name, jazyk)}
        </h3>
        {p.decors.length > 1 && (
          <div
            className="product__decors"
            title={
              dekor
                ? dekorNazov(dekor.name, jazyk)
                : `${p.decors.length} ${SLOVNIKY[jazyk].katalog.dekorov}`
            }
            onMouseLeave={() => setDekor(null)}
          >
            {p.decors.map((d) => (
              <span
                key={d.id}
                className={`product__decor${dekor?.id === d.id ? " is-on" : ""}`}
                onMouseEnter={() => setDekor(d)}
                aria-label={dekorNazov(d.name, jazyk)}
              >
                <Swatch swatch={d.swatch} className="swatch--dot" />
              </span>
            ))}
          </div>
        )}
        <div className="product__specs">
          <span>
            <i>{s.rozmer}</i>
            {p.dim}
          </span>
          <span>
            <i>{s.akvarium}</i>
            {p.vol}
          </span>
        </div>
        <div className="product__foot">
          <span className="product__price">
            {foto && p.priceLed ? p.priceLed : p.price}
            {foto && p.priceLed && <i className="product__price-pozn">{s.sLed}</i>}
          </span>
          <span className="product__cta">
            {s.detail} <span aria-hidden>→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
