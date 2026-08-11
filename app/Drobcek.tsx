import Link from "next/link";

/**
 * Drobček. Cesta domov, ktorá nikam nevyskakuje a je stále na mieste —
 * úvod totiž nemá vlastnú položku v navigácii.
 */
export default function Drobcek({
  cesta,
}: {
  /** medzikroky bez domova; posledný je aktuálna stránka */
  cesta: { nazov: string; href?: string }[];
}) {
  return (
    <nav className="drobcek" aria-label="Drobčeková navigácia">
      <Link href="/" className="drobcek__domov" transitionTypes={["nav-dozadu"]}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <path d="M4 11 12 4.5 20 11" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6.5 9.6V19h11V9.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Domov
      </Link>
      {cesta.map((k) => (
        <span key={k.nazov} className="drobcek__krok">
          <span aria-hidden>/</span>
          {k.href ? (
            <Link href={k.href} transitionTypes={["nav-dozadu"]}>
              {k.nazov}
            </Link>
          ) : (
            <em>{k.nazov}</em>
          )}
        </span>
      ))}
    </nav>
  );
}
