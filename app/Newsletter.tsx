"use client";

import { useState } from "react";
import { posliDopyt } from "./send-dopyt";

const OWNER_EMAIL = "ahoj@aquaprime.sk";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  if (sent) {
    return (
      <p className="footer__news-ok" role="status">
        ✓ Ďakujeme! Ozveme sa s novinkami.
      </p>
    );
  }

  return (
    <form
      className="newsletter"
      onSubmit={async (e) => {
        e.preventDefault();
        if (sending) return;
        setSending(true);
        await posliDopyt(
          {
            tema: "Newsletter",
            meno: "Odber noviniek",
            email,
            sprava: "Prihlásenie na odber noviniek z pätičky webu.",
          },
          {
            komu: OWNER_EMAIL,
            predmet: "Odber noviniek — AQUAPRIME",
            telo: `Prosím o zaradenie do odberu noviniek.\nE-mail: ${email}`,
          }
        );
        setSending(false);
        setSent(true);
      }}
    >
      <input
        type="email"
        placeholder="Váš e-mail"
        aria-label="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit" aria-label="Odoslať" disabled={sending}>
        →
      </button>
    </form>
  );
}
