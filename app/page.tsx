import type { Metadata } from "next";
import DomovObsah from "./DomovObsah";
import { SK } from "./preklady";

export const metadata: Metadata = {
  title: SK.meta.domovTitul,
  description: SK.meta.domovPopis,
  alternates: { canonical: "/", languages: { sk: "/", en: "/en" } },
};

export default function Home() {
  return <DomovObsah t={SK} jazyk="sk" />;
}
