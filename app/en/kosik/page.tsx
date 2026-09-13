import type { Metadata } from "next";
import KosikStranka from "../../kosik/Obsah";
import { EN } from "../../preklady";

export const metadata: Metadata = {
  title: EN.kosik.metaTitul,
  description: EN.kosik.metaPopis,
  robots: { index: false, follow: false },
};

export default function Page() {
  return <KosikStranka t={EN} jazyk="en" />;
}
