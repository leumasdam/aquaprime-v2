"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { eur, useKosik, type PolozkaKosika } from "../kosik-store";
import { AQUARIUMS } from "../aquariums";
import { cenaEur, PRODUCTS } from "../products";
import { suggestTank } from "../configurator-logic";
import { odkaz, type Jazyk } from "../jazyk";
import { SLOVNIKY } from "../preklady";

const DOPRAVA_ZDARMA_OD = 500;
const KURIER = 39;

/** poradie musí sedieť so zoznamom `dorucenie` v slovníku */
const DORUCENIE = [
  { id: "kurier", cena: KURIER },
  { id: "odber", cena: 0 },
] as const;

/** Platobný model: 30 % záloha po objednaní, zvyšok pri prevzatí. */
const ZALOHA_PODIEL = 0.3;

/**
 * Ako zákazník uhradí zálohu. Prevod ostáva — časť zákazníkov ho chce
 * a QR kódy k nemu už máme; karta rieši najmä platby z Česka, kde sa pri
 * ručnom SEPA prevode strácal variabilný symbol.
 */
const SPOSOBY = [
  {
    id: "karta",
    ikona: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
        <path d="M2.5 9.5h19" />
        <path d="M6 14.5h3.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "prevod",
    ikona: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <rect x="3.5" y="3.5" width="7" height="7" rx="1" />
        <rect x="13.5" y="3.5" width="7" height="7" rx="1" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="1" />
        <path d="M13.5 13.5h3v3M20.5 16.5v4M16.5 20.5h1" strokeLinecap="round" />
      </svg>
    ),
  },
] as const;

