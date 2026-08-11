"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { eur, useKosik } from "../kosik-store";

const DOPRAVA_ZDARMA_OD = 500;
const DOPRAVA = 39;

export default function KosikObsah() {
  const { polozky, suma, pocet, zmenPocet, uber, vyprazdni, pripravene } = useKosik();
  const [odosielam, setOdosielam] = useState(false);
  const [hotovo, setHotovo] = useState<null | { cislo: string; mailom: boolean }>(null);
  const [chyba, setChyba] = useState("");
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
  const doprava = suma >= DOPRAVA_ZDARMA_OD || suma === 0 ? 0 : DOPRAVA;
  const spolu = suma + doprava;
  const mozeOdoslat =
    f.meno.trim().length > 1 &&
    /.+@.+\..+/.test(f.email) &&
    f.ulica.trim() &&
    f.mesto.trim() &&
    f.psc.trim() &&
    polozky.length > 0;

  const odosli = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mozeOdoslat || odosielam) return;
    setOdosielam(true);
    setChyba("");
    try {
      const res = await fetch("/api/objednavka", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ polozky, suma, doprava, spolu, ...f }),
      });
      const data = await res.json();
      if (!res.ok && !data?.cislo) throw new Error(data?.error || "chyba");
      setHotovo({ cislo: data.cislo, mailom: !!data.mailom });
      vyprazdni();
    } catch {
      setChyba(
        "Objednávku sa nepodarilo odoslať. Skúste to o chvíľu znova, alebo nám napíšte na ahoj@aquaprime.sk."
      );
    } finally {
      setOdosielam(false);
    }
  };

  if (hotovo) {
    return (
      <div className="kos__done kcard" role="status">
        <div className="kos__done-ico" aria-hidden>
          ✓
        </div>
        <h2 className="kos__done-title">Objednávka prijatá</h2>
        <p className="kos__done-body">
          Číslo objednávky <b>{hotovo.cislo}</b>.{" "}
          {hotovo.mailom
            ? "Potvrdenie sme poslali na váš e-mail."
            : "Ozveme sa vám na uvedený kontakt."}{" "}
          Ozveme sa do 24 hodín v pracovný deň s potvrdením termínu a platobnými
          údajmi — nič neplatíte vopred.
        </p>
        <Link href="/" className="btn-outline">
          Späť na úvod
        </Link>
      </div>
    );
  }

  if (!pripravene) {
    return <p className="kos__prazdny kcard">Načítavam košík…</p>;
  }

  if (!polozky.length) {
    return (
      <div className="kos__prazdny kcard">
        <h2>Košík je prázdny</h2>
        <p>
          Vyberte si skrinku alebo nádrž — ceny sú cenníkové a objednávku
          potvrdíme do 24 hodín.
        </p>
        <div className="kos__prazdny-akcie">
          <Link href="/skrinky" className="btn-cyan">
            Skrinky <span aria-hidden>→</span>
          </Link>
          <Link href="/akvaria" className="btn-outline">
            Akváriá <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="kos__grid">
      {/* položky */}
      <div className="kos__polozky">
        {polozky.map((p) => (
          <div className="kcard kos__item" key={p.id}>
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
              <span className="kos__item-variant">{p.variant}</span>
              <button type="button" className="kos__zmaz" onClick={() => uber(p.id)}>
                Odstrániť
              </button>
            </div>
            <div className="kos__item-pocet">
              <button
                type="button"
                onClick={() => zmenPocet(p.id, p.ks - 1)}
                aria-label="Menej"
              >
                −
              </button>
              <span>{p.ks}</span>
              <button
                type="button"
                onClick={() => zmenPocet(p.id, p.ks + 1)}
                aria-label="Viac"
              >
                +
              </button>
            </div>
            <div className="kos__item-cena">{eur(p.cena * p.ks)}</div>
          </div>
        ))}
        <button type="button" className="kos__vyprazdni" onClick={vyprazdni}>
          Vyprázdniť košík
        </button>
      </div>

      {/* objednávka */}
      <form className="kos__form" onSubmit={odosli}>
        <div className="kcard kos__sum">
          <div className="kos__sumrow">
            <span>Medzisúčet ({pocet} ks)</span>
            <b>{eur(suma)}</b>
          </div>
          <div className="kos__sumrow">
            <span>Doprava</span>
            <b>{doprava === 0 ? "zdarma" : eur(doprava)}</b>
          </div>
          {doprava > 0 && (
            <p className="kos__note">
              Doprava zdarma od {eur(DOPRAVA_ZDARMA_OD)}. Pri veľkých nádržiach
              dohodneme vynesenie individuálne.
            </p>
          )}
          <div className="kos__sumrow kos__sumrow--total">
            <span>Spolu</span>
            <b>{eur(spolu)}</b>
          </div>
          <span className="kos__note">Ceny sú vrátane DPH.</span>
        </div>

        <div className="kcard kos__udaje">
          <h2 className="kos__h2">Doručenie</h2>
          <div className="kos__row">
            <label>
              <span>Meno a priezvisko</span>
              <input
                value={f.meno}
                onChange={(e) => set("meno", e.target.value)}
                autoComplete="name"
                required
              />
            </label>
            <label>
              <span>Telefón</span>
              <input
                value={f.tel}
                onChange={(e) => set("tel", e.target.value)}
                autoComplete="tel"
                type="tel"
              />
            </label>
          </div>
          <label>
            <span>E-mail</span>
            <input
              value={f.email}
              onChange={(e) => set("email", e.target.value)}
              autoComplete="email"
              type="email"
              required
            />
          </label>
          <label>
            <span>Ulica a číslo</span>
            <input
              value={f.ulica}
              onChange={(e) => set("ulica", e.target.value)}
              autoComplete="street-address"
              required
            />
          </label>
          <div className="kos__row">
            <label>
              <span>Mesto</span>
              <input
                value={f.mesto}
                onChange={(e) => set("mesto", e.target.value)}
                autoComplete="address-level2"
                required
              />
            </label>
            <label>
              <span>PSČ</span>
              <input
                value={f.psc}
                onChange={(e) => set("psc", e.target.value)}
                autoComplete="postal-code"
                required
              />
            </label>
          </div>
          <label>
            <span>Poschodie a výťah — pomôže nám pri doprave</span>
            <input
              value={f.poschodie}
              onChange={(e) => set("poschodie", e.target.value)}
              placeholder="napr. 3. poschodie, výťah je"
            />
          </label>
          <div className="kos__row">
            <label>
              <span>Firma — nepovinné</span>
              <input value={f.firma} onChange={(e) => set("firma", e.target.value)} />
            </label>
            <label>
              <span>IČO — nepovinné</span>
              <input value={f.ico} onChange={(e) => set("ico", e.target.value)} />
            </label>
          </div>
          <label>
            <span>Poznámka</span>
            <textarea
              rows={3}
              value={f.poznamka}
              onChange={(e) => set("poznamka", e.target.value)}
              placeholder="Termín, špecifické želanie…"
            />
          </label>
        </div>

        <div className="kcard kos__platba">
          <h2 className="kos__h2">Platba</h2>
          <p className="kos__note">
            Objednávku potvrdíme do 24 hodín v pracovný deň a pošleme platobné
            údaje. <b>Nič neplatíte vopred</b> — platí sa až po odsúhlasení
            termínu, prevodom na účet.
          </p>
        </div>

        {chyba && <p className="kos__chyba">{chyba}</p>}

        <button
          type="submit"
          className="btn-cyan kos__odoslat"
          disabled={!mozeOdoslat || odosielam}
        >
          {odosielam ? "ODOSIELAM…" : "ZÁVÄZNE OBJEDNAŤ"} <span aria-hidden>→</span>
        </button>
        <p className="kos__note">
          Odoslaním súhlasíte so spracovaním údajov za účelom vybavenia
          objednávky.
        </p>
      </form>
    </div>
  );
}
