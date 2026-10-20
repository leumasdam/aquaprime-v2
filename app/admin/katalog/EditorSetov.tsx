"use client";

import type { Set } from "../../sety";
import EditorPoloziek from "./EditorPoloziek";
import FormularSetu from "./FormularSetu";

const KATEGORIA: Record<Set["kategoria"], string> = {
  akvariove: "akváriový",
  krevetariove: "krevetáriový",
  terariove: "terárijný",
};

export default function EditorSetov() {
  return (
    <EditorPoloziek<Set>
      kolekcia="sety"
      nazov="Sety"
      popis="Hotové dvojice skrinka + akvárium: texty, parametre, prevedenia s fotkami a cena. Zmena sa na webe prejaví do pár sekúnd od uloženia."
      jednotne={["set", "sety", "setov"]}
      id={(s) => s.id}
      meno={(s) => s.nazov}
      hladatText={(s) => `${s.nazov} ${s.id} ${s.kategoria} ${s.skrinka} ${s.akvarium}`}
      kopia={(s, obsadene) => {
        let id = `${s.id}-kopia`;
        for (let k = 2; obsadene.includes(id); k++) id = `${s.id}-kopia-${k}`;
        return { ...structuredClone(s), id, nazov: `${s.nazov} (kópia)`, skryta: true };
      }}
      riadok={(s) => ({
        foto: s.prevedenia.find((p) => !p.chyba && p.images.length)?.images[0] ?? "",
        titul: s.nazov,
        podtitul: `${KATEGORIA[s.kategoria]} · ${s.objem} l · ${s.prevedenia.length} ${s.prevedenia.length === 1 ? "prevedenie" : s.prevedenia.length < 5 ? "prevedenia" : "prevedení"}`,
        vpravo: s.cena === null ? <span className="ad-muted">na dopyt</span> : `${s.cena.toLocaleString("sk-SK")} €`,
      })}
      Formular={FormularSetu}
    />
  );
}
