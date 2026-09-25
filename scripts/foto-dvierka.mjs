/**
 * Počet dvierok na každej produktovej fotke.
 *
 * Klient upresnil konštrukciu: pod 120 cm dve dvierka, od 120 cm tri,
 * Vrátane 200 cm tri. Fotky sa preto nesmú dediť naprieč týmito hranicami —
 * 150 cm skrinka nemôže mať v galérii dvojdverovú fotku.
 *
 *   2 — na zábere sú 2 dvierka (alebo rám s 2 poľami)
 *   3 — na zábere sú 3 dvierka (alebo rám s 3 poľami)
 *   0 — detail pántu, textúra, bočnica alebo výrez, kde dvierka nevidno;
 *       taká fotka je použiteľná pri oboch vyhotoveniach
 *
 * Hodnoty sú odčítané vizuálne z fotiek, nie odvodené z názvu súboru —
 * názov klame (napr. standard-100x40x90-black-matt-02 je trojdverová).
 */

import { dvierkaPreSirku } from "../app/cabinet-construction.ts";
export { dvierkaPreSirku };

export const DVIERKA = {
  "basic-100x40x90": { def: 2 },
  "basic-150x50x80": { def: 3 },

  "premium-100x40x90-black-matt": { def: 2, 3: 0 },
  "premium-100x40x90-cool-white": { def: 2, 4: 0, 5: 0 },
  "premium-100x40x90-dub-hunton-black-matt": { def: 2, 6: 0 },
  "premium-100x40x90-dub-sonoma": { def: 2, 6: 0 },

  "standard-100x40x90-black-matt": { def: 2, 2: 3 },
  "standard-100x40x90-cool-white": { def: 2 },

  /* dodané klientom 8. 9. 2026 — dvojdverové, čiže rozmer pod 120 cm */
  "standard-100x40x80-cool-white": { def: 2, 7: 0 },
  "standard-100x40x80-black-matt": { def: 2 },
  /* zábery s opláštených vnútrom — kompletné opláštenie je znak Premium */
  "premium-100x40x80-cool-white": { def: 2 },
  "premium-100x40x80-black-matt-orech": { def: 2 },
  /* otvorené dvierka, opláštené dno aj bočnice — dodané klientom 25. 9. 2026 */
  "premium-100x40x80-black-matt": { def: 2 },
  "premium-100x40x80-dub-sonoma": { def: 2 },
  "premium-100x40x80-dub-spanielsky": { def: 2 },
  "premium-100x40x80-choco-vintage-oak": { def: 2 },
  "premium-100x40x80-dub-hunton-black-matt": { def: 2 },
  "premium-100x40x80-dub-spanielsky-black-matt": { def: 2 },
  /* jedna sada rozhádzaná pod tromi názvami rozmerov — zjednotená */
  "standard-100x40x80-black-matt-orech": { def: 2, 12: 0 },

  "standard-150x50x80-black-matt": { def: 3 },

  "standard-200x60x60-antracit": { def: 3, 6: 0 },
  "standard-200x60x60-black-matt": { def: 3, 1: 0, 3: 0 },
  "standard-200x60x60-cool-white": { def: 0 },
  "standard-200x60x60-dub-sonoma": { def: 3 },

  "standard-80x40x90-antracit": { def: 2, 1: 0 },
  "standard-80x40x90-artisan-antracit": { def: 2, 1: 0, 8: 0 },
  "standard-80x40x90-black-matt": { def: 2, 1: 0 },
  "standard-80x40x90-dub-sonoma": { def: 2, 2: 0 },

  /* zo setu vypadli tri zábery svetlého dubu (pôvodne 02, 07, 10) — patria
     k dekoru dub španielsky, nie k čokoládovému; zvyšok prečíslovaný */
  "choco-vintage-oak": { def: 2, 2: 3, 7: 3, 10: 3, 11: 3, 4: 0, 13: 0 },
  "dub-spanielsky": { def: 2, 2: 3, 5: 3, 6: 3, 10: 3, 13: 3, 11: 0, 14: 0 },
  "dub-spanielsky-black-matt": { def: 2, 1: 0, 2: 0, 12: 0, 13: 0 },

  /* dodané 12. 9. 2026 — trojdverové zábery dekorov, ktoré sme mali len
     na menších dvojdverových skrinkách; 05 a 06 sú detail otvorenej
     skrinky a pántu, tam sa dvierka počítať nedajú */
  "premium-120x40x80-dub-spanielsky-black-matt": { def: 3, 5: 0, 6: 0 },
  "premium-120x40x80-dub-hunton-black-matt": { def: 3, 5: 0, 6: 0 },

  /* dodané 14. 9. 2026 — ŠTANDARD trojdverový, doteraz chýbal
     (04 je bočnica, 06 detail pántu, na oboch dvierka nevidno) */
  "standard-120x40x80-dub-hunton-black-matt": { def: 3, 4: 0, 6: 0 },
  "standard-120x40x80-black-matt-orech": { def: 3, 4: 0, 6: 0 },
  "standard-120x40x80-dub-spanielsky-black-matt": { def: 3, 4: 0 },
  "standard-120x40x80-artisan-antracit": { def: 3, 4: 0, 6: 0 },
  /* biela sada z 12. 9. — bez bocnice, 05 a 06 su detaily pantu */
  "standard-120x40x80-cool-white": { def: 3, 5: 0, 6: 0 },

  /* PREMIUM v dekoroch, ktore mal doteraz len standard — 04 je bocnica */
  "premium-120x40x80-antracit": { def: 3, 4: 0 },
  "premium-100x40x80-antracit": { def: 2, 4: 0 },

  /* 4-dverové sady od klienta 16. 9. 2026 — od 200 cm sú štyri dvierka */
  "premium-200x50x70-antracit": { def: 4 },
  "premium-200x50x70-artisan": { def: 4 },
  "premium-200x50x70-artisan-cierna": { def: 4 },
  "premium-200x50x70-cool-white": { def: 4 },
  "premium-200x50x70-choco-vintage-oak": { def: 4 },
  "premium-200x50x70-black-matt": { def: 4 },
  "premium-200x50x70-dub-hunton": { def: 4 },
  "premium-200x50x70-dub-spanielsky": { def: 4 },
  "premium-200x50x70-mouse-grey": { def: 4 },
  "premium-200x50x70-black-matt-orech": { def: 4 },
  "premium-120x40x80-black-matt-orech": { def: 3, 5: 0, 6: 0 },
  "premium-120x40x80-cool-white": { def: 3, 5: 0, 6: 0 },
  /* STANDARD 200 x 50 x 70 - stvordverove, dodane klientom 25. 9. 2026 */
  "standard-200x50x70-black-matt": { def: 4 },
  "standard-200x50x70-cool-white": { def: 4 },
  "standard-200x50x70-choco-vintage-oak": { def: 4 },
  "standard-200x50x70-black-matt-orech": { def: 4 },
  "standard-200x50x70-dub-hunton": { def: 4 },
  "standard-200x50x70-artisan": { def: 4 },
  "standard-200x50x70-artisan-cierna": { def: 4 },
  "standard-200x50x70-mouse-grey": { def: 4 },
};

