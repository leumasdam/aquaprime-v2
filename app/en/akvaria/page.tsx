import type { Metadata } from "next";
import AkvariaObsah from "../../akvaria/Obsah";
import { EN } from "../../preklady";

export const metadata: Metadata = {
  title: EN.akvaria.metaTitul,
  description: EN.akvaria.metaPopis,
  alternates: { canonical: "/en/akvaria", languages: { sk: "/akvaria", en: "/en/akvaria" } },
};

export default function AkvariaPageEn() {
  return <AkvariaObsah t={EN} jazyk="en" />;
}
