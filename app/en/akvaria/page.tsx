import type { Metadata } from "next";
import AkvariaObsah from "../../akvaria/Obsah";
import { EN } from "../../preklady";
import { nacitajAkvaria } from "../../katalog/galerie-server";

export const metadata: Metadata = {
  title: EN.akvaria.metaTitul,
  description: EN.akvaria.metaPopis,
  alternates: { canonical: "/en/akvaria", languages: { sk: "/akvaria", en: "/en/akvaria" } },
};

export default async function AkvariaPageEn() {
  return <AkvariaObsah t={EN} jazyk="en" akvaria={await nacitajAkvaria()} />;
}
