"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { KATEGORIE, type KategoriaSetu, type Prevedenie, type Set } from "../../sety";
import type { Decor } from "../../products";
import type { Chyba } from "../../katalog/kontrola";
import { chybySetu, normalizujSet } from "../../katalog/polozky";
import Swatch from "../../Swatch";
import DekorKarta from "./DekorKarta";
import { naSlug } from "./FormularSkrinky";
import { ChybaServera, ListaUlozenia, Pole, usePolozka } from "./FormularSpolocne";
import { nacitaj, type StavPoloziek } from "./api";

const KATEGORIA_NAZOV: Record<KategoriaSetu, string> = {
  akvariove: "Akváriové",
  krevetariove: "Krevetáriové",
  terariove: "Terárijové",
};

type DekorVzor = Pick<Decor, "id" | "name" | "swatch">;

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
  const [pridavanie, setPridavanie] = useState(false);
  const [noveDekory, setNoveDekory] = useState<globalThis.Set<string>>(() => new globalThis.Set());
  const [noveMeno, setNoveMeno] = useState("");
  /* knižnica dekorov = všetky dekory z katalógu skriniek — set používa tie isté */
  const [kniznica, setKniznica] = useState<DekorVzor[] | null>(null);
  useEffect(() => {
    nacitaj()
      .then((st) => {
        const m = new Map<string, DekorVzor>();
        for (const p of st.katalog) for (const d of p.decors) if (!m.has(d.id)) m.set(d.id, { id: d.id, name: d.name, swatch: d.swatch });
        setKniznica([...m.values()].sort((a, b) => a.name.localeCompare(b.name, "sk")));
      })
      .catch(() => setKniznica([]));
  }, []);
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
  const volneDekory = useMemo(() => (kniznica ?? []).filter((d) => !draft.prevedenia.some((x) => x.id === d.id)), [kniznica, draft.prevedenia]);
  const presun = (i: number, smer: -1 | 1) =>
    zmen((d) => {
      const j = i + smer;
      if (j < 0 || j >= d.prevedenia.length) return d;
      const n = [...d.prevedenia];
      [n[i], n[j]] = [n[j], n[i]];
      return { ...d, prevedenia: n };
    });
  const pridajDekor = (vzor: DekorVzor) => {
    setNoveDekory((n) => new globalThis.Set(n).add(vzor.id));
    zmen((d) => ({ ...d, prevedenia: [...d.prevedenia, { id: vzor.id, name: vzor.name, swatch: [...vzor.swatch], images: [] }] }));
    setPridavanie(false);
  };
  const vytvorDekor = () => {
    const meno = noveMeno.trim();
    if (!meno) return;
    let id = naSlug(meno) || "dekor";
    const obsadene = new globalThis.Set([...(kniznica ?? []).map((d) => d.id), ...draft.prevedenia.map((d) => d.id)]);
    for (let k = 2; obsadene.has(id); k++) id = `${naSlug(meno)}-${k}`;
    pridajDekor({ id, name: meno, swatch: ["#17181a"] });
    setNoveMeno("");
  };
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
          <Pole nazov="Cena s LED podsvietením" pozn="Platí pre LED verziu setu — tá vznikne, keď dekor dostane LED fotky. Nechajte prázdne, ak set LED nemá.">
            <span className="kt-jednotka">
              <input
                className="kt-vstup"
                type="number"
                inputMode="decimal"
                min={0}
                step="1"
                placeholder="bez LED"
                value={draft.cenaLed ?? ""}
                onChange={(e) => zmen({ cenaLed: e.target.value ? Number(e.target.value) : null })}
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

      <h2 className="ad-h2">Dekory a fotky</h2>
      <p className="kt-podnadpis">
        Rovnaké dekory ako pri skrinkách. Prvý dekor dáva setu titulnú fotku v katalógu; LED fotky k dekoru pridajú LED
        dlaždicu do katalógu a prepínač podsvietenia na detaile — presne ako pri skrinke.
      </p>
      {f.chybyPola("prevedenia").map((c, k) => (
        <p key={k} className="ad-err">
          {c.sprava}
        </p>
      ))}
      <div className="kt-dekory">
        {draft.prevedenia.map((d, i) => (
          <DekorKarta
            key={d.id}
            dekor={d}
            poradie={i}
            pocet={draft.prevedenia.length}
            chyby={chybyPrevedenia(i)}
            otvorena={noveDekory.has(d.id) || (!povodna && !predloha)}
            onZmena={(nd) => zmenPrevedenie(i, nd)}
            onPresun={(smer) => presun(i, smer)}
            onOdstran={() => {
              if (d.images.length && !window.confirm(`Odobrať dekor „${d.name}" aj s ${d.images.length} fotkami?`)) return;
              zmen((x) => ({ ...x, prevedenia: x.prevedenia.filter((_, k) => k !== i) }));
            }}
          />
        ))}
      </div>

      {pridavanie ? (
        <div className="kt-karta kt-pridaj">
          <h3 className="kt-podnadpis">Dekor z ponuky skriniek</h3>
          {kniznica === null ? (
            <p className="ad-muted">Načítavam dekory…</p>
          ) : volneDekory.length ? (
            <ul className="kt-kniznica">
              {volneDekory.map((d) => (
                <li key={d.id}>
                  <button type="button" onClick={() => pridajDekor(d)}>
                    <span className="kt-kniznica__vzorka">
                      <Swatch swatch={d.swatch} />
                    </span>
                    {d.name}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="ad-muted">Všetky dekory z ponuky už set má.</p>
          )}
          <h3 className="kt-podnadpis">Úplne nový dekor</h3>
          <div className="kt-riadok kt-riadok--akcia">
            <input
              className="kt-vstup"
              value={noveMeno}
              placeholder="Názov, napríklad Dub Lancelot"
              onChange={(e) => setNoveMeno(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  vytvorDekor();
                }
              }}
            />
            <button type="button" className="ad-btn" onClick={vytvorDekor} disabled={!noveMeno.trim()}>
              Vytvoriť
            </button>
          </div>
          <button type="button" className="kt-odkaz" onClick={() => setPridavanie(false)}>
            Zavrieť
          </button>
        </div>
      ) : (
        <button type="button" className="kt-pridat" onClick={() => setPridavanie(true)}>
          + Pridať dekor
        </button>
      )}

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
