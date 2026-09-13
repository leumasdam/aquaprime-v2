import type { Metadata } from "next";
import { PravnaStranka, Doplnit, Overit } from "../pravne";

export const metadata: Metadata = {
  title: "Reklamačný poriadok | AQUAPRIME",
  description:
    "Reklamačný poriadok AQUAPRIME — zodpovednosť za vady, uplatnenie reklamácie, lehoty a spôsoby nápravy pri skrinkách a akváriách.",
  alternates: {
    canonical: "/reklamacny-poriadok",
    languages: { sk: "/reklamacny-poriadok", en: "/en/reklamacny-poriadok" },
  },
};

export default function ReklamacnyPoriadok() {
  return (
    <PravnaStranka titul="Reklamačný poriadok" aktualizovane="11. septembra 2026">
      <h2>1. Úvodné ustanovenia</h2>
      <p>
        Tento reklamačný poriadok upravuje postup pri uplatňovaní práv z chybného plnenia
        pri tovare zakúpenom od <Doplnit co="obchodné meno" /> prostredníctvom obchodu
        aquaprime.sk. Je neoddeliteľnou súčasťou{" "}
        <a href="/obchodne-podmienky">obchodných podmienok</a>.
      </p>
      <p>
        Práva a povinnosti sa riadia zákonom č. 40/1964 Zb. Občiansky zákonník a zákonom
        č. 108/2024 Z. z. o ochrane spotrebiteľa. Ak je kupujúcim podnikateľ, riadi sa
        zodpovednosť za vady Obchodným zákonníkom.
      </p>

      <h2>2. Zodpovednosť za vady</h2>
      <p>
        <Overit co="body 2 až 5 — presné lehoty, znenie práv z chybného plnenia a odkazy na ustanovenia dať skontrolovať právnikovi" />
      </p>
      <p>
        Predávajúci zodpovedá za vady, ktoré má tovar pri prevzatí kupujúcim, a za vady,
        ktoré sa vyskytnú v lehote 24 mesiacov od prevzatia. Ak sa vada prejaví v prvých
        12 mesiacoch od prevzatia, predpokladá sa, že tovar bol chybný už pri prevzatí,
        ak predávajúci nepreukáže opak.
      </p>
      <p>Zodpovednosť za vady sa nevzťahuje najmä na:</p>
      <ul>
        <li>bežné opotrebenie zodpovedajúce spôsobu a dobe používania,</li>
        <li>mechanické poškodenie vzniknuté po prevzatí tovaru,</li>
        <li>
          poškodenie spôsobené nesprávnou montážou alebo používaním v rozpore s pokynmi
          predávajúceho, najmä umiestnením skrinky na nerovný alebo nedostatočne pevný
          podklad bez vyrovnania nastaviteľnými nožičkami,
        </li>
        <li>
          poškodenie spôsobené zaťažením nad rozsah dohodnutý pre konkrétny výrobok alebo
          nádržou presahujúcou pôdorys skrinky,
        </li>
        <li>vady, na ktoré bola poskytnutá zľava z ceny.</li>
      </ul>

      <h2>3. Uplatnenie reklamácie</h2>
      <p>
        Reklamáciu môže kupujúci uplatniť e-mailom na{" "}
        <a href="mailto:ahoj@aquaprime.sk">ahoj@aquaprime.sk</a> alebo písomne na adrese{" "}
        <Doplnit co="adresa na uplatnenie reklamácie" />. V oznámení je vhodné uviesť číslo
        objednávky, popis vady, kedy sa vada prejavila, a priložiť fotografie. Tieto údaje
        slúžia na rýchlejšie vybavenie; ich neuvedenie nie je dôvodom na zamietnutie
        reklamácie.
      </p>
      <p>
        Reklamáciu je možné uplatniť kedykoľvek počas plynutia lehoty podľa bodu 2.
        Pri zásielke poškodenej prepravou odporúčame spísať s kuriérom zápis o škode hneď
        pri prevzatí a poškodenie oznámiť predávajúcemu čo najskôr — uľahčí to preukázanie
        vzniku škody pri preprave. Neskoršie oznámenie nemá za následok automatickú stratu
        práv z chybného plnenia.
      </p>

      <h2>4. Vybavenie reklamácie</h2>
      <p>
        Predávajúci potvrdí prijatie reklamácie a vydá kupujúcemu potvrdenie o jej
        uplatnení. O spôsobe vybavenia rozhodne bez zbytočného odkladu a reklamáciu vybaví
        najneskôr do 30 dní od jej uplatnenia, ak sa s kupujúcim nedohodne na dlhšej
        lehote. Márne uplynutie tejto lehoty zakladá právo odstúpiť od zmluvy alebo žiadať
        výmenu tovaru.
      </p>
      <p>
        Oprávnená reklamácia sa vybavuje bezplatne. Kupujúci má právo na odstránenie vady
        opravou alebo výmenou tovaru; ak nie je náprava možná, má právo na primeranú zľavu
        z ceny alebo na odstúpenie od zmluvy. Pri výbere spôsobu nápravy sa prihliada na
        povahu vady a na náklady, ktoré by náprava vyžadovala.
      </p>
      <p>
        O výsledku reklamácie informuje predávajúci kupujúceho e-mailom a vydá písomný
        doklad o vybavení reklamácie.
      </p>

      <h2>5. Náklady</h2>
      <p>
        Pri oprávnenej reklamácii znáša náklady na dopravu tovaru predávajúci. Ak sa
        reklamácia ukáže ako neoprávnená, náklady na prepravu znáša kupujúci. Pri
        rozmernom tovare treba spôsob prepravy dohodnúť vopred.
      </p>

      <h2>6. Alternatívne riešenie sporov</h2>
      <p>
        Ak kupujúci — spotrebiteľ nie je spokojný s vybavením reklamácie, má právo obrátiť
        sa na predávajúceho so žiadosťou o nápravu. Ak predávajúci odpovie zamietavo alebo
        neodpovie do 30 dní, môže spotrebiteľ podať návrh na alternatívne riešenie sporu
        podľa zákona č. 391/2015 Z. z. Príslušným subjektom je Slovenská obchodná
        inšpekcia (
        <a href="https://www.soi.sk" rel="noreferrer" target="_blank">
          soi.sk
        </a>
        ) alebo iná oprávnená právnická osoba zo zoznamu vedeného Ministerstvom
        hospodárstva SR. Európska platforma ODR bola ukončená 20. júla 2025.
      </p>
      <p>
        Tento reklamačný poriadok nadobúda účinnosť <Doplnit co="dátum účinnosti" />.
      </p>
    </PravnaStranka>
  );
}
