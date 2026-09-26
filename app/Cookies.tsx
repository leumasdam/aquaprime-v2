"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { odkaz, type Jazyk } from "./jazyk";
import { SLOVNIKY } from "./preklady";
import { precitaj, UDALOST, zapis } from "./suhlas";

/**
 * Lišta so súhlasom s cookies.
 *
 * Nabehne až po načítaní stránky, zdola, a kým v nej návštevník nerozhodne,
 * nenačíta sa žiadny merací skript. V prvej vrstve je „Prijať všetko"
 * a „Prispôsobiť"; odmietnutie je v rozbalených nastaveniach vedľa
 * uloženia výberu.
 *
 * Nastavenia sa dajú kedykoľvek otvoriť znova odkazom v pätičke, ktorý
 * pošle udalosť „aq-cookies-otvor".
 */
export default function Cookies({ jazyk = "sk" }: { jazyk?: Jazyk }) {
  const t = SLOVNIKY[jazyk].cookies;
  const [vidno, setVidno] = useState(false);
  const [detail, setDetail] = useState(false);
  const [analyticke, setAnalyticke] = useState(true);
  const [marketingove, setMarketingove] = useState(true);
  /* ?cookies=biela prepne lištu na svetlú — dočasné, kým si Samuel vyberie */
  const [biela, setBiela] = useState(false);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setBiela(new URLSearchParams(window.location.search).get("cookies") === "biela");
  }, []);

  useEffect(() => {
    const ulozene = precitaj();
    if (!ulozene) {
      // krátke zdržanie, nech lišta nevyskočí do nedokresleného webu
      const id = window.setTimeout(() => setVidno(true), 900);
      return () => window.clearTimeout(id);
    }
    setAnalyticke(ulozene.analyticke);
    setMarketingove(ulozene.marketingove);
  }, []);

  useEffect(() => {
    const otvor = () => {
      const u = precitaj();
      if (u) {
        setAnalyticke(u.analyticke);
        setMarketingove(u.marketingove);
      }
      setDetail(true);
      setVidno(true);
    };
    window.addEventListener("aq-cookies-otvor", otvor);
    return () => window.removeEventListener("aq-cookies-otvor", otvor);
  }, []);

  const rozhodni = (a: boolean, m: boolean) => {
    zapis({ analyticke: a, marketingove: m });
    setVidno(false);
    setDetail(false);
  };

  if (!vidno) return null;

  return (
    <div
      className={`ck${detail ? " ck--detail" : ""}${biela ? " ck--biela" : ""}`}
      role="dialog"
      aria-live="polite"
      aria-label={t.titul}
      ref={panel}
    >
      <div className="ck__in">
        <div className="ck__text">
          <span className="ck__eyebrow">{t.titul}</span>
          <p>
            {t.text}{" "}
            <Link href={odkaz("/ochrana-osobnych-udajov", jazyk)} className="ck__odkaz">
              {t.viac}
            </Link>
          </p>
        </div>

        {detail && (
          <div className="ck__volby">
            <label className="ck__volba is-locked">
              <span className="ck__prepinac" aria-hidden>
                <input type="checkbox" checked disabled />
                <span />
              </span>
              <span>
                <b>{t.nutneTitul}</b>
                {t.nutneText}
              </span>
            </label>
            <label className="ck__volba">
              <span className="ck__prepinac" aria-hidden>
                <input
                  type="checkbox"
                  checked={analyticke}
                  onChange={(e) => setAnalyticke(e.target.checked)}
                />
                <span />
              </span>
              <span>
                <b>{t.analytickeTitul}</b>
                {t.analytickeText}
              </span>
            </label>
            <label className="ck__volba">
              <span className="ck__prepinac" aria-hidden>
                <input
                  type="checkbox"
                  checked={marketingove}
                  onChange={(e) => setMarketingove(e.target.checked)}
                />
                <span />
              </span>
              <span>
                <b>{t.marketingoveTitul}</b>
                {t.marketingoveText}
              </span>
            </label>
          </div>
        )}

        <div className="ck__akcie">
          {detail ? (
            <>
              <button type="button" className="ck__btn ck__btn--hlavny" onClick={() => rozhodni(true, true)}>
                {t.prijat}
              </button>
              <button type="button" className="ck__btn" onClick={() => rozhodni(analyticke, marketingove)}>
                {t.ulozit}
              </button>
              <button type="button" className="ck__tichy" onClick={() => rozhodni(false, false)}>
                {t.odmietnut}
              </button>
            </>
          ) : (
            <>
              <button type="button" className="ck__btn ck__btn--hlavny" onClick={() => rozhodni(true, true)}>
                {t.prijat}
              </button>
              <button type="button" className="ck__btn" onClick={() => setDetail(true)}>
                {t.prisposobit}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
