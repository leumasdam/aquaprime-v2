/**
 * Úložisko katalógu, ktorý upravuje klient v administrácii.
 *
 * Dáta ležia v súkromnom Vercel Blob store (ten istý, kam ukladajú výsledky
 * SEO agenti). Pre každú kolekciu sú tam dve veci:
 *
 *   katalog/<kolekcia>.json                     aktuálny stav, prepisuje sa
 *   katalog/historia/<kolekcia>/<čas>.json      nemenná kópia každého uloženia
 *
 * História slúži na návrat k predošlej verzii — keď klient niečo pokazí,
 * jedným klikom sa vráti tam, kde bol.
 *
 * Kým kolekcia v úložisku ešte nie je (klient nič neuložil), web beží
 * z pôvodných dát v kóde. Prvé uloženie ich sem skopíruje aj so zmenou.
 * Súkromný store číta bez CDN (useCache: false), takže sa nikdy nestane,
 * že by sa po uložení načítala stará verzia z medzipamäte.
 *
 * Tento modul patrí len na server — potrebuje BLOB_READ_WRITE_TOKEN.
 */

import { BlobNotFoundError, BlobPreconditionFailedError, del, get, list, put } from "@vercel/blob";

export type Kolekcia = "skrinky";

/** koľko verzií histórie držíme — staršie sa pri ukladaní mažú */
const HISTORIA_LIMIT = 40;

