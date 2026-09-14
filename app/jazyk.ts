/**
 * Dvojjazyčnosť webu.
 *
 * Slovenčina žije na pôvodných cestách („/skrinky"), angličtina na tých istých
 * cestách s predponou „/en" („/en/skrinky"). Obsah stránky je v oboch prípadoch
 * ten istý komponent — mení sa len slovník, ktorý dostane v propse. Vďaka tomu
 * ostáva layout aj triedy CSS zhodné a preklad nemôže nič rozhodiť.
 *
 * Nové reťazce pridávaj VŽDY do oboch slovníkov; typ `Slovnik` je odvodený zo
 * slovenského, takže chýbajúci anglický preklad neprejde cez TypeScript.
 */

export type Jazyk = "sk" | "en";

/** Cesta prepnutá do druhého jazyka („/skrinky" ⇄ „/en/skrinky"). */
export function druhyJazyk(cesta: string, jazyk: Jazyk): string {
  if (jazyk === "sk") return cesta === "/" ? "/en" : `/en${cesta}`;
  const bez = cesta.replace(/^\/en/, "");
  return bez === "" ? "/" : bez;
}

/** Odkaz v rámci aktuálneho jazyka: odkaz("/skrinky", "en") → "/en/skrinky". */
export function odkaz(cesta: string, jazyk: Jazyk): string {
  if (jazyk === "sk") return cesta;
  if (cesta === "/") return "/en";
  return cesta.startsWith("/en") ? cesta : `/en${cesta}`;
}

/** Jazyk odvodený z cesty — pre klientské komponenty, ktoré poznajú pathname. */
export function jazykZCesty(cesta: string): Jazyk {
  return cesta === "/en" || cesta.startsWith("/en/") ? "en" : "sk";
}

/**
 * Názvy radov („ŠTANDARD 120 × 40 × 80") sú uložené v dátach po slovensky.
 * Na anglickej verzii stačí prepísať jediné slovo, ktoré sa líši — čísla,
 * rozmery aj názvy BASIC a PREMIUM sú v oboch jazykoch rovnaké.
 */
export function radText(text: string, jazyk: Jazyk): string {
  return jazyk === "en"
    ? text.replace(/ŠTANDARD/g, "STANDARD").replace(/Štandard/g, "Standard")
    : text;
}

/**
 * Dekory sa volajú podľa vzorkovníkov výrobcu dosiek — väčšina názvov je
 * medzinárodná („Black Matt", „Artisan"), slovenské sú len tie opisné.
 * Zložené názvy typu „Dub španielsky / Čierna matná" prekladáme po častiach.
 */
const DEKORY_EN: Record<string, string> = {
  Antracit: "Anthracite",
  Orech: "Walnut",
  "Dub Sonoma": "Sonoma Oak",
  "Dub Hunton": "Hunton Oak",
  "Dub španielsky": "Spanish Oak",
  "Čierna matná": "Black Matt",
  "Čierny rám + doska v dekore": "Black frame + board in a decor",
  "číre sklo": "clear glass",
};

export function dekorNazov(nazov: string, jazyk: Jazyk): string {
  if (jazyk === "sk") return nazov;
  return nazov
    .split(" / ")
    .map((cast) => DEKORY_EN[cast] ?? cast)
    .join(" / ");
}

/**
 * Ceny a objemy sú v dátach reťazce. Pri rozmeroch, ktoré klient zatiaľ
 * neocenil, stojí namiesto čísla „Na dopyt" — to je jediné slovo, ktoré
 * treba na anglickej verzii prepísať.
 */
export function cenaText(text: string, jazyk: Jazyk): string {
  return jazyk === "en" ? text.replace("Na dopyt", "On request") : text;
}

/** „160 × 60 cm (pôdorys)" → „160 × 60 cm (footprint)" */
export function podorysText(text: string, jazyk: Jazyk): string {
  return jazyk === "en" ? text.replace("(pôdorys)", "(footprint)") : text;
}
