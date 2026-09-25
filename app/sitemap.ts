import type { MetadataRoute } from "next";
import { PRODUCTS } from "./products";
import { AQUARIUMS } from "./aquariums";
import { SKRYTY_PRED_VYHLADAVACMI } from "./site-config";
import { vsetkyClanky } from "./blog/clanky";

const BASE = "https://aquaprime.sk";
const ROUTES = [
  "",
  "/skrinky",
  "/akvaria",
  "/doplnky-technika",
  "/materialy",
  "/technologia",
  "/realizacie",
  "/sety",
  "/blog",
  "/o-nas",
  "/konfigurator",
  "/dopyt",
  "/kontakt",
  "/obchodne-podmienky",
  "/reklamacny-poriadok",
  "/ochrana-osobnych-udajov",
];

/** Každá cesta má slovenskú aj anglickú verziu — robotovi ich dvojicu ukážeme
 *  cez hreflang, aby ich nebral ako dva samostatné weby s rovnakým obsahom. */
function dvojjazycne(cesta: string, priorita: number) {
  const alternates = {
    languages: { sk: BASE + cesta, en: `${BASE}/en${cesta}` },
  };
  return [
    {
      url: BASE + (cesta || "/"),
      changeFrequency: "monthly" as const,
      priority: priorita,
      alternates,
    },
    {
      url: `${BASE}/en${cesta || "/"}`,
      changeFrequency: "monthly" as const,
      priority: Math.round(priorita * 0.9 * 10) / 10,
      alternates,
    },
  ];
}

export default function sitemap(): MetadataRoute.Sitemap {
  // skrytý web neponúka mapu stránok — inak by ju robot našiel aj bez odkazu
  if (SKRYTY_PRED_VYHLADAVACMI) return [];
  return [
    ...ROUTES.flatMap((r) =>
      dvojjazycne(
        r,
        r === "" ? 1 : r === "/skrinky" || r === "/akvaria" || r === "/dopyt" ? 0.9 : 0.7
      )
    ),
    ...PRODUCTS.flatMap((p) => dvojjazycne(`/skrinky/${p.slug}`, 0.8)),
    ...AQUARIUMS.flatMap((a) => dvojjazycne(`/akvaria/${a.slug}`, 0.8)),
    /* články sú zatiaľ len po slovensky — bez anglickej dvojičky */
    ...vsetkyClanky().map((c) => ({
      url: `${BASE}/blog/${c.slug}`,
      lastModified: c.date,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