/**
 * Zábery s otvorenými dvierkami alebo holým rámom. Sú užitočné v galérii,
 * ale ako titulná fotka karty v katalógu vyzerajú nedorobene — chceme
 * zatvorenú skrinku. (Rad Basic je výnimka, tam je rám celý produkt.)
 */
export const OTVORENE = new Set([
  "premium-100x40x90-black-matt-03", "premium-100x40x90-black-matt-06",
  "premium-100x40x90-cool-white-05", "premium-100x40x90-cool-white-06", "premium-100x40x90-cool-white-08",
  "premium-100x40x90-dub-hunton-black-matt-03", "premium-100x40x90-dub-hunton-black-matt-06",
  "premium-100x40x90-dub-hunton-black-matt-08",
  "premium-100x40x90-dub-sonoma-04",
  "standard-100x40x90-black-matt-01",
  "standard-100x40x90-cool-white-01", "standard-100x40x90-cool-white-02",
  "standard-150x50x80-black-matt-01",
  "standard-200x60x60-antracit-01",
  "standard-200x60x60-black-matt-03",
  "standard-200x60x60-cool-white-01",
  "standard-200x60x60-dub-sonoma-02",
  "standard-80x40x90-antracit-01", "standard-80x40x90-antracit-04", "standard-80x40x90-antracit-08",
  "standard-80x40x90-artisan-antracit-02", "standard-80x40x90-artisan-antracit-06", "standard-80x40x90-artisan-antracit-07",
  "standard-80x40x90-black-matt-01", "standard-80x40x90-black-matt-02", "standard-80x40x90-black-matt-03",
  "standard-100x40x80-black-matt-orech-09", "standard-100x40x80-black-matt-orech-10",
  "standard-100x40x80-black-matt-orech-11",
  "premium-100x40x80-black-matt-orech-01", "premium-100x40x80-black-matt-orech-02",
  "premium-100x40x80-black-matt-orech-03",
  "premium-100x40x80-cool-white-01", "premium-100x40x80-cool-white-02",
  "premium-100x40x80-cool-white-03",
  "standard-100x40x80-black-matt-05",
  "standard-80x40x90-dub-sonoma-01", "standard-80x40x90-dub-sonoma-02", "standard-80x40x90-dub-sonoma-03",

  "choco-vintage-oak-01", "choco-vintage-oak-07", "choco-vintage-oak-08",
  "dub-spanielsky-01", "dub-spanielsky-03", "dub-spanielsky-06", "dub-spanielsky-07",
  "dub-spanielsky-black-matt-03", "dub-spanielsky-black-matt-07", "dub-spanielsky-black-matt-10",
]);

