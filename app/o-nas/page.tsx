import type { Metadata } from "next";
import ONasObsah from "./Obsah";
import { SK } from "../preklady";

export const metadata: Metadata = {
  title: SK.onas.metaTitul,
  description: SK.onas.metaPopis,
  alternates: { canonical: "/o-nas", languages: { sk: "/o-nas", en: "/en/o-nas" } },
};

export default function Page() {
  return <ONasObsah t={SK} jazyk="sk" />;
}
