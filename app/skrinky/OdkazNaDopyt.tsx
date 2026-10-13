"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { odkaz, type Jazyk } from "../jazyk";
import { UDALOST_NOZICKY } from "../nozicky";

/**
 * Tlačidlo „Opýtať sa na produkt" na detaile skrinky. Nesie so sebou, o ktorú
 * skrinku ide a či zákazník zvolil nožičky — formulár dopytu si z toho
 * predvyplní rozmer aj poznámku. Pri skrinke bez ceny je to jediná cesta,
 * ako sa voľba nožičiek dostane k Patrikovi (košík tam nie je).
 */
export default function OdkazNaDopyt({
  slug,
  jazyk = "sk",
  className,
  children,
}: {
  slug: string;
  jazyk?: Jazyk;
  className?: string;
  children: React.ReactNode;
}) {
  const [nozicky, setNozicky] = useState(false);
  useEffect(() => {
    const on = (e: Event) => setNozicky(Boolean((e as CustomEvent).detail));
    window.addEventListener(UDALOST_NOZICKY, on);
    return () => window.removeEventListener(UDALOST_NOZICKY, on);
  }, []);
  const q = new URLSearchParams({ skrinka: slug });
  if (nozicky) q.set("nozicky", "1");
  return (
    <Link href={odkaz(`/dopyt?${q}`, jazyk)} className={className}>
      {children}
    </Link>
  );
}
