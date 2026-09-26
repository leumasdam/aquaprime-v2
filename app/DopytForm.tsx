"use client";

import { useEffect, useRef, useState } from "react";
import { najdiSet } from "./sety";
import { ROZMER_EVENT } from "./LoadCalc";
import { odkaz, type Jazyk } from "./jazyk";
import { SLOVNIKY } from "./preklady";
import { posliDopyt } from "./send-dopyt";

const OWNER_EMAIL = "patrikranda225@gmail.com";

export default function DopytForm({ jazyk = "sk" }: { jazyk?: Jazyk }) {
  const t = SLOVNIKY[jazyk].dopyt;
  const TYPY = t.formTypy;
  const STYLY = t.formStyly;
  const [typ, setTyp] = useState("");
  const [styl, setStyl] = useState<string[]>([]);
  const [rozmer, setRozmer] = useState("");
  const [meno, setMeno] = useState("");
  const [email, setEmail] = useState("");
  const [poznamka, setPoznamka] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [delivered, setDelivered] = useState(false);

  /* odkaz zo stránky Sety (?set=scape-60) predvyplní rozmer akvária a poznámku,
     aby zákazník nemusel set opisovať; čo už napísal, sa neprepíše */
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("set");
    const set = id ? najdiSet(id) : undefined;
    if (!set) return;
    setRozmer((r) => r || set.akvarium);
    setPoznamka((p) =>
      p ||
      (jazyk === "en"
        ? `I am interested in the ${set.nazov} set (${set.podtitul.en}).`
        : `Mám záujem o set ${set.nazov} (${set.podtitul.sk}).`)
    );
  }, [jazyk]);
  const rozmerRef = useRef<HTMLInputElement>(null);

  // kalkulačka záťaže nižšie na stránke pošle rozmery sem — vyplní pole a
  // privedie človeka späť k formuláru
  useEffect(() => {
    const on = (e: Event) => {
      setRozmer(String((e as CustomEvent).detail ?? ""));
      const el = rozmerRef.current;
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      window.setTimeout(() => el.focus({ preventScroll: true }), 500);
    };
    window.addEventListener(ROZMER_EVENT, on);
    return () => window.removeEventListener(ROZMER_EVENT, on);
  }, []);

  const toggleStyl = (s: string) =>
    setStyl((arr) => (arr.includes(s) ? arr.filter((x) => x !== s) : [...arr, s]));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    const body = [
      `Typ projektu: ${typ || "—"}`,
      `Rozmery a objem: ${rozmer || "—"}`,
      `Preferovaný povrch: ${styl.length ? styl.join(", ") : "—"}`,
      `Meno: ${meno || "—"}`,
      `E-mail: ${email || "—"}`,
      "",
      `Poznámka:`,
      poznamka || "—",
    ].join("\n");

    const ok = await posliDopyt(
      {
        tema: typ || "Dopyt na mieru",
        meno,
        email,
        rozmer,
        sprava: [poznamka, styl.length ? `Štýl: ${styl.join(", ")}` : ""]
          .filter(Boolean)
          .join("\n\n"),
      },
      { komu: OWNER_EMAIL, predmet: "Dopyt na mieru — AQUAPRIME", telo: body }
    );
    setDelivered(ok);
    setSending(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="dopyt__done" role="status">
        <div className="dopyt__done-ico" aria-hidden>
          ✓
        </div>
        <h2 className="dopyt__done-title">
          {delivered ? t.hotovoOdoslany : t.hotovoPripraveny}
        </h2>
        <p className="dopyt__done-body">
          {delivered
            ? t.hotovoPrijaty
            : `${t.hotovoKlient} ${OWNER_EMAIL}.`}
        </p>
      </div>
    );
  }

  return (
    <form className="dopyt" id="dopyt-form" onSubmit={submit}>
      <fieldset className="dopyt__field">
        <legend className="dopyt__legend">
          <span className="dopyt__n">01</span> {t.formKrok1}
        </legend>
        <div className="dopyt__chips">
          {TYPY.map((t) => (
            <button
              type="button"
              key={t}
              className={`chipbtn${typ === t ? " is-on" : ""}`}
              onClick={() => setTyp(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="dopyt__field">
        <legend className="dopyt__legend">
          <span className="dopyt__n">02</span> {t.formKrok2}
        </legend>
        <label className="dopyt__label" htmlFor="dopyt-rozmer">
          <span className="len-pre-citacky">{t.formKrok2}</span>
          <input
            ref={rozmerRef}
            id="dopyt-rozmer"
            name="rozmer"
            className="dopyt__input"
            type="text"
            placeholder={t.formRozmer}
            value={rozmer}
            onChange={(e) => setRozmer(e.target.value)}
          />
        </label>
      </fieldset>

      <fieldset className="dopyt__field">
        <legend className="dopyt__legend">
          <span className="dopyt__n">03</span> {t.formKrok3}
        </legend>
        <div className="dopyt__chips">
          {STYLY.map((s) => (
            <button
              type="button"
              key={s}
              className={`chipbtn${styl.includes(s) ? " is-on" : ""}`}
              onClick={() => toggleStyl(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="dopyt__field">
        <legend className="dopyt__legend">
          <span className="dopyt__n">04</span> {t.formKrok4}
        </legend>
        <div className="dopyt__row">
          <label className="dopyt__label" htmlFor="dopyt-meno">
            <span className="len-pre-citacky">{t.formMeno}</span>
            <input
              id="dopyt-meno"
              name="meno"
              className="dopyt__input"
              type="text"
              autoComplete="name"
              placeholder={t.formMeno}
              value={meno}
              onChange={(e) => setMeno(e.target.value)}
              required
            />
          </label>
          <label className="dopyt__label" htmlFor="dopyt-email">
            <span className="len-pre-citacky">{t.formEmail}</span>
            <input
              id="dopyt-email"
              name="email"
              className="dopyt__input"
              type="email"
              autoComplete="email"
              placeholder={t.formEmail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
        </div>
        <label className="dopyt__label" htmlFor="dopyt-poznamka">
          <span className="len-pre-citacky">{t.formPoznamka}</span>
          <textarea
            id="dopyt-poznamka"
            name="poznamka"
            className="dopyt__input dopyt__textarea"
            placeholder={t.formPoznamka}
            rows={4}
            value={poznamka}
            onChange={(e) => setPoznamka(e.target.value)}
          />
        </label>
      </fieldset>

      <button type="submit" className="btn-cyan dopyt__submit" disabled={sending}>
        {sending ? t.formOdosielam : t.formPoslat} <span aria-hidden>→</span>
      </button>
      <p className="dopyt__note">
        {t.formPozn1}{" "}
        <a href={odkaz("/ochrana-osobnych-udajov", jazyk)}>{t.formPoznOdkaz}</a>.
      </p>
    </form>
  );
}
