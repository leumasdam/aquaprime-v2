"use client";

import { useRef, useState } from "react";
import Swatch from "../../Swatch";
import { cabinetSurfaces } from "../../cabinet-construction";
import { nahrajFotku } from "./api";

/**
 * Vzorka dekoru — to malé koliesko, ktorým zákazník na webe prepína farby.
 * Jedna časť je buď farba (lak), alebo textúra z fotky (drevo). Kombinovaný
 * dekor, napríklad „Black Matt / Orech", má dve časti a koliesko je
 * rozdelené uhlopriečne — prvá časť sú dvierka, druhá korpus.
 */
export default function Vzorka({
  id,
  hodnota,
  onZmena,
}: {
  /** identifikátor dekoru — pri pár starších dekoroch je poradie častí opačné */
  id: string;
  hodnota: string[];
  onZmena: (v: string[]) => void;
}) {
  const casti = hodnota.length ? hodnota : ["#17181a"];
  /* ktorá časť sú dvierka, rozhoduje to isté pravidlo, podľa ktorého kreslí
     náhľad skrinky — popis v editore tak vždy sedí s tým, čo zákazník uvidí */
  const korpusPrvy = cabinetSurfaces({ id, swatch: ["a", "b"] }).body === "a";
  const popisCasti = (i: number) => ((i === 0) !== korpusPrvy ? "Dvierka" : "Korpus");
  const [nahrava, setNahrava] = useState<number | null>(null);
  const [chyba, setChyba] = useState("");
  const vstup = useRef<HTMLInputElement>(null);
  const cielova = useRef(0);

  const nastav = (i: number, v: string) => onZmena(casti.map((x, k) => (k === i ? v : x)));

  const textura = async (subor: File) => {
    const i = cielova.current;
    setNahrava(i);
    setChyba("");
    try {
      nastav(i, await nahrajFotku(subor));
    } catch (e) {
      setChyba(e instanceof Error ? e.message : "Textúru sa nepodarilo nahrať.");
    } finally {
      setNahrava(null);
    }
  };

  return (
    <div className="kt-vzorka">
      <span className="kt-vzorka__nahlad">
        <Swatch swatch={casti} />
      </span>
      <div className="kt-vzorka__casti">
        {casti.map((v, i) => {
          const jeFarba = v.startsWith("#");
          return (
            <div key={i} className="kt-vzorka__cast">
              <span className="kt-vzorka__popis">
                {casti.length === 2 ? popisCasti(i) : "Vzorka"}
              </span>
              {jeFarba ? (
                <label className="kt-vzorka__farba">
                  <input type="color" value={v.length === 7 ? v : "#17181a"} onChange={(e) => nastav(i, e.target.value)} />
                  <span className="ad-mono">{v}</span>
                </label>
              ) : (
                <span className="kt-vzorka__textura">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={v} alt="" />
                  Textúra z fotky
                </span>
              )}
              <div className="kt-vzorka__prepni">
                {!jeFarba && (
                  <button type="button" onClick={() => nastav(i, "#17181a")}>
                    Farba
                  </button>
                )}
                <button
                  type="button"
                  disabled={nahrava !== null}
                  onClick={() => {
                    cielova.current = i;
                    vstup.current?.click();
                  }}
                >
                  {nahrava === i ? "Nahrávam…" : jeFarba ? "Textúra" : "Iná textúra"}
                </button>
                {casti.length === 2 && (
                  <button type="button" onClick={() => onZmena(casti.filter((_, k) => k !== i))}>
                    Odobrať
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {casti.length === 1 && (
          <button type="button" className="kt-odkaz" onClick={() => onZmena([...casti, "#8b5a35"])}>
            + Kombinovaný dekor (iné dvierka a korpus)
          </button>
        )}
        {chyba && <p className="ad-err">{chyba}</p>}
      </div>
      <input
        ref={vstup}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void textura(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}
