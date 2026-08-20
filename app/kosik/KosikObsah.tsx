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

/** Platobný model: 30 % záloha po objednaní, zvyšok pri prevzatí. */
const ZALOHA_PODIEL = 0.3;

type Hotovo = {
  cislo: string;
  mailom: boolean;
  vs?: string;
  zaloha?: number;
  doplatok?: number;
  iban?: string | null;
  /** Pay by Square (slovenské banky) */
  pbs?: string | null;
  /** QR Platba / SPD (české banky — nesie aj variabilný symbol) */
  spd?: string | null;
};

/** riadok údaju s tlačidlom kopírovania */
function Udaj({ nazov, hodnota, kopiruj }: { nazov: string; hodnota: string; kopiruj?: string }) {
  const [ok, setOk] = useState(false);
  return (
    <div>
      <dt>{nazov}</dt>
      <dd>
        {hodnota}
        <button
          type="button"
          className={`kos__kopir${ok ? " is-ok" : ""}`}
          aria-label={`Kopírovať ${nazov}`}
          onClick={() => {
            navigator.clipboard?.writeText(kopiruj ?? hodnota).then(() => {
              setOk(true);
              setTimeout(() => setOk(false), 1600);
            });
          }}
        >
          {ok ? "✓" : "⧉"}
        </button>
      </dd>
    </div>
  );
}

