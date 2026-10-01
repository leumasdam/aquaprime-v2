"use client";

import { useState } from "react";
import { NOZICKY_PRIPLATOK, UDALOST_NOZICKY } from "../nozicky";
import { SLOVNIKY } from "../preklady";
import type { Jazyk } from "../jazyk";

/**
 * Voľba nastaviteľných nožičiek na detaile skrinky. Vzhľadom je to ten istý
 * prepínač ako podsvietenie v galérii. Zmenu oznamuje udalosťou, ktorú
 * počúva tlačidlo do košíka (SkrinkaDoKosika) — rovnako ako výber dekoru.
 */
export default function VolbaNoziciek({ jazyk = "sk" }: { jazyk?: Jazyk }) {
  const t = SLOVNIKY[jazyk].produkt;
  const [s, setS] = useState(false);

  const vyber = (zapnut: boolean) => {
    setS(zapnut);
    window.dispatchEvent(new CustomEvent(UDALOST_NOZICKY, { detail: zapnut }));
  };

  return (
    <div className="pgal__led pdetail__nozicky" role="radiogroup" aria-label={t.nozickyVolba}>
      <span className="pgal__led-label">{t.nozickyVolba}</span>
      <div className="pgal__led-vyber">
        {[
          { zap: false, label: t.nozickyBez },
          { zap: true, label: t.nozickyS },
        ].map((v) => (
          <button
            key={String(v.zap)}
            type="button"
            role="radio"
            aria-checked={s === v.zap}
            className={`pgal__ledbtn${s === v.zap ? " is-on" : ""}`}
            onClick={() => vyber(v.zap)}
          >
            {v.label}
          </button>
        ))}
      </div>
      {s && (
        <p className="pdetail__nozicky-pozn">
          {NOZICKY_PRIPLATOK === null
            ? t.nozickyNaDopyt
            : `${t.nozickyPriplatok}: +${NOZICKY_PRIPLATOK.toLocaleString(jazyk === "en" ? "en-GB" : "sk-SK")} €`}
        </p>
      )}
    </div>
  );
}
