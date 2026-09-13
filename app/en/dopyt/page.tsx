import type { Metadata } from "next";
import DopytObsah from "../../dopyt/Obsah";
import { EN } from "../../preklady";

export const metadata: Metadata = {
  title: EN.dopyt.metaTitul,
  description: EN.dopyt.metaPopis,
  alternates: { canonical: "/en/dopyt", languages: { sk: "/dopyt", en: "/en/dopyt" } },
};

export default function Page() {
  return <DopytObsah t={EN} jazyk="en" />;
}
