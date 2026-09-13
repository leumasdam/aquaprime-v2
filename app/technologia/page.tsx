import type { Metadata } from "next";
import KonstrukciaObsah from "./Obsah";
import { SK } from "../preklady";

export const metadata: Metadata = {
  title: SK.konstrukcia.metaTitul,
  description: SK.konstrukcia.metaPopis,
  alternates: {
    canonical: "/technologia",
    languages: { sk: "/technologia", en: "/en/technologia" },
  },
};

export default function Page() {
  return <KonstrukciaObsah t={SK} jazyk="sk" />;
}
