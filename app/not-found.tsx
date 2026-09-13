import type { Metadata } from "next";
import NenajdeneObsah from "./NenajdeneObsah";
import { SK } from "./preklady";

export const metadata: Metadata = { title: SK.nenajdene.metaTitul };

export default function NotFound() {
  return <NenajdeneObsah t={SK} jazyk="sk" />;
}
