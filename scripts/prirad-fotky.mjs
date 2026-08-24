/**
 * Prepíše galérie v app/products.ts tak, aby počet dvierok na fotke
 * sedel s rozmerom skrinky (do 100 cm 2 dvierka, nad 100 cm 3) a doplní
 * galérie s LED podsvietením (public/img/products/led).
 *
 *   node scripts/prirad-fotky.mjs          # náhľad zmien
 *   node scripts/prirad-fotky.mjs --zapis  # zapíše products.ts
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { dvierkaFotky, dvierkaPreSirku, jeOtvorena } from "./foto-dvierka.mjs";

const KOREN = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SUBOR = path.join(KOREN, "app/products.ts");
const FOTKY = path.join(KOREN, "public/img/products");
const LED = path.join(FOTKY, "led");
const ZAPIS = process.argv.includes("--zapis");

const { PRODUCTS } = await import(`file:///${SUBOR.replace(/\\/g, "/")}`);

/* ── dostupné fotky, zoskupené do setov ─────────────────────────── */
const sety = {};
for (const f of fs.readdirSync(FOTKY)) {
  const m = f.match(/^(.+)-(\d+)\.webp$/);
  if (!m) continue;
  (sety[m[1]] ??= []).push(`/img/products/${f}`);
}
for (const k in sety) sety[k].sort();

/* ktoré sety patria ku ktorému dekoru — čítame z doterajšieho katalógu,
   názvy setov totiž nie sú jednoznačne parsovateľné (dub-spanielsky vs
   dub-spanielsky-black-matt) */
const setyDekoru = {};
for (const p of PRODUCTS)
  for (const d of p.decors)
    for (const img of d.images) {
      const set = img.replace("/img/products/", "").replace(/-\d+\.webp$/, "");
      (setyDekoru[d.id] ??= new Set()).add(set);
    }

const rozborSetu = (set) => {
  const m = set.match(/^(premium|standard|basic)-(\d+)x(\d+)x(\d+)/);
  return m ? { rad: m[1], w: +m[2], d: +m[3] } : { rad: null, w: null, d: null };
};

/* ── LED galérie ────────────────────────────────────────────────── */
const ledSubory = fs.existsSync(LED) ? fs.readdirSync(LED).sort() : [];
const ledSet = (dekor, farba, dv) =>
  ledSubory
    .filter((f) => f.startsWith(`led-${dekor}-${farba}-${dv}d-`))
    .map((f) => `/img/products/led/${f}`);

/** dekor v katalógu → dekor v LED renderoch (len tam, kde sedí povrch) */
const LED_DEKOR = {
  antracit: "antracit",
  "black-matt": "black-matt",
  "cool-white": "cool-white",
  "dub-hunton-black-matt": "dub-hunton",
  "dub-spanielsky": "dub-spanielsky",
};

