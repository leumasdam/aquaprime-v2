import type { Metadata } from "next";
import DoplnkyObsah from "../../doplnky-technika/Obsah";
import { EN } from "../../preklady";

export const metadata: Metadata = {
  title: EN.doplnky.metaTitul,
  description: EN.doplnky.metaPopis,
  alternates: {
    canonical: "/en/doplnky-technika",
    languages: { sk: "/doplnky-technika", en: "/en/doplnky-technika" },
  },
};

export default function Page() {
  return <DoplnkyObsah t={EN} jazyk="en" />;
}
