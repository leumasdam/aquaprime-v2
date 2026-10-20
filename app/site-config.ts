/**
 * Jediný prepínač viditeľnosti webu pre vyhľadávače.
 *
 * true  = web je verejne dostupný, ale vyhľadávače ho majú ignorovať
 *         (noindex, nofollow + robots.txt zakazuje celý web, sitemap sa
 *         neponúka). Odkaz stále funguje, takže sa dá poslať klientovi.
 * false = normálna prevádzka, web sa indexuje.
 *
 * Prepnúť na false, keď budú hotové: reálne realizácie, potvrdené ceny
 * a funkčné odosielanie formulárov.
 */
export const SKRYTY_PRED_VYHLADAVACMI = true;

/**
 * Profil na Instagrame — odkaz z pásu s dlaždicami na domovskej stránke.
 * POZOR: prezývka je zatiaľ odhad, klient ju musí potvrdiť.
 */
export const INSTAGRAM_PROFIL = "https://www.instagram.com/aquaprime.sk/";
export const INSTAGRAM_MENO = "@aquaprime.sk";

/**
 * Konfigurátor skriniek je zamknutý — na webe sa ukazuje zašedený
 * s oznamom „pripravujeme“. Po odomknutí prepnúť na false (20. 10. 2026).
 */
export const KONFIGURATOR_ZAMKNUTY = true;