type Sposob = (typeof SPOSOBY)[number]["id"];

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
function Udaj({
  nazov,
  hodnota,
  kopiruj,
  kopirovat,
}: {
  nazov: string;
  hodnota: string;
  kopiruj?: string;
  kopirovat: string;
}) {
  const [ok, setOk] = useState(false);
  return (
    <div>
      <dt>{nazov}</dt>
      <dd>
        {hodnota}
        <button
          type="button"
          className={`kos__kopir${ok ? " is-ok" : ""}`}
          aria-label={`${kopirovat} ${nazov}`}
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

export default function KosikObsah({ jazyk = "sk" }: { jazyk?: Jazyk }) {
  const t = SLOVNIKY[jazyk].kosik;
  const l = (h: string) => odkaz(h, jazyk);
  const { polozky, suma, pocet, zmenPocet, uber, vyprazdni, pridaj, pripravene } =
    useKosik();
  const [dorucenie, setDorucenie] = useState<(typeof DORUCENIE)[number]["id"]>("kurier");
  /* Kým nevieme, či je brána zapnutá, držíme prevod — ten funguje vždy.
     Dlaždice s výberom sa ukážu, až keď karta naozaj je k dispozícii. */
  const [sposob, setSposob] = useState<Sposob>("prevod");
  const [kartaMozna, setKartaMozna] = useState(false);
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
      d.toLocaleDateString(jazyk === "en" ? "en-GB" : "sk-SK", {
        day: "numeric",
        month: "long",
      });
    const od = new Date();
    od.setDate(od.getDate() + 14);
    const doo = new Date();
    doo.setDate(doo.getDate() + 21);
    setTermin(`${f2(od)} – ${f2(doo)}`);
  }, [jazyk]);

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
        const tank = suggestTank(prod.w, prod.d).best;
        if (tank && !vKosiku.has(`akvarium:${tank.slug}`)) {
          out.push({
            id: `akvarium-${tank.slug}-${tank.glass[0].mm}`,
            druh: "akvarium",
            slug: tank.slug,
            nazov: `${tank.name} cm`,
            variant: `${tank.vol} · ${t.navrhSadne} ${prod.dim}`,
            cena: tank.priceValue,
            obrazok: tank.cover,
            ks: 1,
          });
        }
      } else {
        const akv = AQUARIUMS.find((x) => x.slug === p.slug);
        if (!akv) continue;
        const skr = PRODUCTS.filter((x) => x.w === akv.w && cenaEur(x) !== null).sort(
          (a, b) =>
            Number(a.price.replace(/\D/g, "")) - Number(b.price.replace(/\D/g, ""))
        )[0];
        if (skr && !vKosiku.has(`skrinka:${skr.slug}`)) {
          out.push({
            id: `skrinka-${skr.slug}-${skr.decors[0].id}`,
            druh: "skrinka",
            slug: skr.slug,
            nazov: skr.name,
            variant: `${skr.dim} · ${t.navrhUnesie} ${akv.vol} ${t.navrhVody}`,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [polozky, jazyk]);

  // je platobná brána nastavená? bez kľúčov ostáva len prevod
  useEffect(() => {
    fetch("/api/platba")
      .then((r) => r.json())
      .then((d) => {
        if (!d?.karta) return;
        setKartaMozna(true);
        setSposob("karta");
      })
      .catch(() => null);
  }, []);

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
          dorucenie: t.dorucenie[dorucenie === "kurier" ? 0 : 1][0],
          platba: sposob === "karta" ? t.platbaKarta : t.platbaPrevod,
          ...f,
        }),
      });
      const data = await res.json();
      if (!res.ok && !data?.cislo) throw new Error();

      /* Objednávka je prijatá — až potom platba. Keby brána zlyhala, zákazník
         nepríde o objednávku a zálohu doplatí prevodom podľa e-mailu. */
      if (sposob === "karta") {
        const p = await fetch("/api/platba", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cislo: data.cislo,
            email: f.email,
            dorucenie,
            polozky: polozky.map((x) => ({ slug: x.slug, druh: x.druh, ks: x.ks })),
          }),
        }).then((r) => r.json()).catch(() => null);

        if (p?.ok && p.url) {
          vyprazdni();
          window.location.href = p.url;
          return;
        }
        // brána nedostupná — pokračujeme prevodom, nech objednávka nezostane visieť
        setChyba(t.chybaBrana);
      }

      setHotovo(data as Hotovo);
      vyprazdni();
    } catch {
      setChyba(t.chybaOdoslanie);
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
        <h2 className="kos__done-title">{t.hotovoTitul}</h2>
        <p className="kos__done-cislo">{hotovo.cislo}</p>
        <p className="kos__done-body">
          {hotovo.mailom ? t.hotovoMailom : t.hotovoBezMailu} {t.hotovoVyroba}
        </p>

        {typeof hotovo.zaloha === "number" && hotovo.zaloha > 0 && (
          <div className="kos__zaloha">
            <div className="kos__zaloha-head">
              <span>{t.zalohaNaUhradu}</span>
              <b>{eur(hotovo.zaloha)}</b>
            </div>
            {hotovo.iban ? (
              <>
                <div className="kos__zaloha-banky" role="tablist" aria-label={t.krajinaBanky}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={banka === "sk"}
                    className={banka === "sk" ? "is-on" : ""}
                    onClick={() => setBanka("sk")}
                  >
                    {t.bankaSk}
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={banka === "cz"}
                    className={banka === "cz" ? "is-on" : ""}
                    onClick={() => setBanka("cz")}
                  >
                    {t.bankaCz}
                  </button>
                </div>
                <div className="kos__zaloha-telo">
                  {(banka === "sk" ? qr : qrCz) && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      className="kos__zaloha-qr"
                      src={banka === "sk" ? qr : qrCz}
                      alt={banka === "sk" ? t.qrAltSk : t.qrAltCz}
                    />
                  )}
                  <div className="kos__zaloha-udaje">
                    <p className="kos__zaloha-tip">
                      {banka === "sk" ? t.qrTipSk : t.qrTipCz}
                    </p>
                    <dl>
                      <Udaj
                        nazov={t.iban}
                        hodnota={hotovo.iban.replace(/(.{4})/g, "$1 ").trim()}
                        kopiruj={hotovo.iban}
                        kopirovat={t.kopirovat}
                      />
                      <Udaj nazov={t.vs} hodnota={hotovo.vs ?? ""} kopirovat={t.kopirovat} />
                      <Udaj
                        nazov={t.suma}
                        hodnota={eur(hotovo.zaloha)}
                        kopiruj={hotovo.zaloha.toFixed(2)}
                        kopirovat={t.kopirovat}
                      />
                      <Udaj
                        nazov={t.poznamkaUdaj}
                        hodnota={`${t.poznamkaZaloha} ${hotovo.cislo}`}
                        kopirovat={t.kopirovat}
                      />
                    </dl>
                    {banka === "cz" && (
                      <p className="kos__zaloha-sepa">
                        {t.sepaA} <b>/VS{hotovo.vs}/</b> {t.sepaB}
                      </p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <p className="kos__zaloha-tip">{t.udajeMailom}</p>
            )}
            {typeof hotovo.doplatok === "number" && (
              <p className="kos__zaloha-doplatok">
                {t.doplatokA} <b>{eur(hotovo.doplatok)}</b> {t.doplatokB}
              </p>
            )}
          </div>
        )}

        <div className="kos__done-akcie">
          <Link href={l("/")} className="btn-cyan">
            {t.spatNaUvod}
          </Link>
          <Link href={l("/skrinky")} className="btn-outline">
            {t.pokracovat}
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
        <h2>{t.prazdnyTitul}</h2>
        <p>{t.prazdnyText}</p>
        <div className="kos__prazdny-akcie">
          <Link href={l("/skrinky")} className="btn-cyan">
            {t.prezrietSkrinky} <span aria-hidden>→</span>
          </Link>
          <Link href={l("/akvaria")} className="btn-outline">
            {t.prezrietAkvaria} <span aria-hidden>→</span>
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
            <h2>{t.blok1}</h2>
            <span className="kos__blok-meta">
              {pocet} {t.ks}
            </span>
          </header>

          <div className="kos__items">
            {polozky.map((p) => (
              <article className="kos__item" key={p.id}>
                <div className="kos__item-foto">
                  <Image src={p.obrazok} alt="" fill sizes="120px" />
                </div>
                <div className="kos__item-info">
                  <Link
                    href={l(
                      p.druh === "skrinka" ? `/skrinky/${p.slug}` : `/akvaria/${p.slug}`
                    )}
                    className="kos__item-nazov"
                  >
                    {p.nazov}
                  </Link>
                  <span className="kos__chip">{p.variant}</span>
                  <span className="kos__item-jedn">
                    {eur(p.cena)} {t.naKus}
                  </span>
                </div>
                <div className="kos__stepper">
                  <button type="button" onClick={() => zmenPocet(p.id, p.ks - 1)} aria-label={t.menej}>
                    −
                  </button>
                  <span>{p.ks}</span>
                  <button type="button" onClick={() => zmenPocet(p.id, p.ks + 1)} aria-label={t.viac}>
                    +
                  </button>
                </div>
                <div className="kos__item-cena">
                  <b>{eur(p.cena * p.ks)}</b>
                  <button type="button" className="kos__zmaz" onClick={() => uber(p.id)}>
                    {t.odstranit}
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
              <h2>{t.navrhTitul}</h2>
              <span className="kos__blok-meta">{t.navrhMeta}</span>
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
                      {t.pridat}
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
            <h2>{t.blok2}</h2>
          </header>
          <div className="kos__volby">
            {DORUCENIE.map((d, i) => (
              <label key={d.id} className={`kos__volba${dorucenie === d.id ? " is-on" : ""}`}>
                <input
                  type="radio"
                  name="dorucenie"
                  checked={dorucenie === d.id}
                  onChange={() => setDorucenie(d.id)}
                />
                <span className="kos__volba-telo">
                  <strong>{t.dorucenie[i][0]}</strong>
                  <span>{t.dorucenie[i][1]}</span>
                </span>
                <span className="kos__volba-cena">
                  {d.cena === 0 || suma >= DOPRAVA_ZDARMA_OD ? t.zdarma : eur(d.cena)}
                </span>
              </label>
            ))}
          </div>
          {termin && (
            <p className="kos__termin">
              <b>{t.terminTitul}</b> {termin} {t.terminText}
            </p>
          )}
        </section>

        {/* 03 platba */}
        <section className="kos__blok">
          <header className="kos__blok-head">
            <span className="kos__krok">03</span>
            <h2>{t.blok3}</h2>
          </header>
          <div className="kos__platba-model">
            <div className="kos__platba-faza">
              <span className="kos__platba-podiel">30 %</span>
              <span className="kos__platba-telo">
                <strong>{t.zalohaFaza}</strong>
                <span>{sposob === "karta" ? t.zalohaKarta : t.zalohaPrevod}</span>
              </span>
              <b className="kos__platba-suma">{eur(zaloha)}</b>
            </div>
            <div className="kos__platba-faza">
              <span className="kos__platba-podiel">70 %</span>
              <span className="kos__platba-telo">
                <strong>{t.doplatokFaza}</strong>
                <span>{t.doplatokFazaText}</span>
              </span>
              <b className="kos__platba-suma">{eur(spolu - zaloha)}</b>
            </div>
          </div>

          {kartaMozna && (
          <div className="kos__sposob" role="radiogroup" aria-label={t.sposobLabel}>
            {SPOSOBY.map((s, i) => (
              <button
                key={s.id}
                type="button"
                role="radio"
                aria-checked={sposob === s.id}
                className={`kos__sposob-volba${sposob === s.id ? " is-on" : ""}`}
                onClick={() => setSposob(s.id)}
              >
                <span className="kos__sposob-ico" aria-hidden>
                  {s.ikona}
                </span>
                <span className="kos__sposob-telo">
                  <strong>{t.sposoby[i][0]}</strong>
                  <span>{t.sposoby[i][1]}</span>
                </span>
              </button>
            ))}
          </div>
          )}
        </section>

        {/* 04 údaje */}
        <section className="kos__blok">
          <header className="kos__blok-head">
            <span className="kos__krok">04</span>
            <h2>{t.blok4}</h2>
          </header>
          <div className="kos__polia">
            <label className="kos__pole">
              <span>{t.poleMeno}</span>
              <input value={f.meno} onChange={(e) => set("meno", e.target.value)} autoComplete="name" required />
            </label>
            <label className="kos__pole">
              <span>{t.poleTel}</span>
              <input value={f.tel} onChange={(e) => set("tel", e.target.value)} autoComplete="tel" type="tel" placeholder="+421" />
            </label>
            <label className="kos__pole kos__pole--full">
              <span>{t.poleEmail}</span>
              <input value={f.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" type="email" required />
            </label>

            {potrebnaAdresa && (
              <>
                <label className="kos__pole kos__pole--full">
                  <span>{t.poleUlica}</span>
                  <input value={f.ulica} onChange={(e) => set("ulica", e.target.value)} autoComplete="street-address" required />
                </label>
                <label className="kos__pole">
                  <span>{t.poleMesto}</span>
                  <input value={f.mesto} onChange={(e) => set("mesto", e.target.value)} autoComplete="address-level2" required />
                </label>
                <label className="kos__pole">
                  <span>{t.polePsc}</span>
                  <input value={f.psc} onChange={(e) => set("psc", e.target.value)} autoComplete="postal-code" required />
                </label>
                <label className="kos__pole kos__pole--full">
                  <span>{t.polePoschodie}</span>
                  <input
                    value={f.poschodie}
                    onChange={(e) => set("poschodie", e.target.value)}
                    placeholder={t.polePoschodiePh}
                  />
                </label>
              </>
            )}

            <label className="kos__pole">
              <span>{t.poleFirma}</span>
              <input value={f.firma} onChange={(e) => set("firma", e.target.value)} />
            </label>
            <label className="kos__pole">
              <span>{t.poleIco}</span>
              <input value={f.ico} onChange={(e) => set("ico", e.target.value)} />
            </label>
            <label className="kos__pole kos__pole--full">
              <span>{t.polePoznamka}</span>
              <textarea
                rows={3}
                value={f.poznamka}
                onChange={(e) => set("poznamka", e.target.value)}
                placeholder={t.polePoznamkaPh}
              />
            </label>
          </div>
        </section>
      </div>

      {/* ============ SÚHRN ============ */}
      <aside className="kos__aside">
        <div className="kos__sum">
          <h2 className="kos__sum-title">{t.suhrnTitul}</h2>

          {doprava > 0 && (
            <div className="kos__zdarma">
              <div className="kos__zdarma-bar">
                <i style={{ width: `${pokrok}%` }} />
              </div>
              <span>
                {t.zdarmaChybaA} <b>{eur(doZdarma)}</b>
              </span>
            </div>
          )}

          <div className="kos__sumrow">
            <span>
              {t.tovar} ({pocet} {t.ks})
            </span>
            <b>{eur(suma)}</b>
          </div>
          <div className="kos__sumrow">
            <span>{t.doprava}</span>
            <b className={doprava === 0 ? "kos__zdarma-text" : ""}>
              {doprava === 0 ? t.zdarma : eur(doprava)}
            </b>
          </div>
          <div className="kos__sumrow kos__sumrow--total">
            <span>{t.spoluSDph}</span>
            <b>{eur(spolu)}</b>
          </div>
          <div className="kos__sumrow kos__sumrow--zaloha">
            <span>{t.zalohaDnes}</span>
            <b>{eur(zaloha)}</b>
          </div>
          <div className="kos__sumrow kos__sumrow--doplatok">
            <span>{t.priPrevzati}</span>
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
              {t.suhlasA}{" "}
              <Link href={l("/obchodne-podmienky")}>{t.suhlasOdkazOp}</Link> {t.suhlasB}{" "}
              <Link href={l("/ochrana-osobnych-udajov")}>{t.suhlasOdkazGdpr}</Link>.
            </span>
          </label>

          <button type="submit" className="btn-cyan kos__odoslat" disabled={!mozeOdoslat || odosielam}>
            {odosielam ? t.odosielam : t.objednat} <span aria-hidden>→</span>
          </button>
          {!mozeOdoslat && (
            <p className="kos__hint">{t.hint}</p>
          )}

          <ul className="kos__istoty">
            {t.istoty.map(([titul, popis]) => (
              <li key={titul}>
                <b>{titul}</b>
                {popis}
              </li>
            ))}
          </ul>

          <p className="kos__pomoc">
            {t.pomocA} <a href="mailto:patrikranda225@gmail.com">patrikranda225@gmail.com</a>{" "}
            {t.pomocB} <Link href={l("/kontakt")}>{t.pomocOdkaz}</Link>.
          </p>
        </div>
      </aside>
    </form>
  );
}
