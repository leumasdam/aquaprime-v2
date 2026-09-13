import type { Metadata } from "next";
import KontaktObsah from "../../kontakt/Obsah";
import { EN } from "../../preklady";

export const metadata: Metadata = {
  title: EN.kontakt.metaTitul,
  description: EN.kontakt.metaPopis,
  alternates: { canonical: "/en/kontakt", languages: { sk: "/kontakt", en: "/en/kontakt" } },
};

export default function Page() {
  return <KontaktObsah t={EN} jazyk="en" />;
}
