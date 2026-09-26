"use client";

import Link from "next/link";
import { useState } from "react";
import { odkaz, type Jazyk } from "../jazyk";
import type { Slovnik } from "../preklady";
import { KATEGORIE, SETY, type KategoriaSetu } from "../sety";
import SetCard from "./SetCard";

/**
 * Katalóg setov: prepínač kategórií a mriežka kariet. Kategórie, ktoré ešte
 * nemajú žiadny set, sú v prepínači zošednuté so štítkom „čoskoro“ — dajú
 * sa zvoliť, ale namiesto kariet ukážu odkaz na dopyt.
 */
export default function SetyKatalog({ t, jazyk }: { t: Slovnik["sety"]; jazyk: Jazyk }) {
  const prva = KATEGORIE.find((k) => SETY.some((s) => s.kategoria === k))?? KATEGORIE[0];
  const [kategoria, setKategoria] = useState<KategoriaSetu>(prva);
  const sety = SETY.filter((s) => s.kategoria === kategoria);

  return (
    <>
      <div className="sety-filtre" role="group" aria-label={t.filtreAria}>
        {KATEGORIE.map((k) => {
          const pocet = SETY.filter((s) => s.kategoria === k).length;
          return (
            <button
              key={k}
              type="button"
              className={`sety-filtre__volba${kategoria === k ? " is-on" : ""}${
                pocet === 0 ? " sety-filtre__volba--chystame" : ""
              }`}
              aria-pressed={kategoria === k}
              onClick={() => setKategoria(k)}
            >
              {t.kategorie[k]}
              {pocet === 0 ? (
                <small className="sety-filtre__coskoro">{t.coskoro}</small>
              ) : (
                <small className="sety-filtre__pocet">{pocet}</small>
              )}
            </button>
          );
        })}
      </div>

      {sety.length > 0 ? (
        <div className="product-grid" key={kategoria}>
          {sety.map((s, i) => (
            <SetCard key={s.id} set={s} t={t} jazyk={jazyk} delay={(i % 3) * 70} />
          ))}
        </div>
      ) : (
        <div className="sety-chystame" key={kategoria}>
          <span className="sety-chystame__stitok">{t.coskoro}</span>
          <p>{t.chystame.replace("{kategoria}", t.kategorie[kategoria].toLowerCase())}</p>
          <Link href={odkaz("/dopyt", jazyk)} className="btn-outline">
            {t.chystameOdkaz}
          </Link>
        </div>
      )}
    </>
  );
}
