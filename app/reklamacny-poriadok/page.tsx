import type { Metadata } from "next";
import { PravnaStranka, Doplnit } from "../pravne";

export const metadata: Metadata = { title: "Reklamačný poriadok" };

export default function ReklamacnyPoriadok() {
  return (
    <PravnaStranka titul="Reklamačný poriadok" aktualizovane="11. augusta 2026">
      <h2>1. Všeobecné ustanovenia</h2>
      <p>
        Tento reklamačný poriadok upravuje postup pri uplatňovaní reklamácií na tovar
        zakúpený od <Doplnit co="obchodné meno" /> prostredníctvom aquaprime.sk. Je
        neoddeliteľnou súčasťou <a href="/obchodne-podmienky">obchodných podmienok</a>.
      </p>

      <h2>2. Záručná doba</h2>
      <p>
        Na tovar sa poskytuje záruka 24 mesiacov od prevzatia. Záruka sa nevzťahuje na
        bežné opotrebenie, mechanické poškodenie po prevzatí, nesprávnu montáž alebo
        používanie v rozpore s návodom (napr. preťaženie skrinky nad uvedenú nosnosť,
        umiestnenie akvária na nerovný či nevhodný podklad).
      </p>

      <h2>3. Uplatnenie reklamácie</h2>
      <p>
        Reklamáciu je možné uplatniť e-mailom na <Doplnit co="e-mail" /> — uveďte číslo
        objednávky, popis vady a priložte fotografie. Pri preprave poškodenú zásielku
        odporúčame spísať s kuriérom zápis o škode hneď pri prevzatí a poškodenie
        nahlásiť do 24 hodín.
      </p>

      <h2>4. Vybavenie reklamácie</h2>
      <p>
        Predávajúci potvrdí prijatie reklamácie e-mailom a rozhodne o spôsobe vybavenia
        bez zbytočného odkladu, najneskôr do 30 dní od uplatnenia. Po tejto lehote má
        spotrebiteľ právo od zmluvy odstúpiť alebo žiadať výmenu. Oprávnená reklamácia
        sa vybavuje bezplatne — opravou, výmenou, primeranou zľavou alebo vrátením ceny.
      </p>

      <h2>5. Alternatívne riešenie sporov</h2>
      <p>
        Ak spotrebiteľ nie je spokojný s vybavením reklamácie, môže podať návrh na
        alternatívne riešenie sporu Slovenskej obchodnej inšpekcii
        (<a href="https://www.soi.sk" rel="noreferrer" target="_blank">soi.sk</a>) alebo
        využiť platformu <a href="https://ec.europa.eu/consumers/odr" rel="noreferrer" target="_blank">ODR</a>.
      </p>
    </PravnaStranka>
  );
}
