"use client";

import { useState } from "react";
import { posliDopyt } from "./send-dopyt";

const TYPY = ["Akvárium", "Terárium", "Skrinka", "Kompletná zostava"];
const STYLY = ["Čierna štruktúra", "Drevo", "Kov", "Minimal"];
const OWNER_EMAIL = "ahoj@aquaprime.sk";

export default function DopytForm() {
  const [typ, setTyp] = useState("");
  const [styl, setStyl] = useState<string[]>([]);
  const [rozmer, setRozmer] = useState("");
  const [meno, setMeno] = useState("");
  const [email, setEmail] = useState("");
  const [poznamka, setPoznamka] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [delivered, setDelivered] = useState(false);

  const toggleStyl = (s: string) =>
    setStyl((arr) => (arr.includes(s) ? arr.filter((x) => x !== s) : [...arr, s]));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    const body = [
      `Typ projektu: ${typ || "—"}`,
      `Rozmery a objem: ${rozmer || "—"}`,
      `Preferovaný štýl: ${styl.length ? styl.join(", ") : "—"}`,
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
          {delivered ? "Dopyt odoslaný." : "Dopyt je pripravený."}
        </h2>
        <p className="dopyt__done-body">
          {delivered
            ? "Máme ho u seba a potvrdenie sme poslali aj na váš e-mail. Ozveme sa spravidla do 24 hodín v pracovný deň."
            : `Otvorili sme váš e-mailový klient s vyplnenými údajmi — stačí odoslať. Ak sa neotvoril, napíšte nám priamo na ${OWNER_EMAIL}.`}
        </p>
      </div>
    );
  }

  return (
    <form className="dopyt" onSubmit={submit}>
      <fieldset className="dopyt__field">
        <legend className="dopyt__legend">
          <span className="dopyt__n">01</span> Typ projektu
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
          <span className="dopyt__n">02</span> Rozmery a objem
        </legend>
        <input
          className="dopyt__input"
          type="text"
          placeholder="napr. 120 × 50 × 60 cm, ~360 l"
          value={rozmer}
          onChange={(e) => setRozmer(e.target.value)}
        />
      </fieldset>

      <fieldset className="dopyt__field">
        <legend className="dopyt__legend">
          <span className="dopyt__n">03</span> Preferovaný štýl
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
          <span className="dopyt__n">04</span> Kontakt
        </legend>
        <div className="dopyt__row">
          <input
            className="dopyt__input"
            type="text"
            placeholder="Meno"
            value={meno}
            onChange={(e) => setMeno(e.target.value)}
            required
          />
          <input
            className="dopyt__input"
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <textarea
          className="dopyt__input dopyt__textarea"
          placeholder="Poznámka — priestor, termín, vízia…"
          rows={4}
          value={poznamka}
          onChange={(e) => setPoznamka(e.target.value)}
        />
      </fieldset>

      <button type="submit" className="btn-cyan dopyt__submit" disabled={sending}>
        {sending ? "ODOSIELAM…" : "ODOSLAŤ DOPYT"} <span aria-hidden>→</span>
      </button>
      <p className="dopyt__note">
        Odoslaním súhlasíte so spracovaním údajov za účelom prípravy ponuky.
        Žiadny spam.
      </p>
    </form>
  );
}
