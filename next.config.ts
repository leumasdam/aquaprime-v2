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

const nextConfig: NextConfig = {
  async redirects() {
    return Object.entries(LEGACY_SLUGS).map(([from, to]) => ({
      source: `/skrinky/${from}`,
      destination: `/skrinky/${to}`,
      permanent: true,
    }));
  },
};

export default nextConfig;
