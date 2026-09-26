"use client";

import Link from "next/link";
import { useState } from "react";
import { FilterLista, Segmented } from "../Filtre";
import { odkaz, type Jazyk } from "../jazyk";
import type { Slovnik } from "../preklady";
import { KATEGORIE, SETY, type KategoriaSetu } from "../sety";
import SetCard from "./SetCard";

/**
 * Katalóg setov: prepínač kategórií v rovnakej lište ako katalóg skriniek
 * a mriežka kariet. Kategórie, ktoré ešte nemajú žiadny set, majú namiesto
 * počtu štítok „čoskoro“ — dajú sa zvoliť, ale namiesto kariet ukážu
 * pozvánku na dopyt.
 */
export default function SetyKatalog({ t, jazyk }: { t: Slovnik["sety"]; jazyk: Jazyk }) {
  const prva = KATEGORIE.find((k) => SETY.some((s) => s.kategoria === k)) ?? KATEGORIE[0];
  const [kategoria, setKategoria] = useState<KategoriaSetu>(prva);
  const sety = SETY.filter((s) => s.kategoria === kategoria);

  return (
    <>
      <FilterLista ariaLabel={t.filtreAria}>
        <Segmented
          ariaLabel={t.filtreAria}
          value={kategoria}
          onChange={setKategoria}
          volby={KATEGORIE.map((k) => {
            const pocet = SETY.filter((s) => s.kategoria === k).length;
            return { id: k, label: t.kategorie[k], ...(pocet ? { count: pocet } : {}) };
          })}
        />
        <span className="fbar__count" aria-live="polite">
          <b>{sety.length}</b> {sety.length === 1 ? t.setJeden : t.setViac}
        </span>
      </FilterLista>

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
