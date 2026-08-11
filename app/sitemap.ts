import type { MetadataRoute } from "next";
import { PRODUCTS } from "./products";
import { AQUARIUMS } from "./aquariums";
import { SKRYTY_PRED_VYHLADAVACMI } from "./site-config";

const BASE = "https://aquaprime.sk";
const ROUTES = [
  "",
  "/skrinky",
  "/akvaria",
  "/doplnky-technika",
  "/materialy",
  "/technologia",
  "/realizacie",
  "/o-nas",
  "/dopyt",
  "/kontakt",
];

export default function sitemap(): MetadataRoute.Sitemap {
  // skrytý web neponúka mapu stránok — inak by ju robot našiel aj bez odkazu
  if (SKRYTY_PRED_VYHLADAVACMI) return [];
  return [
    ...ROUTES.map((r) => ({
      url: BASE + r,
      changeFrequency: "monthly" as const,
      priority:
        r === ""
          ? 1
          : r === "/skrinky" || r === "/akvaria" || r === "/dopyt"
            ? 0.9
            : 0.7,
    })),
    ...PRODUCTS.map((p) => ({
      url: `${BASE}/skrinky/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...AQUARIUMS.map((a) => ({
      url: `${BASE}/akvaria/${a.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
