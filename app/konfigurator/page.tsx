import type { Metadata } from "next";
import KonfiguratorObsah from "./Obsah";
import { SK } from "../preklady";

export const metadata: Metadata = {
  title: SK.konfigurator.metaTitul,
  description: SK.konfigurator.metaPopis,
  alternates: {
    canonical: "/konfigurator",
    languages: { sk: "/konfigurator", en: "/en/konfigurator" },
  },
};

export default function Page() {
  return <KonfiguratorObsah t={SK} jazyk="sk" />;
}
