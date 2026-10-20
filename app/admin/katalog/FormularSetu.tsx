"use client";

import { useCallback, useState } from "react";
import { KATEGORIE, type KategoriaSetu, type Prevedenie, type Set } from "../../sety";
import type { Chyba } from "../../katalog/kontrola";
import { chybySetu, normalizujSet } from "../../katalog/polozky";
import Swatch from "../../Swatch";
import Fotky from "./Fotky";
import Vzorka from "./Vzorka";
import { naSlug } from "./FormularSkrinky";
import { ChybaServera, ListaUlozenia, Pole, usePolozka } from "./FormularSpolocne";
import type { StavPoloziek } from "./api";

const KATEGORIA_NAZOV: Record<KategoriaSetu, string> = {
  akvariove: "Akváriové",
  krevetariove: "Krevetáriové",
  terariove: "Terárijové",
};

/** Najčastejšie prevedenia — klient si ich pridá jedným klikom. */
const PREVEDENIA_VZOR: Pick<Prevedenie, "id" | "nazov" | "swatch">[] = [
  { id: "black-matt", nazov: "Black Matt", swatch: ["#17181a"] },
  { id: "cool-white", nazov: "Cool White", swatch: ["#eef0f0"] },
  { id: "antracit", nazov: "Antracit", swatch: ["#40454a"] },
];

export function novySet(): Set {
  return normalizujSet({
    id: "",
    kategoria: "krevetariove",
    nazov: "",
    podtitul: { sk: "", en: "" },
    popis: { sk: [], en: [] },
    preKoho: { sk: [], en: [] },
    skrinka: "",
    akvarium: "",
    sklo: { sk: "Klasické sklo", en: "Classic glass" },
    objem: 0,
    prevedenia: [],
    cena: null,
    novinka: true,
    skryta: true,
  });
}

/** odseky ↔ textarea (odsek = prázdny riadok medzi), body ↔ riadky */
const odsekyText = (z: string[]) => z.join("\n\n");
const textOdseky = (t: string) => t.split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean);
const riadkyText = (z: string[]) => z.join("\n");
const textRiadky = (t: string) => t.split("\n").map((x) => x.trim()).filter(Boolean);

