import type { MetadataRoute } from "next";
import { SKRYTY_PRED_VYHLADAVACMI } from "./site-config";

export default function robots(): MetadataRoute.Robots {
  if (SKRYTY_PRED_VYHLADAVACMI) {
    // žiadna sitemap — nemá zmysel pozývať roboty na web, ktorý majú ignorovať
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://aquaprime.sk/sitemap.xml",
  };
}
