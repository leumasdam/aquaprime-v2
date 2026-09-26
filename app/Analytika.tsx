"use client";

// Merací kód pre GA4 / Google Tag Manager. Nasadí sa len keď je vo Verceli
// nastavené NEXT_PUBLIC_GTM_ID alebo NEXT_PUBLIC_GA4_ID a zároveň keď
// návštevník povolil analytické cookies — dovtedy web nenačíta žiadny
// cudzí skript.

import Script from "next/script";
import { useEffect, useState } from "react";
import { precitaj, UDALOST } from "./suhlas";

export default function Analytika() {
  const gtm = process.env.NEXT_PUBLIC_GTM_ID;
  const ga4 = process.env.NEXT_PUBLIC_GA4_ID;
  const [smie, setSmie] = useState(false);

  useEffect(() => {
    const zisti = () => setSmie(Boolean(precitaj()?.analyticke));
    zisti();
    window.addEventListener(UDALOST, zisti);
    return () => window.removeEventListener(UDALOST, zisti);
  }, []);

  if ((!gtm && !ga4) || !smie) return null;

  return (
    <>
      {/* Tag Manager — cez neho sa dá pridať čokoľvek ďalšie bez zásahu do kódu */}
      {gtm && (
        <>
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtm}');`}
          </Script>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtm}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        </>
      )}
      {/* GA4 priamo — beží aj vedľa Tag Managera, keď v ňom meranie nie je */}
      {ga4 && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4}');`}
          </Script>
        </>
      )}
    </>
  );
}