export default function FormularSetu({
  povodna,
  predloha,
  zoznam,
  onUlozene,
  onSpat,
}: {
  povodna: Set | null;
  predloha?: Set;
  zoznam: Set[];
  onUlozene: (stav: StavPoloziek<Set>, sprava: string, id: string | null) => void;
  onSpat: () => void;
}) {
  const [slugAuto, setSlugAuto] = useState(() => !povodna);
  const [jazyk, setJazyk] = useState<"sk" | "en">("sk");
  const [otvorene, setOtvorene] = useState<string | null>(null);
  const chyby = useCallback(
    (s: Set): Chyba[] => {
      const obsadena = zoznam.some((x) => x.id === s.id && x.id !== povodna?.id);
      return [...chybySetu(s), ...(obsadena ? [{ slug: s.id, pole: "id", sprava: "Túto adresu už má iný set." }] : [])];
    },
    [zoznam, povodna],
  );
  const f = usePolozka<Set>({
    kolekcia: "sety",
    povodna,
    predloha,
    nova: novySet,
    id: (s) => s.id,
    normalizuj: normalizujSet,
    chyby,
    onUlozene,
  });
  const { draft, zmen, uklada } = f;

  const zmenNazov = (nazov: string) => zmen((d) => ({ ...d, nazov, id: slugAuto ? naSlug(nazov) : d.id }));
  const zmenText = (pole: "podtitul" | "sklo", hodnota: string) => zmen((d) => ({ ...d, [pole]: { ...d[pole], [jazyk]: hodnota } }));
  const zmenZoznam = (pole: "popis" | "preKoho", hodnota: string[]) => zmen((d) => ({ ...d, [pole]: { ...d[pole], [jazyk]: hodnota } }));
  const zmenPrevedenie = (i: number, p: Prevedenie) => zmen((d) => ({ ...d, prevedenia: d.prevedenia.map((x, k) => (k === i ? p : x)) }));
  const presun = (i: number, smer: -1 | 1) =>
    zmen((d) => {
      const j = i + smer;
      if (j < 0 || j >= d.prevedenia.length) return d;
      const n = [...d.prevedenia];
      [n[i], n[j]] = [n[j], n[i]];
      return { ...d, prevedenia: n };
    });
  const pridajPrevedenie = (vzor: Pick<Prevedenie, "id" | "nazov" | "swatch">) => {
    let id = vzor.id;
    for (let k = 2; draft.prevedenia.some((p) => p.id === id); k++) id = `${vzor.id}-${k}`;
    zmen((d) => ({ ...d, prevedenia: [...d.prevedenia, { id, nazov: vzor.nazov, swatch: [...vzor.swatch], fotky: [] }] }));
    setOtvorene(id);
  };
  const [noveMeno, setNoveMeno] = useState("");
  const chybyPrevedenia = (i: number) => f.chyby.filter((c) => c.pole === `prevedenia.${i}`);

  const spat = () => {
    if (f.neulozene && !window.confirm("Máte neuložené zmeny. Naozaj odísť bez uloženia?")) return;
    onSpat();
  };
  const naWebe = Boolean(povodna && !povodna.skryta);

  return (
    <section className="ad-section kt-form">
      <button type="button" className="kt-spat" onClick={spat} disabled={uklada}>
        ← Všetky sety
      </button>
      <header className="ad-head">
        <h1>{povodna ? povodna.nazov : predloha ? "Kópia setu" : "Nový set"}</h1>
        <p>
          {povodna
            ? naWebe
              ? "Set je zverejnený. Po uložení sa zmena na webe prejaví do pár sekúnd."
              : "Set je rozpracovaný a na webe sa zatiaľ neukazuje."
            : "Nový set sa uloží ako rozpracovaný. Zverejnite ho, keď bude mať popis a aspoň jedno prevedenie s fotkou."}
        </p>
      </header>

      <ChybaServera chyba={f.serverChyba} />

      <h2 className="ad-h2">Názov a kategória</h2>
      <div className="kt-karta">
        <div className="kt-rady" role="radiogroup" aria-label="Kategória">
          {KATEGORIE.map((k) => (
            <button key={k} type="button" role="radio" aria-checked={draft.kategoria === k} className={`kt-rad${draft.kategoria === k ? " is-on" : ""}`} onClick={() => zmen({ kategoria: k })}>
              <b>{KATEGORIA_NAZOV[k]}</b>
            </button>
          ))}
        </div>
        <div className="kt-riadok">
          <Pole nazov="Názov setu" chyby={f.chybyPola("nazov")}>
            <input className="kt-vstup" value={draft.nazov} placeholder="napr. Scape 60" onChange={(e) => zmenNazov(e.target.value)} />
          </Pole>
          <Pole
            nazov={
              <>
                Adresa na webe{slugAuto && <small className="kt-auto">dopĺňa sa z názvu</small>}
              </>
            }
            chyby={f.chybyPola("id")}
          >
            <span className="kt-adresa">
              <i>aquaprime.sk/sety/</i>
              <input
                className="kt-vstup"
                value={draft.id}
                onChange={(e) => {
                  setSlugAuto(false);
                  zmen({ id: e.target.value.toLowerCase() });
                }}
              />
            </span>
          </Pole>
        </div>
        <label className="kt-prepinac">
          <input type="checkbox" checked={Boolean(draft.novinka)} onChange={(e) => zmen({ novinka: e.target.checked })} />
          <span>Označiť ako novinku</span>
        </label>
      </div>

      <h2 className="ad-h2">Parametre a cena</h2>
      <div className="kt-karta">
        <div className="kt-riadok kt-riadok--3">
          <Pole nazov="Skrinka (D × Š × V)" chyby={f.chybyPola("skrinka")}>
            <input className="kt-vstup" value={draft.skrinka} placeholder="60 × 35 × 75 cm" onChange={(e) => zmen({ skrinka: e.target.value })} />
          </Pole>
          <Pole nazov="Akvárium (D × Š × V)" chyby={f.chybyPola("akvarium")}>
            <input className="kt-vstup" value={draft.akvarium} placeholder="60 × 35 × 35 cm" onChange={(e) => zmen({ akvarium: e.target.value })} />
          </Pole>
          <Pole nazov="Objem" chyby={f.chybyPola("objem")}>
            <span className="kt-jednotka">
              <input className="kt-vstup" type="number" inputMode="numeric" min={1} value={draft.objem || ""} onChange={(e) => zmen({ objem: Number(e.target.value) })} />
              <i>l</i>
            </span>
          </Pole>
        </div>
        <div className="kt-riadok">
          <Pole nazov="Cena setu" pozn={draft.cena === null ? "Bez ceny sa set ponúka na dopyt." : "Cena sa ukáže v katalógu aj na detaile."}>
            <span className="kt-jednotka">
              <input
                className="kt-vstup"
                type="number"
                inputMode="decimal"
                min={0}
                step="1"
                placeholder="na dopyt"
                value={draft.cena ?? ""}
                onChange={(e) => zmen({ cena: e.target.value ? Number(e.target.value) : null })}
              />
              <i>€</i>
            </span>
          </Pole>
        </div>
      </div>

      <h2 className="ad-h2">
        Texty
        <span className="kt-filtre kt-filtre--vpravo" role="tablist" aria-label="Jazyk textov">
          <button type="button" className={jazyk === "sk" ? "is-on" : ""} aria-pressed={jazyk === "sk"} onClick={() => setJazyk("sk")}>
            Slovensky
          </button>
          <button type="button" className={jazyk === "en" ? "is-on" : ""} aria-pressed={jazyk === "en"} onClick={() => setJazyk("en")}>
            English
          </button>
        </span>
      </h2>
      <div className="kt-karta">
        {jazyk === "en" && <p className="kt-pozn">Anglické znenie je voliteľné — kde chýba, /en ukáže slovenský text.</p>}
        <Pole nazov="Podtitul" chyby={jazyk === "sk" ? f.chybyPola("podtitul") : []}>
          <input className="kt-vstup" value={draft.podtitul[jazyk]} placeholder={jazyk === "sk" ? "Kompaktný set pre chov kreviet" : "A compact set for keeping shrimp"} onChange={(e) => zmenText("podtitul", e.target.value)} />
        </Pole>
        <Pole nazov="Popis" chyby={jazyk === "sk" ? f.chybyPola("popis") : []} pozn="Odseky oddeľte prázdnym riadkom.">
          <textarea className="kt-vstup" rows={5} value={odsekyText(draft.popis[jazyk])} onChange={(e) => zmenZoznam("popis", textOdseky(e.target.value))} />
        </Pole>
        <Pole nazov="Pre koho je set" pozn="Každý bod na samostatný riadok.">
          <textarea className="kt-vstup" rows={4} value={riadkyText(draft.preKoho[jazyk])} onChange={(e) => zmenZoznam("preKoho", textRiadky(e.target.value))} />
        </Pole>
        <Pole nazov="Sklo" uzke>
          <input className="kt-vstup" value={draft.sklo[jazyk]} onChange={(e) => zmenText("sklo", e.target.value)} />
        </Pole>
      </div>

      <h2 className="ad-h2">Prevedenia a fotky</h2>
      <p className="kt-podnadpis">Každé prevedenie (farba skrinky) má vlastnú sadu fotiek. Prvé prevedenie dáva setu titulnú fotku v katalógu.</p>
      <div className="kt-dekory">
        {draft.prevedenia.map((p, i) => {
          const otv = otvorene === p.id || chybyPrevedenia(i).length > 0;
          return (
            <article key={p.id} className={`kt-dekor${chybyPrevedenia(i).length ? " is-chyba" : ""}`}>
              <header className="kt-dekor__hlava">
                <span className="kt-dekor__cislo">{i + 1}</span>
                <span className="kt-dekor__vzorka">
                  <Swatch swatch={p.swatch} />
                </span>
                <div className="kt-dekor__meno">
                  {otv ? (
                    <input className="kt-vstup kt-vstup--nazov" value={p.nazov} placeholder="Názov prevedenia" aria-label="Názov prevedenia" onChange={(e) => zmenPrevedenie(i, { ...p, nazov: e.target.value })} />
                  ) : (
                    <b className="kt-dekor__nazov">{p.nazov || "Bez názvu"}</b>
                  )}
                  <span className="ad-mono ad-muted">ID: {p.id}</span>
                </div>
                {!otv && p.fotky.length > 0 && (
                  <span className="kt-dekor__nahlady" aria-hidden>
                    {p.fotky.slice(0, 5).map((src, k) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={`${src}-${k}`} src={src} alt="" loading="lazy" />
                    ))}
                    {p.fotky.length > 5 && <i>+{p.fotky.length - 5}</i>}
                  </span>
                )}
                <span className={`ad-tag ${p.fotky.length ? "is-a" : "is-off"}`}>{p.fotky.length ? `${p.fotky.length} fotiek` : "Bez fotky"}</span>
                <div className="kt-dekor__ovladace">
                  <button type="button" onClick={() => presun(i, -1)} disabled={i === 0} aria-label="Posunúť vyššie">
                    ↑
                  </button>
                  <button type="button" onClick={() => presun(i, 1)} disabled={i === draft.prevedenia.length - 1} aria-label="Posunúť nižšie">
                    ↓
                  </button>
                  <button
                    type="button"
                    className="kt-dekor__zmaz"
                    onClick={() => {
                      if (p.fotky.length && !window.confirm(`Odobrať prevedenie „${p.nazov}" aj s ${p.fotky.length} fotkami?`)) return;
                      zmen((d) => ({ ...d, prevedenia: d.prevedenia.filter((_, k) => k !== i) }));
                    }}
                  >
                    Odobrať
                  </button>
                  <button type="button" className="kt-dekor__rozbal" aria-expanded={otv} onClick={() => setOtvorene(otv ? null : p.id)}>
                    {otv ? "Zbaliť" : "Upraviť"}
                  </button>
                </div>
              </header>
              {otv && (
                <div className="kt-dekor__telo">
                  <Vzorka id={p.id} hodnota={p.swatch} onZmena={(swatch) => zmenPrevedenie(i, { ...p, swatch })} />
                  <Fotky fotky={p.fotky} onZmena={(fotky) => zmenPrevedenie(i, { ...p, fotky })} titulna={i === 0} popis={`${draft.nazov} ${p.nazov}, fotka`} />
                  {chybyPrevedenia(i).map((c, k) => (
                    <em key={k} className="ad-err">
                      {c.sprava}
                    </em>
                  ))}
                </div>
              )}
            </article>
          );
        })}
        {f.chybyPola("prevedenia").map((c, k) => (
          <em key={k} className="ad-err">
            {c.sprava}
          </em>
        ))}
        <div className="kt-prev-pridat">
          {PREVEDENIA_VZOR.filter((v) => !draft.prevedenia.some((p) => p.id === v.id)).map((v) => (
            <button key={v.id} type="button" className="kt-prev-pridat__vzor" onClick={() => pridajPrevedenie(v)}>
              <Swatch swatch={v.swatch} />
              {v.nazov}
            </button>
          ))}
          <div className="kt-prev-pridat__vlastne">
            <input
              className="kt-vstup"
              value={noveMeno}
              placeholder="Vlastné prevedenie, napr. Dub"
              onChange={(e) => setNoveMeno(e.target.value)}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                e.preventDefault();
                if (noveMeno.trim()) pridajPrevedenie({ id: naSlug(noveMeno) || "prevedenie", nazov: noveMeno.trim(), swatch: ["#17181a"] });
                setNoveMeno("");
              }}
            />
            <button
              type="button"
              className="kt-pridat"
              disabled={!noveMeno.trim()}
              onClick={() => {
                pridajPrevedenie({ id: naSlug(noveMeno) || "prevedenie", nazov: noveMeno.trim(), swatch: ["#17181a"] });
                setNoveMeno("");
              }}
            >
              + Pridať prevedenie
            </button>
          </div>
        </div>
      </div>

      <ListaUlozenia
        skryta={Boolean(draft.skryta)}
        jeNova={!povodna}
        naWebe={naWebe}
        odkaz={`/sety/${povodna?.id ?? ""}`}
        uklada={uklada}
        zmenene={f.zmenene}
        neulozene={f.neulozene}
        chyby={f.chyby.length}
        chybyKonceptu={f.chybyKonceptu.length}
        onUloz={f.uloz}
        onZmaz={() => f.zmaz(`set ${povodna?.nazov ?? ""}`)}
      />
    </section>
  );
}
