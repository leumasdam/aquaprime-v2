import type { Metadata } from "next";
import { PravnaStranka, Doplnit, Overit } from "../pravne";

export const metadata: Metadata = {
  title: "Obchodné podmienky | AQUAPRIME",
  description:
    "Obchodné podmienky pre nákup skriniek pod akváriá a akvárií na aquaprime.sk — objednávka, ceny, dodanie, odstúpenie od zmluvy a reklamácie.",
  alternates: {
    canonical: "/obchodne-podmienky",
    languages: { sk: "/obchodne-podmienky", en: "/en/obchodne-podmienky" },
  },
};

export default function ObchodnePodmienky() {
  return (
    <PravnaStranka titul="Obchodné podmienky" aktualizovane="11. septembra 2026">
      <h2>1. Úvodné ustanovenia</h2>
      <p>
        Tieto obchodné podmienky upravujú práva a povinnosti zmluvných strán pri predaji
        tovaru prostredníctvom internetového obchodu na adrese aquaprime.sk. Sú
        neoddeliteľnou súčasťou kúpnej zmluvy uzavretej medzi predávajúcim a kupujúcim.
      </p>
      <p>
        Vzťahy neupravené týmito podmienkami sa riadia právnym poriadkom Slovenskej
        republiky, najmä zákonom č. 40/1964 Zb. Občiansky zákonník, zákonom č. 108/2024
        Z. z. o ochrane spotrebiteľa a zákonom č. 22/2004 Z. z. o elektronickom obchode.
        Ak je kupujúcim podnikateľ, riadi sa vzťah zákonom č. 513/1991 Zb. Obchodný
        zákonník a ustanovenia o právach spotrebiteľa sa neuplatnia.
      </p>

      <h2>2. Predávajúci</h2>
      <p>
        Prevádzkovateľom internetového obchodu a predávajúcim je{" "}
        <Doplnit co="obchodné meno" />, so sídlom <Doplnit co="sídlo" />, IČO{" "}
        <Doplnit co="IČO" />, DIČ <Doplnit co="DIČ" />,{" "}
        <Doplnit co="IČ DPH alebo poznámka, že predávajúci nie je platcom DPH" />,
        zapísaný v <Doplnit co="register a číslo zápisu" /> (ďalej len „predávajúci“).
      </p>
      <p>
        Kontaktné údaje: e-mail <a href="mailto:ahoj@aquaprime.sk">ahoj@aquaprime.sk</a>,
        telefón <Doplnit co="telefón" />, adresa na doručovanie{" "}
        <Doplnit co="adresa na doručovanie a vrátenie tovaru" />.
      </p>
      <p>
        Orgán dozoru: Slovenská obchodná inšpekcia, Inšpektorát SOI pre{" "}
        <Doplnit co="kraj podľa sídla predávajúceho" />,{" "}
        <a href="https://www.soi.sk" rel="noreferrer" target="_blank">
          soi.sk
        </a>
        .
      </p>

      <h2>3. Objednávka a uzavretie zmluvy</h2>
      <p>
        Kupujúci objednáva tovar odoslaním objednávky cez nákupný košík. Pred odoslaním má
        možnosť skontrolovať a zmeniť zadané údaje. Odoslanie objednávky je úkon spojený
        s povinnosťou platby a kupujúci ním potvrdzuje, že sa oboznámil s týmito obchodnými
        podmienkami.
      </p>
      <p>
        Predávajúci potvrdí prijatie objednávky e-mailom. Kúpna zmluva vzniká záväzným
        potvrdením objednávky zo strany predávajúceho; automatické potvrdenie o doručení
        objednávky nie je jej prijatím. Pri tovare vyrábanom na mieru predávajúci pred
        potvrdením spresní s kupujúcim rozmery a vyhotovenie.
      </p>
      <p>
        Nezáväzný dopyt odoslaný cez formulár alebo konfigurátor nie je objednávkou
        a nevzniká ním zmluva ani povinnosť platby.
      </p>

      <h2>4. Ceny</h2>
      <p>
        Ceny uvedené pri tovare sú v eurách a sú konečné,{" "}
        <Doplnit co="vrátane DPH / predávajúci nie je platcom DPH" />. Cena nezahŕňa
        náklady na dopravu, ktoré sa zobrazia v košíku pred odoslaním objednávky.
      </p>
      <p>
        Cena platná pre objednávku je cena uvedená v momente jej odoslania. Predávajúci si
        vyhradzuje právo ceny meniť; zmena sa netýka už potvrdených objednávok. Pri tovare
        na mieru sa cena určuje individuálne a kupujúcemu sa oznámi v ponuke pred
        potvrdením objednávky.
      </p>

      <h2>5. Platobné podmienky</h2>
      <p>
        <Overit co="celý bod 5 — potvrdiť skutočný platobný proces, výšku zálohy a dostupné platobné metódy" />
      </p>
      <p>
        Kupujúci môže cenu uhradiť spôsobmi ponúknutými v objednávkovom formulári. Pri
        tovare vyrábanom na objednávku uhrádza kupujúci po potvrdení objednávky zálohu vo
        výške <Doplnit co="výška zálohy v %" /> z ceny; výroba sa začína po jej pripísaní.
        Zvyšnú časť ceny uhrádza kupujúci <Doplnit co="spôsob a termín doplatku" />.
      </p>
      <p>
        Platby kartou spracúva poskytovateľ platobnej brány; predávajúci neuchováva údaje
        o platobnej karte. Daňový doklad zasiela predávajúci elektronicky na e-mail
        kupujúceho. Tovar zostáva vlastníctvom predávajúceho do úplného zaplatenia ceny.
      </p>

      <h2>6. Dodanie tovaru</h2>
      <p>
        <Overit co="celý bod 6 — potvrdiť dopravcu, cenník dopravy, miesto osobného odberu a rozsah montáže" />
      </p>
      <p>
        Tovar sa vyrába na objednávku. Predpokladaný termín dodania predávajúci oznámi
        v potvrdení objednávky a závisí od výrobku a aktuálnej kapacity výroby. Ak termín
        nie je možné dodržať, predávajúci bezodkladne informuje kupujúceho a dohodne s ním
        náhradný termín alebo zrušenie objednávky s vrátením uhradenej sumy.
      </p>
      <p>
        Spôsob dodania a jeho cena sú uvedené v košíku pred odoslaním objednávky. Osobný
        odber je možný na adrese <Doplnit co="adresa osobného odberu" /> po dohode
        termínu. Vynesenie na poschodie a osadenie skrinky sú samostatné služby; ich
        dostupnosť a cenu treba dohodnúť vopred.
      </p>
      <p>
        Kupujúci je povinný skontrolovať zásielku pri prevzatí. Zjavné poškodenie obalu
        alebo tovaru je potrebné uviesť do prepravného dokladu a bezodkladne oznámiť
        predávajúcemu.
      </p>

      <h2>7. Odstúpenie od zmluvy spotrebiteľom</h2>
      <p>
        <Overit co="bod 7 — presné znenie a odkazy na ustanovenia zákona č. 108/2024 Z. z. dať skontrolovať právnikovi" />
      </p>
      <p>
        Spotrebiteľ má právo odstúpiť od zmluvy uzavretej na diaľku bez uvedenia dôvodu do
        14 dní odo dňa prevzatia tovaru. Lehota je zachovaná, ak spotrebiteľ odošle
        oznámenie o odstúpení pred jej uplynutím.
      </p>
      <p>
        Odstúpenie je možné oznámiť e-mailom na{" "}
        <a href="mailto:ahoj@aquaprime.sk">ahoj@aquaprime.sk</a> alebo písomne na adresu
        sídla. Použiť možno aj vzorový formulár nižšie. Predávajúci potvrdí prijatie
        odstúpenia bez zbytočného odkladu.
      </p>
      <p>
        Tovar je potrebné zaslať späť najneskôr do 14 dní odo dňa odstúpenia. Priame
        náklady na vrátenie tovaru znáša spotrebiteľ; pri rozmernom tovare, ktorý nemožno
        zaslať bežnou poštou, môžu byť tieto náklady vyššie a odhadujú sa na{" "}
        <Doplnit co="odhad nákladov na vrátenie rozmerného tovaru" />.
      </p>
      <p>
        Predávajúci vráti všetky prijaté platby vrátane nákladov na dodanie (vo výške
        najlacnejšieho ponúkaného spôsobu doručenia) do 14 dní od doručenia odstúpenia,
        rovnakým platobným prostriedkom, aký použil spotrebiteľ, ak sa nedohodnú inak.
        Platbu môže zadržať do vrátenia tovaru alebo preukázania jeho odoslania.
        Spotrebiteľ zodpovedá za zníženie hodnoty tovaru, ktoré vzniklo zaobchádzaním nad
        rámec potrebný na zistenie jeho vlastností a funkčnosti.
      </p>
      <p>
        <strong>Kedy právo na odstúpenie nevzniká.</strong> Právo odstúpiť od zmluvy sa
        nevzťahuje na tovar zhotovený podľa osobitných požiadaviek spotrebiteľa, na tovar
        vyrobený na mieru alebo určený osobitne pre jedného spotrebiteľa. Týka sa to
        akvárií a skriniek v atypických rozmeroch alebo vyhotovení objednaných cez
        konfigurátor či individuálny dopyt. Pri tovare v katalógových rozmeroch a bežnom
        vyhotovení právo na odstúpenie zostáva zachované. Predávajúci na túto skutočnosť
        upozorní pri konkrétnej objednávke pred jej odoslaním.
      </p>

      <h3>Vzorový formulár na odstúpenie od zmluvy</h3>
      <p className="pravne__formular">
        Adresát: <Doplnit co="obchodné meno, sídlo, e-mail" />
        <br />
        Týmto oznamujem, že odstupujem od zmluvy na tento tovar: …
        <br />
        Dátum objednania / prevzatia: …
        <br />
        Meno a priezvisko spotrebiteľa: …
        <br />
        Adresa spotrebiteľa: …
        <br />
        Číslo objednávky: …
        <br />
        Dátum: …
        <br />
        Podpis (iba ak sa formulár podáva v listinnej podobe): …
      </p>

      <h2>8. Zodpovednosť za vady a reklamácie</h2>
      <p>
        Predávajúci zodpovedá za vady, ktoré má tovar pri prevzatí, a za vady, ktoré sa
        vyskytnú v zákonnej lehote. Postup pri uplatnení a vybavení reklamácie upravuje{" "}
        <a href="/reklamacny-poriadok">reklamačný poriadok</a>, ktorý je súčasťou týchto
        podmienok.
      </p>

      <h2>9. Alternatívne riešenie sporov</h2>
      <p>
        Ak spotrebiteľ nie je spokojný so spôsobom vybavenia reklamácie alebo sa domnieva,
        že predávajúci porušil jeho práva, má právo obrátiť sa na predávajúceho so žiadosťou
        o nápravu. Ak predávajúci na žiadosť odpovie zamietavo alebo neodpovie do 30 dní od
        jej odoslania, má spotrebiteľ právo podať návrh na začatie alternatívneho riešenia
        sporu podľa zákona č. 391/2015 Z. z.
      </p>
      <p>
        Príslušným subjektom je Slovenská obchodná inšpekcia (
        <a href="https://www.soi.sk" rel="noreferrer" target="_blank">
          soi.sk
        </a>
        ) alebo iná oprávnená právnická osoba zapísaná v zozname vedenom Ministerstvom
        hospodárstva SR. Európska platforma na riešenie sporov online (ODR) bola
        prevádzkovaná do 20. júla 2025 a už nie je dostupná.
      </p>

      <h2>10. Záverečné ustanovenia</h2>
      <p>
        Spracúvanie osobných údajov upravuje samostatný dokument{" "}
        <a href="/ochrana-osobnych-udajov">Ochrana osobných údajov</a>. Zmluva sa uzatvára
        v slovenskom jazyku a predávajúci ju archivuje v elektronickej podobe.
      </p>
      <p>
        Predávajúci si vyhradzuje právo tieto podmienky meniť. Na už uzavreté zmluvy sa
        vzťahuje znenie účinné v čase odoslania objednávky. Tieto podmienky nadobúdajú
        účinnosť <Doplnit co="dátum účinnosti" />.
      </p>
    </PravnaStranka>
  );
}
