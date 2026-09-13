import type { Metadata } from "next";
import DoplnkyObsah from "./Obsah";
import { SK } from "../preklady";

export const metadata: Metadata = {
  title: SK.doplnky.metaTitul,
  description: SK.doplnky.metaPopis,
  alternates: {
    canonical: "/doplnky-technika",
    languages: { sk: "/doplnky-technika", en: "/en/doplnky-technika" },
  },
};

export default function Page() {
  return <DoplnkyObsah t={SK} jazyk="sk" />;
}