export function uloziskoPripravene(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

/**
 * Ostrý web a všetko ostatné (lokálny vývoj, náhľadové nasadenia) zdieľajú
 * jeden Blob store aj jeden kľúč. Bez oddelenia by každé skúšobné uloženie
 * pri vývoji prepísalo živý katalóg. Mimo produkcie preto pracujeme
 * v samostatnom priečinku „katalog-test".
 */
const KOREN = process.env.VERCEL_ENV === "production" ? "katalog" : "katalog-test";

const aktualnaCesta = (k: Kolekcia) => `${KOREN}/${k}.json`;
const historiaPrefix = (k: Kolekcia) => `${KOREN}/historia/${k}/`;

/**
 * Prečíta JSON z úložiska. Chýbajúci súbor je null — to je bežný stav, kým
 * klient nič neuložil. Každú inú chybu (výpadok siete, úložiska) ale
 * posielame ďalej. Keby sme ju premenili na null, web by si pomyslel, že
 * nič uložené nie je, vrátil by pôvodný katalóg z kódu a ten by si zapamätal
 * v cache — všetky úpravy klienta by potichu zmizli. Výnimka naopak cache
 * nezapíše a Next ponechá poslednú dobrú verziu.
 */
async function citajJson<T>(cesta: string): Promise<T | null> {
  try {
    const res = await get(cesta, { access: "private", useCache: false });
    if (!res || res.statusCode !== 200 || !res.stream) return null;
    return JSON.parse(await new Response(res.stream).text()) as T;
  } catch (e) {
    if (e instanceof BlobNotFoundError) return null;
    throw e;
  }
}

/** Aktuálne uložené dáta kolekcie, alebo null, ak ich klient ešte neuložil. */
export async function nacitajUlozene<T>(k: Kolekcia): Promise<T | null> {
  if (!uloziskoPripravene()) return null;
  const obal = await citajJson<{ data: T }>(aktualnaCesta(k));
  return obal?.data ?? null;
}

export type ZaznamHistorie = {
  /** cesta v úložisku — identifikátor verzie */
  id: string;
  kedy: string;
  kto: string;
  poznamka: string;
};

type Obal<T> = { data: T; kedy: string; kto: string; poznamka: string };

/** Aktuálny obal aj s ETagom, podľa ktorého sa pozná, či ho medzitým niekto nezmenil. */
async function nacitajSEtagom<T>(k: Kolekcia): Promise<{ obal: Obal<T>; etag: string } | null> {
  try {
    const res = await get(aktualnaCesta(k), { access: "private", useCache: false });
    if (!res || res.statusCode !== 200 || !res.stream) return null;
    const obal = JSON.parse(await new Response(res.stream).text()) as Obal<T>;
    /* Veľký súbor prichádza skomprimovaný a úložisko k nemu vracia slabý
       ETag (W/"…"). Podmienený zápis slabý neprijme, hoci hodnota v úvodzovkách
       je tá istá ako pri silnom — overené proti úložisku 29. 9. 2026. */
    return { obal, etag: res.blob.etag.replace(/^W\//, "") };
  } catch (e) {
    // ako pri citajJson: len chýbajúci súbor znamená „zatiaľ nič"
    if (e instanceof BlobNotFoundError) return null;
    throw e;
  }
}

/** Aktuálne uložená verzia aj s časom — editor ju potrebuje ako základ. */
export async function nacitajSMetou<T>(k: Kolekcia): Promise<{ data: T; kedy: string; kto: string } | null> {
  if (!uloziskoPripravene()) return null;
  const r = await nacitajSEtagom<T>(k);
  return r ? { data: r.obal.data, kedy: r.obal.kedy, kto: r.obal.kto } : null;
}

/** Zmenu odmietla kontrola — správa ide rovno do editora. */
export class ZamietnutaZmena extends Error {
  constructor(
    sprava: string,
    public readonly detail?: unknown,
    public readonly konflikt = false,
  ) {
    super(sprava);
  }
}

/**
 * Atomická úprava kolekcie: prečíta aktuálny stav, nechá `zmena` spraviť
 * novú verziu a zapíše ju len vtedy, ak ju medzitým nikto iný nezmenil
 * (podmienený zápis cez ETag). Keď sa dvaja trafia do tej istej chvíle,
 * pomalší si prečíta novší stav a skúsi to znova — nikto nikomu neprepíše
 * zmenu na inej skrinke.
 *
 * `zmena` dostane null, kým kolekcia v úložisku ešte nie je; vtedy si má
 * zobrať pôvodné dáta z kódu. Vracia novú verziu aj popis zmeny do histórie.
 */
export async function upravKolekciu<T>(
  k: Kolekcia,
  zmena: (aktualne: T | null) => { data: T; poznamka: string },
  kto: string,
): Promise<{ data: T; zaznam: ZaznamHistorie }> {
  if (!uloziskoPripravene()) throw new ZamietnutaZmena("Úložisko nie je nastavené (chýba BLOB_READ_WRITE_TOKEN).");

  for (let pokus = 0; pokus < 6; pokus++) {
    // pri opakovaní chvíľu počkáme, náhodne — súbežné zápisy sa tak rozostúpia
    if (pokus > 0) await new Promise((r) => setTimeout(r, 60 + Math.random() * 180 * pokus));
    const aktualne = await nacitajSEtagom<T>(k);
    // popis zmeny do histórie vzniká až pri úprave — vie, čo sa naozaj zmenilo
    const { data, poznamka } = zmena(aktualne?.obal.data ?? null);

    const kedy = new Date().toISOString();
    const telo = JSON.stringify({ data, kedy, kto, poznamka } satisfies Obal<T>);
    try {
      await put(aktualnaCesta(k), telo, {
        access: "private",
        contentType: "application/json",
        // existujúci súbor prepíšeme len ak je to stále ten, ktorý sme čítali;
        // prvý zápis zlyhá, ak ho medzitým stihol vytvoriť niekto iný
        ...(aktualne ? { ifMatch: aktualne.etag } : { allowOverwrite: false }),
      });
    } catch (e) {
      /* Tri podoby tej istej situácie — niekto iný práve zapísal:
         ETag už nesedí, súbor medzitým vznikol, alebo úložisko ešte
         dokončuje cudzí zápis („conflicting operation", HTTP 409).
         Všetky tri sa riešia rovnako: načítať znova a zopakovať. */
      const sprava = e instanceof Error ? e.message : "";
      const kolizia =
        e instanceof BlobPreconditionFailedError ||
        /conflicting operation/i.test(sprava) ||
        (!aktualne && /already exists/i.test(sprava));
      if (kolizia) continue;
      throw e;
    }

    const id = `${historiaPrefix(k)}${kedy.replace(/[:.]/g, "-")}.json`;
    await put(id, telo, { access: "private", contentType: "application/json" });
    void orezHistoriu(k);
    return { data, zaznam: { id, kedy, kto, poznamka } };
  }
  throw new ZamietnutaZmena("Katalóg práve ukladá niekto iný. Skúste to o chvíľu znova.", undefined, true);
}

async function vsetkyVerzie(k: Kolekcia) {
  const bloby: { pathname: string }[] = [];
  let kurzor: string | undefined;
  do {
    const strana = await list({ prefix: historiaPrefix(k), cursor: kurzor, limit: 1000 });
    bloby.push(...strana.blobs);
    kurzor = strana.hasMore ? strana.cursor : undefined;
  } while (kurzor);
  return bloby.map((b) => b.pathname).sort();
}

async function orezHistoriu(k: Kolekcia): Promise<void> {
  try {
    const cesty = await vsetkyVerzie(k);
    const nadbytocne = cesty.slice(0, Math.max(0, cesty.length - HISTORIA_LIMIT));
    if (nadbytocne.length) await del(nadbytocne);
  } catch {
    /* orezanie histórie nie je kritické — skúsi sa znova pri ďalšom uložení */
  }
}

/** Zoznam verzií od najnovšej, bez samotných dát. */
export async function historia(k: Kolekcia): Promise<ZaznamHistorie[]> {
  if (!uloziskoPripravene()) return [];
  const cesty = (await vsetkyVerzie(k)).reverse();
  const zaznamy = await Promise.all(
    cesty.map(async (id) => {
      const obal = await citajJson<{ kedy: string; kto: string; poznamka: string }>(id);
      return obal ? { id, kedy: obal.kedy, kto: obal.kto, poznamka: obal.poznamka } : null;
    }),
  );
  return zaznamy.filter((z): z is ZaznamHistorie => z !== null);
}

/** Dáta konkrétnej verzie z histórie — na návrat späť. */
export async function nacitajVerziu<T>(k: Kolekcia, id: string): Promise<T | null> {
  // id musí patriť tejto kolekcii — nech sa nedá načítať ľubovoľný súbor
  if (!id.startsWith(historiaPrefix(k)) || id.includes("..")) return null;
  const obal = await citajJson<{ data: T }>(id);
  return obal?.data ?? null;
}

/* ---------------- fotky ---------------- */

/**
 * Fotky sú v súkromnom store, preto ich web servíruje cez vlastnú adresu
 * /foto/… (app/foto/[...cesta]/route.ts). Cesta je náhodná a nemenná,
 * takže sa dá navždy uložiť do medzipamäte prehliadača aj CDN.
 */
export const FOTO_PREFIX = `${KOREN}/fotky/`;

export function adresaFotky(pathname: string): string {
  return `/foto/${pathname}`;
}

export async function ulozFotku(
  k: Kolekcia,
  subor: Blob,
  pripona: "webp" | "jpg" | "png",
): Promise<string> {
  const nahodne = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
  const cesta = `${FOTO_PREFIX}${k}/${nahodne}.${pripona}`;
  const vysledok = await put(cesta, subor, {
    access: "private",
    contentType: pripona === "jpg" ? "image/jpeg" : `image/${pripona}`,
  });
  return adresaFotky(vysledok.pathname);
}
