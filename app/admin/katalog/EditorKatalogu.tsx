"use client";

import { useCallback, useEffect, useState } from "react";
import type { Product } from "../../products";
import FormularSkrinky from "./FormularSkrinky";
import HistoriaVerzii from "./HistoriaVerzii";
import KniznicaDekorov from "./KniznicaDekorov";
import ZoznamSkriniek from "./ZoznamSkriniek";
import { nacitaj, posli, type StavKatalogu } from "./api";
import "./katalog.css";

type Pohlad =
  | { typ: "zoznam" }
  | { typ: "skrinka"; slug: string | null; predloha?: Product }
  | { typ: "dekory" }
  | { typ: "historia" };

/**
 * Editor katalógu skriniek v administrácii. Drží načítaný katalóg
 * a prepína medzi zoznamom, formulárom skrinky, dekormi a históriou.
 */
export default function EditorKatalogu() {
  const [stav, setStav] = useState<StavKatalogu | null>(null);
  const [chyba, setChyba] = useState("");
  const [pohlad, setPohlad] = useState<Pohlad>({ typ: "zoznam" });
  const [sprava, setSprava] = useState("");
  // formulár sa po uložení nanovo pripojí s čerstvou verziou skrinky
  const [verzia, setVerzia] = useState(0);

  const obnov = useCallback(() => {
    setChyba("");
    nacitaj()
      .then(setStav)
      .catch((e) =>
        setChyba(
          e instanceof Error && e.message === "odhlaseny"
            ? "Prihlásenie vypršalo. Obnovte stránku a prihláste sa znova."
            : "Katalóg sa nepodarilo načítať.",
        ),
      );
  }, []);
  useEffect(obnov, [obnov]);

  useEffect(() => {
    if (!sprava) return;
    const t = window.setTimeout(() => setSprava(""), 6000);
    return () => window.clearTimeout(t);
  }, [sprava]);

  const chod = (p: Pohlad) => {
    setPohlad(p);
    window.scrollTo({ top: 0 });
  };

  const poUlozeni = (novy: StavKatalogu, text: string, slug?: string | null) => {
    setStav(novy);
    setSprava(text);
    setVerzia((v) => v + 1);
    // uložená skrinka ostáva otvorená (ďalšie úpravy idú už ako úprava, nie nová),
    // zmazaná a ostatné pohľady sa vracajú na zoznam
    if (slug) chod({ typ: "skrinka", slug });
    else chod({ typ: "zoznam" });
  };

  if (chyba)
    return (
      <section className="ad-section">
        <div className="ad-banner is-warn">
          {chyba}{" "}
          <button type="button" className="kt-odkaz" onClick={obnov}>
            Skúsiť znova
          </button>
        </div>
      </section>
    );
  if (!stav) return <p className="ad-muted">Načítavam katalóg…</p>;

  const { katalog } = stav;

  return (
    <>
      {!stav.uloziskoPripravene && (
        <div className="ad-banner is-warn">
          Úložisko nie je nastavené, zmeny sa nedajú uložiť. Chýba premenná BLOB_READ_WRITE_TOKEN.
        </div>
      )}

      {pohlad.typ === "zoznam" && (
        <ZoznamSkriniek
          katalog={katalog}
          ulozene={stav.ulozene}
          onOtvor={(slug) => chod({ typ: "skrinka", slug })}
          onNova={() => chod({ typ: "skrinka", slug: null })}
          onKopia={(slug) => {
            const zdroj = katalog.find((p) => p.slug === slug);
            if (!zdroj) return;
            let novy = `${slug}-kopia`;
            for (let k = 2; katalog.some((p) => p.slug === novy); k++) novy = `${slug}-kopia-${k}`;
            chod({ typ: "skrinka", slug: null, predloha: { ...structuredClone(zdroj), slug: novy, skryta: true } });
          }}
          onPoradie={async (slugy) => {
            const r = await posli({ akcia: "poradie", slugy });
            if (!r.ok) {
              setSprava(r.chyba);
              return false;
            }
            poUlozeni(r, "Poradie je uložené.", null);
            return true;
          }}
          onDekory={() => chod({ typ: "dekory" })}
          onHistoria={() => chod({ typ: "historia" })}
        />
      )}

      {pohlad.typ === "skrinka" && (
        <FormularSkrinky
          key={`${pohlad.slug ?? "nova"}-${verzia}`}
          povodna={pohlad.slug ? (katalog.find((p) => p.slug === pohlad.slug) ?? null) : null}
          predloha={pohlad.predloha}
          katalog={katalog}
          onUlozene={(s, text, slug) => poUlozeni(s, text, slug)}
          onSpat={() => chod({ typ: "zoznam" })}
        />
      )}

      {pohlad.typ === "dekory" && (
        <KniznicaDekorov katalog={katalog} onUlozene={(s, text) => poUlozeni(s, text, null)} onSpat={() => chod({ typ: "zoznam" })} />
      )}

      {pohlad.typ === "historia" && (
        <HistoriaVerzii onUlozene={(s, text) => poUlozeni(s, text, null)} onSpat={() => chod({ typ: "zoznam" })} />
      )}

      {sprava && (
        <div className="kt-toast" role="status">
          {sprava}
          <button type="button" onClick={() => setSprava("")} aria-label="Zavrieť">
            ×
          </button>
        </div>
      )}
    </>
  );
}
