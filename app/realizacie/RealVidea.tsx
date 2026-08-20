"use client";

/**
 * Dve samostatné sekcie z prevádzky, každá s vlastným zvislým videom
 * (9:16 — natočené na telefón, orezávať do širokouhlého rámu nemá zmysel).
 * Montáž má zvuk a púšťa sa na klik; dvor beží ako tichá slučka.
 */

import { useEffect, useRef, useState } from "react";

function Slucka() {
  const ref = useRef<HTMLVideoElement>(null);

  /* rozbehne sa až na obrazovke — nech nežerie dáta na mobile */
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([z]) => (z.isIntersecting ? v.play().catch(() => null) : v.pause()),
      { threshold: 0.35 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className="rvid__video"
      poster="/realizacie/poster-dvor.webp"
      preload="metadata"
      muted
      loop
      playsInline
    >
      <source src="/video/realizacie-dvor.mp4" type="video/mp4" />
    </video>
  );
}

function Reklama() {
  const ref = useRef<HTMLVideoElement>(null);
  const [hra, setHra] = useState(false);

  const prepni = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play().then(() => setHra(true)).catch(() => null);
    else {
      v.pause();
      setHra(false);
    }
  };

  return (
    <div className={`rvid__ramik${hra ? " is-playing" : ""}`}>
      <video
        ref={ref}
        className="rvid__video"
        poster="/realizacie/poster-vyroba.webp"
        preload="none"
        playsInline
        onEnded={() => setHra(false)}
        onClick={prepni}
      >
        <source src="/video/realizacie-vyroba.mp4" type="video/mp4" />
      </video>
      <button
        type="button"
        className="rvid__play"
        aria-label={hra ? "Pozastaviť video" : "Prehrať video so zvukom"}
        onClick={prepni}
      >
        <span aria-hidden>{hra ? "❚❚" : "▶"}</span>
      </button>
      <span className="rvid__zvuk" aria-hidden>
        so zvukom
      </span>
    </div>
  );
}

export default function RealVidea() {
  return (
    <>
      <section className="rvid section">
        <div className="wrap rvid__grid">
          <div className="rvid__media" data-reveal="scale">
            <Reklama />
          </div>
          <div className="rvid__copy" data-reveal>
            <h2 className="rvid__title">Montáž u zákazníka</h2>
            <p className="rvid__lead">
              Záber z reálnej montáže — od oceľového rámu cez vrchnú dosku až
              po osadenú nádrž s podsvietením. Skrinka prichádza hotová,
              na mieste ju len usadíme a vyrovnáme.
            </p>
          </div>
        </div>
      </section>

      <section className="rvid rvid--flip section">
        <div className="wrap rvid__grid">
          <div className="rvid__media" data-reveal="scale">
            <div className="rvid__ramik">
              <Slucka />
            </div>
          </div>
          <div className="rvid__copy" data-reveal>
            <h2 className="rvid__title">Pripravené na odoslanie</h2>
            <p className="rvid__lead">
              Séria hotových skriniek na dvore tesne pred expedíciou. Každý kus
              prejde kontrolou zvarov, rovinnosti a povrchu skôr, než sa naloží.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
