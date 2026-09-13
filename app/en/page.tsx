import type { Metadata } from "next";
import DomovObsah from "../DomovObsah";
import { EN } from "../preklady";

export const metadata: Metadata = {
  title: EN.meta.domovTitul,
  description: EN.meta.domovPopis,
  alternates: { canonical: "/en", languages: { sk: "/", en: "/en" } },
};

export default function HomeEn() {
  return <DomovObsah t={EN} jazyk="en" />;
}
