import type { Metadata } from "next";
import MaterialyObsah from "../../materialy/Obsah";
import { EN } from "../../preklady";

export const metadata: Metadata = {
  title: EN.materialy.metaTitul,
  description: EN.materialy.metaPopis,
  alternates: {
    canonical: "/en/materialy",
    languages: { sk: "/materialy", en: "/en/materialy" },
  },
};

export default function Page() {
  return <MaterialyObsah t={EN} jazyk="en" />;
}
