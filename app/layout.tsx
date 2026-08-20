import type { Metadata } from "next";
import { Tinos, Inter } from "next/font/google";
import { SKRYTY_PRED_VYHLADAVACMI } from "./site-config";
import { KosikProvider } from "./kosik-store";
import "./globals.css";
import ScrollFx from "./ScrollFx";
import DevViewport from "./DevViewport";
import ScrollProgress from "./ScrollProgress";
import BackToTop from "./BackToTop";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";
import Analytika from "./Analytika";

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
  // kým sa web dolaďuje, nesmie skončiť vo vyhľadávaní ani v náhľadoch
  ...(SKRYTY_PRED_VYHLADAVACMI && {
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: { index: false, follow: false, noimageindex: true },
    },
  }),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="sk"
      className={`${tinos.variable} ${inter.variable}`}
      /* pri prechode medzi stránkami skočiť na vrch okamžite — plynulý scroll
         by sa bil so swipe animáciou (hlási to aj Next warningom) */
      data-scroll-behavior="smooth"
    >
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
        <script
          // burger musí fungovať hneď — na mobile prichádza klik často skôr,
          // než sa stihne hydratovať React. Tento mini-handler ho obslúži
          // do nábehu (SiteNav ho potom vypne a stav si preberie).
          dangerouslySetInnerHTML={{
            __html: `try{var n=performance.getEntriesByType("navigation")[0];if(n&&n.type==="reload"){history.scrollRestoration="manual";window.scrollTo(0,0)}}catch(x){}
document.addEventListener("click",function(e){if(window.__aqNavZije)return;var b=e.target.closest&&e.target.closest(".nav__burger");if(!b)return;e.preventDefault();e.stopPropagation();var m=document.querySelector(".nav__mobile");if(m){var o=!m.classList.contains("is-open");m.classList.toggle("is-open",o);b.classList.toggle("is-open",o);m.style.opacity=o?"1":"0";m.style.transform=o?"none":"translateY(-10px)";m.style.pointerEvents=o?"auto":"none";document.body.style.overflow=o?"hidden":""}},true);`,
          }}
        />
        <a href="#main" className="skip-link">
          Preskočiť na obsah
        </a>
        <KosikProvider>
          <ScrollProgress />
          <SiteNav />
          {children}
          <SiteFooter />
        </KosikProvider>
        <BackToTop />
        <ScrollFx />
        <Analytika />
        {process.env.NODE_ENV === "development" && <DevViewport />}
      </body>
    </html>
  );
}
