import type { MetadataRoute } from "next";
import { PRODUCTS } from "./products";

const BASE = "https://aquaprime.sk";
const ROUTES = [
  "",
  "/skrinky",
  "/akvaria-teraria",
  "/doplnky-technika",
  "/materialy",
  "/technologia",
  "/realizacie",
  "/o-nas",
  "/dopyt",
  "/kontakt",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...ROUTES.map((r) => ({
      url: BASE + r,
      changeFrequency: "monthly" as const,
      priority: r === "" ? 1 : r === "/skrinky" || r === "/dopyt" ? 0.9 : 0.7,
    })),
    ...PRODUCTS.map((p) => ({
      url: `${BASE}/skrinky/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
