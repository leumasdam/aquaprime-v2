"use client";

import Link from "next/link";
import { useKosik } from "./kosik-store";

/** Ikona košíka v navigácii s počtom kusov. */
export default function KosikTlacidlo() {
  const { pocet, pripravene } = useKosik();

  return (
    <Link
      href="/kosik"
      transitionTypes={["nav-dopredu"]}
      className={`nav__kosik${pocet > 0 ? " has-items" : ""}`}
      aria-label={pocet > 0 ? `Košík — ${pocet} položiek` : "Košík"}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
        <path d="M4 5.5h2.2l2 10h9.4l2-7.3H7" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9.5" cy="19" r="1.3" />
        <circle cx="17" cy="19" r="1.3" />
      </svg>
      {/* počet až po načítaní z localStorage, inak by sa server a klient rozišli */}
      {pripravene && pocet > 0 && <span className="nav__kosik-pocet">{pocet}</span>}
    </Link>
  );
}
