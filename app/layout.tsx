import type { Metadata } from "next";
import { Tinos, Inter } from "next/font/google";
import "./globals.css";
import ScrollFx from "./ScrollFx";
import ScrollProgress from "./ScrollProgress";
import BackToTop from "./BackToTop";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";

const tinos = Tinos({
  variable: "--f-display",
  weight: ["400", "700"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const inter = Inter({
  variable: "--f-ui",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aquaprime.sk"),
  title: {
    default: "AQUAPRIME — Luxusné akváriá. Dokonalé v každom detaile.",
    template: "%s · AQUAPRIME",
  },
  description:
    "AQUAPRIME prináša technickú dokonalosť, prémiové materiály a minimalistický dizajn. Akvarijné skrinky na mieru s oceľovým rámom — nosnosť až 770 kg.",
  keywords: [
    "akvarijné skrinky",
    "skrinky pod akvárium",
    "akvárium na mieru",
    "oceľový rám",
    "AQUAPRIME",
  ],
  openGraph: {
    title: "AQUAPRIME — Luxusné akváriá. Dokonalé v každom detaile.",
    description:
      "Akvarijné skrinky na mieru s oceľovým rámom. Prémiové materiály, technická dokonalosť, nadčasový dizajn.",
    type: "website",
    locale: "sk_SK",
    siteName: "AQUAPRIME",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sk" className={`${tinos.variable} ${inter.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "AQUAPRIME",
              url: "https://aquaprime.sk",
              description:
                "Akvarijné skrinky na mieru s oceľovým rámom. Prémiové materiály a nadčasový dizajn.",
              logo: "https://aquaprime.sk/icon.svg",
              areaServed: "SK",
              slogan: "Elevate Nature",
            }),
          }}
        />
        <a href="#main" className="skip-link">
          Preskočiť na obsah
        </a>
        <ScrollProgress />
        <SiteNav />
        {children}
        <SiteFooter />
        <BackToTop />
        <ScrollFx />
      </body>
    </html>
  );
}
