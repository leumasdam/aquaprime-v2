"use client";

import type { Aquarium } from "../../aquariums";
import { navrhSlugAkvaria } from "../../katalog/polozky";
import EditorPoloziek from "./EditorPoloziek";
import FormularAkvaria from "./FormularAkvaria";

export default function EditorAkvarii() {
  return (
    <EditorPoloziek<Aquarium>
      kolekcia="akvaria"
      nazov="Akváriá"
      popis="Rozmery, hrúbky skla, ceny a fotky nádrží. Zmena sa na webe prejaví do pár sekúnd od uloženia."
      jednotne={["akvárium", "akváriá", "akvárií"]}
      id={(a) => a.slug}
      meno={(a) => a.name}
      hladatText={(a) => `${a.w}x${a.d}x${a.h} ${a.dim} ${a.slug} ${a.liters}`}
      kopia={(a, obsadene) => {
        let slug = `${navrhSlugAkvaria(a.w, a.d, a.h)}-kopia`;
        for (let k = 2; obsadene.includes(slug); k++) slug = `${navrhSlugAkvaria(a.w, a.d, a.h)}-kopia-${k}`;
        return { ...structuredClone(a), slug, skryta: true };
      }}
      riadok={(a) => ({
        foto: a.cover,
        titul: a.dim,
        podtitul: `${a.vol} · sklo ${a.glass.map((g) => `${g.mm} mm`).join(" / ") || "—"}${a.fotky?.length ? ` · ${a.fotky.length} vlastných fotiek` : a.coverIllustrative ? " · ilustračná fotka" : ""}`,
        vpravo: a.priceValue ? a.priceLabel : <span className="ad-muted">na dopyt</span>,
      })}
      Formular={FormularAkvaria}
    />
  );
}
