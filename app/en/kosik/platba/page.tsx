import type { Metadata } from "next";
import PlatbaObsah from "../../../kosik/platba/Obsah";
import { EN } from "../../../preklady";

export const metadata: Metadata = {
  title: EN.platba.metaTitul,
  robots: { index: false, follow: false },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ stav?: string; cislo?: string }>;
}) {
  const { stav, cislo } = await searchParams;
  return <PlatbaObsah t={EN} jazyk="en" stav={stav} cislo={cislo} />;
}
