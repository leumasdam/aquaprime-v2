import type { Metadata } from "next";
import KonfiguratorObsah from "../../konfigurator/Obsah";
import { EN } from "../../preklady";

export const metadata: Metadata = {
  title: EN.konfigurator.metaTitul,
  description: EN.konfigurator.metaPopis,
  alternates: {
    canonical: "/en/konfigurator",
    languages: { sk: "/konfigurator", en: "/en/konfigurator" },
  },
};

export default function Page() {
  return <KonfiguratorObsah t={EN} jazyk="en" />;
}
