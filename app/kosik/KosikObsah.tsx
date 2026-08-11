"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { eur, useKosik, type PolozkaKosika } from "../kosik-store";
import { AQUARIUMS } from "../aquariums";
import { PRODUCTS } from "../products";
import { suggestTank } from "../configurator-logic";

const DOPRAVA_ZDARMA_OD = 500;
const KURIER = 39;

const DORUCENIE = [
  {
    id: "kurier",
    nazov: "Kuriér po celom Slovensku",
    popis: "Doručenie až k dverám, termín dohodneme vopred telefonicky.",
    cena: KURIER,
  },
  {
    id: "odber",
    nazov: "Osobný odber v Bratislave",
    popis: "Po dohode termínu v našej dielni. Skrinku si pozriete pred prevzatím.",
    cena: 0,
  },
] as const;

const PLATBA = [
  {
    id: "prevod",
    nazov: "Prevodom na účet",
    popis: "Platobné údaje pošleme po potvrdení objednávky. Nič neplatíte vopred.",
  },
  {
    id: "prevzatie",
    nazov: "Pri prevzatí",
    popis: "Zaplatíte až keď je tovar u vás — v hotovosti alebo kartou vodičovi.",
  },
] as const;

export default function KosikObsah() {
  const { polozky, suma, pocet, zmenPocet, uber, vyprazdni, pridaj, pripravene } =
    useKosik();
  const [dorucenie, setDorucenie] = useState<(typeof DORUCENIE)[number]["id"]>("kurier");
  const [platba, setPlatba] = useState<(typeof PLATBA)[number]["id"]>("prevod");
  const [odosielam, setOdosielam] = useState(false);
  const [hotovo, setHotovo] = useState<null | { cislo: string; mailom: boolean }>(null);
  const [chyba, setChyba] = useState("");
  const [termin, setTermin] = useState("");
  const [f, setF] = useState({
    meno: "",
    email: "",
    tel: "",
    ulica: "",
    mesto: "",
    psc: "",
    poschodie: "",
    poznamka: "",
    firma: "",
    ico: "",
  });

  const set = (k: keyof typeof f, v: string) => setF((p) => ({ ...p, [k]: v }));

  /* orientačný termín výroby — počíta sa až v prehliadači kvôli hydratácii */
  useEffect(() => {
    const f2 = (d: Date) =>
      d.toLocaleDateString("sk-SK", { day: "numeric", month: "long" });
    const od = new Date();
    od.setDate(od.getDate() + 14);
    const doo = new Date();
    doo.setDate(doo.getDate() + 21);
    setTermin(`${f2(od)} – ${f2(doo)}`);
  }, []);

  const doprava =
    dorucenie === "odber" || suma >= DOPRAVA_ZDARMA_OD || suma === 0 ? 0 : KURIER;
  const spolu = suma + doprava;
  const doZdarma = Math.max(0, DOPRAVA_ZDARMA_OD - suma);
  const pokrok = Math.min(100, (suma / DOPRAVA_ZDARMA_OD) * 100);
  const potrebnaAdresa = dorucenie === "kurier";

  const mozeOdoslat =
    f.meno.trim().length > 1 &&
    /.+@.+\..+/.test(f.email) &&
    (!potrebnaAdresa || (f.ulica.trim() && f.mesto.trim() && f.psc.trim())) &&
    polozky.length > 0;

  /* ---- čo sa hodí k tomu, čo je v košíku ---- */
  const navrhy = useMemo(() => {
    const vKosiku = new Set(polozky.map((p) => `${p.druh}:${p.slug}`));
    const out: PolozkaKosika[] = [];

    for (const p of polozky) {
      if (p.druh === "skrinka") {
        const prod = PRODUCTS.find((x) => x.slug === p.slug);
        if (!prod) continue;
        const t = suggestTank(prod.w, prod.d).best;
        if (t && !vKosiku.has(`akvarium:${t.slug}`)) {
          out.push({
            id: `akvarium-${t.slug}-${t.glass[0].mm}`,
            druh: "akvarium",
            slug: t.slug,
            nazov: `${t.name} cm`,
            variant: `${t.vol} · sadne presne na ${prod.dim}`,
            cena: t.priceValue,
            obrazok: t.cover,
            ks: 1,
          });
        }
      } else {
        const akv = AQUARIUMS.find((x) => x.slug === p.slug);
        if (!akv) continue;
        const skr = PRODUCTS.filter((x) => x.w === akv.w).sort(
          (a, b) =>
            Number(a.price.replace(/\D/g, "")) - Number(b.price.replace(/\D/g, ""))
        )[0];
        if (skr && !vKosiku.has(`skrinka:${skr.slug}`)) {
          out.push({
            id: `skrinka-${skr.slug}-${skr.decors[0].id}`,
            druh: "skrinka",
            slug: skr.slug,
            nazov: skr.name,
            variant: `${skr.dim} · unesie ${akv.vol} vody`,
            cena: Number(skr.price.replace(/\D/g, "")),
            obrazok: skr.decors[0].images[0],
            ks: 1,
          });
        }
      }
    }
    // bez duplicít, maximálne dva návrhy
    const videne = new Set<string>();
    return out.filter((x) => !videne.has(x.id) && videne.add(x.id)).slice(0, 2);
  }, [polozky]);

  const odosli = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mozeOdoslat || odosielam) return;
    setOdosielam(true);
    setChyba("");
    try {
      const res = await fetch("/api/objednavka", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          polozky,
          suma,
          doprava,
          spolu,
          dorucenie: DORUCENIE.find((d) => d.id === dorucenie)?.nazov,
          platba: PLATBA.find((p) => p.id === platba)?.nazov,
          ...f,
        }),
      });
      const data = await res.json();
      if (!res.ok && !data?.cislo) throw new Error();
      setHotovo({ cislo: data.cislo, mailom: !!data.mailom });
      vyprazdni();
    } catch {
      setChyba(
        "Objednávku sa nepodarilo odoslať. Skúste to o chvíľu znova, alebo nám zavolajte na +421 900 000 000."
      );
    } finally {
      setOdosielam(false);
    }
  };

  /* ---------- stavy ---------- */

  if (hotovo) {
    return (
      <div className="kos__done">
        <div className="kos__done-ico" aria-hidden>
          ✓
        </div>
        <h2 className="kos__done-title">Objednávka prijatá</h2>
        <p className="kos__done-cislo">{hotovo.cislo}</p>
        <p className="kos__done-body">
          {hotovo.mailom
            ? "Potvrdenie sme poslali na váš e-mail."
            : "Ozveme sa vám na uvedený kontakt."}{" "}
          Do 24 hodín v pracovný deň potvrdíme termín a pošleme platobné údaje.
          Nič neplatíte vopred.
        </p>
        <div className="kos__done-akcie">
          <Link href="/" className="btn-cyan">
            Späť na úvod
          </Link>
          <Link href="/skrinky" className="btn-outline">
            Pokračovať v prezeraní
          </Link>
        </div>
      </div>
    );
  }

  if (!pripravene) {
    return <div className="kos__skeleton" aria-hidden />;
  }

  if (!polozky.length) {
    return (
      <div className="kos__prazdny">
        <span className="kos__prazdny-ico" aria-hidden>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M4 5.5h2.2l2 10h9.4l2-7.3H7" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="9.5" cy="19" r="1.3" />
            <circle cx="17" cy="19" r="1.3" />
          </svg>
        </span>
        <h2>Košík je zatiaľ prázdny</h2>
        <p>
          Vyberte si skrinku alebo nádrž — ceny sú cenníkové, objednávku
          potvrdíme do 24 hodín a nič neplatíte vopred.
        </p>
        <div className="kos__prazdny-akcie">
          <Link href="/skrinky" className="btn-cyan">
            Prezrieť skrinky <span aria-hidden>→</span>
          </Link>
          <Link href="/akvaria" className="btn-outline">
            Prezrieť akváriá <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form className="kos__layout" onSubmit={odosli}>
      {/* ============ ĽAVÝ STĹPEC ============ */}
      <div className="kos__main">
        {/* 01 položky */}
        <section className="kos__blok">
          <header className="kos__blok-head">
            <span className="kos__krok">01</span>
            <h2>Vaša objednávka</h2>
            <span className="kos__blok-meta">{pocet} ks</span>
          </header>

          <div className="kos__items">
            {polozky.map((p) => (
              <article className="kos__item" key={p.id}>
                <div className="kos__item-foto">
                  <Image src={p.obrazok} alt="" fill sizes="120px" />
                </div>
                <div className="kos__item-info">
                  <Link
                    href={p.druh === "skrinka" ? `/skrinky/${p.slug}` : `/akvaria/${p.slug}`}
                    className="kos__item-nazov"
                  >
                    {p.nazov}
                  </Link>
                  <span className="kos__chip">{p.variant}</span>
                  <span className="kos__item-jedn">{eur(p.cena)} / ks</span>
                </div>
                <div className="kos__stepper">
                  <button type="button" onClick={() => zmenPocet(p.id, p.ks - 1)} aria-label="Menej">
                    −
                  </button>
                  <span>{p.ks}</span>
                  <button type="button" onClick={() => zmenPocet(p.id, p.ks + 1)} aria-label="Viac">
                    +
                  </button>
                </div>
                <div className="kos__item-cena">
                  <b>{eur(p.cena * p.ks)}</b>
                  <button type="button" className="kos__zmaz" onClick={() => uber(p.id)}>
                    Odstrániť
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* krížový predaj — nádrž k skrinke a naopak */}
        {navrhy.length > 0 && (
          <section className="kos__blok kos__blok--navrh">
            <header className="kos__blok-head">
              <h2>Hodí sa k tomu</h2>
              <span className="kos__blok-meta">pôdorys sedí</span>
            </header>
            <div className="kos__navrhy">
              {navrhy.map((n) => (
                <article className="kos__navrh" key={n.id}>
                  <div className="kos__navrh-foto">
                    <Image src={n.obrazok} alt="" fill sizes="90px" />
                  </div>
                  <div className="kos__navrh-info">
                    <strong>{n.nazov}</strong>
                    <span>{n.variant}</span>
                  </div>
                  <div className="kos__navrh-akcia">
                    <b>{eur(n.cena)}</b>
                    <button
                      type="button"
                      onClick={() => pridaj({ ...n })}
                      className="kos__pridaj"
                    >
                      Pridať +
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* 02 doručenie */}
        <section className="kos__blok">
          <header className="kos__blok-head">
            <span className="kos__krok">02</span>
            <h2>Doručenie</h2>
          </header>
          <div className="kos__volby">
            {DORUCENIE.map((d) => (
              <label key={d.id} className={`kos__volba${dorucenie === d.id ? " is-on" : ""}`}>
                <input
                  type="radio"
                  name="dorucenie"
                  checked={dorucenie === d.id}
                  onChange={() => setDorucenie(d.id)}
                />
                <span className="kos__volba-telo">
                  <strong>{d.nazov}</strong>
                  <span>{d.popis}</span>
                </span>
                <span className="kos__volba-cena">
                  {d.cena === 0 || suma >= DOPRAVA_ZDARMA_OD ? "zdarma" : eur(d.cena)}
                </span>
              </label>
            ))}
          </div>
          {termin && (
            <p className="kos__termin">
              <b>Predpokladaný termín</b> {termin} — vyrábame na mieru, presný
              dátum potvrdíme pri objednávke.
            </p>
          )}
        </section>

        {/* 03 platba */}
        <section className="kos__blok">
          <header className="kos__blok-head">
            <span className="kos__krok">03</span>
            <h2>Platba</h2>
          </header>
          <div className="kos__volby">
            {PLATBA.map((p) => (
              <label key={p.id} className={`kos__volba${platba === p.id ? " is-on" : ""}`}>
                <input
                  type="radio"
                  name="platba"
                  checked={platba === p.id}
                  onChange={() => setPlatba(p.id)}
                />
                <span className="kos__volba-telo">
                  <strong>{p.nazov}</strong>
                  <span>{p.popis}</span>
                </span>
                <span className="kos__volba-cena">0 €</span>
              </label>
            ))}
          </div>
        </section>

        {/* 04 údaje */}
        <section className="kos__blok">
          <header className="kos__blok-head">
            <span className="kos__krok">04</span>
            <h2>Kontaktné údaje</h2>
          </header>
          <div className="kos__polia">
            <label className="kos__pole">
              <span>Meno a priezvisko *</span>
              <input value={f.meno} onChange={(e) => set("meno", e.target.value)} autoComplete="name" required />
            </label>
            <label className="kos__pole">
              <span>Telefón</span>
              <input value={f.tel} onChange={(e) => set("tel", e.target.value)} autoComplete="tel" type="tel" placeholder="+421" />
            </label>
            <label className="kos__pole kos__pole--full">
              <span>E-mail *</span>
              <input value={f.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" type="email" required />
            </label>

            {potrebnaAdresa && (
              <>
                <label className="kos__pole kos__pole--full">
                  <span>Ulica a číslo *</span>
                  <input value={f.ulica} onChange={(e) => set("ulica", e.target.value)} autoComplete="street-address" required />
                </label>
                <label className="kos__pole">
                  <span>Mesto *</span>
                  <input value={f.mesto} onChange={(e) => set("mesto", e.target.value)} autoComplete="address-level2" required />
                </label>
                <label className="kos__pole">
                  <span>PSČ *</span>
                  <input value={f.psc} onChange={(e) => set("psc", e.target.value)} autoComplete="postal-code" required />
                </label>
                <label className="kos__pole kos__pole--full">
                  <span>Poschodie a výťah</span>
                  <input
                    value={f.poschodie}
                    onChange={(e) => set("poschodie", e.target.value)}
                    placeholder="napr. 3. poschodie, výťah je — pri 200 cm skrinke to rozhoduje"
                  />
                </label>
              </>
            )}

            <label className="kos__pole">
              <span>Firma</span>
              <input value={f.firma} onChange={(e) => set("firma", e.target.value)} />
            </label>
            <label className="kos__pole">
              <span>IČO</span>
              <input value={f.ico} onChange={(e) => set("ico", e.target.value)} />
            </label>
            <label className="kos__pole kos__pole--full">
              <span>Poznámka</span>
              <textarea
                rows={3}
                value={f.poznamka}
                onChange={(e) => set("poznamka", e.target.value)}
                placeholder="Termín, špecifické želanie…"
              />
            </label>
          </div>
        </section>
      </div>

      {/* ============ SÚHRN ============ */}
      <aside className="kos__aside">
        <div className="kos__sum">
          <h2 className="kos__sum-title">Súhrn objednávky</h2>

          {doprava > 0 && (
            <div className="kos__zdarma">
              <div className="kos__zdarma-bar">
                <i style={{ width: `${pokrok}%` }} />
              </div>
              <span>
                Do dopravy zdarma chýba <b>{eur(doZdarma)}</b>
              </span>
            </div>
          )}

          <div className="kos__sumrow">
            <span>Tovar ({pocet} ks)</span>
            <b>{eur(suma)}</b>
          </div>
          <div className="kos__sumrow">
            <span>Doprava</span>
            <b className={doprava === 0 ? "kos__zdarma-text" : ""}>
              {doprava === 0 ? "zdarma" : eur(doprava)}
            </b>
          </div>
          <div className="kos__sumrow kos__sumrow--total">
            <span>Spolu s DPH</span>
            <b>{eur(spolu)}</b>
          </div>

          {chyba && <p className="kos__chyba">{chyba}</p>}

          <button type="submit" className="btn-cyan kos__odoslat" disabled={!mozeOdoslat || odosielam}>
            {odosielam ? "ODOSIELAM…" : "ZÁVÄZNE OBJEDNAŤ"} <span aria-hidden>→</span>
          </button>
          {!mozeOdoslat && (
            <p className="kos__hint">Vyplňte označené polia nižšie a môžeme to poslať.</p>
          )}

          <ul className="kos__istoty">
            <li>
              <b>Nič neplatíte vopred</b>
              Platba až po potvrdení termínu.
            </li>
            <li>
              <b>Vyrábame na mieru</b>
              Rozmer mimo cenníka? Ozvite sa.
            </li>
            <li>
              <b>Nosnosť 770 kg</b>
              Rám testovaný na plnú nádrž.
            </li>
          </ul>

          <p className="kos__pomoc">
            Neviete si rady? Zavolajte na <a href="tel:+421900000000">+421 900 000 000</a>{" "}
            alebo napíšte cez <Link href="/kontakt">kontakt</Link>.
          </p>
        </div>
      </aside>
    </form>
  );
}
