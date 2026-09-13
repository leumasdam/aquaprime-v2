import type { Metadata } from "next";
import RealizacieObsah from "./Obsah";
import { SK } from "../preklady";

export const metadata: Metadata = {
  title: SK.realizacie.metaTitul,
  description: SK.realizacie.metaPopis,
  alternates: {
    canonical: "/realizacie",
    languages: { sk: "/realizacie", en: "/en/realizacie" },
  },
};

export default function Page() {
  return <RealizacieObsah t={SK} jazyk="sk" />;
}
