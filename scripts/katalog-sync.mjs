// Synchronizácia katalógu skriniek medzi úložiskom (to, čo edituje klient
// v administrácii) a app/products.ts (pôvodné dáta v kóde).
//
// Kým klient v administrácii nič neuloží, web beží z products.ts. Po prvom
// uložení je pravdou úložisko a zmeny v products.ts sa na webe NEPREJAVIA.
// Pri hromadných úpravách v kóde (import fotiek z archívu a pod.) preto:
//
//   node scripts/katalog-sync.mjs stav        čo je v úložisku
//   node scripts/katalog-sync.mjs stiahni     úložisko → products.ts
//   … úpravy v products.ts, node scripts/check-product-images.mjs …
//   node scripts/katalog-sync.mjs nahraj      products.ts → úložisko (nová verzia)
//   … nasadenie (každé nasadenie si katalóg načíta nanovo) …
//
// `nahraj` odmietne zapísať, ak klient medzitým v administrácii niečo uložil —
// inak by import prepísal jeho prácu. Vtedy znova `stiahni` a úpravu zopakuj.
//
// Predvolene pracuje s ostrým katalógom (priečinok "katalog"). Prepínač
// --test prepne na "katalog-test", ktorý používa lokálny vývoj.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SUBOR = path.join(ROOT, "app", "products.ts");
const ZNACKA = path.join(ROOT, ".katalog-zaklad.json");
const MARKER = "export const SEED_PRODUKTY: Product[] = ";

const [prikaz, ...prepinace] = process.argv.slice(2);
const KOREN = prepinace.includes("--test") ? "katalog-test" : "katalog";
const AKTUALNA = `${KOREN}/skrinky.json`;

for (const riadok of readFileSync(path.join(ROOT, ".env.local"), "utf8").split(/\r?\n/)) {
  const m = riadok.match(/^\s*(BLOB_READ_WRITE_TOKEN)\s*=\s*"?([^"]*)"?\s*$/);
  if (m) process.env[m[1]] = m[2];
}
if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error("V .env.local chýba BLOB_READ_WRITE_TOKEN (npx vercel env pull).");
const { get, put } = await import("@vercel/blob");

async function citaj() {
  const r = await get(AKTUALNA, { access: "private", useCache: false });
  if (!r || r.statusCode !== 200) return null;
  const obal = JSON.parse(await new Response(r.stream).text());
  // slabý ETag (W/"…") podmienený zápis neprijme — viď app/katalog/uloziste.ts
  return { obal, etag: r.blob.etag.replace(/^W\//, "") };
}

function seedZoSuboru() {
  const src = readFileSync(SUBOR, "utf8");
  const i = src.indexOf(MARKER);
  if (i < 0) throw new Error("V products.ts sa nenašiel SEED_PRODUKTY.");
  const zac = i + MARKER.length;
  const kon = src.indexOf("\n];", zac) + 2;
  return { src, zac, kon, data: JSON.parse(src.slice(zac, kon)) };
}

if (prikaz === "stav") {
  const r = await citaj();
  if (!r) console.log(`[${KOREN}] V úložisku nič nie je — web beží z products.ts.`);
  else
    console.log(
      `[${KOREN}] Uložené ${r.obal.kedy}, ${r.obal.kto}: „${r.obal.poznamka}"\n` +
        `${r.obal.data.length} skriniek, ${r.obal.data.filter((p) => p.skryta).length} rozpracovaných.`,
    );
  if (existsSync(ZNACKA)) console.log("Posledné stiahnutie:", JSON.parse(readFileSync(ZNACKA, "utf8")).kedy);
} else if (prikaz === "stiahni") {
  const r = await citaj();
  if (!r) {
    console.log(`[${KOREN}] V úložisku nič nie je — products.ts je aktuálny, netreba nič sťahovať.`);
  } else {
  const { src, zac, kon } = seedZoSuboru();
  writeFileSync(SUBOR, src.slice(0, zac) + JSON.stringify(r.obal.data, null, 2) + src.slice(kon), "utf8");
  writeFileSync(ZNACKA, JSON.stringify({ koren: KOREN, kedy: r.obal.kedy, etag: r.etag }, null, 2), "utf8");
  console.log(`Stiahnuté do products.ts: ${r.obal.data.length} skriniek (verzia ${r.obal.kedy}, ${r.obal.kto}).`);
  }
} else if (prikaz === "nahraj") {
  const { data } = seedZoSuboru();
  const r = await citaj();
  const zaklad = existsSync(ZNACKA) ? JSON.parse(readFileSync(ZNACKA, "utf8")) : null;
  if (r && (!zaklad || zaklad.koren !== KOREN || zaklad.kedy !== r.obal.kedy)) {
    console.error(
      `Odmietnuté: v úložisku je verzia z ${r.obal.kedy} (${r.obal.kto}), ` +
        `ale products.ts vychádza z ${zaklad?.kedy ?? "pôvodných dát"}. ` +
        `Klient medzitým niečo uložil — spusti „stiahni" a úpravu zopakuj.`,
    );
    // exitCode namiesto process.exit — na Windows by prerušený sieťový handle zhodil Node
    process.exitCode = 1;
  } else {
  const kedy = new Date().toISOString();
  const poznamka = prepinace.find((x) => !x.startsWith("--")) ?? "Hromadná úprava z kódu";
  const telo = JSON.stringify({ data, kedy, kto: "Samuel (import)", poznamka });
  // podmienený zápis — ak klient uloží v tej istej chvíli, zápis zlyhá a nič sa neprepíše
  await put(AKTUALNA, telo, {
    access: "private",
    contentType: "application/json",
    ...(r ? { ifMatch: r.etag } : { allowOverwrite: false }),
  });
  await put(`${KOREN}/historia/skrinky/${kedy.replace(/[:.]/g, "-")}.json`, telo, {
    access: "private",
    contentType: "application/json",
  });
  writeFileSync(ZNACKA, JSON.stringify({ koren: KOREN, kedy }, null, 2), "utf8");
  console.log(`Nahraté: ${data.length} skriniek ako verzia ${kedy}. Web ju načíta pri najbližšom nasadení.`);
  }
} else {
  console.log("Použitie: node scripts/katalog-sync.mjs stav|stiahni|nahraj [\"poznámka\"] [--test]");
  process.exitCode = 1;
}
