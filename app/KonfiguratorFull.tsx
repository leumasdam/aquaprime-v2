"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Turntable from "./Turntable";
import CabinetPreview, { type PreviewTank } from "./CabinetPreview";
import Swatch from "./Swatch";
import { AQUARIUMS } from "./aquariums";
import {
  CFG_SIZES,
  CFG_TIERS,
  deeperOption,
  ledOf,
  priceOf,
  productFor,
  suggestTank,
  tankLoadKg,
  toCfgDecor,
} from "./configurator-logic";
import { posliDopyt } from "./send-dopyt";
import type { Tier } from "./products";
import { dvierkaPreSirku } from "./cabinet-construction";
import { dekorNazov, odkaz, radText, type Jazyk } from "./jazyk";
import { SLOVNIKY } from "./preklady";

/* Kolieska nikdy neboli súčasťou výrobku (audit 11. 9. 2026) — skrinka má
   nastaviteľné nožičky, bez výberu a bez príplatku. */
const FEET = [{ id: "steel", name: "Nastaviteľné nožičky", prem: 0 }] as const;

const OWNER_EMAIL = "ahoj@aquaprime.sk";

export default function KonfiguratorFull({ jazyk = "sk" }: { jazyk?: Jazyk }) {
  const t = SLOVNIKY[jazyk].konfigurator;
  const l = (h: string) => odkaz(h, jazyk);
  // predvoľba z mini-konfigurátora na homepage (?rad=&rozmer=&dekor=)
  const [tier, setTier] = useState<Tier>("premium");
  const [sizeKey, setSizeKey] = useState(CFG_SIZES[0].key);
  const [decorId, setDecorId] = useState<string | null>(null);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const rad = q.get("rad");
    const rozmer = q.get("rozmer");
    const dekor = q.get("dekor");
    if (rad && ["basic", "standard", "premium"].includes(rad)) setTier(rad as Tier);
    if (rozmer && CFG_SIZES.some((s) => s.key === rozmer)) setSizeKey(rozmer);
    if (dekor) setDecorId(dekor);
  }, []);
  const [feet, setFeet] = useState<(typeof FEET)[number]>(FEET[0]);
  const [led, setLed] = useState(false);
  const [ledFarba, setLedFarba] = useState<"zlta" | "modra">("zlta");
  const [withTank, setWithTank] = useState(false);
  const [tankSlug, setTankSlug] = useState<string | null>(null);
  const [requestedView, setView] = useState<"foto" | "skica" | "3d">("foto");
  const [showKontakt, setShowKontakt] = useState(false);
  const [kontakt, setKontakt] = useState({ meno: "", email: "", tel: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [delivered, setDelivered] = useState(false);
  const kontaktOk =
    kontakt.meno.trim().length > 1 && /.+@.+\..+/.test(kontakt.email);

  const size = CFG_SIZES.find((s) => s.key === sizeKey)!;
  const product = productFor(tier, size)!;
  const { w, d, h } = size;
  // The fixed 3D sample has two doors; never show it for a three-panel selection.
  const view = requestedView === "3d" && w >= 120 ? "skica" : requestedView;

  // dekor sa drží naprieč zmenou radu, len ak ho daný produkt naozaj má;
  // bez voľby ukáž najlepšie zdokumentovaný — vlastná fotka pred fotkou inej
  // dĺžky, tá pred fotkou iného radu
  const decor =
    product.decors.find((x) => x.id === decorId) ??
    product.decors.find((x) => !x.inherited) ??
    product.decors.find((x) => x.illuFrom === "rozmer") ??
    product.decors[0];
  const cfgDecor = toCfgDecor(decor);

  const ledPrem = ledOf(product);
  const ledOn = led && ledPrem !== null;
  const total = priceOf(product, ledOn) + feet.prem;

  /* ---- akvárium podľa pôdorysu skrinky ---- */
  const match = suggestTank(w, d);
  const picked = tankSlug ? AQUARIUMS.find((a) => a.slug === tankSlug) : null;
  const pickedFits = !!picked && picked.w <= w && picked.d <= d;
  const chosen = pickedFits ? picked : match.best;
  const droppedPick = !!picked && !pickedFits;
  const tankOnStage: PreviewTank =
    withTank && chosen
      ? { w: chosen.w, d: chosen.d, h: chosen.h, liters: chosen.liters }
      : null;
  const liters = chosen?.liters ?? 0;
  const loadKg = tankLoadKg(liters);
  const deeper = deeperOption(w, d);
  const tankPrice = chosen?.priceValue ?? null;

  const diffs = chosen
    ? [
        w - chosen.w > 0 ? `o ${w - chosen.w} cm širšia` : null,
        d - chosen.d > 0 ? `o ${d - chosen.d} cm hlbšia` : null,
      ].filter(Boolean)
    : [];
  const fitNote = !chosen
    ? ""
    : diffs.length === 0
      ? t.podorysSedi
      : `Skrinka je ${diffs.join(" a ")} než nádrž — akvárium nikdy nesmie pretŕčať cez rám.`;

  /* Keď je LED zapnuté, náhľad má ukázať podsvietenú skrinku — presne tie isté
     vizualizácie, aké sú na karte v katalógu aj na detaile produktu. Nie každý
     dekor ich má nafotené; vtedy zostáva bežná fotka a text to povie. */
  const ledFotky = ledOn ? (decor.led?.[ledFarba] ?? decor.led?.zlta ?? decor.led?.modra ?? []) : [];
  const ledFarby = ([
    { id: "zlta", label: t.teplaBiela, bodka: "#ffd9a0" },
    { id: "modra", label: t.modra, bodka: "#5fb8ff" },
  ] as const).filter((f) => decor.led?.[f.id]?.length);
  const ledNahlad = ledFotky.length > 0;
  /* illuIdx označuje konkrétne prevzaté zábery — keď prvý z nich nie je
     titulný, štítok „ilustračné" na náhľade nepatrí */
  const prevzataPrva = decor.illuIdx ? decor.illuIdx.includes(0) : Boolean(decor.inherited);
  const foto = useMemo(
    () => (ledFotky.length ? ledFotky[0] : decor.images[0]),
    [decor, ledFotky]
  );

  const zapnutNadrz = (on: boolean) => {
    setWithTank(on);
    // fotka zostavu s nádržou ukázať nevie — skica áno
    if (on && view === "foto") setView("skica");
  };

  const dopyt = async () => {
    if (sending) return;
    setSending(true);
    const lines = [
      "Konfigurácia z konfigurátora AQUAPRIME",
      "",
      `Produkt: ${product.name}`,
      `Rad: ${product.tierLabel} — ${product.tierNote}`,
      `Rozmer: ${product.dim}`,
      `Dekor: ${decor.name}`,
      `Nožičky: nastaviteľné (vyrovnanie pri osadení)`,
      `LED podsvietenie: ${ledOn ? "áno" : "nie"}`,
      `Cena skrinky: ${total} €`,
    ];
    if (withTank && chosen) {
      lines.push(
        "",
        `Akvárium: ${chosen.name} cm (${chosen.vol}) — ${chosen.priceLabel}`,
        `Odhad zaťaženia zostavy: ~${loadKg} kg (orientačný výpočet)`,
        `Spolu: ${total + (tankPrice ?? 0)} €`
      );
    }
    // konfigurácia sa odosiela ako nezáväzný dopyt — priamo do schránky, nie cez mailto
    const ok = await posliDopyt(
      {
        tema: `Konfigurácia ${product.tierLabel}`,
        meno: kontakt.meno,
        email: kontakt.email,
        tel: kontakt.tel,
        rozmer: product.dim,
        sprava: lines.slice(2).join("\n"),
      },
      {
        komu: OWNER_EMAIL,
        predmet: `Konfigurácia ${product.name} — AQUAPRIME`,
        telo: lines.join("\n"),
      }
    );
    setDelivered(ok);
    setSending(false);
    setSent(true);
  };

  return (
    <div className="kfx">
      {/* ĽAVÁ karta — vyhotovenie, rozmer */}
      <div className="kfx__card kfx__card--left" data-reveal="left">
        <div className="kfx__group">
          <span className="kfx__legend">
            <span className="kfx__n">01</span> {t.krok1}
          </span>
          <div className="kfx__tiers">
            {CFG_TIERS.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`kfx__tier${tier === t.id ? " is-on" : ""}`}
                onClick={() => setTier(t.id)}
              >
                <strong>{radText(t.label, jazyk)}</strong>
                <span>{SLOVNIKY[jazyk].spolocne.radPoznamky[t.id]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="kfx__group">
          <span className="kfx__legend">
            <span className="kfx__n">02</span> {t.krok2}
          </span>
          <div className="kfx__sizes">
            {CFG_SIZES.map((s) => (
              <button
                key={s.key}
                type="button"
                className={`kfx__size${sizeKey === s.key ? " is-on" : ""}`}
                onClick={() => setSizeKey(s.key)}
              >
                {s.label}
                <em>cm</em>
              </button>
            ))}
          </div>
          <p className="kfx__note">
            {t.rozmerPozn1}{" "}
            <Link href={l("/dopyt")}>{t.rozmerOdkaz}</Link> {t.rozmerPozn2}
          </p>
        </div>

      </div>

      {/* STRED — fotka z katalógu, skica alebo 3D */}
      <div className="kfx__stage" data-reveal="scale">
        <div className="kfx__glow" />
        <div className="kfx__toggle">
          {(["foto", "skica", "3d"] as const).filter(v => v !== "3d" || w < 120).map((v) => (
            <button
              key={v}
              className={view === v ? "is-on" : ""}
              onClick={() => setView(v)}
              type="button"
            >
              {v === "foto" ? t.zobrazenieFoto : v === "skica" ? t.zobrazenieSkica : t.zobrazenie3d}
            </button>
          ))}
        </div>
        <span className="kfx__dimtag">
          {product.dim}
          {withTank && chosen && <em> + akvárium {chosen.dim}</em>}
        </span>
        <div className="kfx__model">
          {view === "foto" ? (
            <div className="kfx__shot">
              <Image
                key={foto}
                src={foto}
                alt={`${radText(product.name, jazyk)} — ${SLOVNIKY[jazyk].spolocne.altDekor} ${dekorNazov(decor.name, jazyk)}`}
                fill
                sizes="(max-width: 980px) 92vw, 46vw"
                priority
              />
              {ledNahlad ? (
                <span className="pgal__illu pgal__illu--led">{t.stitokLed}</span>
              ) : (
                prevzataPrva &&
                (decor.illuFrom === "schema" ? (
                  <span className="pgal__illu">{t.stitokSchema}</span>
                ) : decor.illuFrom === "rad" ? (
                  <span className="pgal__illu">{t.stitokRad}</span>
                ) : decor.illuFrom === "dvierka" ? (
                  <span className="pgal__illu">
                    {t.stitokDvierka.replace("{n}", String(decor.illuDvierka))}
                  </span>
                ) : (
                  <span className="pgal__illu pgal__illu--size">
                    {decor.illuSize
                      ? t.stitokRozmer.replace("{rozmer}", decor.illuSize)
                      : t.stitokInyRozmer}
                  </span>
                ))
              )}
            </div>
          ) : view === "skica" ? (
            <CabinetPreview
              jazyk={jazyk}
              w={w}
              h={h}
              d={d}
              tier={tier}
              decor={cfgDecor}
              feet={feet.id}
              led={ledOn}
              tank={tankOnStage}
            />
          ) : (
            <Turntable jazyk={jazyk} />
          )}
        </div>
        <p className="kfx__stagenote">
          {view === "foto"
            ? ledNahlad
              ? t.poznLed.replace("{dekor}", dekorNazov(decor.name, jazyk))
              : ledOn
                ? t.poznLedChyba
                : decor.illuFrom === "schema"
              ? t.poznSchema
              : !prevzataPrva
              ? t.poznFoto
              : decor.illuFrom === "rad"
                ? t.poznRad
                : decor.illuFrom === "dvierka"
                ? t.poznDvierka
                    .replace("{n}", String(decor.illuDvierka))
                    .replace("{m}", String(dvierkaPreSirku(w)))
                : t.poznRozmer.replace("{rozmer}", decor.illuSize ?? "")
            : view === "skica"
              ? withTank
                ? t.poznSkicaNadrz
                : t.poznSkica
              : t.pozn3d}
        </p>
      </div>

      {/* PRAVÁ karta — dekor, LED, akvárium, cena */}
      <div className="kfx__card kfx__card--right" data-reveal>
        <div className="kfx__group">
          <span className="kfx__legend">
            <span className="kfx__n">03</span> {t.krok3}
            <em>{product.decors.length} {t.dekorPocet}</em>
          </span>
          <div className="kfx__swatches">
            {product.decors.map((c) => (
              <button
                key={c.id}
                className={`kfx__sw${decor.id === c.id ? " is-on" : ""}`}
                aria-label={dekorNazov(c.name, jazyk)}
                title={dekorNazov(c.name, jazyk)}
                onClick={() => setDecorId(c.id)}
                type="button"
              >
                <Swatch swatch={c.swatch} />
              </button>
            ))}
          </div>
          <span className="kfx__pick">{dekorNazov(decor.name, jazyk)}</span>
        </div>

        <div className="kfx__group">
          <span className="kfx__legend">
            <span className="kfx__n">04</span> {t.krok4}
          </span>
          {ledPrem === null ? (
            <p className="kfx__note">
              {t.ledBasic}
            </p>
          ) : (
            <div className="kfx__opts">
              <button
                type="button"
                className={`kfx__opt${!led ? " is-on" : ""}`}
                onClick={() => setLed(false)}
              >
                {t.bezLed}
              </button>
              <button
                type="button"
                className={`kfx__opt${led ? " is-on" : ""}`}
                onClick={() => setLed(true)}
              >
                {t.sLed} <em> +{ledPrem} €</em>
              </button>
            </div>
          )}
          {ledOn && ledFarby.length > 1 && (
            <div className="kfx__opts kfx__opts--led" role="group" aria-label={t.ledFarba}>
              {ledFarby.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={`kfx__opt${ledFarba === f.id ? " is-on" : ""}`}
                  onClick={() => setLedFarba(f.id)}
                >
                  <span className="pgal__ledbod" style={{ background: f.bodka }} aria-hidden />
                  {f.label}
                </button>
              ))}
            </div>
          )}
          {ledOn && !ledNahlad && (
            <p className="kfx__note">
              {t.ledNenafotene}
            </p>
          )}
        </div>

        <div className="kfx__group">
          <span className="kfx__legend">
            <span className="kfx__n">05</span> {t.krok5}
          </span>
          <div className="kfx__opts">
            <button
              type="button"
              className={`kfx__opt${!withTank ? " is-on" : ""}`}
              onClick={() => zapnutNadrz(false)}
            >
              {t.lenSkrinka}
            </button>
            <button
              type="button"
              className={`kfx__opt${withTank ? " is-on" : ""}`}
              onClick={() => zapnutNadrz(true)}
            >
              {t.sNadrzou}
            </button>
          </div>

          {withTank && chosen && (
            <div className="kfx__tank">
              <div className="kfx__tank-head">
                <span className="kfx__tank-tag">
                  {tankSlug && pickedFits ? t.vybrane : t.odporucame}
                </span>
                <strong>{chosen.name} cm</strong>
                <span className="kfx__tank-vol">{chosen.vol}</span>
              </div>

              <label className="kfx__selectwrap">
                <select
                  className="kfx__select"
                  aria-label={t.inaNadrz}
                  value={chosen.slug}
                  onChange={(e) => setTankSlug(e.target.value)}
                >
                  {match.fits.map((a) => (
                    <option key={a.slug} value={a.slug}>
                      {a.name} cm — {a.vol} — {a.priceLabel}
                    </option>
                  ))}
                </select>
              </label>

              <div className="kfx__load">
                <div className="kfx__load-top">
                  <span>{t.odhadZatazenia}</span>
                  <b>~{loadKg} kg</b>
                </div>
              </div>

              {/* kompaktne: jedna veta, zvyšok v title — panel nemá naťahovať stránku */}
              <p
                className="kfx__note kfx__note--tight"
                title={[
                  fitNote,
                  droppedPick ? "Pôvodne vybraná nádrž sa už na tento pôdorys nezmestí, tak ukazujem odporúčanú." : "",
                  deeper ? `Pri hĺbke ${deeper.d} cm by sa zmestilo akvárium ${deeper.dim} (${deeper.vol}).` : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {droppedPick
                  ? t.nadrzNezmesti
                  : match.exact
                    ? t.podorysSedi
                    : fitNote}
                {deeper && !droppedPick && (
                  <>
                    {" "}
                    {t.hlbsia.replace("{d}", String(deeper.d)).replace("{dim}", deeper.dim)}
                  </>
                )}
              </p>
            </div>
          )}
        </div>

        <div className="kfx__sum">
          <div className="kfx__sumrow">
            <span>{t.skrinka}</span>
            <b>{total.toLocaleString("sk-SK")} €</b>
          </div>
          {withTank && chosen && (
            <>
              <div className="kfx__sumrow">
                <span>{t.akvarium}</span>
                <b>{chosen.priceLabel}</b>
              </div>
              <div className="kfx__sumrow kfx__sumrow--total">
                <span>{t.spolu}</span>
                <b>
                  {chosen.glass.length > 1 ? t.od : ""}
                  {(total + (tankPrice ?? 0)).toLocaleString("sk-SK")} €
                </b>
              </div>
            </>
          )}
          <span className="kfx__price-n">
            {t.cenaPozn}{" "}
            <Link href={l(`/skrinky/${product.slug}`)}>{t.detailSkrinky}</Link>
          </span>
        </div>
        {sent ? (
          <p className="kfx__done" role="status">
            <b>{delivered ? t.dopytOdoslany : t.dopytPripraveny}</b>
            {delivered
              ? t.dopytPrijaty
              : t.dopytKlient}
          </p>
        ) : !showKontakt ? (
          <button
            type="button"
            className="btn-cyan kfx__send"
            onClick={() => setShowKontakt(true)}
          >
            {t.poslat} <span aria-hidden>→</span>
          </button>
        ) : (
          <div className="kfx__kontakt">
            <span className="kfx__legend">
              <span className="kfx__n">07</span> Kam vám odpovedať
            </span>
            <input
              className="kfx__input"
              type="text"
              autoComplete="name"
              placeholder={t.meno}
              value={kontakt.meno}
              onChange={(e) => setKontakt({ ...kontakt, meno: e.target.value })}
              autoFocus
            />
            <input
              className="kfx__input"
              type="email"
              autoComplete="email"
              placeholder={t.email}
              value={kontakt.email}
              onChange={(e) => setKontakt({ ...kontakt, email: e.target.value })}
            />
            <input
              className="kfx__input"
              type="tel"
              autoComplete="tel"
              placeholder={t.telefon}
              value={kontakt.tel}
              onChange={(e) => setKontakt({ ...kontakt, tel: e.target.value })}
            />
            <button
              type="button"
              className="btn-cyan kfx__send"
              onClick={dopyt}
              disabled={!kontaktOk || sending}
            >
              {sending ? t.odosielam : t.poslat}{" "}
              <span aria-hidden>→</span>
            </button>
            <p className="kfx__note">
              {t.kopia}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
