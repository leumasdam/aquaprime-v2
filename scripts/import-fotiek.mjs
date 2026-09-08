/**
 * Prevedie klientov archív fotiek do public/img/products.
 *
 * Názov súboru je jediný zdroj pravdy o tom, z ktorého radu, rozmeru a
 * dekoru fotka je — priraďovanie k produktom sa oň opiera. Doterajšie
 * názvy tomu nezodpovedali (napr. celý set pomenovaný „standard“ pochádzal
 * z priečinka PREMIUM), preto ich generujeme priamo zo štruktúry archívu:
 *
 *     <rad>-<rozmer>-<dekor>-NN.webp
 *
 *   node scripts/import-fotiek.mjs "<cesta k archívu>"
 *   node scripts/import-fotiek.mjs "<cesta>" --zapis
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
const sharp = createRequire(import.meta.url)("sharp");

const KOREN = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CIEL = path.join(KOREN, "public/img/products");
const ARCHIV = process.argv[2];
const ZAPIS = process.argv.includes("--zapis");

if (!ARCHIV || !fs.existsSync(ARCHIV)) {
  console.error("Zadaj cestu k archívu:  node scripts/import-fotiek.mjs \"C:/…/Skrinky pod akvária\"");
  process.exit(1);
}

const RAD = { "🥇": "premium", "🥈": "standard", "🥉": "basic" };
const DEKOR = {
  "ANTRACIT": "antracit",
  "ARTISAN - ANTRACIT": "artisan-antracit",
  "BLACK MATT": "black-matt",
  "BLACK MATT - ORECH": "black-matt-orech",
  "COOL WHITE": "cool-white",
  "DUB HUNTON - BLACK MATT": "dub-hunton-black-matt",
  "DUB SONOMA": "dub-sonoma",
};

/* ── načítanie archívu ──────────────────────────────────────────── */
const zdroj = [];
for (const radDir of fs.readdirSync(ARCHIV)) {
  const rad = RAD[[...radDir][0]];
  if (!rad) continue;
  const radCesta = path.join(ARCHIV, radDir);
  for (const rozmer of fs.readdirSync(radCesta)) {
    const rozCesta = path.join(radCesta, rozmer);
    if (!fs.statSync(rozCesta).isDirectory()) continue;
    const deti = fs.readdirSync(rozCesta);
    const maDekory = deti.some((d) => fs.statSync(path.join(rozCesta, d)).isDirectory());

    /* Basic je len kovový rám s doskou — dekory tam nie sú, fotky ležia priamo */
    if (!maDekory) {
      for (const f of deti.sort()) if (/\.(png|jpe?g|webp)$/i.test(f))
        zdroj.push({ rad, rozmer: rozmer.toLowerCase(), dekor: "ram", subor: path.join(rozCesta, f) });
      continue;
    }
    for (const dek of deti) {
      const dekCesta = path.join(rozCesta, dek);
      if (!fs.statSync(dekCesta).isDirectory() || dek.toUpperCase() === "TEXT PRODUKTU") continue;
      const dekor = DEKOR[dek.toUpperCase()];
      if (!dekor) { console.warn("  ! neznámy dekor:", dek); continue; }
      for (const f of fs.readdirSync(dekCesta).sort()) if (/\.(png|jpe?g|webp)$/i.test(f))
        zdroj.push({ rad, rozmer: rozmer.toLowerCase(), dekor, subor: path.join(dekCesta, f) });
    }
  }
}

const skupiny = {};
for (const z of zdroj) (skupiny[`${z.rad}-${z.rozmer}-${z.dekor}`] ??= []).push(z);

console.log(`archív: ${zdroj.length} fotiek v ${Object.keys(skupiny).length} skupinách\n`);
for (const k of Object.keys(skupiny).sort()) console.log("  " + k.padEnd(46), skupiny[k].length);

if (!ZAPIS) {
  console.log("\n(náhľad — spusti s --zapis)");
  process.exit(0);
}

/* ── konverzia ─────────────────────────────────────────────────── */
let n = 0, bajtov = 0;
for (const [set, fotky] of Object.entries(skupiny)) {
  for (let i = 0; i < fotky.length; i++) {
    const meno = `${set}-${String(i + 1).padStart(2, "0")}.webp`;
    const ciel = path.join(CIEL, meno);
    await sharp(fotky[i].subor)
      .resize({ width: 1400, height: 1400, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(ciel);
    bajtov += fs.statSync(ciel).size;
    n++;
  }
}
console.log(`\nzapísaných ${n} fotiek, ${(bajtov / 1024 / 1024).toFixed(1)} MB → ${CIEL}`);
