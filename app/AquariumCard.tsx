import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { Aquarium } from "./aquariums";
import { VT } from "./vt";
import { odkaz, type Jazyk } from "./jazyk";
import { SLOVNIKY } from "./preklady";
import { akvariumNazov } from "./aquariums-en";

/** Karta akvária — rovnaký jazyk ako ProductCard pri skrinkách, len bez dekorov. */
export default function AquariumCard({
  a,
  delay = 0,
  reveal = false,
  entered = false,
  jazyk = "sk",
}: {
  a: Aquarium;
  delay?: number;
  reveal?: boolean;
  entered?: boolean;
  jazyk?: Jazyk;
}) {
  const t = SLOVNIKY[jazyk].akvaria;
  return (
    <Link
      href={odkaz(`/akvaria/${a.slug}`, jazyk)}
      className={`product${entered ? " product--in" : ""}`}
      {...(reveal ? { "data-reveal": "" } : {})}
      style={{ "--rd": `${delay}ms` } as CSSProperties}
    >
      {/* rovnaké meno má galéria na detaile — karta sa doň premorfuje */}
      <VT name={`a-${a.slug}`} share="vt-morph">
        <div className="product__media product__media--scene">
          <Image
            src={a.cover}
            alt={`${akvariumNazov(a, jazyk)} cm — ${SLOVNIKY[jazyk].akvarium.alt}`}
            fill
            sizes="(max-width: 700px) 92vw, (max-width: 1100px) 46vw, 30vw"
          />
          <span className="product__badge product__badge--aqua">{a.vol}</span>
        </div>
      </VT>
      <div className="product__body">
        <h3 className="product__name">{akvariumNazov(a, jazyk)}</h3>
        <div className="product__specs">
          <span>
            <i>{t.kartaRozmer}</i>
            {a.dim}
          </span>
          <span>
            <i>{t.kartaSklo}</i>
            {a.glass.map((g) => `${g.mm} mm`).join(" / ")}
          </span>
        </div>
        <div className="product__foot">
          <span className="product__price">{a.priceLabel}</span>
          <span className="product__cta">
            {t.kartaDetail} <span aria-hidden>→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