export default function KosikObsah() {
  const { polozky, suma, pocet, zmenPocet, uber, vyprazdni, pridaj, pripravene } =
    useKosik();
  const [dorucenie, setDorucenie] = useState<(typeof DORUCENIE)[number]["id"]>("kurier");
  const [odosielam, setOdosielam] = useState(false);
  const [hotovo, setHotovo] = useState<null | Hotovo>(null);
  const [qr, setQr] = useState("");
  const [qrCz, setQrCz] = useState("");
  const [banka, setBanka] = useState<"sk" | "cz">("sk");
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

  // objednávka sa nedá odoslať bez súhlasu s obchodnými podmienkami
  const [suhlasOP, setSuhlasOP] = useState(false);

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
  const zaloha = Math.round(spolu * ZALOHA_PODIEL * 100) / 100;
  const doZdarma = Math.max(0, DOPRAVA_ZDARMA_OD - suma);
  const pokrok = Math.min(100, (suma / DOPRAVA_ZDARMA_OD) * 100);
  const potrebnaAdresa = dorucenie === "kurier";

  const mozeOdoslat =
    f.meno.trim().length > 1 &&
    /.+@.+\..+/.test(f.email) &&
    (!potrebnaAdresa || (f.ulica.trim() && f.mesto.trim() && f.psc.trim())) &&
    polozky.length > 0 &&
    suhlasOP;

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

  // QR platby sa kreslia až po prijatí objednávky — SK aj CZ formát
  useEffect(() => {
    if (!hotovo?.pbs && !hotovo?.spd) return;
    import("qrcode").then((q) => {
      if (hotovo.pbs)
        q.toDataURL(hotovo.pbs, { width: 232, margin: 1 }).then(setQr).catch(() => null);
      if (hotovo.spd)
        q.toDataURL(hotovo.spd, { width: 232, margin: 1 }).then(setQrCz).catch(() => null);
    });
  }, [hotovo]);

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
          platba: "Záloha 30 % prevodom, zvyšok pri prevzatí",
          ...f,
        }),
      });
      const data = await res.json();
      if (!res.ok && !data?.cislo) throw new Error();
      setHotovo(data as Hotovo);
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
          Výrobu spúšťame po uhradení zálohy — zvyšok zaplatíte pri prevzatí.
        </p>

        {typeof hotovo.zaloha === "number" && hotovo.zaloha > 0 && (
          <div className="kos__zaloha">
            <div className="kos__zaloha-head">
              <span>Záloha na úhradu</span>
              <b>{eur(hotovo.zaloha)}</b>
            </div>
            {hotovo.iban ? (
              <>
                <div className="kos__zaloha-banky" role="tablist" aria-label="Krajina banky">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={banka === "sk"}
                    className={banka === "sk" ? "is-on" : ""}
                    onClick={() => setBanka("sk")}
                  >
                    🇸🇰 Slovenská banka
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={banka === "cz"}
                    className={banka === "cz" ? "is-on" : ""}
                    onClick={() => setBanka("cz")}
                  >
                    🇨🇿 Česká banka
                  </button>
                </div>
                <div className="kos__zaloha-telo">
                  {(banka === "sk" ? qr : qrCz) && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      className="kos__zaloha-qr"
                      src={banka === "sk" ? qr : qrCz}
                      alt={banka === "sk" ? "QR platba (Pay by Square)" : "QR Platba pre české banky"}
                    />
                  )}
                  <div className="kos__zaloha-udaje">
                    <p className="kos__zaloha-tip">
                      {banka === "sk"
                        ? "Naskenujte QR kód v aplikácii svojej banky — suma, účet aj symbol sa vyplnia samy."
                        : "QR vo formáte českej QR Platby — naskenuje ho aplikácia každej českej banky a prenesie aj variabilný symbol. Platba odíde ako bežná europlatba (SEPA) v eurách."}
                    </p>
                    <dl>
                      <Udaj
                        nazov="IBAN"
                        hodnota={hotovo.iban.replace(/(.{4})/g, "$1 ").trim()}
                        kopiruj={hotovo.iban}
                      />
                      <Udaj nazov="Variabilný symbol" hodnota={hotovo.vs ?? ""} />
                      <Udaj nazov="Suma" hodnota={eur(hotovo.zaloha)} kopiruj={hotovo.zaloha.toFixed(2)} />
                      <Udaj nazov="Poznámka" hodnota={`Zaloha ${hotovo.cislo}`} />
                    </dl>
                    {banka === "cz" && (
                      <p className="kos__zaloha-sepa">
                        Platíte ručne cez SEPA prevod? Pole na variabilný symbol tam
                        nie je — do správy pre príjemcu napíšte{" "}
                        <b>/VS{hotovo.vs}/</b> alebo číslo objednávky. Platbu
                        spárujeme.
                      </p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <p className="kos__zaloha-tip">
                Platobné údaje k zálohe vám pošleme e-mailom spolu s potvrdením
                termínu.
              </p>
            )}
            {typeof hotovo.doplatok === "number" && (
              <p className="kos__zaloha-doplatok">
                Zvyšok <b>{eur(hotovo.doplatok)}</b> zaplatíte pri prevzatí — v
                hotovosti alebo kartou.
              </p>
            )}
          </div>
        )}

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
          potvrdíme do 24 hodín a vopred sa platí len 30 % záloha.
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
          <div className="kos__platba-model">
            <div className="kos__platba-faza">
              <span className="kos__platba-podiel">30 %</span>
              <span className="kos__platba-telo">
                <strong>Záloha po objednaní</strong>
                <span>
                  Prevodom — QR kód a platobné údaje dostanete hneď po odoslaní
                  objednávky. Výroba sa spúšťa po jej uhradení.
                </span>
              </span>
              <b className="kos__platba-suma">{eur(zaloha)}</b>
            </div>
            <div className="kos__platba-faza">
              <span className="kos__platba-podiel">70 %</span>
              <span className="kos__platba-telo">
                <strong>Zvyšok pri prevzatí</strong>
                <span>V hotovosti alebo kartou pri doručení či osobnom odbere.</span>
              </span>
              <b className="kos__platba-suma">{eur(spolu - zaloha)}</b>
            </div>
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
          <div className="kos__sumrow kos__sumrow--zaloha">
            <span>Záloha dnes (30 %)</span>
            <b>{eur(zaloha)}</b>
          </div>
          <div className="kos__sumrow kos__sumrow--doplatok">
            <span>Pri prevzatí</span>
            <b>{eur(spolu - zaloha)}</b>
          </div>

          {chyba && <p className="kos__chyba">{chyba}</p>}

          <label className="kos__suhlas">
            <input
              type="checkbox"
              checked={suhlasOP}
              onChange={(e) => setSuhlasOP(e.target.checked)}
            />
            <span>
              Súhlasím s <Link href="/obchodne-podmienky">obchodnými podmienkami</Link> a
              beriem na vedomie{" "}
              <Link href="/ochrana-osobnych-udajov">spracúvanie osobných údajov</Link>.
            </span>
          </label>

          <button type="submit" className="btn-cyan kos__odoslat" disabled={!mozeOdoslat || odosielam}>
            {odosielam ? "ODOSIELAM…" : "ZÁVÄZNE OBJEDNAŤ"} <span aria-hidden>→</span>
          </button>
          {!mozeOdoslat && (
            <p className="kos__hint">Vyplňte označené polia nižšie a môžeme to poslať.</p>
          )}

          <ul className="kos__istoty">
            <li>
              <b>Vopred len záloha 30 %</b>
              Zvyšok až pri prevzatí tovaru.
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