/**
 * Čelné zábery zatvorenej skrinky (kamera kolmo spredu). Katalógová karta
 * ich uprednostňuje, aby boli všetky skrinky otočené z rovnakého uhla.
 * Odčítané z fotiek: sklon hornej hrany do 0,002 šírky, bez scén a bočníc.
 */
export const CELNE = new Set([
  "basic-100x40x90-01", "basic-100x40x90-02", "basic-100x40x90-03", "basic-100x40x90-04",
  "basic-100x40x90-05", "basic-100x40x90-06", "basic-100x40x90-07",
  "choco-vintage-oak-02", "choco-vintage-oak-09",
  "dub-spanielsky-10", "dub-spanielsky-12",
  "premium-100x40x90-black-matt-04",
  "premium-100x40x90-cool-white-07",
  "premium-100x40x90-dub-hunton-black-matt-05",
  "premium-100x40x90-dub-sonoma-02",
  "standard-100x40x80-black-matt-01",
  "standard-100x40x80-black-matt-orech-01",
  "standard-100x40x80-cool-white-03",
  "standard-200x60x60-antracit-02", "standard-200x60x60-black-matt-02", "standard-200x60x60-dub-sonoma-04",
  "standard-80x40x90-antracit-03",
]);

/** Je záber čelný (kolmo spredu)? */
export const jeCelna = (nazov) =>
  CELNE.has(nazov.replace(/^\/img\/products\//, "").replace(/\.webp$/, ""));

/** Je na zábere otvorená skrinka / holý rám? */
export const jeOtvorena = (nazov) =>
  OTVORENE.has(nazov.replace(/^\/img\/products\//, "").replace(/\.webp$/, ""));

/**
 * Koľko dvierok má skrinka danej šírky podľa zadania klienta:
 *   pod 120 cm        … 2
 *   od 120 cm vrátane … 3   (120 cm už patrí sem)
 *   200 cm            … 3
 */


/** Počet dvierok na konkrétnej fotke; 0 = nedá sa určiť (použiteľná vždy). */
export function dvierkaFotky(nazov) {
  const led = nazov.match(/-(2|3)d-\d+\.webp$/);
  if (led) return Number(led[1]);
  const schema = nazov.match(/-(2|3)d\.svg$/);
  if (schema) return Number(schema[1]);
  const m = nazov.replace(/^\/img\/products\//, "").match(/^(.+)-(\d+)\.webp$/);
  if (!m) return null;
  const set = DVIERKA[m[1]];
  if (!set) return null;
  const n = Number(m[2]);
  return set[n] ?? set.def;
}
