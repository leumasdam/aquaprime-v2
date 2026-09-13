import type { Metadata } from "next";
import RealizacieObsah from "../../realizacie/Obsah";
import { EN } from "../../preklady";

export const metadata: Metadata = {
  title: EN.realizacie.metaTitul,
  description: EN.realizacie.metaPopis,
  alternates: {
    canonical: "/en/realizacie",
    languages: { sk: "/realizacie", en: "/en/realizacie" },
  },
};

export default function Page() {
  return <RealizacieObsah t={EN} jazyk="en" />;
}
