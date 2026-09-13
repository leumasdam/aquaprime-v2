import Image from "next/image";
import Link from "next/link";
import RealizacieShowcase from "./RealizacieShowcase";
import styles from "./realizacie.module.css";
import { odkaz, type Jazyk } from "../jazyk";
import type { Slovnik } from "../preklady";

export default function RealizacieObsah({ t, jazyk }: { t: Slovnik; jazyk: Jazyk }) {
  const r = t.realizacie;
  const l = (h: string) => odkaz(h, jazyk);
  return (
    <main id="main" className={styles.page}>
      <RealizacieShowcase t={r} jazyk={jazyk} />
      <section className={styles.workshop} aria-labelledby="workshop-title">
        <div>
          <p className={styles.kicker}>{r.dielnaKicker}</p>
          <h2 id="workshop-title">
            {r.dielnaTitul1}
            <br />
            {r.dielnaTitul2}
          </h2>
          <p>{r.dielnaText}</p>
        </div>
        <div className={styles.videos}>
          <figure>
            <video controls playsInline preload="none" poster="/realizacie/poster-vyroba.webp" aria-label={r.videoMontaz}>
              <source src="/video/realizacie-vyroba.mp4" type="video/mp4" />
            </video>
            <figcaption>{r.videoMontazPopis}</figcaption>
          </figure>
          <figure>
            <video controls playsInline preload="none" poster="/realizacie/poster-dvor.webp" aria-label={r.videoDvor}>
              <source src="/video/realizacie-dvor.mp4" type="video/mp4" />
            </video>
            <figcaption>{r.videoDvorPopis}</figcaption>
          </figure>
        </div>
      </section>
      {/* záverečná výzva: kompaktný pás, kameň s machom cez celé pozadie, text vľavo */}
      <section className={styles.cta}>
        <div className={styles.ctaBg} aria-hidden>
          <Image src="/realizacie/hero-skala.webp" alt="" fill sizes="100vw" />
        </div>
        <div className={styles.ctaInner}>
          <div className={styles.ctaCopy}>
            <p className={styles.kicker}>{r.ctaKicker}</p>
            <h2>
              {r.ctaTitul1}
              <br />
              {r.ctaTitul2}
            </h2>
            <p>{r.ctaText}</p>
            <div className={styles.ctaActions}>
              <Link href={l("/dopyt")} className={styles.primary}>
                {r.ctaTlacidlo} <span aria-hidden>↗</span>
              </Link>
              <Link href={l("/skrinky")} className={styles.textLink}>
                {r.ctaSkrinky}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
