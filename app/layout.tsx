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
import SkipLink from "./SkipLink";
import Analytika from "./Analytika";
import Cookies from "./Cookies";
import Intro from "./Intro";
import Mikro from "./Mikro";
import PauzaPriPrechode from "./PauzaPriPrechode";

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
    default: "Skrinky pod akváriá na mieru | AQUAPRIME",
    template: "%s",
  },
  description:
    "Skrinky pod akváriá s oceľovým rámom a nastaviteľnými nožičkami. Vyberte si vyhotovenie, rozmer a dekor alebo pošlite zadanie na mieru.",
  keywords: [
    "akvarijné skrinky",
    "skrinky pod akvárium",
    "akvárium na mieru",
    "oceľový rám",
    "AQUAPRIME",
  ],
  openGraph: {
    title: "Skrinky pod akváriá na mieru | AQUAPRIME",
    description:
      "Skrinky pod akváriá s oceľovým rámom a nastaviteľnými nožičkami. Vyberte si vyhotovenie, rozmer a dekor alebo pošlite zadanie na mieru.",
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
      /* na /en prepíše jazyk dokumentu skript z app/en/layout.tsx ešte pred
         vykreslením — React by inak hlásil nesúlad atribútu pri hydratácii */
      suppressHydrationWarning
      className={`${tinos.variable} ${inter.variable}`}
      /* pri prechode medzi stránkami skočiť na vrch okamžite — plynulý scroll
         by sa bil so swipe animáciou (hlási to aj Next warningom) */
      data-scroll-behavior="smooth"
    >
      <head>
        {/* Vizuálny editor breakpointov (public/tools/editor.html) generuje
            public/css/overrides.css — to je jediný zdroj hero layoutov pre
            jednotlivé breakpointy, žiadny ručný prepis. Vo vývoji ho pripája
            overrides.js (spolu s textovými úpravami z overrides.json),
            v produkcii sa CSS linkuje priamo, aby web ukazoval presne to,
            čo editor. */}
        {process.env.NODE_ENV === "development" ? (
          <script src="/tools/overrides.js" async={false} />
        ) : (
          <link rel="stylesheet" href="/css/overrides.css" />
        )}
        {/* Safari si pred prechodom odfotí celú starú stránku a pri úvodnej
            stránke mu to trvá aj niekoľko sekúnd — obraz zamrzne a prechod
            aj tak nevidno. Podstrčíme mu preto prechod, ktorý len prepne
            obsah. Musí to byť tu v hlavičke, nech to platí od prvej
            navigácie a stránky ostanú staticky generované. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var u=navigator.userAgent;if(!/Safari/i.test(u)||/Chrome|Chromium|Edg|OPR|Android/i.test(u))return;document.documentElement.classList.add("safari");if(!document.startViewTransition)return;window.__aqBezPrechodov=true;document.startViewTransition=function(a){var r;try{r=typeof a==="function"?a():a&&a.update&&a.update()}catch(e){r=Promise.reject(e)}var p=Promise.resolve(r);var t=p.then(function(){},function(){});return{ready:t,finished:t,updateCallbackDone:p,types:new Set(),skipTransition:function(){}}}})();`,
          }}
        />
      </head>
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
        <SkipLink />
        <KosikProvider>
          <ScrollProgress />
          <SiteNav />
          {children}
          <SiteFooter />
        </KosikProvider>
        <BackToTop />
        <ScrollFx />
        <Analytika />
        <PauzaPriPrechode />
        <Mikro />
        <Cookies />
        <Intro />
        {process.env.NODE_ENV === "development" && <DevViewport />}
      </body>
    </html>
  );
}
