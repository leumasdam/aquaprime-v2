import Link from "next/link";
import { Logo } from "./brand";
import { NAV } from "./nav";
import Newsletter from "./Newsletter";

const BENEFITS: [string, string][] = [
  ["PRÉMIOVÉ SKRINKY", "Navrhnuté na mieru"],
  ["TECHNICKÁ PODPORA", "Odborné poradenstvo"],
  ["DOPRAVA PO SR", "Bezpečné doručenie"],
  ["ZÁRUKA KVALITY", "Overené časom"],
];

export default function SiteFooter() {
  return (
    <footer className="footer section">
      <div className="wrap footer__benefits">
        {BENEFITS.map(([t, s]) => (
          <div className="footer-benefit" key={t}>
            <span className="footer-benefit__mark" />
            <span className="footer-benefit__title">{t}</span>
            <span className="footer-benefit__sub">{s}</span>
          </div>
        ))}
        <div className="footer__news">
          <div className="footer-benefit__title">KONZULTÁCIA / NOVINKY</div>
          <p className="footer__news-sub">
            Získajte inšpiráciu, novinky a špeciálne ponuky.
          </p>
          <Newsletter />
        </div>
      </div>

      <div className="wrap footer__mid">
        <div className="footer__logo">
          <Logo className="logo--footer" />
        </div>
        <nav className="footer__nav">
          {NAV.map((n) => (
            <Link key={n.label} href={n.href}>
              {n.label}
            </Link>
          ))}
        </nav>
        <span className="footer__social">SLEDUJTE NÁS &nbsp; f &nbsp; ◎</span>
      </div>

      <div className="wrap footer__bottom">
        <span>© 2026 AQUAPRIME. VŠETKY PRÁVA VYHRADENÉ.</span>
        <span>— VYROBENÉ NA SLOVENSKU</span>
      </div>
    </footer>
  );
}
