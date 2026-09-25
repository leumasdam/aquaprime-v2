import type { Metadata } from "next";
import SetyObsah from "../../sety/Obsah";
import { EN } from "../../preklady";

export const metadata: Metadata = {
  title: EN.sety.metaTitul,
  description: EN.sety.metaPopis,
  alternates: { canonical: "/en/sety", languages: { sk: "/sety", en: "/en/sety" } },
};

export default function SetyPage() {
  return <SetyObsah t={EN} jazyk="en" />;
}
