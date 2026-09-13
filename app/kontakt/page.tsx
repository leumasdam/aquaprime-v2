import type { Metadata } from "next";
import KontaktObsah from "./Obsah";
import { SK } from "../preklady";

export const metadata: Metadata = {
  title: SK.kontakt.metaTitul,
  description: SK.kontakt.metaPopis,
  alternates: { canonical: "/kontakt", languages: { sk: "/kontakt", en: "/en/kontakt" } },
};

export default function Page() {
  return <KontaktObsah t={SK} jazyk="sk" />;
}
