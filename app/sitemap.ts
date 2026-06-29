import type { MetadataRoute } from "next";

const BASE = "https://aquaprime.sk";
const ROUTES = [
  "",
  "/skrinky",
  "/akvaria-teraria",
  "/doplnky-technika",
  "/materialy",
  "/realizacie",
  "/o-nas",
  "/dopyt",
  "/kontakt",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((r) => ({
    url: BASE + r,
    changeFrequency: "monthly",
    priority: r === "" ? 1 : r === "/skrinky" || r === "/dopyt" ? 0.9 : 0.7,
  }));
}
