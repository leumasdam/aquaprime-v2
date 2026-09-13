import type { Metadata } from "next";
import { PravnaStranka, Doplnit, Overit } from "../pravne";

export const metadata: Metadata = {
  title: "Ochrana osobných údajov | AQUAPRIME",
  description:
    "Aké osobné údaje spracúva AQUAPRIME, na akom právnom základe, ako dlho ich uchováva, komu ich odovzdáva a aké práva máte.",
  alternates: {
    canonical: "/ochrana-osobnych-udajov",
    languages: { sk: "/ochrana-osobnych-udajov", en: "/en/ochrana-osobnych-udajov" },
  },
};

export default function OchranaOsobnychUdajov() {
  return (
    <PravnaStranka titul="Ochrana osobných údajov" aktualizovane="11. septembra 2026">
      <h2>1. Prevádzkovateľ</h2>
      <p>
        Prevádzkovateľom, ktorý určuje účely a prostriedky spracúvania osobných údajov, je{" "}
        <Doplnit co="obchodné meno" />, so sídlom <Doplnit co="sídlo" />, IČO{" "}
        <Doplnit co="IČO" /> (ďalej len „prevádzkovateľ“).
      </p>
      <p>
        Kontakt na uplatnenie práv: <a href="mailto:ahoj@aquaprime.sk">ahoj@aquaprime.sk</a>,{" "}
        <Doplnit co="poštová adresa na uplatnenie práv" />.{" "}
        <Doplnit co="zodpovedná osoba (DPO), ak je určená — inak tento údaj vypustiť" />
      </p>
      <p>
        Údaje spracúvame v súlade s nariadením (EÚ) 2016/679 (GDPR) a zákonom č. 18/2018
        Z. z. o ochrane osobných údajov.
      </p>

      <h2>2. Aké údaje spracúvame a prečo</h2>
      <h3>Dopyty a kontaktný formulár</h3>
      <p>
        <strong>Údaje:</strong> meno, e-mail, telefón (ak ho uvediete), obsah správy
        a údaje o výrobku, ktorý riešite.
        <br />
        <strong>Účel:</strong> odpoveď na dopyt a príprava ponuky.
        <br />
        <strong>Právny základ:</strong> opatrenia pred uzavretím zmluvy na žiadosť
        dotknutej osoby (čl. 6 ods. 1 písm. b GDPR).
        <br />
        <strong>Doba uchovávania:</strong> <Doplnit co="doba uchovávania dopytov" />.
      </p>

      <h3>Objednávky</h3>
      <p>
        <strong>Údaje:</strong> meno, fakturačná a dodacia adresa, e-mail, telefón,
        objednaný tovar, údaje o platbe a dodaní; pri nákupe na firmu aj obchodné meno,
        IČO, DIČ a IČ DPH.
        <br />
        <strong>Účel:</strong> uzavretie a plnenie kúpnej zmluvy, vybavenie objednávky,
        fakturácia a vedenie účtovníctva.
        <br />
        <strong>Právny základ:</strong> plnenie zmluvy (čl. 6 ods. 1 písm. b) a plnenie
        zákonných povinností (čl. 6 ods. 1 písm. c).
        <br />
        <strong>Doba uchovávania:</strong> účtovné doklady 10 rokov podľa zákona
        č. 431/2002 Z. z. o účtovníctve; ostatné údaje k objednávke po dobu potrebnú na
        vybavenie a uplatnenie práv zo zmluvy.
      </p>

      <h3>Reklamácie</h3>
      <p>
        <strong>Údaje:</strong> identifikačné a kontaktné údaje, popis vady, fotografie,
        doklad o kúpe.
        <br />
        <strong>Účel:</strong> vybavenie reklamácie a preukázanie jej priebehu.
        <br />
        <strong>Právny základ:</strong> plnenie zmluvy a zákonných povinností.
        <br />
        <strong>Doba uchovávania:</strong>{" "}
        <Doplnit co="doba uchovávania reklamačnej dokumentácie" />.
      </p>

      <h3>Meranie návštevnosti</h3>
      <p>
        Analytické nástroje (Google Analytics 4, prípadne Google Tag Manager) sa na webe
        načítavajú iba vtedy, ak je pre konkrétne prostredie nastavený merací kód.{" "}
        <Overit co="stav analytiky pred spustením — ak je merací kód nasadený, doplniť súhlasnú lištu a údaje nižšie" />{" "}
        Ak je merací kód aktívny, spracúvajú sa údaje o používaní webu (navštívené stránky,
        približná poloha, typ zariadenia) na základe vášho súhlasu (čl. 6 ods. 1 písm. a
        GDPR), ktorý môžete kedykoľvek odvolať.
      </p>

      <h2>3. Údaje, ktoré zostávajú vo vašom prehliadači</h2>
      <p>
        Obsah košíka a rozpísaný text formulára ukladá web do lokálneho úložiska vášho
        prehliadača, aby ste o ne neprišli pri zavretí stránky. Tieto údaje sa neodosielajú
        na server a zostávajú vo vašom zariadení, kým ich nevymažete vy alebo kým
        neodošlete objednávku či správu. Vymazať ich môžete v nastaveniach prehliadača
        (vymazanie údajov stránok).
      </p>

      <h2>4. Komu údaje odovzdávame</h2>
      <p>V našom mene spracúvajú údaje títo sprostredkovatelia:</p>
      <ul>
        <li>
          <strong>Vercel Inc.</strong> — prevádzka a hosting webu vrátane serverových
          logov.
        </li>
        <li>
          <strong>Resend</strong> — odosielanie e-mailov z formulárov a potvrdení
          objednávok.
        </li>
        <li>
          <strong>Stripe</strong> — spracovanie platby kartou, ak si tento spôsob platby
          zvolíte. Údaje o karte zadávate priamo u poskytovateľa platobnej brány,
          prevádzkovateľ k nim nemá prístup.
        </li>
        <li>
          <strong>Google Ireland Ltd.</strong> — meranie návštevnosti, iba ak je merací
          kód nasadený a udelili ste súhlas.
        </li>
        <li>
          <Doplnit co="poskytovateľ domény a e-mailových schránok" /> — prevádzka domény
          a e-mailu.
        </li>
        <li>
          <Doplnit co="prepravca / kuriérska spoločnosť" /> — doručenie objednávky.
        </li>
        <li>
          <Doplnit co="účtovník alebo účtovná kancelária, ak spracúva doklady" />.
        </li>
      </ul>
      <p>
        Niektorí z uvedených poskytovateľov môžu spracúvať údaje aj mimo Európskeho
        hospodárskeho priestoru. V takom prípade je prenos zabezpečený štandardnými
        zmluvnými doložkami schválenými Európskou komisiou alebo iným primeraným
        nástrojom.{" "}
        <Overit co="skutočný zoznam sprostredkovateľov a uzavreté zmluvy podľa čl. 28 GDPR" />
      </p>
      <p>
        Údaje neodovzdávame tretím stranám na marketingové účely a nevykonávame
        automatizované rozhodovanie ani profilovanie s právnymi účinkami.
      </p>

      <h2>5. Cookies</h2>
      <p>
        Web používa technicky nevyhnutné cookies a lokálne úložisko potrebné na jeho
        fungovanie — napríklad na uchovanie obsahu košíka. Tieto nevyžadujú súhlas.
      </p>
      <p>
        Analytické a marketingové cookies sa nasadzujú až po udelení súhlasu prostredníctvom
        súhlasnej lišty spolu s meracím kódom. Súhlas môžete kedykoľvek odvolať vymazaním
        údajov stránky v prehliadači.{" "}
        <Overit co="pred spustením analytiky doplniť súhlasnú lištu a zoznam konkrétnych cookies s dobou platnosti" />
      </p>

      <h2>6. Vaše práva</h2>
      <p>Ako dotknutá osoba máte právo:</p>
      <ul>
        <li>na prístup k svojim údajom a na ich kópiu,</li>
        <li>na opravu nesprávnych a doplnenie neúplných údajov,</li>
        <li>na vymazanie údajov, ak na ich spracúvanie už nie je dôvod,</li>
        <li>na obmedzenie spracúvania,</li>
        <li>na prenosnosť údajov, ktoré ste nám poskytli,</li>
        <li>namietať proti spracúvaniu založenému na oprávnenom záujme,</li>
        <li>kedykoľvek odvolať súhlas, ak je spracúvanie založené na súhlase.</li>
      </ul>
      <p>
        Práva si uplatníte e-mailom na{" "}
        <a href="mailto:ahoj@aquaprime.sk">ahoj@aquaprime.sk</a>. Odpovieme do jedného
        mesiaca od doručenia žiadosti; v odôvodnených prípadoch môžeme lehotu predĺžiť
        a budeme vás o tom informovať.
      </p>
      <p>
        Ak sa domnievate, že spracúvaním vašich údajov došlo k porušeniu predpisov, máte
        právo podať sťažnosť Úradu na ochranu osobných údajov SR, Hraničná 12, 820 07
        Bratislava (
        <a href="https://dataprotection.gov.sk" rel="noreferrer" target="_blank">
          dataprotection.gov.sk
        </a>
        ).
      </p>

      <h2>7. Poskytnutie údajov</h2>
      <p>
        Poskytnutie údajov potrebných na uzavretie a plnenie zmluvy je zmluvnou
        požiadavkou — bez nich nevieme objednávku vybaviť. Poskytnutie údajov na účely
        analytiky je dobrovoľné a založené na súhlase.
      </p>

      <h2>8. Zmeny dokumentu</h2>
      <p>
        Tento dokument môžeme aktualizovať, ak sa zmenia spracovateľské operácie alebo
        právne predpisy. Aktuálne znenie je vždy zverejnené na tejto stránke s dátumom
        poslednej aktualizácie.
      </p>
    </PravnaStranka>
  );
}
