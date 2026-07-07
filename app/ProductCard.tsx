import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { Product } from "./products";
import Swatch from "./Swatch";

/** Zdieľaná produktová karta — katalóg, home featured aj súvisiace na detaile. */
export default function ProductCard({
  p,
  delay = 0,
  reveal = false,
  entered = false,
}: {
  p: Product;
  delay?: number;
  /** scroll-reveal animácia (home / detail) */
  reveal?: boolean;
  /** okamžitý vstup pri prepnutí filtra (katalóg) */
  entered?: boolean;
}) {
  return (
    <Link
      href={`/skrinky/${p.slug}`}
      className={`product${entered ? " product--in" : ""}`}
      {...(reveal ? { "data-reveal": "" } : {})}
      style={{ "--rd": `${delay}ms` } as CSSProperties}
    >
      <div className="product__media product__media--photo">
        <Image
          src={p.cover}
          alt={`${p.name} — skrinka pod akvárium`}
          fill
          sizes="(max-width: 700px) 92vw, (max-width: 1100px) 46vw, 30vw"
        />
        <span className={`product__badge product__badge--${p.tier}`}>
          {p.tierLabel}
        </span>
      </div>
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
          <span className="product__price">{p.price}</span>
          <span className="product__cta">
            Detail <span aria-hidden>→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
