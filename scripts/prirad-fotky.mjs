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

/**
 * Novo dodané sety, ktoré v katalógu ešte nie sú, a tak by ich odvodenie
 * vyššie nenašlo — priraďujeme ich k dekoru ručne. Po prvom behu ich už
 * katalóg obsahuje, ale zápis tu nič nepokazí.
 */
const NOVE_SETY = {
  "cool-white": ["standard-100x40x80-cool-white"],
  "black-matt-orech": [
    "standard-100x40x80-black-matt-orech",
    "premium-100x40x80-black-matt-orech",
  ],
};
for (const [dekor, zoznam] of Object.entries(NOVE_SETY))
  for (const set of zoznam)
    if (sety[set]) (setyDekoru[dekor] ??= new Set()).add(set);

/**
 * Šírka z názvu súboru, ale len ak jej zodpovedá aj počet dvierok na zábere.
 * `standard-100x40x90-black-matt-02` má v názve 100 cm, no reálne tri
 * dvierka — je to teda širšia skrinka a jej názvu sa veriť nedá. V takom
 * prípade radšej priznáme, že šírku nepoznáme.
 */
const overenaSirka = (f, set) => {
  const r = rozborSetu(set);
  if (r.w === null) return null;
  const dv = dvierkaFotky(f);
  if (dv !== 0 && dv !== dvierkaPreSirku(r.w)) return null;
  return r.w;
};

/**
 * Ako ďaleko je fotka od produktu. Poradie váh: správne delenie čela,
 * potom rovnaký rad, nakoniec najbližšia šírka. Delenie je hore, lebo
 * je najviditeľnejšie — pri 200 cm skrinke (štvoro dvierok) je trojdverová
 * fotka bližšie než dvojdverová.
 */
const blizkostProdukt = (p, f) => {
  const set = f.replace("/img/products/", "").replace(/-\d+\.webp$/, "");
  const r = rozborSetu(set);
  const w = overenaSirka(f, set);
  const dv = dvierkaFotky(f);
  const D = dvierkaPreSirku(p.w);
  return (dv === 0 || dv === D ? 0 : Math.abs(dv - D) * 5000) +
    (r.rad === p.tier ? 0 : r.rad ? 1000 : 2000) +
    (w === null ? 400 : Math.abs(w - p.w));
};

const rozborSetu = (set) => {
  const m = set.match(/^(premium|standard|basic)-(\d+)x(\d+)x(\d+)/);
  return m ? { rad: m[1], w: +m[2], d: +m[3] } : { rad: null, w: null, d: null };
};

/* ── LED galérie ────────────────────────────────────────────────── */
const ledSubory = fs.existsSync(LED) ? fs.readdirSync(LED).sort() : [];
/**
 * LED vizualizácie pre daný počet dvierok. Existujú len 2- a 3-dverové;
 * 200 cm skrinky majú štvoro dvierok a vizualizácie k nim klient ešte
 * nedodal. Namiesto prázdnej galérie vezmeme najbližší dostupný počet —
 * podsvietenie vyzerá rovnako, líši sa len delenie čela.
 */
