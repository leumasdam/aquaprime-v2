/**
 * Nastaviteľné nožičky sú od 1. 10. 2026 voliteľný doplnok skrinky —
 * zákazník si na detaile vyberie, či ich chce.
 *
 * Cenu klient zatiaľ neurčil. Kým je tu null, web pri nožičkách píše
 * „príplatok na dopyt" a do košíka ani do platby nepripočíta nič; príplatok
 * sa dorieši v potvrdení objednávky. Keď cenu dodá, stačí ju zapísať sem
 * (v eurách s DPH) — detail, košík aj platba ju začnú počítať naraz.
 */
export const NOZICKY_PRIPLATOK: number | null = null;

/** udalosť, ktorou volba nožičiek na detaile oznamuje zmenu tlačidlu do košíka */
export const UDALOST_NOZICKY = "aq:nozicky";
