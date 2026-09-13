import type { Metadata } from "next";
import ONasObsah from "../../o-nas/Obsah";
import { EN } from "../../preklady";

export const metadata: Metadata = {
  title: EN.onas.metaTitul,
  description: EN.onas.metaPopis,
  alternates: { canonical: "/en/o-nas", languages: { sk: "/o-nas", en: "/en/o-nas" } },
};

export default function Page() {
  return <ONasObsah t={EN} jazyk="en" />;
}
