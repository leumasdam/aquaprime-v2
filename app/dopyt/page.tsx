import type { Metadata } from "next";
import DopytObsah from "./Obsah";
import { SK } from "../preklady";

export const metadata: Metadata = {
  title: SK.dopyt.metaTitul,
  description: SK.dopyt.metaPopis,
  alternates: { canonical: "/dopyt", languages: { sk: "/dopyt", en: "/en/dopyt" } },
};

export default function Page() {
  return <DopytObsah t={SK} jazyk="sk" />;
}
