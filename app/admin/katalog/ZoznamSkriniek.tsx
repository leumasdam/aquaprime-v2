"use client";

import { useMemo, useState } from "react";
import { TIERS, type Product, type Tier } from "../../products";
import { cenaZTextu } from "../../katalog/kontrola";

type Filter = "vsetky" | Tier | "skryte";

const casUlozenia = (iso: string) =>
  new Date(iso).toLocaleString("sk-SK", { day: "numeric", month: "numeric", hour: "2-digit", minute: "2-digit" });

export default function ZoznamSkriniek({
  katalog,
  ulozene,
  onOtvor,
  onNova,
  onKopia,
  onPoradie,
  onDekory,
  onHistoria,
}: {
  katalog: Product[];
  ulozene: { kedy: string; kto: string } | null;
  onOtvor: (slug: string) => void;
  onNova: () => void;
  onKopia: (slug: string) => void;
  onPoradie: (slugy: string[]) => Promise<boolean>;
  onDekory: () => void;
  onHistoria: () => void;
}) {
  const [filter, setFilter] = useState<Filter>("vsetky");
  const [hladaj, setHladaj] = useState("");
  const [poradie, setPoradie] = useState<string[] | null>(null);
  const [uklada, setUklada] = useState(false);

  const pocty = useMemo(
    () => ({
      naWebe: katalog.filter((p) => !p.skryta).length,
      skryte: katalog.filter((p) => p.skryta).length,
    }),
    [katalog],
  );

  const podla = useMemo(() => new Map(katalog.map((p) => [p.slug, p])), [katalog]);
  const zoradovanie = poradie !== null;

  const zobrazene = useMemo(() => {
    if (zoradovanie) return poradie!.map((s) => podla.get(s)!).filter(Boolean);
    const h = hladaj
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .trim();
    return katalog.filter((p) => {
      if (filter === "skryte" && !p.skryta) return false;
      if (filter !== "vsetky" && filter !== "skryte" && p.tier !== filter) return false;
      if (!h) return true;
      const text = `${p.name} ${p.slug} ${p.decors.map((d) => d.name).join(" ")}`
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase();
      return h.split(/\s+/).every((slovo) => text.includes(slovo));
    });
  }, [katalog, filter, hladaj, zoradovanie, poradie, podla]);

  const presun = (i: number, smer: -1 | 1) => {
    if (!poradie) return;
    const j = i + smer;
    if (j < 0 || j >= poradie.length) return;
    const n = [...poradie];
    [n[i], n[j]] = [n[j], n[i]];
    setPoradie(n);
  };

  const ulozPoradie = async () => {
    if (!poradie) return;
    setUklada(true);
    const ok = await onPoradie(poradie);
    setUklada(false);
    if (ok) setPoradie(null);
  };

  return (
    <section className="ad-section">
      <header className="ad-head">
        <h1>Skrinky</h1>
        <p>
          Všetko, čo zákazník vidí v katalógu — rozmery, ceny, popisy, dekory a fotky. Zmena sa na webe prejaví do pár
          sekúnd od uloženia.
        </p>
      </header>

      <div className="kt-suhrn">
        <span>
          <b>{katalog.length}</b> skriniek
        </span>
        <span>
          <b>{pocty.naWebe}</b> na webe
        </span>
        {pocty.skryte > 0 && (
          <span>
            <b>{pocty.skryte}</b> rozpracovaných
          </span>
        )}
        <span className="kt-suhrn__ulozene">
          {ulozene ? `Naposledy uložil ${ulozene.kto}, ${casUlozenia(ulozene.kedy)}` : "Zatiaľ bez úprav — web beží z pôvodného katalógu"}
        </span>
      </div>

      <div className="kt-nastroje">
        {zoradovanie ? (
          <>
            <span className="kt-nastroje__info">Zmeňte poradie šípkami. Takto budú skrinky zoradené aj na webe pri „Odporúčané".</span>
            <button type="button" className="ad-btn ad-btn--ghost" onClick={() => setPoradie(null)} disabled={uklada}>
              Zrušiť
            </button>
            <button type="button" className="ad-btn" onClick={ulozPoradie} disabled={uklada}>
              {uklada ? "Ukladám…" : "Uložiť poradie"}
            </button>
          </>
        ) : (
          <>
            <input
              className="kt-vstup kt-hladaj"
              type="search"
              placeholder="Hľadať rozmer, názov alebo dekor…"
              value={hladaj}
              onChange={(e) => setHladaj(e.target.value)}
              aria-label="Hľadať skrinku"
            />
            <div className="kt-filtre" role="group" aria-label="Filter">
              {(
                [
                  ["vsetky", "Všetky"],
                  ...TIERS.map((t) => [t.id, t.label] as const),
                  ...(pocty.skryte ? [["skryte", "Rozpracované"] as const] : []),
                ] as [Filter, string][]
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  className={filter === id ? "is-on" : ""}
                  aria-pressed={filter === id}
                  onClick={() => setFilter(id)}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="kt-nastroje__vpravo">
              <button type="button" className="kt-odkaz" onClick={() => setPoradie(katalog.map((p) => p.slug))}>
                Poradie
              </button>
              <button type="button" className="kt-odkaz" onClick={onDekory}>
                Dekory
              </button>
              <button type="button" className="kt-odkaz" onClick={onHistoria}>
                História
              </button>
              <button type="button" className="ad-btn" onClick={onNova}>
                + Nová skrinka
              </button>
            </div>
          </>
        )}
      </div>

      {zobrazene.length === 0 ? (
        <p className="ad-muted kt-prazdne">Nič nezodpovedá hľadaniu.</p>
      ) : (
        <ul className="kt-skrinky">
          {zobrazene.map((p, i) => {
            const cena = cenaZTextu(p.price);
            const cakaju = p.decors.filter((d) => d.chyba).length;
            const nafotene = p.decors.length - cakaju;
            return (
              <li key={p.slug} className={`kt-skrinka${p.skryta ? " is-skryta" : ""}`}>
                <button
                  type="button"
                  className="kt-skrinka__otvor"
                  onClick={() => !zoradovanie && onOtvor(p.slug)}
                  disabled={zoradovanie}
                >
                  <span className="kt-skrinka__foto">
                    {p.cover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.cover} alt="" loading="lazy" />
                    ) : (
                      <span className="kt-skrinka__bez">bez fotky</span>
                    )}
                  </span>
                  <span className="kt-skrinka__text">
                    <b>{p.name}</b>
                    <small>
                      {nafotene} {nafotene === 1 ? "dekor" : nafotene < 5 && nafotene > 0 ? "dekory" : "dekorov"}
                      {cakaju > 0 && ` · ${cakaju} čaká na fotky`}
                    </small>
                  </span>
                  <span className="kt-skrinka__cena">
                    {cena === null ? <span className="ad-muted">na dopyt</span> : `${cena.toLocaleString("sk-SK")} €`}
                    {p.priceLed && <small>LED {p.priceLed}</small>}
                  </span>
                  <span className={`ad-tag ${p.skryta ? "is-off" : "is-a"}`}>{p.skryta ? "Rozpracovaná" : "Na webe"}</span>
                </button>
                {zoradovanie ? (
                  <span className="kt-skrinka__poradie">
                    <button type="button" onClick={() => presun(i, -1)} disabled={i === 0} aria-label="Vyššie">
                      ↑
                    </button>
                    <button type="button" onClick={() => presun(i, 1)} disabled={i === zobrazene.length - 1} aria-label="Nižšie">
                      ↓
                    </button>
                  </span>
                ) : (
                  <button type="button" className="kt-odkaz kt-skrinka__kopia" onClick={() => onKopia(p.slug)} title="Vytvoriť novú skrinku podľa tejto">
                    Kópia
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
