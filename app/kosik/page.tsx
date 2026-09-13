import type { Metadata } from "next";
import KosikStranka from "./Obsah";
import { SK } from "../preklady";

export const metadata: Metadata = {
  title: SK.kosik.metaTitul,
  description: SK.kosik.metaPopis,
  robots: { index: false, follow: false },
};

export default function Page() {
  return <KosikStranka t={SK} jazyk="sk" />;
}
