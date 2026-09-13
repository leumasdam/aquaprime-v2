import type { Metadata } from "next";
import SkrinkyObsah from "../../skrinky/Obsah";
import { EN } from "../../preklady";

export const metadata: Metadata = {
  title: EN.katalog.metaTitul,
  description: EN.katalog.metaPopis,
  alternates: { canonical: "/en/skrinky", languages: { sk: "/skrinky", en: "/en/skrinky" } },
};

export default function SkrinkyPageEn() {
  return <SkrinkyObsah t={EN} jazyk="en" />;
}
