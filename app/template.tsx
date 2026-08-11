import { VT } from "./vt";

/**
 * Prechody medzi stránkami. Smer nesie klik (transitionTypes na linkoch):
 *  nav-dopredu — obsah odíde doľava, nový priletí sprava (napr. Skrinky → Akváriá)
 *  nav-dozadu  — zrkadlovo naspäť
 *  bez typu    — jemný cross-fade (karty, pätička, priamy vstup)
 * Header je ukotvený menom site-header a stojí, hýbe sa len obsah.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <VT
      enter={{ "nav-dopredu": "vt-dopredu", "nav-dozadu": "vt-dozadu", default: "vt-fade" }}
      exit={{ "nav-dopredu": "vt-dopredu", "nav-dozadu": "vt-dozadu", default: "vt-fade" }}
      default="none"
    >
      <div id="main" tabIndex={-1}>
        {children}
      </div>
    </VT>
  );
}
