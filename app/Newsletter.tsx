"use client";

import { useState } from "react";

export default function Newsletter() {
  const [sent, setSent] = useState(false);

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
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <input type="email" placeholder="Váš e-mail" aria-label="E-mail" required />
      <button type="submit" aria-label="Odoslať">
        →
      </button>
    </form>
  );
}
