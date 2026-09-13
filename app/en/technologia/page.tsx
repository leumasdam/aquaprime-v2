import type { Metadata } from "next";
import KonstrukciaObsah from "../../technologia/Obsah";
import { EN } from "../../preklady";

export const metadata: Metadata = {
  title: EN.konstrukcia.metaTitul,
  description: EN.konstrukcia.metaPopis,
  alternates: {
    canonical: "/en/technologia",
    languages: { sk: "/technologia", en: "/en/technologia" },
  },
};

export default function Page() {
  return <KonstrukciaObsah t={EN} jazyk="en" />;
}
