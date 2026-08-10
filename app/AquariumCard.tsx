import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { Aquarium } from "./aquariums";

/** Karta akvária — rovnaký jazyk ako ProductCard pri skrinkách, len bez dekorov. */
export default function AquariumCard({
  a,
  delay = 0,
  reveal = false,
  entered = false,
}: {
  a: Aquarium;
  delay?: number;
  reveal?: boolean;
  entered?: boolean;
}) {
  return (
    <Link
      href={`/akvaria/${a.slug}`}
      className={`product${entered ? " product--in" : ""}`}
      {...(reveal ? { "data-reveal": "" } : {})}
      style={{ "--rd": `${delay}ms` } as CSSProperties}
    >
      <div className="product__media product__media--scene">
        <Image
          src={a.cover}
          alt={`${a.name} cm — akvárium na mieru z čírého float skla`}
          fill
          sizes="(max-width: 700px) 92vw, (max-width: 1100px) 46vw, 30vw"
        />
        <span className="product__badge product__badge--aqua">{a.vol}</span>
      </div>
      <div className="product__body">
        <h3 className="product__name">{a.name}</h3>
        <div className="product__specs">
          <span>
            <i>Rozmer</i>
            {a.dim}
          </span>
          <span>
            <i>Sklo</i>
            {a.glass.map((g) => `${g.mm} mm`).join(" / ")}
          </span>
        </div>
        <div className="product__foot">
          <span className="product__price">{a.priceLabel}</span>
          <span className="product__cta">
            Detail <span aria-hidden>→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
