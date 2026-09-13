"use client";

import { useState } from "react";
import Newsletter from "./Newsletter";

/**
 * Piata bunka pätičky podľa Figmy: „Odber noviniek" vyzerá ako ostatné
 * štyri, po kliknutí sa pod radom buniek rozbalí formulár. Návrh má bunku
 * bez poľa, ale odber je jediná cesta, ako e-mail zbierať — preto toggle.
 */
export default function FooterNovinky() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className={`footer-cell footer-cell--btn${open ? " is-on" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="footer-novinky"
      >
        <span className="footer-cell__title">ODBER NOVINIEK</span>
        <span className="footer-cell__sub">Inšpirácia a ponuky</span>
      </button>
      {open && (
        <div className="footer__novinky" id="footer-novinky">
          <Newsletter />
        </div>
      )}
    </>
  );
}
