import type { Metadata } from "next";
import { PravnaStranka, Doplnit } from "../pravne";

export const metadata: Metadata = { title: "Ochrana osobných údajov" };

export default function OchranaOsobnychUdajov() {
  return (
    <PravnaStranka titul="Ochrana osobných údajov" aktualizovane="11. augusta 2026">
      <h2>1. Prevádzkovateľ</h2>
      <p>
        Prevádzkovateľom osobných údajov je <Doplnit co="obchodné meno" />,
        sídlo <Doplnit co="sídlo" />, IČO <Doplnit co="IČO" />,
        kontakt <Doplnit co="e-mail" /> (ďalej „prevádzkovateľ“). Údaje spracúvame
        v súlade s nariadením GDPR a zákonom č. 18/2018 Z. z.
      </p>

      <h2>2. Aké údaje a prečo spracúvame</h2>
      <ul>
        <li>
          <strong>Dopyty a kontaktný formulár</strong> — meno, e-mail, telefón a obsah
          správy; právny základ: predzmluvné vzťahy (čl. 6 ods. 1 písm. b GDPR).
          Uchovávame 2 roky od vybavenia.
        </li>
        <li>
          <strong>Objednávky</strong> — meno, adresa, e-mail, telefón, objednaný tovar;
          právny základ: plnenie zmluvy a zákonné povinnosti (účtovníctvo — čl. 6 ods. 1
          písm. b a c). Účtovné doklady uchovávame 10 rokov.
        </li>
        <li>
          <strong>Meranie návštevnosti</strong> — anonymizované štatistiky (Google
          Analytics) spracúvame len po udelení súhlasu (čl. 6 ods. 1 písm. a).
          Kým merací kód nie je nasadený, žiadne analytické cookies sa nepoužívajú.
        </li>
      </ul>

      <h2>3. Komu údaje odovzdávame</h2>
      <p>Údaje spracúvajú v našom mene títo sprostredkovatelia:</p>
      <ul>
        <li>Vercel Inc. — hosting webu (EÚ/USA, štandardné zmluvné doložky),</li>
        <li>Resend — odosielanie e-mailov z formulárov,</li>
        <li>Websupport, s.r.o. — doména a e-mailové schránky,</li>
        <li>Google Ireland Ltd. — analytika (len po udelení súhlasu),</li>
        <li>prepravca <Doplnit co="názov kuriérskej spoločnosti" /> — doručenie objednávky.</li>
      </ul>

      <h2>4. Vaše práva</h2>
      <p>
        Máte právo na prístup k údajom, ich opravu, vymazanie, obmedzenie spracúvania,
        prenosnosť, právo namietať a právo odvolať súhlas. Uplatníte ich e-mailom
        na <Doplnit co="e-mail" />. Sťažnosť môžete podať Úradu na ochranu osobných
        údajov SR (<a href="https://dataprotection.gov.sk" rel="noreferrer" target="_blank">dataprotection.gov.sk</a>).
      </p>

      <h2>5. Cookies</h2>
      <p>
        Web používa iba technicky nevyhnutné cookies (napr. obsah košíka, prihlásenie).
        Analytické cookies sa nasadia až so súhlasnou lištou spolu s meracím kódom.
      </p>
    </PravnaStranka>
  );
}
