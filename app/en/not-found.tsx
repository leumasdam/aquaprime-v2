import type { Metadata } from "next";
import NenajdeneObsah from "../NenajdeneObsah";
import { EN } from "../preklady";

export const metadata: Metadata = { title: EN.nenajdene.metaTitul };

export default function NotFound() {
  return <NenajdeneObsah t={EN} jazyk="en" />;
}
