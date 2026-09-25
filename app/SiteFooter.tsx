"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "./nav";
import { Logo, LogoPlny } from "./brand";
import { odkaz, jazykZCesty } from "./jazyk";
import { SLOVNIKY } from "./preklady";

/* Pätička 1:1 podľa Figmy „Completed / Footer" (node 187:576):
   rad buniek s orámovaním, oddeľovač, logo + navigácia,
   dole copyright a „Vyrobené na Slovensku".
   Položky buniek: tri konkrétne (audit 11. 9. 2026) — doprava po SR, záruka
   a odber noviniek sa vrátia až po potvrdení prevádzkovateľom. */

export default function SiteFooter() {
  const jazyk = jazykZCesty(usePathname());
  const t = SLOVNIKY[jazyk].footer;
  const nav = SLOVNIKY[jazyk].nav;
  const l = (href: string) => odkaz(href, jazyk);

  return (
    <footer className="footer">
      <div className="wrap footer__in">
        <div className="footer__cells">
          {t.bunky.map(([titul, popis]) => (
            <div className="footer-cell" key={titul}>
              <span className="footer-cell__title">{titul}</span>
              <span className="footer-cell__sub">{popis}</span>
            </div>
          ))}
        </div>

        <div className="footer__mid">
          <Link href={l("/")} className="footer__logo" aria-label={t.domov}>
            {/* plný podpis má minimum 400 px — pod ním manuál káže
                jednoduchší variant, preto sú v DOM obidva a CSS prepína */}
            <LogoPlny className="logo--siroke" />
            <Logo className="logo--uzke" />
          </Link>
          <nav className="footer__nav" aria-label={t.patickaAria}>
            {/* Domov je v pätičke prvý odkaz — logo vedľa vedie tam isto, ale
                v zozname odkazov to nie je zrejmé. */}
            <Link href={l("/")}>{nav.domov}</Link>
            {NAV.map((n) => (
              <Link key={n.kluc} href={l(n.href)}>
                {nav[n.kluc]}
              </Link>
            ))}
            {/* blog v hornej lište nahradili Sety — v pätičke ostáva dostupný */}
            <Link href={l("/blog")}>{nav.blog}</Link>
          </nav>
        </div>

        <div className="footer__bottom">
          <div className="footer__legal">
            <span>{t.copyright}</span>
            <Link href={l("/obchodne-podmienky")}>{t.podmienky}</Link>
            <Link href={l("/reklamacny-poriadok")}>{t.reklamacie}</Link>
            <Link href={l("/ochrana-osobnych-udajov")}>{t.ochrana}</Link>
          </div>
          <span className="footer__made">{t.vyrobene}</span>
        </div>
      </div>
    </footer>
  );
}