const ledSet = (dekor, farba, dv) => {
  const podla = (n) =>
    ledSubory
      .filter((f) => f.startsWith(`led-${dekor}-${farba}-${n}d-`))
      .map((f) => `/img/products/led/${f}`);
  const presne = podla(dv);
  if (presne.length) return presne;
  for (const n of [3, 2].filter((x) => x !== dv)) {
    const nahrada = podla(n);
    if (nahrada.length) return nahrada;
  }
  return [];
};

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
  const blizkost = (f) => blizkostProdukt(p, f);
  /* Fotky so správnym delením čela pre tento produkt — ak neexistujú vôbec
     (200 cm má štvoro dvierok a vizualizácie zatiaľ nie sú), pustíme aj iné
     delenie. Inak by v galérii ostali samé detaily pántov. */
  /* Posudzuje sa to per dekor: Cool White nemá ani jednu trojdverovú fotku,
     hoci iné dekory ju majú. Keby sa pozeralo globálne, ostali by mu pri
     120 cm len detaily pántov a ako titulná fotka by vyšiel záber závesu. */
  const maSpravnu = (dekorId) =>
    [...(setyDekoru[dekorId] ?? [])]
      .flatMap((set) => sety[set] ?? [])
      .some((f) => dvierkaFotky(f) === D);

  for (const d of p.decors) {
    /* fotky, ktoré medzitým zanikli (premenovanie setu), musia z katalógu
       von — inak by v galérii ostali mŕtve odkazy */
    const povodne = d.images.filter((f) => fs.existsSync(path.join(FOTKY, path.basename(f))));
    const prijatelna = (f) => {
      const dv = dvierkaFotky(f);
      return dv === 0 || dv === D || !maSpravnu(d.id);
    };

    /* 1. vyhodíme fotky s nesprávnym počtom dvierok */
    let vybrane = povodne.filter(prijatelna);

    /* 2. doplníme zo setov toho istého dekoru.
          Poradie: rovnaký rad má prednosť (určuje mieru opláštenia, čiže
          vzhľad), no v rámci radu rozhoduje najbližšia šírka. Bez toho
          druhého kritéria dostala 200 cm skrinka fotku 150 cm a 120 cm
          zase 200 cm — počet dvierok sedel, proporcie nie. */
    const kandidati = [...(setyDekoru[d.id] ?? [])]
      .flatMap((set) => (sety[set] ?? []).map((f) => ({ f, ...rozborSetu(set) })))
      .filter(({ f }) => prijatelna(f))
      .sort((a, b) => blizkost(a.f) - blizkost(b.f) || a.f.localeCompare(b.f))
      .map(({ f }) => f);

    /* Poradie v galérii: zatvorená skrinka → otvorená / rám → detaily,
       a v rámci skupiny rozmerovo najbližšia fotka napred. */
    const poradie = (f) => (dvierkaFotky(f) === 0 ? 2 : jeOtvorena(f) ? 1 : 0);
    const kluc = (a, b) => poradie(a) - poradie(b) || blizkost(a) - blizkost(b);

    /* Doterajšie aj nové fotky posudzujeme spoločne a necháme najlepšie —
       keby sa kandidáti len dopĺňali do limitu, novo dodaný set v presnom
       rozmere by sa k produktu nedostal.
       Triedi sa rovnakým kľúčom ako galéria, nie len podľa vzdialenosti:
       detail pántu má za delenie čela nulovú penalizáciu, takže by inak
       predbehol celé skrinky a orezanie na limit by nechalo samé detaily.
       Fotky presne tohto radu aj rozmeru berieme všetky. */
    /* Pri výbere rozhoduje pôvod fotky, nie to, či je skrinka zatvorená —
       vlastný otvorený záber je lepší než cudzí zatvorený. Prirážka za
       detail musí prevýšiť aj dva stupne rozdielu v delení čela (2 × 5000),
       inak by pri 200 cm skrinkách vyhral záber pántu nad celou skrinkou.
       Vlastné detaily to neodsúva — tie chytá filter `vlastne` nižšie. */
    const vyber = (f) => blizkost(f) + (dvierkaFotky(f) === 0 ? 12_000 : 0);
    const spolu = [...new Set([...vybrane, ...kandidati])]
      .sort((a, b) => vyber(a) - vyber(b));
    /* Keď má dekor dosť vlastných záberov, berieme ich všetky a cudzie
       nepridávame — galéria by sa inak označila ako ilustračná, hoci
       všetko podstatné v nej je. Vrátane vlastných detailov: tie by inak
       vypadli za cudziu zatvorenú skrinku. */
    const vlastne = spolu.filter((f) => blizkost(f) < 100);
    vybrane = (vlastne.length >= 4
      ? vlastne
      : spolu.slice(0, Math.max(povodne.length, 4))
    ).sort(kluc);

    /* 3. ak pre tento počet dvierok neexistuje ani jedna fotka celej
          skrinky, radšej ukážeme pôvodné zábery a otvorene povieme,
          že zachytávajú iné vyhotovenie — prázdna galéria je horšia */
    /* Ak sú v galérii len detaily (pánt, textúra), dvierka na nich nevidno
       a o nezhode nemá zmysel hovoriť — hlásiť „foto 3-dverového
       vyhotovenia“ pri zábere hrany by bolo mätúce. */
    /* Delenie čela na fotkách nesedí s produktom. Nič nevraciame späť —
       výber vyššie už náhradné delenie pripúšťa, keď správne fotky
       neexistujú; tu to len poctivo označíme. */
    const viditelne = vybrane.filter((f) => dvierkaFotky(f) > 0);
    const bezDvierok = viditelne.length > 0 && !viditelne.some((f) => dvierkaFotky(f) === D);

    /* 4. príznaky ilustračnosti prepočítame nanovo — len zo záberov celej
          skrinky. Detail pántu z inej dĺžky vyzerá rovnako, ale robil
          z galérie „ilustračnú" a hlásil rozmer, ktorý na hlavnej fotke
          vôbec nebol. */
    const pouziteSety = [...new Set(
      vybrane.filter((f) => dvierkaFotky(f) !== 0)
        .map((f) => f.replace("/img/products/", "").replace(/-\d+\.webp$/, "")),
    )];
    /* Rozmer hlásime len tam, kde mu vieme veriť. Pri fotkách, ktorých názov
       nesedí s počtom dvierok, skutočnú šírku nepoznáme — tvrdiť „foto
       rozmeru 100 × 40" pri trojdverovej skrinke by bola nepravda. */
    const rozbory = pouziteSety
      .map((set) => ({ set, r: rozborSetu(set) }))
      .filter(({ set }) => {
        const f = vybrane.find((x) => x.includes(set + "-"));
        return f ? overenaSirka(f, set) !== null : true;
      })
      .map(({ r }) => r);
    const inyRad = rozbory.some((r) => r.rad !== p.tier);
    /* aj hĺbka — 200×60×60 pri produkte 200×50×70 sedí len šírkou, ale je to
       viditeľne iná skrinka a doteraz sa tvárila ako presná fotka */
    const inyRozmer = rozbory.some((r) => r.w !== null && (r.w !== p.w || r.d !== p.d));

    delete d.inherited;
    delete d.illuFrom;
    delete d.illuSize;
    delete d.illuDvierka;
    delete d.illuIdx;

    /* Ktoré konkrétne zábery v galérii sú z iného radu alebo rozmeru.
       Štítok sa potom ukáže len nad nimi — dekor môže mať pár vlastných
       fotiek a zvyšok prevzatý, a označiť celú galériu by klamalo v oboch
       smeroch. Detaily (dvierka nevidno) sem nepatria, tie sedia vždy. */
    const cudzia = (f) => {
      if (dvierkaFotky(f) === 0) return false;
      const set = f.replace("/img/products/", "").replace(/-\d+\.webp$/, "");
      const r = rozborSetu(set);
      if (r.rad !== null && r.rad !== p.tier) return true;
      const w = overenaSirka(f, set);
      return w !== null && (w !== p.w || r.d !== p.d);
    };
    const idx = vybrane.map((f, i) => (cudzia(f) ? i : -1)).filter((i) => i >= 0);
    if (idx.length && idx.length < vybrane.length) d.illuIdx = idx;

    if (bezDvierok) {
      d.inherited = true;
      d.illuFrom = "dvierka";
      /* koľko dvierok je naozaj na použitých fotkách — pri 200 cm skrinkách
         (4 dvierka) zatiaľ nemáme ani jednu správnu vizualizáciu */
      const naFotke = [...new Set(vybrane.map(dvierkaFotky).filter((n) => n > 0))];
      if (naFotke.length) d.illuDvierka = Math.max(...naFotke);
    } else if (inyRad) {
      d.inherited = true;
      d.illuFrom = "rad";
    } else if (inyRozmer) {
      const r = rozbory.find((x) => x.w !== null && (x.w !== p.w || x.d !== p.d));
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
  /* Dekor s najvernejšou fotkou dáme prvý. Karta v katalógu ukazuje cover,
     ale detail sa otvára na prvom dekore — keď to bol iný dekor, zákazník
     klikol na trojdverovú skrinku v správnej šírke a dostal dvojdverovú
     fotku z iného rozmeru so štítkom „ilustračné". */
  const kvalita = (d) => {
    const f = d.images[0];
    if (!f) return 99_000;
    /* Prvá fotka musí byť zatvorená skrinka so správnymi dvierkami — inak
       sa cover a detail rozídu. Penalizácie musia byť nad rozsahom
       blizkostProdukt (tá ide do ~2400), inak by zlý počet dvierok
       „vyhral" nad vzdialenejšou, ale správnou fotkou.
       Detail pántu je horší než celá skrinka s iným delením čela: pri
       200 cm (štvoro dvierok) zatiaľ správnu vizualizáciu nemáme vôbec,
       a ukázať ako titulnú fotku záber pántu je horšie než trojdverovú
       skrinku s poctivým štítkom. */
    const dv = dvierkaFotky(f);
    if (dv === 0) return 300_000;
    if (jeOtvorena(f) && p.tier !== "basic") return 100_000 + blizkostProdukt(p, f);
    return blizkostProdukt(p, f);
  };
  const povodnePrvy = p.decors[0]?.id;
  p.decors.sort((a, b) => kvalita(a) - kvalita(b));
  if (p.decors[0]?.id !== povodnePrvy) {
    zmeny.push({ slug: p.slug, dekor: "poradie dekorov", pred: povodnePrvy, po: p.decors[0].id });
  }

  /* cover katalógovej karty — prvá fotka prvého dekoru, nech karta a detail
     ukazujú to isté; ak by nesedeli dvierka, hľadáme ďalej */
  const prvy = p.decors[0]?.images?.[0];
  const covorOk = (f) => f && dvierkaFotky(f) === D && !(jeOtvorena(f) && p.tier !== "basic");
  let novy = covorOk(prvy) ? prvy : null;
  if (!novy) {
    /* celá skrinka pred detailom, správne dvierka pred nesprávnymi */
    const vsetky = p.decors
      .flatMap((d) => d.images)
      .filter((f) => dvierkaFotky(f) !== 0)
      .sort((a, b) =>
        (dvierkaFotky(a) === D ? 0 : 1) - (dvierkaFotky(b) === D ? 0 : 1) ||
        (p.tier === "basic" ? 0 : jeOtvorena(a) - jeOtvorena(b)) ||
        blizkostProdukt(p, a) - blizkostProdukt(p, b));
    novy = vsetky[0] ?? prvy;
  }
  if (novy && novy !== p.cover) {
    zmeny.push({ slug: p.slug, dekor: "cover", pred: p.cover.split("/").pop(), po: novy.split("/").pop() });
    p.cover = novy;
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
