"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Decor, Product } from "./products";
import { cenaText, dekorNazov, odkaz as odkazJazyk, radText, type Jazyk } from "./jazyk";
import { SLOVNIKY } from "./preklady";
import Swatch from "./Swatch";
import { VT } from "./vt";

/** Ako často sa na karte sama vymení farba a ako dlho trvá prelínanie. */
const INTERVAL_MS = 4000;

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
  const s = SLOVNIKY[jazyk].spolocne;

  /* Náhľad sa pomaly sám strieda cez dekory, ktoré majú fotku. Hover alebo
     fokus na vzorke to preruší a ukáže vybraný dekor; po odchode myši sa
     striedanie rozbehne znova. LED dlaždica (foto) má pevný záber. */
  const cyklus = foto ? [] : p.decors.filter((d) => !d.chyba && d.images.length > 0);
  const [hover, setHover] = useState<Decor | null>(null);
  const [auto, setAuto] = useState(0);
  const [pauza, setPauza] = useState(false);
  const karta = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (cyklus.length < 2 || pauza) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = karta.current;
    if (!el) return;
    /* každá karta začne v inom okamihu, aby sa mriežka nemenila naraz —
       slugy susedných rozmerov sa líšia v jednom znaku, preto hash a nie súčet */
    let h = 2166136261;
    for (let i = 0; i < p.slug.length; i++) h = Math.imul(h ^ p.slug.charCodeAt(i), 16777619) >>> 0;
    const faza = h % INTERVAL_MS;
    let timer: number | undefined;
    let viditelna = false;
    const stop = () => {
      if (timer !== undefined) window.clearInterval(timer);
      timer = undefined;
    };
    const start = () => {
      stop();
      timer = window.setInterval(() => setAuto((i) => (i + 1) % cyklus.length), INTERVAL_MS);
    };
    const io = new IntersectionObserver(
      ([z]) => {
        viditelna = z.isIntersecting;
        if (viditelna) start();
        else stop();
      },
      { threshold: 0.25 }
    );
    const rozbeh = window.setTimeout(() => io.observe(el), faza);
    return () => {
      window.clearTimeout(rozbeh);
      io.disconnect();
      stop();
    };
  }, [cyklus.length, pauza, p.slug]);

  const aktivny: Decor | null = hover ?? (cyklus.length ? cyklus[auto % cyklus.length] : null);
  const nahlad = foto ?? aktivny?.images[0] ?? p.cover;

  /* prelínanie: predošlá fotka ostáva pod novou, kým nová nedobehne */
  const posledna = useRef(nahlad);
  const predosla = posledna.current !== nahlad ? posledna.current : null;
  useEffect(() => {
    posledna.current = nahlad;
  }, [nahlad]);

  const odkazParametre = odkazParam ?? (aktivny ? `?dekor=${aktivny.id}` : "");
  const alt = foto
    ? `${radText(p.name, jazyk)} — ${s.altLed}`
    : aktivny
      ? `${radText(p.name, jazyk)} — ${s.altDekor} ${dekorNazov(aktivny.name, jazyk)}`
      : `${radText(p.name, jazyk)} — ${s.altSkrinka}`;
  const velkosti = "(max-width: 700px) 92vw, (max-width: 1100px) 46vw, 30vw";

  return (
    <Link
      ref={karta}
      href={odkazJazyk(`/skrinky/${p.slug}${odkazParametre}`, jazyk)}
      className={`product${entered ? " product--in" : ""}`}
      {...(reveal ? { "data-reveal": "" } : {})}
      style={{ "--rd": `${delay}ms` } as CSSProperties}
      onMouseEnter={() => setPauza(true)}
      onMouseLeave={() => {
        setPauza(false);
        setHover(null);
      }}
    >
      {/* rovnaké meno má galéria na detaile — karta sa doň premorfuje */}
      <VT name={`p-${p.slug}${znacka ? "-led" : ""}`} share="vt-morph">
        <div
          className={`product__media product__media--photo${foto ? " product__media--led" : ""}`}
        >
          {predosla && (
            <Image key={`predosla-${predosla}`} src={predosla} alt="" aria-hidden fill sizes={velkosti} />
          )}
          <Image
            key={nahlad}
            src={nahlad}
            alt={alt}
            className={predosla ? "product__foto--nova" : undefined}
            fill
            sizes={velkosti}
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
              aktivny
                ? dekorNazov(aktivny.name, jazyk)
                : `${p.decors.length} ${SLOVNIKY[jazyk].katalog.dekorov}`
            }
          >
            {p.decors.map((d) => (
              <span
                key={d.id}
                className={`product__decor${aktivny?.id === d.id ? " is-on" : ""}${
                  /* dekor z ponuky, ktorý ešte nie je nafotený — zošedne */
                  d.chyba ? " product__decor--chyba" : ""
                }`}
                onMouseEnter={() => setHover(d)}
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
            {cenaText(p.vol, jazyk)}
          </span>
        </div>
        <div className="product__foot">
          <span className="product__price">
            {cenaText(foto && p.priceLed ? p.priceLed : p.price, jazyk)}
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
