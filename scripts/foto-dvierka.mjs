/**
 * Počet dvierok na každej produktovej fotke.
 *
 * Klient upresnil konštrukciu: skrinky do 100 cm majú 2 dvierka,
 * všetko nad 100 cm má 3. Fotky sa preto nesmú dediť naprieč touto
 * hranicou — 120 cm skrinka nemôže mať v galérii dvojdverovú fotku.
 *
 *   2 — na zábere sú 2 dvierka (alebo rám s 2 poľami)
 *   3 — na zábere sú 3 dvierka (alebo rám s 3 poľami)
 *   0 — detail pántu, textúra, bočnica alebo výrez, kde dvierka nevidno;
 *       taká fotka je použiteľná pri oboch vyhotoveniach
 *
 * Hodnoty sú odčítané vizuálne z fotiek, nie odvodené z názvu súboru —
 * názov klame (napr. standard-100x40x90-black-matt-02 je trojdverová).
 */

export const DVIERKA = {
  "basic-100x40x90": { def: 2 },
  "basic-150x50x80": { def: 3 },

  "premium-100x40x90-black-matt": { def: 2, 3: 0 },
  "premium-100x40x90-black-matt-orech": { def: 0 },
  "premium-100x40x90-cool-white": { def: 2, 4: 0, 5: 0 },
  "premium-100x40x90-dub-hunton-black-matt": { def: 2, 6: 0 },
  "premium-100x40x90-dub-sonoma": { def: 2, 6: 0 },

  "standard-100x40x90-black-matt": { def: 2, 2: 3 },
  "standard-100x40x90-black-matt-orech": { def: 2 },
  "standard-100x40x90-cool-white": { def: 2 },

  "standard-150x50x80-black-matt": { def: 3 },

  "standard-200x60x60-antracit": { def: 3, 6: 0 },
  "standard-200x60x60-black-matt": { def: 3, 1: 0, 3: 0 },
  "standard-200x60x60-black-matt-orech": { def: 0 },
  "standard-200x60x60-cool-white": { def: 0 },
  "standard-200x60x60-dub-sonoma": { def: 3 },

  "standard-80x40x90-antracit": { def: 2, 1: 0 },
  "standard-80x40x90-artisan-antracit": { def: 2, 1: 0, 8: 0 },
  "standard-80x40x90-black-matt": { def: 2, 1: 0 },
  "standard-80x40x90-black-matt-orech": { def: 2, 5: 0 },
  "standard-80x40x90-dub-sonoma": { def: 2, 2: 0 },

  "choco-vintage-oak": { def: 2, 3: 3, 7: 3, 9: 3, 13: 3, 14: 3, 5: 0, 10: 0, 16: 0 },
  "dub-spanielsky": { def: 2, 2: 3, 5: 3, 6: 3, 10: 3, 11: 0 },
  "dub-spanielsky-black-matt": { def: 2, 1: 0, 2: 0, 12: 0, 13: 0 },
};

/**
 * Zábery s otvorenými dvierkami alebo holým rámom. Sú užitočné v galérii,
 * ale ako titulná fotka karty v katalógu vyzerajú nedorobene — chceme
 * zatvorenú skrinku. (Rad Basic je výnimka, tam je rám celý produkt.)
 */
export const OTVORENE = new Set([
  "premium-100x40x90-black-matt-03", "premium-100x40x90-black-matt-06",
  "premium-100x40x90-black-matt-orech-01",
  "premium-100x40x90-cool-white-05", "premium-100x40x90-cool-white-06", "premium-100x40x90-cool-white-08",
  "premium-100x40x90-dub-hunton-black-matt-03", "premium-100x40x90-dub-hunton-black-matt-06",
  "premium-100x40x90-dub-hunton-black-matt-08",
  "premium-100x40x90-dub-sonoma-04",
  "standard-100x40x90-black-matt-01",
  "standard-100x40x90-black-matt-orech-01",
  "standard-100x40x90-cool-white-01", "standard-100x40x90-cool-white-02",
  "standard-150x50x80-black-matt-01",
  "standard-200x60x60-antracit-01",
  "standard-200x60x60-black-matt-03",
  "standard-200x60x60-cool-white-01",
  "standard-200x60x60-dub-sonoma-02",
  "standard-80x40x90-antracit-01", "standard-80x40x90-antracit-04", "standard-80x40x90-antracit-08",
  "standard-80x40x90-artisan-antracit-02", "standard-80x40x90-artisan-antracit-06", "standard-80x40x90-artisan-antracit-07",
  "standard-80x40x90-black-matt-01", "standard-80x40x90-black-matt-02", "standard-80x40x90-black-matt-03",
  "standard-80x40x90-black-matt-orech-01", "standard-80x40x90-black-matt-orech-05",
  "standard-80x40x90-dub-sonoma-01", "standard-80x40x90-dub-sonoma-02", "standard-80x40x90-dub-sonoma-03",
  "choco-vintage-oak-01", "choco-vintage-oak-09", "choco-vintage-oak-11",
  "dub-spanielsky-01", "dub-spanielsky-03", "dub-spanielsky-06", "dub-spanielsky-07",
  "dub-spanielsky-black-matt-03", "dub-spanielsky-black-matt-07", "dub-spanielsky-black-matt-10",
]);

/** Je na zábere otvorená skrinka / holý rám? */
export const jeOtvorena = (nazov) =>
  OTVORENE.has(nazov.replace(/^\/img\/products\//, "").replace(/\.webp$/, ""));

/** Koľko dvierok má skrinka danej šírky podľa zadania klienta. */
export const dvierkaPreSirku = (w) => (w <= 100 ? 2 : 3);

/** Počet dvierok na konkrétnej fotke; 0 = nedá sa určiť (použiteľná vždy). */
export function dvierkaFotky(nazov) {
  const m = nazov.replace(/^\/img\/products\//, "").match(/^(.+)-(\d+)\.webp$/);
  if (!m) return 0;
  const set = DVIERKA[m[1]];
  if (!set) return 0;
  const n = Number(m[2]);
  return set[n] ?? set.def;
}
