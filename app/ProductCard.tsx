import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { Product } from "./products";
import Swatch from "./Swatch";
import { VT } from "./vt";

/** Zdieľaná produktová karta — katalóg, home featured aj súvisiace na detaile. */
export default function ProductCard({
  p,
  delay = 0,
  reveal = false,
  entered = false,
  foto,
  stitok,
  odkazParam,
}: {
  p: Product;
  delay?: number;
  /** scroll-reveal animácia (home / detail) */
  reveal?: boolean;
  /** okamžitý vstup pri prepnutí filtra (katalóg) */
  entered?: boolean;
  /** iná titulná fotka než p.cover — napr. LED vizualizácia pri filtri */
  foto?: string;
  /** doplnkový štítok cez fotku (vysvetľuje, prečo je iná) */
  stitok?: string;
  /** query pre detail, nech sa otvorí v tom istom stave ako karta */
  odkazParam?: string;
}) {
  return (
    <Link
      href={`/skrinky/${p.slug}${odkazParam ?? ""}`}
      className={`product${entered ? " product--in" : ""}`}
      {...(reveal ? { "data-reveal": "" } : {})}
      style={{ "--rd": `${delay}ms` } as CSSProperties}
    >
      {/* rovnaké meno má galéria na detaile — karta sa doň premorfuje */}
      <VT name={`p-${p.slug}`} share="vt-morph">
        <div
          className={`product__media product__media--photo${foto ? " product__media--led" : ""}`}
        >
          <Image
            key={foto ?? p.cover}
            src={foto ?? p.cover}
            alt={
              foto
                ? `${p.name} — vizualizácia s LED podsvietením`
                : `${p.name} — skrinka pod akvárium`
            }
            fill
            sizes="(max-width: 700px) 92vw, (max-width: 1100px) 46vw, 30vw"
          />
          <span className={`product__badge product__badge--${p.tier}`}>
            {p.tierLabel}
          </span>
          {stitok && <span className="product__stitok">{stitok}</span>}
        </div>
      </VT>
      <div className="product__body">
        <h3 className="product__name">{p.name}</h3>
        {p.decors.length > 1 && (
          <div
            className="product__decors"
            title={`${p.decors.length} dekorov na výber`}
          >
            {p.decors.map((d) => (
              <Swatch key={d.id} swatch={d.swatch} className="swatch--dot" />
            ))}
          </div>
        )}
        <div className="product__specs">
          <span>
            <i>Rozmer</i>
            {p.dim}
          </span>
          <span>
            <i>Akvárium</i>
            {p.vol}
          </span>
        </div>
        <div className="product__foot">
          <span className="product__price">
            {foto && p.priceLed ? p.priceLed : p.price}
            {foto && p.priceLed && <i className="product__price-pozn">s LED</i>}
          </span>
          <span className="product__cta">
            Detail <span aria-hidden>→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
