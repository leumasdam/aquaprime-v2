import type { Metadata } from "next";
import MaterialyObsah from "./Obsah";
import { SK } from "../preklady";

export const metadata: Metadata = {
  title: SK.materialy.metaTitul,
  description: SK.materialy.metaPopis,
  alternates: {
    canonical: "/materialy",
    languages: { sk: "/materialy", en: "/en/materialy" },
  },
};

export default function Page() {
  return <MaterialyObsah t={SK} jazyk="sk" />;
}
