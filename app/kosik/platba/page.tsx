import type { Metadata } from "next";
import PlatbaObsah from "./Obsah";
import { SK } from "../../preklady";

export const metadata: Metadata = {
  title: SK.platba.metaTitul,
  robots: { index: false, follow: false },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ stav?: string; cislo?: string }>;
}) {
  const { stav, cislo } = await searchParams;
  return <PlatbaObsah t={SK} jazyk="sk" stav={stav} cislo={cislo} />;
}
