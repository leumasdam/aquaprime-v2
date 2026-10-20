import Link from "next/link";
import { odkaz, type Jazyk } from "./jazyk";
import { SLOVNIKY } from "./preklady";

/**
 * Zamknutý konfigurátor: obsah pod ním ostáva zašedený a neklikateľný,
 * navrchu stojí oznam „pripravujeme“ s odkazom na dopyt. Riadi ho
 * KONFIGURATOR_ZAMKNUTY v site-config.ts.
 */
export default function KonfiguratorZamok({ jazyk, children }: { jazyk: Jazyk; children: React.ReactNode }) {
  const k = SLOVNIKY[jazyk].konfigurator;
  return (
    <div className="kzamok">
      <div className="kzamok__obsah" inert aria-hidden>
        {children}
      </div>
      <div className="kzamok__panel" role="status">
        <div className="kzamok__karta">
        <span className="kzamok__ikona" aria-hidden>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
            <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" strokeLinecap="round" />
            <circle cx="12" cy="15.5" r="1.2" fill="currentColor" stroke="none" />
          </svg>
        </span>
        <strong className="kzamok__titul">{k.zamokTitul}</strong>
        <p className="kzamok__text">{k.zamokText}</p>
        <div className="kzamok__akcie">
          <Link href={odkaz("/dopyt", jazyk)} className="btn-cyan">
            {k.zamokCta}
          </Link>
          <Link href={odkaz("/skrinky", jazyk)} className="kzamok__alt">
            {k.zamokAlt} <span aria-hidden>→</span>
          </Link>
        </div>
        </div>
      </div>
    </div>
  );
}
