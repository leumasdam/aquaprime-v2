"use client";

import { useEffect, useState } from "react";
import DoKosika from "./DoKosika";
import type { Product } from "./products";

/**
 * Tlačidlo do košíka na detaile skrinky. Dekor si vyberá zákazník v galérii
 * vedľa, tak si ho vypočujeme cez event `aq:decor` — rovnaký vzor, aký web
 * používa pri prepínaní radov medzi TierCards a katalógom.
 */
export default function SkrinkaDoKosika({ p }: { p: Product }) {
  const [dekor, setDekor] = useState({
    id: p.decors[0].id,
    name: p.decors[0].name,
    image: p.decors[0].images[0],
  });

  useEffect(() => {
    const on = (e: Event) => setDekor((e as CustomEvent).detail);
    window.addEventListener("aq:decor", on);
    return () => window.removeEventListener("aq:decor", on);
  }, []);

  const cena = Number(p.price.replace(/[^\d]/g, ""));

  return (
    <DoKosika
      polozka={{
        id: `skrinka-${p.slug}-${dekor.id}`,
        druh: "skrinka",
        slug: p.slug,
        nazov: p.name,
        variant: `${p.dim} · ${dekor.name}`,
        cena,
        obrazok: dekor.image,
      }}
    />
  );
}