/* ── prepočet ───────────────────────────────────────────────────── */
const zmeny = [];
for (const p of PRODUCTS) {
  const D = dvierkaPreSirku(p.w);
  for (const d of p.decors) {
    const povodne = d.images.slice();

    /* 1. vyhodíme fotky s nesprávnym počtom dvierok */
    let vybrane = povodne.filter((f) => [D, 0].includes(dvierkaFotky(f)));

    /* 2. doplníme zo setov toho istého dekoru — najprv presný rozmer,
          potom rovnaký rad, až nakoniec zvyšok */
    const kandidati = [...(setyDekoru[d.id] ?? [])]
      .flatMap((set) => (sety[set] ?? []).map((f) => ({ f, ...rozborSetu(set) })))
      .filter(({ f }) => [D, 0].includes(dvierkaFotky(f)))
      .sort((a, b) => {
        const sk = (x) => (x.w === p.w ? 0 : x.rad === p.tier ? 1 : x.rad ? 2 : 3);
        return sk(a) - sk(b) || a.f.localeCompare(b.f);
      })
      .map(({ f }) => f);

    for (const f of kandidati) {
      if (vybrane.length >= Math.max(povodne.length, 4)) break;
      if (!vybrane.includes(f)) vybrane.push(f);
    }
    /* poradie: zatvorená skrinka → otvorená / rám → detaily */
    const poradie = (f) => (dvierkaFotky(f) === 0 ? 2 : jeOtvorena(f) ? 1 : 0);
    vybrane.sort((a, b) => poradie(a) - poradie(b));

    /* 3. ak pre tento počet dvierok neexistuje ani jedna fotka celej
          skrinky, radšej ukážeme pôvodné zábery a otvorene povieme,
          že zachytávajú iné vyhotovenie — prázdna galéria je horšia */
    const bezDvierok = !vybrane.some((f) => dvierkaFotky(f) === D);
    if (bezDvierok) vybrane = povodne.slice();

    /* 4. príznaky ilustračnosti prepočítame nanovo */
    const pouziteSety = [...new Set(vybrane.map((f) => f.replace("/img/products/", "").replace(/-\d+\.webp$/, "")))];
    const rozbory = pouziteSety.map(rozborSetu);
    const inyRad = rozbory.some((r) => r.rad !== p.tier);
    const inyRozmer = rozbory.some((r) => r.w !== null && r.w !== p.w);

    delete d.inherited;
    delete d.illuFrom;
    delete d.illuSize;
    delete d.illuDvierka;
    if (bezDvierok) {
      d.inherited = true;
      d.illuFrom = "dvierka";
      d.illuDvierka = D === 3 ? 2 : 3;
    } else if (inyRad) {
      d.inherited = true;
      d.illuFrom = "rad";
    } else if (inyRozmer) {
      const r = rozbory.find((x) => x.w !== p.w);
      d.inherited = true;
      d.illuFrom = "rozmer";
      d.illuSize = `${r.w} × ${r.d} cm`;
    }

    /* 4. LED galéria pre tento dekor a počet dvierok — len tam, kde sa LED
          dá objednať; rad Basic nemá plášť, do ktorého sa lišta osádza */
    const ldek = p.priceLed ? LED_DEKOR[d.id] : null;
    if (ldek) {
      const teply = ledSet(ldek, "zlta", D);
      const modry = ledSet(ldek, "modra", D);
      if (teply.length || modry.length) {
        d.led = {};
        if (teply.length) d.led.zlta = teply;
        if (modry.length) d.led.modra = modry;
      } else delete d.led;
    } else delete d.led;

    const zmenene = JSON.stringify(povodne) !== JSON.stringify(vybrane);
    if (zmenene) zmeny.push({ slug: p.slug, dekor: d.id, pred: povodne.length, po: vybrane.length });
    d.images = vybrane;
  }
  /* cover katalógovej karty — najlepšia fotka celej skrinky so správnym
     počtom dvierok, inak necháme pôvodnú */
  if (dvierkaFotky(p.cover) !== D || (jeOtvorena(p.cover) && p.tier !== "basic")) {
    const vsetky = p.decors
      .flatMap((d) => d.images)
      .filter((f) => dvierkaFotky(f) === D)
      .sort((a, b) => (p.tier === "basic" ? 0 : jeOtvorena(a) - jeOtvorena(b)));
    const zRadu = vsetky.find((f) => rozborSetu(f.replace("/img/products/", "").replace(/-\d+\.webp$/, "")).rad === p.tier);
    const novy = zRadu ?? vsetky[0];
    if (novy && novy !== p.cover) {
      zmeny.push({ slug: p.slug, dekor: "cover", pred: p.cover.split("/").pop(), po: novy.split("/").pop() });
      p.cover = novy;
    }
  }
}

console.log(`\nupravených galérií: ${zmeny.length}`);
for (const z of zmeny) console.log(`  ${z.slug.padEnd(20)} ${String(z.dekor).padEnd(26)} ${z.pred} → ${z.po}`);

const sLed = PRODUCTS.flatMap((p) => p.decors).filter((d) => d.led).length;
console.log(`\ndekorov s LED galériou: ${sLed}`);

if (!ZAPIS) {
  console.log("\n(náhľad — spusti s --zapis pre zápis do products.ts)");
  process.exit(0);
}

const src = fs.readFileSync(SUBOR, "utf8").replace(/\r\n/g, "\n");
const zac = src.indexOf("export const PRODUCTS: Product[] = [");
const kon = src.indexOf("\n  ];", zac);
if (zac < 0 || kon < 0) throw new Error("nenašiel som pole PRODUCTS");
const telo = JSON.stringify(PRODUCTS, null, 2)
  .split("\n")
  .slice(1, -1)
  .join("\n");
fs.writeFileSync(SUBOR, `${src.slice(0, zac)}export const PRODUCTS: Product[] = [\n${telo}\n  ];${src.slice(kon + 5)}`);
console.log(`\nzapísané → ${SUBOR}`);
