import type { Metadata } from "next";
import { PravnaStranka, Doplnit } from "../pravne";

export const metadata: Metadata = { title: "Obchodné podmienky" };

export default function ObchodnePodmienky() {
  return (
    <PravnaStranka titul="Obchodné podmienky" aktualizovane="11. augusta 2026">
      <h2>1. Predávajúci</h2>
      <p>
        Prevádzkovateľom internetového obchodu aquaprime.sk je <Doplnit co="obchodné meno" />,
        so sídlom <Doplnit co="sídlo" />, IČO <Doplnit co="IČO" />, DIČ <Doplnit co="DIČ" />,
        zapísaný v <Doplnit co="register a číslo zápisu" /> (ďalej „predávajúci“).
        Kontakt: <Doplnit co="e-mail" />, <Doplnit co="telefón" />.
      </p>

      <h2>2. Objednávka a uzavretie zmluvy</h2>
      <p>
        Kúpna zmluva vzniká potvrdením objednávky predávajúcim. Odoslaním objednávky
        kupujúci potvrdzuje, že sa oboznámil s týmito obchodnými podmienkami a súhlasí s nimi.
        Predávajúci potvrdí prijatie objednávky e-mailom spolu s číslom objednávky.
      </p>

      <h2>3. Ceny a platba</h2>
      <p>
        Všetky ceny sú uvedené v eurách. Predávajúci <Doplnit co="je / nie je platcom DPH" />.
        Po odoslaní objednávky uhrádza kupujúci zálohu vo výške 30 % z celkovej ceny
        bankovým prevodom (platobné údaje vrátane QR kódu sú súčasťou potvrdenia
        objednávky); výroba sa začína po pripísaní zálohy. Zvyšná časť ceny sa uhrádza
        pri prevzatí tovaru — v hotovosti alebo kartou. Tovar zostáva majetkom
        predávajúceho do úplného zaplatenia kúpnej ceny.
      </p>

      <h2>4. Dodanie tovaru</h2>
      <p>
        Skrinky a akváriá sa vyrábajú na objednávku; predpokladaná doba výroby je uvedená
        pri objednávke a spresní sa v potvrdení. Doprava kuriérom je spoplatnená podľa
        cenníka v košíku (pri objednávke nad 500 € zdarma), osobný odber
        v <Doplnit co="miesto odberu" /> je bezplatný. O expedícii predávajúci informuje e-mailom.
      </p>

      <h2>5. Odstúpenie od zmluvy</h2>
      <p>
        Spotrebiteľ má právo odstúpiť od zmluvy bez udania dôvodu do 14 dní od prevzatia
        tovaru (zákon č. 102/2014 Z. z.). Odstúpenie je potrebné zaslať e-mailom
        na <Doplnit co="e-mail" />; predávajúci vráti platbu do 14 dní od doručenia tovaru späť.
      </p>
      <p>
        <strong>Výnimka:</strong> právo na odstúpenie sa podľa § 7 ods. 6 písm. c) zákona
        č. 102/2014 Z. z. nevzťahuje na tovar zhotovený podľa osobitných požiadaviek
        spotrebiteľa alebo vyrobený na mieru — teda na akváriá a skrinky v atypických
        rozmeroch či vyhotovení objednaných cez konfigurátor alebo individuálny dopyt.
        Na katalógové modely v štandardných rozmeroch sa právo na odstúpenie vzťahuje.
      </p>

      <h2>6. Reklamácie</h2>
      <p>
        Záručná doba je 24 mesiacov od prevzatia tovaru. Postup uplatnenia reklamácie
        upravuje <a href="/reklamacny-poriadok">reklamačný poriadok</a>.
      </p>

      <h2>7. Alternatívne riešenie sporov</h2>
      <p>
        Spotrebiteľ sa môže so sťažnosťou obrátiť na predávajúceho e-mailom. Ak nebude
        vybavená k spokojnosti, má právo podať návrh na alternatívne riešenie sporu
        Slovenskej obchodnej inšpekcii (<a href="https://www.soi.sk" rel="noreferrer" target="_blank">soi.sk</a>)
        alebo využiť platformu EÚ na riešenie sporov online
        (<a href="https://ec.europa.eu/consumers/odr" rel="noreferrer" target="_blank">ec.europa.eu/consumers/odr</a>).
      </p>

      <h2>8. Dozorný orgán</h2>
      <p>
        Slovenská obchodná inšpekcia, <Doplnit co="inšpektorát podľa sídla firmy" />.
      </p>

      <h2>9. Záverečné ustanovenia</h2>
      <p>
        Vzťahy neupravené týmito podmienkami sa riadia právnym poriadkom Slovenskej
        republiky, najmä Občianskym zákonníkom a zákonom č. 102/2014 Z. z. Ochranu
        osobných údajov upravuje samostatný dokument
        <a href="/ochrana-osobnych-udajov"> Ochrana osobných údajov</a>.
      </p>
    </PravnaStranka>
  );
}
