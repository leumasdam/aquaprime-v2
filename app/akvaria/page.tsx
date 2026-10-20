import type { Metadata } from "next";
import AkvariaObsah from "./Obsah";
import { SK } from "../preklady";
import { nacitajAkvaria } from "../katalog/akvaria";

export const metadata: Metadata = {
  title: SK.akvaria.metaTitul,
  description: SK.akvaria.metaPopis,
  alternates: { canonical: "/akvaria", languages: { sk: "/akvaria", en: "/en/akvaria" } },
};

export default async function AkvariaPage() {
  return <AkvariaObsah t={SK} jazyk="sk" akvaria={await nacitajAkvaria()} />;
}
