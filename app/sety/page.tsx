import type { Metadata } from "next";
import SetyObsah from "./Obsah";
import { SK } from "../preklady";

export const metadata: Metadata = {
  title: SK.sety.metaTitul,
  description: SK.sety.metaPopis,
  alternates: { canonical: "/sety", languages: { sk: "/sety", en: "/en/sety" } },
  openGraph: {
    title: SK.sety.metaTitul,
    description: SK.sety.metaPopis,
    type: "website",
    locale: "sk_SK",
    images: [{ url: "/img/sety/scape-60.webp", width: 1122, height: 1402 }],
  },
};

export default function SetyPage() {
  return <SetyObsah t={SK} jazyk="sk" />;
}
