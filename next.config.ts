import type { NextConfig } from "next";

// staré produktové URL (rozmery z prvého foto-importu) → cenníkové rozmery
const LEGACY_SLUGS: Record<string, string> = {
  "premium-100x40x90": "premium-100x40x80",
  "standard-80x40x90": "standard-100x40x80",
  "standard-100x40x90": "standard-100x40x80",
  "standard-160x40x80": "standard-160x60x80",
  "standard-200x60x60": "standard-200x50x70",
  "basic-80x40x90": "basic-100x40x80",
  "basic-100x40x90": "basic-100x40x80",
  "basic-120x50x90": "basic-120x40x80",
  "basic-120x60x80": "basic-120x40x80",
  "basic-160x40x80": "basic-160x60x80",
  "basic-200x60x60": "basic-200x50x70",
};

// CSP bez nonce — nonce verzia by nútila renderovať všetky stránky dynamicky
// (koniec SSG + CDN cache), čo sa katalógovému webu neoplatí. 'unsafe-inline'
// pri skriptoch je daň za Next hydratáciu; zvyšok direktív drží pevne:
// žiadne cudzie skripty okrem GTM/GA, žiadne iframy, žiadna exfiltrácia
// na neznáme domény, žiadne object/base-uri triky. Prehodnotiť pri výbere
// platobnej brány (embedded polia si vyžiadajú jej domény, redirect nie).
const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data: https://www.googletagmanager.com https://*.google-analytics.com",
  "font-src 'self' data:",
  "connect-src 'self' https://*.google-analytics.com https://www.googletagmanager.com",
  "media-src 'self'",
  "frame-src https://www.googletagmanager.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  // View Transitions sú od Next 16.3 zapnuté bez experimentálneho flagu —
  // <ViewTransition> sa berie priamo z Reactu (app/vt.tsx)
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // web sa nikde nevkladá do iframe — chráni admin aj eshop pred clickjackingom
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
          { key: "Content-Security-Policy", value: CSP },
        ],
      },
    ];
  },
  async redirects() {
    return [
      ...Object.entries(LEGACY_SLUGS).map(([from, to]) => ({
        source: `/skrinky/${from}`,
        destination: `/skrinky/${to}`,
        permanent: true,
      })),
      // vetva „akváriá & teráriá" dostala vlastný katalóg na /akvaria
      { source: "/akvaria-teraria", destination: "/akvaria", permanent: true },
    ];
  },
};

export default nextConfig;
