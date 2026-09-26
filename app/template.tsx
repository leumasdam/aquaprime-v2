import { headers } from "next/headers";
import { VT } from "./vt";

/**
 * Prechody medzi stránkami. Smer nesie klik (transitionTypes na linkoch):
 *  nav-dopredu — obsah odíde doľava, nový priletí sprava (napr. Skrinky → Akváriá)
 *  nav-dozadu  — zrkadlovo naspäť
 *  bez typu    — jemný cross-fade (karty, pätička, priamy vstup)
 * Header je ukotvený menom site-header a stojí, hýbe sa len obsah.
 *
 * Na Safari prechody nebežia. Prehliadač si pred nimi odfotí celú starú
 * stránku a pri úvodnej stránke mu to trvá aj niekoľko sekúnd — obraz
 * zamrzne a prechod aj tak nevidno. Bez neho sa stránka prepne okamžite.
 * Rozhoduje sa na serveri podľa hlavičky prehliadača, aby sa stránka po
 * načítaní nepreskladala.
 */
function jeSafari(ua: string) {
  return /Safari/i.test(ua) && !/Chrome|Chromium|Edg|OPR|Android/i.test(ua);
}

export default async function Template({ children }: { children: React.ReactNode }) {
  const ua = (await headers()).get("user-agent") ?? "";
  const obsah = (
    <div id="main" tabIndex={-1}>
      {children}
    </div>
  );

  if (jeSafari(ua)) return obsah;

  return (
    <VT
      enter={{ "nav-dopredu": "vt-dopredu", "nav-dozadu": "vt-dozadu", default: "vt-fade" }}
      exit={{ "nav-dopredu": "vt-dopredu", "nav-dozadu": "vt-dozadu", default: "vt-fade" }}
      default="none"
    >
      {obsah}
    </VT>
  );
}
