"use client";

import { useEffect, useMemo, useState } from "react";
import { TIERS, type Decor, type Product, type Tier } from "../../products";
import {
  cenaZTextu,
  chybySkrinky,
  navrhSlug,
  normalizuj,
  odtlacok,
  textZCeny,
  type Chyba,
} from "../../katalog/kontrola";
import Swatch from "../../Swatch";
import DekorKarta from "./DekorKarta";
import { posli, type StavKatalogu } from "./api";

/* ---------------- pomocníci ---------------- */

/** „Dub Španielsky / Orech" → „dub-spanielsky-orech" */
export function naSlug(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const rozmer = (p: Pick<Product, "w" | "d" | "h">) => `${p.w} × ${p.d} × ${p.h}`;
const autoMeno = (p: Pick<Product, "tier" | "w" | "d" | "h">) =>
  `${TIERS.find((t) => t.id === p.tier)?.label ?? ""} ${rozmer(p)}`;

/**
 * Popis novej skrinky preberieme zo skrinky toho istého radu a vymeníme
 * v ňom rozmer. Klient tak nezačína z prázdneho poľa a texty ostanú
 * jednotné s ostatnými.
 */
function vzorRadu(katalog: Product[], tier: Tier) {
  const vzor = katalog.find((p) => p.tier === tier && p.desc);
  return {
    desc: vzor ? vzor.desc.replace(vzor.dim.replace(" cm", ""), "{rozmer}") : "",
    features: vzor ? [...vzor.features] : [],
  };
}

export function novaSkrinka(katalog: Product[], tier: Tier = "premium"): Product {
  const vzor = vzorRadu(katalog, tier);
  const zaklad = { tier, w: 100, d: 40, h: 80 };
  return {
    slug: navrhSlug(tier, zaklad.w, zaklad.d, zaklad.h),
    name: autoMeno(zaklad),
    tierLabel: "",
    tierNote: "",
    dim: "",
    ...zaklad,
    aquarium: "",
    vol: "",
    price: "Na dopyt",
    desc: vzor.desc.replace("{rozmer}", rozmer(zaklad)),
    features: vzor.features,
    decors: [],
    cover: "",
    // nová skrinka je rozpracovaná, kým ju klient sám nezverejní
    skryta: true,
  };
}

/** všetky dekory, ktoré sa niekde v katalógu vyskytujú — na rýchle pridanie */
function kniznica(katalog: Product[]): Pick<Decor, "id" | "name" | "swatch">[] {
  const m = new Map<string, Pick<Decor, "id" | "name" | "swatch">>();
  for (const p of katalog) for (const d of p.decors) if (!m.has(d.id)) m.set(d.id, { id: d.id, name: d.name, swatch: d.swatch });
  return [...m.values()].sort((a, b) => a.name.localeCompare(b.name, "sk"));
}

/* ---------------- formulár ---------------- */

export default function FormularSkrinky({
  povodna,
  predloha,
  katalog,
  onUlozene,
  onSpat,
}: {
  /** upravovaná skrinka; null = nová */
  povodna: Product | null;
  /** východzí obsah novej skrinky (napr. kópia existujúcej) */
  predloha?: Product;
  katalog: Product[];
  onUlozene: (stav: StavKatalogu, sprava: string, slug: string | null) => void;
  onSpat: () => void;
}) {
  const [draft, setDraft] = useState<Product>(() => structuredClone(povodna ?? predloha ?? novaSkrinka(katalog)));
  // názov, adresa a popis sa dopočítavajú, kým ich klient neprepíše sám
  const [menoAuto, setMenoAuto] = useState(() => draft.name === autoMeno(draft));
  // pri novej skrinke aj kópii adresa sleduje rozmer — kópia sa typicky líši práve ním
  const [slugAuto, setSlugAuto] = useState(() => !povodna);
  const [popisAuto, setPopisAuto] = useState(() => !povodna && !predloha);
  const [uklada, setUklada] = useState(false);
  const [serverChyba, setServerChyba] = useState<{ sprava: string; chyby: Chyba[]; konflikt: boolean } | null>(null);
  const [pridavanie, setPridavanie] = useState(false);
  // nová skrinka je „zmenená" od začiatku — varovať pri odchode ale treba až po prvej úprave
  const [dotknute, setDotknute] = useState(false);
  // dekory pridané v tomto otvorení formulára sa zobrazia rozbalené
  const [noveDekory, setNoveDekory] = useState<Set<string>>(() => new Set());
  const [novyDekor, setNovyDekor] = useState("");

  const vychodzi = useMemo(() => JSON.stringify(normalizuj(povodna ?? predloha ?? novaSkrinka(katalog))), [povodna, predloha, katalog]);
  const normalizovany = useMemo(() => normalizuj(draft), [draft]);
  const zmenene = JSON.stringify(normalizovany) !== vychodzi || !povodna;

  const neulozene = povodna ? zmenene : dotknute;

  // varovanie pri zatvorení karty s neuloženými zmenami
  useEffect(() => {
    if (!neulozene) return;
    const h = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [neulozene]);

  /* ---- kontrola naživo ----
     Dve úrovne: rozpracovanú skrinku stačí vedieť identifikovať (adresa,
     názov, rozmer), zverejnená musí mať všetko, s čím web počíta. Polia
     sa podčiarkujú podľa prísnejšej úrovne, aby klient hneď videl, čo mu
     ešte chýba do zverejnenia. */
  const { chyby, chybyKonceptu } = useMemo(() => {
    const obsadena = katalog.some((p) => p.slug === normalizovany.slug && p.slug !== povodna?.slug);
    const kolizia: Chyba[] = obsadena
      ? [{ slug: normalizovany.slug, pole: "slug", sprava: "Túto adresu už má iná skrinka." }]
      : [];
    return {
      chyby: [...chybySkrinky({ ...normalizovany, skryta: false }), ...kolizia],
      chybyKonceptu: [...chybySkrinky({ ...normalizovany, skryta: true }), ...kolizia],
    };
  }, [normalizovany, katalog, povodna]);
  const chybyPola = (pole: string) => chyby.filter((c) => c.pole === pole);
  const chybyDekoru = (i: number) => chyby.filter((c) => c.pole === `decors.${i}`);
  const chybyVseobecne = chyby.filter((c) => !["slug", "name", "w", "d", "h", "priceLed", "desc"].includes(c.pole) && !c.pole.startsWith("decors."));

  /* ---- úpravy ---- */
  const zmen = (z: Partial<Product>) => {
    setServerChyba(null);
    setDotknute(true);
    setDraft((d) => {
      const n = { ...d, ...z };
      if (menoAuto) n.name = autoMeno(n);
      if (slugAuto) n.slug = navrhSlug(n.tier, n.w, n.d, n.h);
      if (popisAuto) n.desc = vzorRadu(katalog, n.tier).desc.replace("{rozmer}", rozmer(n));
      return n;
    });
  };
  const zmenDekory = (decors: Decor[]) => zmen({ decors });
  const kniznicaDekorov = useMemo(() => kniznica(katalog), [katalog]);
  const volneDekory = kniznicaDekorov.filter((d) => !draft.decors.some((x) => x.id === d.id));

  const pridajDekor = (d: Pick<Decor, "id" | "name" | "swatch">) => {
    setNoveDekory((n) => new Set(n).add(d.id));
    zmenDekory([...draft.decors, { id: d.id, name: d.name, swatch: [...d.swatch], images: [] }]);
    setPridavanie(false);
  };
  const vytvorDekor = () => {
    const meno = novyDekor.trim();
    if (!meno) return;
    let id = naSlug(meno) || "dekor";
    // ID musí byť v rámci skrinky aj knižnice jedinečné
    const obsadene = new Set([...kniznicaDekorov.map((d) => d.id), ...draft.decors.map((d) => d.id)]);
    for (let k = 2; obsadene.has(id); k++) id = `${naSlug(meno)}-${k}`;
    pridajDekor({ id, name: meno, swatch: ["#17181a"] });
    setNovyDekor("");
  };

  /* ---- uloženie ---- */
  const uloz = async (zverejnit?: boolean) => {
    const produkt = normalizuj({ ...draft, skryta: zverejnit === undefined ? draft.skryta : !zverejnit });
    if (!produkt.skryta && chyby.length) {
      setServerChyba({ sprava: "Na zverejnenie treba najprv doplniť označené polia.", chyby: [], konflikt: false });
      return;
    }
    setUklada(true);
    setServerChyba(null);
    const r = await posli({
      akcia: "uloz",
      povodnySlug: povodna?.slug ?? null,
      produkt,
      odtlacok: povodna ? odtlacok(povodna) : null,
    });
    setUklada(false);
    if (!r.ok) {
      setServerChyba({ sprava: r.chyba, chyby: r.chyby, konflikt: r.konflikt });
      return;
    }
    onUlozene(r, produkt.skryta ? `Uložené ako rozpracované — na webe sa zatiaľ neukáže.` : `Uložené. Na webe sa zmena prejaví do pár sekúnd.`, produkt.slug);
  };

  const zmaz = async () => {
    if (!povodna) return;
    if (!window.confirm(`Naozaj zmazať skrinku ${povodna.name}? Zmazanie sa dá vrátiť v histórii verzií.`)) return;
    setUklada(true);
    const r = await posli({ akcia: "zmaz", slug: povodna.slug, odtlacok: odtlacok(povodna) });
    setUklada(false);
    if (!r.ok) {
      setServerChyba({ sprava: r.chyba, chyby: r.chyby, konflikt: r.konflikt });
      return;
    }
    onUlozene(r, `Skrinka ${povodna.name} je zmazaná.`, null);
  };

  const spat = () => {
    if (neulozene && !window.confirm("Máte neuložené zmeny. Naozaj odísť bez uloženia?")) return;
    onSpat();
  };

  const cena = cenaZTextu(draft.price);
  const cenaLed = cenaZTextu(draft.priceLed);
  const naWebe = povodna && !povodna.skryta;

  return (
    <section className="ad-section kt-form">
      {/* počas ukladania sa nedá odísť — po dokončení by editor klienta
          vtiahol späť do formulára uloženej skrinky */}
      <button type="button" className="kt-spat" onClick={spat} disabled={uklada}>
        ← Všetky skrinky
      </button>

      <header className="ad-head">
        <h1>{povodna ? povodna.name : predloha ? "Kópia skrinky" : "Nová skrinka"}</h1>
        <p>
          {povodna
            ? naWebe
              ? "Skrinka je zverejnená. Po uložení sa zmena na webe prejaví do pár sekúnd."
              : "Skrinka je rozpracovaná a na webe sa zatiaľ neukazuje."
            : "Nová skrinka sa uloží ako rozpracovaná. Zverejnite ju, keď bude mať fotky a popis."}
        </p>
      </header>

      {serverChyba && (
        <div className={`ad-banner is-warn`} role="alert">
          <b>{serverChyba.sprava}</b>
          {serverChyba.chyby.length > 0 && (
            <ul className="kt-chyby">
              {serverChyba.chyby.map((c, i) => (
                <li key={i}>{c.sprava}</li>
              ))}
            </ul>
          )}
          {serverChyba.konflikt && (
            <button type="button" className="ad-btn ad-btn--ghost" onClick={() => window.location.reload()}>
              Obnoviť editor
            </button>
          )}
        </div>
      )}

      {/* ---------- rad a rozmer ---------- */}
      <h2 className="ad-h2">Rad a rozmer</h2>
      <div className="kt-karta">
        <div className="kt-rady" role="radiogroup" aria-label="Rad">
          {TIERS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={draft.tier === t.id}
              className={`kt-rad${draft.tier === t.id ? " is-on" : ""}`}
              onClick={() => zmen({ tier: t.id })}
            >
              <b>{t.label}</b>
              <small>{t.note}</small>
            </button>
          ))}
        </div>
        <div className="kt-riadok kt-riadok--3">
          {(
            [
              ["w", "Šírka"],
              ["d", "Hĺbka"],
              ["h", "Výška"],
            ] as const
          ).map(([pole, nazov]) => (
            <label key={pole} className={`kt-pole${chybyPola(pole).length ? " is-chyba" : ""}`}>
              <span>{nazov}</span>
              <span className="kt-jednotka">
                <input
                  className="kt-vstup"
                  type="number"
                  inputMode="numeric"
                  min={20}
                  max={400}
                  value={draft[pole] || ""}
                  onChange={(e) => zmen({ [pole]: Number(e.target.value) } as Partial<Product>)}
                />
                <i>cm</i>
              </span>
              {chybyPola(pole).map((c, i) => (
                <em key={i}>{c.sprava}</em>
              ))}
            </label>
          ))}
        </div>
      </div>

      {/* ---------- názov a adresa ---------- */}
      <h2 className="ad-h2">Názov a adresa</h2>
      <div className="kt-karta">
        <label className={`kt-pole${chybyPola("name").length ? " is-chyba" : ""}`}>
          <span>
            Názov
            {menoAuto && <small className="kt-auto">dopĺňa sa z radu a rozmeru</small>}
          </span>
          <input
            className="kt-vstup"
            value={draft.name}
            onChange={(e) => {
              setMenoAuto(false);
              zmen({ name: e.target.value });
            }}
          />
          {chybyPola("name").map((c, i) => (
            <em key={i}>{c.sprava}</em>
          ))}
        </label>
        <label className={`kt-pole${chybyPola("slug").length ? " is-chyba" : ""}`}>
          <span>
            Adresa na webe
            {slugAuto && <small className="kt-auto">dopĺňa sa z radu a rozmeru</small>}
          </span>
          <span className="kt-adresa">
            <i>aquaprime.sk/skrinky/</i>
            <input
              className="kt-vstup"
              value={draft.slug}
              onChange={(e) => {
                setSlugAuto(false);
                zmen({ slug: e.target.value.toLowerCase() });
              }}
            />
          </span>
          {povodna && draft.slug !== povodna.slug && (
            <small className="kt-varovanie">
              Zmenou adresy prestanú fungovať staré odkazy na túto skrinku (napríklad z Google alebo sociálnych sietí).
            </small>
          )}
          {chybyPola("slug").map((c, i) => (
            <em key={i}>{c.sprava}</em>
          ))}
        </label>
      </div>

      {/* ---------- cena ---------- */}
      <h2 className="ad-h2">Cena</h2>
      <div className="kt-karta">
        <div className="kt-riadok">
          <label className="kt-pole">
            <span>Cena s DPH</span>
            <span className="kt-jednotka">
              <input
                className="kt-vstup"
                type="number"
                inputMode="decimal"
                min={0}
                step="1"
                placeholder="na dopyt"
                value={cena ?? ""}
                onChange={(e) => zmen({ price: textZCeny(e.target.value ? Number(e.target.value) : null) })}
              />
              <i>€</i>
            </span>
            <small className="ad-muted">
              {cena === null ? "Bez ceny sa skrinka ponúka na dopyt a nedá sa vložiť do košíka." : "Skrinka sa dá kúpiť cez košík."}
            </small>
          </label>
          <label className={`kt-pole${chybyPola("priceLed").length ? " is-chyba" : ""}`}>
            <span>Cena s LED podsvietením</span>
            <span className="kt-jednotka">
              <input
                className="kt-vstup"
                type="number"
                inputMode="decimal"
                min={0}
                step="1"
                placeholder="bez LED"
                value={cenaLed ?? ""}
                onChange={(e) =>
                  zmen({ priceLed: e.target.value ? textZCeny(Number(e.target.value)) : undefined })
                }
              />
              <i>€</i>
            </span>
            <small className="ad-muted">Celková cena vrátane LED. Nechajte prázdne, ak skrinka LED verziu nemá.</small>
            {chybyPola("priceLed").map((c, i) => (
              <em key={i}>{c.sprava}</em>
            ))}
          </label>
        </div>
      </div>

      {/* ---------- texty ---------- */}
      <h2 className="ad-h2">Popis</h2>
      <div className="kt-karta">
        <label className="kt-pole kt-pole--uzke">
          <span>Objem akvária</span>
          <input
            className="kt-vstup"
            value={draft.vol}
            placeholder="napr. ~200 l"
            onChange={(e) => zmen({ vol: e.target.value })}
          />
        </label>
        <label className={`kt-pole${chybyPola("desc").length ? " is-chyba" : ""}`}>
          <span>
            Popis
            {popisAuto && <small className="kt-auto">podľa ostatných skriniek radu</small>}
          </span>
          <textarea
            className="kt-vstup"
            rows={4}
            value={draft.desc}
            onChange={(e) => {
              setPopisAuto(false);
              zmen({ desc: e.target.value });
            }}
          />
          {chybyPola("desc").map((c, i) => (
            <em key={i}>{c.sprava}</em>
          ))}
        </label>
        <div className="kt-pole">
          <span>Vlastnosti (odrážky na detaile skrinky)</span>
          <ul className="kt-zoznam">
            {draft.features.map((f, i) => (
              <li key={i}>
                <input
                  className="kt-vstup"
                  value={f}
                  onChange={(e) => zmen({ features: draft.features.map((x, k) => (k === i ? e.target.value : x)) })}
                />
                <button
                  type="button"
                  aria-label="Posunúť vyššie"
                  disabled={i === 0}
                  onClick={() => {
                    const n = [...draft.features];
                    [n[i - 1], n[i]] = [n[i], n[i - 1]];
                    zmen({ features: n });
                  }}
                >
                  ↑
                </button>
                <button
                  type="button"
                  aria-label="Odstrániť vlastnosť"
                  onClick={() => zmen({ features: draft.features.filter((_, k) => k !== i) })}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
          <button type="button" className="kt-odkaz" onClick={() => zmen({ features: [...draft.features, ""] })}>
            + Pridať vlastnosť
          </button>
        </div>
      </div>

      {/* ---------- dekory ---------- */}
      <h2 className="ad-h2">Dekory a fotky</h2>
      {chybyPola("decors").map((c, i) => (
        <p key={i} className="ad-err">
          {c.sprava}
        </p>
      ))}
      <div className="kt-dekory">
        {draft.decors.map((d, i) => (
          <DekorKarta
            key={d.id}
            dekor={d}
            poradie={i}
            pocet={draft.decors.length}
            chyby={chybyDekoru(i)}
            otvorena={noveDekory.has(d.id) || (!povodna && !predloha)}
            onZmena={(nd) => zmenDekory(draft.decors.map((x, k) => (k === i ? nd : x)))}
            onPresun={(smer) => {
              const n = [...draft.decors];
              const j = i + smer;
              [n[i], n[j]] = [n[j], n[i]];
              zmenDekory(n);
            }}
            onOdstran={() => {
              if (d.images.length && !window.confirm(`Odobrať dekor „${d.name}" aj s ${d.images.length} fotkami?`)) return;
              zmenDekory(draft.decors.filter((_, k) => k !== i));
            }}
          />
        ))}
      </div>

      {pridavanie ? (
        <div className="kt-karta kt-pridaj">
          <h3 className="kt-podnadpis">Dekor z ponuky</h3>
          {volneDekory.length ? (
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
            <p className="ad-muted">Všetky dekory z ponuky už skrinka má.</p>
          )}
          <h3 className="kt-podnadpis">Úplne nový dekor</h3>
          <div className="kt-riadok kt-riadok--akcia">
            <input
              className="kt-vstup"
              value={novyDekor}
              placeholder="Názov, napríklad Dub Lancelot"
              onChange={(e) => setNovyDekor(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  vytvorDekor();
                }
              }}
            />
            <button type="button" className="ad-btn" onClick={vytvorDekor} disabled={!novyDekor.trim()}>
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

      {chybyVseobecne.length > 0 && (
        <ul className="kt-chyby">
          {chybyVseobecne.map((c, i) => (
            <li key={i}>{c.sprava}</li>
          ))}
        </ul>
      )}

      {/* ---------- lišta s uložením ---------- */}
      <div className="kt-lista">
        <div className="kt-lista__stav">
          {chyby.length ? (
            <span className="ad-err">
              {draft.skryta
                ? `Pred zverejnením treba doplniť: ${chyby.length}`
                : `Uloženiu bráni: ${chyby.length}`}
            </span>
          ) : neulozene ? (
            <span>Neuložené zmeny</span>
          ) : (
            <span className="ad-muted">Bez zmien</span>
          )}
        </div>
        <div className="kt-lista__akcie">
          {povodna && (
            <button type="button" className="kt-odkaz kt-odkaz--nebezpecne" onClick={zmaz} disabled={uklada}>
              Zmazať
            </button>
          )}
          {naWebe && (
            <a className="kt-odkaz" href={`/skrinky/${povodna.slug}`} target="_blank" rel="noreferrer">
              Zobraziť na webe ↗
            </a>
          )}
          {draft.skryta ? (
            <>
              <button
                type="button"
                className="ad-btn ad-btn--ghost"
                onClick={() => uloz()}
                disabled={uklada || (!zmenene && Boolean(povodna)) || chybyKonceptu.length > 0}
              >
                Uložiť rozpracované
              </button>
              <button
                type="button"
                className="ad-btn"
                onClick={() => uloz(true)}
                disabled={uklada || chyby.length > 0}
                title={chyby.length ? "Najprv doplňte označené polia" : undefined}
              >
                {uklada ? "Ukladám…" : "Zverejniť na webe"}
              </button>
            </>
          ) : (
            <>
              <button type="button" className="ad-btn ad-btn--ghost" onClick={() => uloz(false)} disabled={uklada}>
                Skryť z webu
              </button>
              <button type="button" className="ad-btn" onClick={() => uloz()} disabled={uklada || !zmenene || chyby.length > 0}>
                {uklada ? "Ukladám…" : "Uložiť"}
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
