import type { MetadataRoute } from "next";
import { SKRYTY_PRED_VYHLADAVACMI } from "./site-config";

export default function robots(): MetadataRoute.Robots {
  if (SKRYTY_PRED_VYHLADAVACMI) {
    // žiadna sitemap — nemá zmysel pozývať roboty na web, ktorý majú ignorovať
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    // administrácia a API nemajú vo vyhľadávačoch čo robiť ani po odomknutí
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
    sitemap: "https://aquaprime.sk/sitemap.xml",
  };
}
