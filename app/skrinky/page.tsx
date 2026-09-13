import type { Metadata } from "next";
import SkrinkyObsah from "./Obsah";
import { SK } from "../preklady";

export const metadata: Metadata = {
  title: SK.katalog.metaTitul,
  description: SK.katalog.metaPopis,
  alternates: { canonical: "/skrinky", languages: { sk: "/skrinky", en: "/en/skrinky" } },
};

export default function SkrinkyPage() {
  return <SkrinkyObsah t={SK} jazyk="sk" />;
}
