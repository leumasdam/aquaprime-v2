import type { Metadata } from "next";
import AkvariaObsah from "./Obsah";
import { SK } from "../preklady";

export const metadata: Metadata = {
  title: SK.akvaria.metaTitul,
  description: SK.akvaria.metaPopis,
  alternates: { canonical: "/akvaria", languages: { sk: "/akvaria", en: "/en/akvaria" } },
};

export default function AkvariaPage() {
  return <AkvariaObsah t={SK} jazyk="sk" />;
}
