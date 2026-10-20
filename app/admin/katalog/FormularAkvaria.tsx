"use client";

import { useCallback, useState } from "react";
import type { Aquarium } from "../../aquariums";
import { textZCeny, cenaZTextu, type Chyba } from "../../katalog/kontrola";
import { chybyAkvaria, navrhSlugAkvaria, normalizujAkvarium } from "../../katalog/polozky";
import Fotky from "./Fotky";
import { ChybaServera, ListaUlozenia, Pole, usePolozka } from "./FormularSpolocne";
import type { StavPoloziek } from "./api";

export function noveAkvarium(): Aquarium {
  // rozmer nechávame prázdny — klient ho doplní, adresa a objem sa dopočítajú
  const z = { w: 0, d: 0, h: 0 };
  return normalizujAkvarium({
    slug: navrhSlugAkvaria(z.w, z.d, z.h),
    ...z,
    liters: 0,
    glass: [{ mm: 8, price: "" }],
    priceValue: 0,
    priceLabel: "",
    cover: "",
    name: "",
    dim: "",
    vol: "",
    featured: false,
    skryta: true,
  });
}

export default function FormularAkvaria({
  povodna,
  predloha,
  zoznam,
  onUlozene,
  onSpat,
}: {
  povodna: Aquarium | null;
  predloha?: Aquarium;
  zoznam: Aquarium[];
  onUlozene: (stav: StavPoloziek<Aquarium>, sprava: string, id: string | null) => void;
  onSpat: () => void;
}) {
  // adresa sleduje rozmer, kým ju klient neprepíše sám
  const [slugAuto, setSlugAuto] = useState(() => !povodna);
  const [litreAuto, setLitreAuto] = useState(() => !povodna);
  const chyby = useCallback(
    (a: Aquarium): Chyba[] => {
      const obsadena = zoznam.some((x) => x.slug === a.slug && x.slug !== povodna?.slug);
      return [...chybyAkvaria(a), ...(obsadena ? [{ slug: a.slug, pole: "slug", sprava: "Túto adresu už má iné akvárium." }] : [])];
    },
    [zoznam, povodna],
  );
  const f = usePolozka<Aquarium>({
    kolekcia: "akvaria",
    povodna,
    predloha,
    nova: noveAkvarium,
    id: (a) => a.slug,
    normalizuj: normalizujAkvarium,
    chyby,
    onUlozene,
  });
  const { draft, zmen, uklada } = f;

  const zmenRozmer = (z: Partial<Pick<Aquarium, "w" | "d" | "h">>) =>
    zmen((d) => {
      const n = { ...d, ...z };
      if (slugAuto) n.slug = navrhSlugAkvaria(n.w, n.d, n.h);
      if (litreAuto) n.liters = Math.round((n.w * n.d * n.h) / 1000);
      return n;
    });
  const zmenSklo = (i: number, z: Partial<{ mm: number; price: string }>) =>
    zmen((d) => ({ ...d, glass: d.glass.map((g, k) => (k === i ? { ...g, ...z } : g)) }));

  const spat = () => {
    if (f.neulozene && !window.confirm("Máte neuložené zmeny. Naozaj odísť bez uloženia?")) return;
    onSpat();
  };
  const naWebe = Boolean(povodna && !povodna.skryta);
  const rozmer = `${draft.w} × ${draft.d} × ${draft.h} cm`;

  return (
    <section className="ad-section kt-form">
      <button type="button" className="kt-spat" onClick={spat} disabled={uklada}>
        ← Všetky akváriá
      </button>
      <header className="ad-head">
        <h1>{povodna ? povodna.name : predloha ? "Kópia akvária" : "Nové akvárium"}</h1>
        <p>
          {povodna
            ? naWebe
              ? "Akvárium je zverejnené. Po uložení sa zmena na webe prejaví do pár sekúnd."
              : "Akvárium je rozpracované a na webe sa zatiaľ neukazuje."
            : "Nové akvárium sa uloží ako rozpracované. Zverejnite ho, keď bude mať cenu a fotku."}
        </p>
      </header>

      <ChybaServera chyba={f.serverChyba} />

      <h2 className="ad-h2">Rozmer</h2>
      <div className="kt-karta">
        <div className="kt-riadok kt-riadok--3">
          {(
            [
              ["w", "Dĺžka"],
              ["d", "Šírka (hĺbka)"],
              ["h", "Výška"],
            ] as const
          ).map(([pole, nazov]) => (
            <Pole key={pole} nazov={nazov} chyby={f.chybyPola(pole)}>
              <span className="kt-jednotka">
                <input className="kt-vstup" type="number" inputMode="numeric" min={10} max={400} value={draft[pole] || ""} onChange={(e) => zmenRozmer({ [pole]: Number(e.target.value) })} />
                <i>cm</i>
              </span>
            </Pole>
          ))}
        </div>
        <div className="kt-riadok">
          <Pole
            nazov={
              <>
                Objem{litreAuto && <small className="kt-auto">dopočítava sa z rozmeru</small>}
              </>
            }
            chyby={f.chybyPola("liters")}
            uzke
          >
            <span className="kt-jednotka">
              <input
                className="kt-vstup"
                type="number"
                inputMode="numeric"
                min={1}
                value={draft.liters || ""}
                onChange={(e) => {
                  setLitreAuto(false);
                  zmen({ liters: Number(e.target.value) });
                }}
              />
              <i>l</i>
            </span>
          </Pole>
          <Pole
            nazov={
              <>
                Adresa na webe{slugAuto && <small className="kt-auto">dopĺňa sa z rozmeru</small>}
              </>
            }
            chyby={f.chybyPola("slug")}
          >
            <span className="kt-adresa">
              <i>aquaprime.sk/akvaria/</i>
              <input
                className="kt-vstup"
                value={draft.slug}
                onChange={(e) => {
                  setSlugAuto(false);
                  zmen({ slug: e.target.value.toLowerCase() });
                }}
              />
            </span>
          </Pole>
        </div>
        <p className="kt-pozn">Názov na webe sa skladá sám: „Akvárium {rozmer}“.</p>
      </div>

      <h2 className="ad-h2">Sklo a cena</h2>
      <div className="kt-karta">
        {draft.glass.map((g, i) => (
          <div key={i} className="kt-riadok kt-riadok--akcia">
            <Pole nazov={i === 0 ? "Hrúbka skla" : "Druhá hrúbka skla"} chyby={f.chybyPola(`glass.${i}`)} uzke>
              <span className="kt-jednotka">
                <input className="kt-vstup" type="number" inputMode="numeric" min={3} max={30} value={g.mm || ""} onChange={(e) => zmenSklo(i, { mm: Number(e.target.value) })} />
                <i>mm</i>
              </span>
            </Pole>
            <Pole nazov="Konečná cena" uzke>
              <span className="kt-jednotka">
                <input
                  className="kt-vstup"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="0.1"
                  value={cenaZTextu(g.price) ?? ""}
                  onChange={(e) => zmenSklo(i, { price: e.target.value ? textZCeny(Number(e.target.value)) : "" })}
                />
                <i>€</i>
              </span>
            </Pole>
            {draft.glass.length > 1 && (
              <button type="button" className="kt-odkaz" onClick={() => zmen((d) => ({ ...d, glass: d.glass.filter((_, k) => k !== i) }))}>
                Odobrať
              </button>
            )}
          </div>
        ))}
        {draft.glass.length < 2 && (
          <button type="button" className="kt-pridat" onClick={() => zmen((d) => ({ ...d, glass: [...d.glass, { mm: (d.glass[0]?.mm ?? 8) + 2, price: "" }] }))}>
            + Druhá hrúbka skla (vlastná cena)
          </button>
        )}
        <p className="kt-pozn">
          Ceny sú konečné, ako v cenníku. Pri dvoch hrúbkach web ukáže „od“ nižšiu cenu a obe varianty v detaile. Bez ceny sa akvárium ponúka na dopyt a nedá sa vložiť do košíka.
        </p>
      </div>

      <h2 className="ad-h2">Fotky</h2>
      <div className="kt-karta">
        {!draft.fotky?.length && draft.cover && (
          <p className="kt-pozn">
            Zatiaľ sa používa {draft.coverIllustrative ? "ilustračná fotka iného rozmeru" : "pôvodná fotka"} z webu. Nahratá fotka ju nahradí.
          </p>
        )}
        <Fotky fotky={draft.fotky ?? []} onZmena={(fotky) => zmen({ fotky })} titulna popis="fotka akvária" />
        {f.chybyPola("fotky").map((c, i) => (
          <em key={i} className="ad-err">
            {c.sprava}
          </em>
        ))}
        <p className="kt-pozn">Prvá fotka je titulná na karte aj v detaile, ďalšie sa otvoria v galérii detailu. Fotky sa neorezávajú.</p>
      </div>

      <ListaUlozenia
        skryta={Boolean(draft.skryta)}
        jeNova={!povodna}
        naWebe={naWebe}
        odkaz={`/akvaria/${povodna?.slug ?? ""}`}
        uklada={uklada}
        zmenene={f.zmenene}
        neulozene={f.neulozene}
        chyby={f.chyby.length}
        chybyKonceptu={f.chybyKonceptu.length}
        onUloz={f.uloz}
        onZmaz={() => f.zmaz(povodna?.name ?? "akvárium")}
      />
    </section>
  );
}
