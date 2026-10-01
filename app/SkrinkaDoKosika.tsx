"use client";

import { useEffect, useState } from "react";
import DoKosika from "./DoKosika";
import type { Product } from "./products";
import type { Jazyk } from "./jazyk";
import { NOZICKY_PRIPLATOK, UDALOST_NOZICKY } from "./nozicky";
import { SLOVNIKY } from "./preklady";

/**
 * Tlačidlo do košíka na detaile skrinky. Dekor si vyberá zákazník v galérii
 * vedľa, tak si ho vypočujeme cez event `aq:decor` — rovnaký vzor, aký web
 * používa pri prepínaní radov medzi TierCards a katalógom.
 */
export default function SkrinkaDoKosika({
  p,
  popis,
  jazyk = "sk",
}: {
  p: Product;
  popis?: string;
  jazyk?: Jazyk;
}) {
  const [dekor, setDekor] = useState({
    id: p.decors[0].id,
    name: p.decors[0].name,
    image: p.decors[0].images[0],
    chyba: false,
  });

  // nožičky si zákazník vyberá prepínačom nad tlačidlom (VolbaNoziciek)
  const [nozicky, setNozicky] = useState(false);

  useEffect(() => {
    const on = (e: Event) => setDekor((e as CustomEvent).detail);
    const onNozicky = (e: Event) => setNozicky(Boolean((e as CustomEvent).detail));
    window.addEventListener("aq:decor", on);
    window.addEventListener(UDALOST_NOZICKY, onNozicky);
    return () => {
      window.removeEventListener("aq:decor", on);
      window.removeEventListener(UDALOST_NOZICKY, onNozicky);
    };
  }, []);

  const t = SLOVNIKY[jazyk].produkt;
  /* Kým klient príplatok neurčí, do ceny sa nepripočíta nič a variant
     v košíku povie, že sa dorieši — rovnako to ráta aj platba (suma.ts). */
  const cena = Number(p.price.replace(/[^\d]/g, "")) + (nozicky ? (NOZICKY_PRIPLATOK ?? 0) : 0);
  const variantNozicky = nozicky
    ? ` · ${t.nozickyVariant}${NOZICKY_PRIPLATOK === null ? ` (${t.nozickyVariantNaDopyt})` : ""}`
    : "";

  /* Dekor, ktorý ešte nie je nafotený, sa objednať nedá — nevieme ukázať,
     ako vyzerá, a pri niektorých radoch ani to, či sa v ňom vyrába. Zostáva
     vedľajšie tlačidlo na dopyt. */
  if (dekor.chyba) return null;

  return (
    <DoKosika
      popis={popis}
      jazyk={jazyk}
      polozka={{
        // s nožičkami a bez nich sú v košíku dve rôzne položky
        id: `skrinka-${p.slug}-${dekor.id}${nozicky ? "-nozicky" : ""}`,
        druh: "skrinka",
        slug: p.slug,
        nazov: p.name,
        variant: `${p.dim} · ${dekor.name}${variantNozicky}`,
        cena,
        obrazok: dekor.image,
        nozicky,
      }}
    />
  );
}
