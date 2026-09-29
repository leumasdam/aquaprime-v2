// End-to-end test editora katalógu (API) proti lokálnemu dev serveru.
//
// Spustenie:
//   ADMIN_PASSWORD=test-lokal npx next dev -p 3003        (v jednom okne)
//   TEST_HESLO=test-lokal node scripts/test-editor-katalogu.mjs
//
// Pracuje výhradne v priečinku katalog-test (mimo produkcie ho úložisko
// používa samo) a na začiatku ho vyčistí. Ostrý katalóg nikdy nečíta ani
// nemení — reset to navyše stráži kontrolou prefixu.
const B = process.env.TEST_URL ?? "http://localhost:3003";
const HESLO = process.env.TEST_HESLO;
if (!HESLO) throw new Error("Nastav TEST_HESLO (rovnaké ako ADMIN_PASSWORD dev servera).");

// čistý štart: zmaž testovací priečinok (len katalog-test, nikdy ostrý katalog)
import { readFileSync } from "node:fs";
for (const riadok of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const m = riadok.match(/^\s*(BLOB_READ_WRITE_TOKEN)\s*=\s*"?([^"]*)"?\s*$/);
  if (m) process.env[m[1]] = m[2];
}
{
  const { list, del } = await import("@vercel/blob");
  const bloby = (await list({ prefix: "katalog-test/", limit: 1000 })).blobs.map((b) => b.pathname);
  if (bloby.some((x) => !x.startsWith("katalog-test/"))) throw new Error("reset by siahol mimo katalog-test");
  if (bloby.length) await del(bloby);
  console.log(`reset: zmazaných ${bloby.length} testovacích súborov`);
}
const vysledky = [];
const ok = (nazov, podmienka, detail = "") => { vysledky.push([podmienka ? "OK  " : "ZLE ", nazov, detail]); console.log(podmienka ? "OK  " : "ZLE ", nazov.padEnd(42), detail); };

const login = await fetch(`${B}/admin`, {
  method: "POST",
  body: new URLSearchParams({ heslo: HESLO }),
  redirect: "manual",
});
const cookie = login.headers.getSetCookie().map((c) => c.split(";")[0]).join("; ");
ok("prihlasenie", login.status === 303 && cookie.includes("aq_admin="), `status ${login.status}`);
const H = { cookie };
const post = (telo, extra = {}) =>
  fetch(`${B}/api/admin/katalog`, {
    method: "POST",
    headers: { ...H, "content-type": "application/json", ...extra },
    body: JSON.stringify(telo),
  });
const nacitaj = async () => (await fetch(`${B}/api/admin/katalog`, { headers: H })).json();
const odtlacok = (p) => {
  const t = JSON.stringify(p);
  let h = 0x811c9dc5;
  for (let i = 0; i < t.length; i++) {
    h ^= t.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
};

ok("API bez prihlasenia = 401", (await fetch(`${B}/api/admin/katalog`)).status === 401);

let s = await nacitaj();
ok("nacitanie katalogu", s.katalog?.length === 33, `${s.katalog?.length} skriniek, ulozene=${JSON.stringify(s.ulozene)}`);

// úprava ceny
const p0 = s.katalog.find((p) => p.slug === "premium-100x40x80");
const upravena = { ...structuredClone(p0), price: "349 €" };
let r = await post({ akcia: "uloz", povodnySlug: p0.slug, produkt: upravena, odtlacok: odtlacok(p0) });
let j = await r.json();
ok("uprava ceny", r.status === 200 && j.ok, `${r.status} ${j.poznamka ?? j.chyba}`);
ok("autor v historii", j.ulozene?.kto === "Samuel", j.ulozene?.kto);
const po = j.katalog.find((p) => p.slug === "premium-100x40x80");
ok("cena ulozena", po?.price === "349 €", po?.price);

const html = await (await fetch(`${B}/skrinky/premium-100x40x80`)).text();
ok("web ukazuje novu cenu", html.includes("349"), html.includes("335 €") ? "stale ukazuje 335" : "");

// konflikt
r = await post({ akcia: "uloz", povodnySlug: p0.slug, produkt: { ...upravena, price: "360 €" }, odtlacok: odtlacok(p0) });
j = await r.json();
ok("konflikt pri starom odtlacku = 409", r.status === 409 && j.konflikt, `${r.status} ${j.chyba}`);

// validácia
const nova = {
  slug: "premium-130x45x80", name: "", tier: "premium", w: 130, d: 45, h: 80, price: "Na dopyt",
  desc: "Test", features: [], decors: [], cover: "", vol: "", aquarium: "", dim: "", tierLabel: "", tierNote: "",
};
r = await post({ akcia: "uloz", povodnySlug: null, produkt: nova, odtlacok: null });
j = await r.json();
ok("zverejnena bez dekorov odmietnuta = 422", r.status === 422 && j.chyby?.length > 0, (j.chyby ?? []).map((c) => c.sprava).join(" | "));

r = await post({ akcia: "uloz", povodnySlug: null, produkt: { ...nova, skryta: true }, odtlacok: null });
j = await r.json();
ok("rozpracovana bez fotiek prejde", r.status === 200 && j.ok, `${r.status} ${j.chyba ?? ""}`);
ok("rozpracovana nie je na webe", (await fetch(`${B}/skrinky/premium-130x45x80`)).status === 404);

r = await post({ akcia: "uloz", povodnySlug: null, produkt: { ...nova, skryta: true }, odtlacok: null });
j = await r.json();
ok("duplicitna adresa odmietnuta", r.status === 422, (j.chyby ?? []).map((c) => c.sprava).join(" | "));

// bezpečnosť — cudzia adresa fotky
const zla = {
  ...structuredClone(po),
  decors: po.decors.map((d, i) => (i === 0 ? { ...d, images: ["https://zly.example/x.webp", ...d.images] } : d)),
};
r = await post({ akcia: "uloz", povodnySlug: po.slug, produkt: zla, odtlacok: odtlacok(po) });
ok("cudzia adresa fotky odmietnuta", r.status === 422, `status ${r.status}`);

// nahratie fotky
const webp = await (await fetch(`${B}/img/products/standard-100x40x80-artisan-01.webp`)).arrayBuffer();
let fd = new FormData();
fd.append("subor", new Blob([webp], { type: "image/webp" }), "a.webp");
r = await fetch(`${B}/api/admin/katalog/foto`, { method: "POST", headers: H, body: fd });
j = await r.json();
ok("nahratie fotky", r.status === 200 && j.src?.startsWith("/foto/katalog-test/fotky/skrinky/"), j.src ?? j.chyba);
const src = j.src;
const f = await fetch(`${B}${src}`);
ok("fotka sa servíruje", f.status === 200 && f.headers.get("content-type") === "image/webp", `${f.status} ${f.headers.get("content-type")} | ${f.headers.get("cache-control")}`);

fd = new FormData();
fd.append("subor", new Blob(["<script>alert(1)</script>"], { type: "image/webp" }), "x.webp");
r = await fetch(`${B}/api/admin/katalog/foto`, { method: "POST", headers: H, body: fd });
ok("podvrhnuty subor odmietnuty = 415", r.status === 415);
ok("/foto mimo katalogu = 404", (await fetch(`${B}/foto/agents/strateg.json`)).status === 404);
ok("/foto s .. = 404", (await fetch(`${B}/foto/katalog-test/fotky/..%2F..%2Fagents%2Fstrateg.json`)).status === 404);

// fotka do dekoru
s = await nacitaj();
const p1 = s.katalog.find((p) => p.slug === "premium-100x40x80");
const sFotkou = { ...structuredClone(p1), decors: p1.decors.map((d, i) => (i === 0 ? { ...d, images: [...d.images, src] } : d)) };
r = await post({ akcia: "uloz", povodnySlug: p1.slug, produkt: sFotkou, odtlacok: odtlacok(p1) });
j = await r.json();
ok("fotka pridana do dekoru", r.status === 200, j.chyba ?? "");

// globálny dekor
r = await post({ akcia: "dekor", id: "black-matt", name: "Black Matt", swatch: ["#111213"] });
j = await r.json();
ok("globalna uprava dekoru", r.status === 200, j.poznamka ?? j.chyba);
r = await post({ akcia: "dekor", id: "black-matt", name: "X", swatch: ["javascript:alert(1)"] });
ok("zla vzorka dekoru odmietnuta", r.status === 422);

// poradie
s = await nacitaj();
const slugy = s.katalog.map((p) => p.slug);
r = await post({ akcia: "poradie", slugy: [...slugy].reverse() });
ok("zmena poradia", r.status === 200);
r = await post({ akcia: "poradie", slugy: slugy.slice(1) });
ok("poradie s chybajucou skrinkou odmietnute", r.status === 409);

// história a obnova
const hist = await (await fetch(`${B}/api/admin/katalog/historia`, { headers: H })).json();
ok("historia", hist.verzie?.length >= 5, `${hist.verzie?.length} verzii; posledna: ${hist.verzie?.[0]?.poznamka}`);
const prva = hist.verzie[hist.verzie.length - 1];
r = await post({ akcia: "obnov", verziaId: prva.id });
j = await r.json();
ok("obnova starsej verzie", r.status === 200, j.poznamka ?? j.chyba);
ok("po obnove je stav z prvej verzie", j.katalog?.find((p) => p.slug === "premium-100x40x80")?.price === "349 €");
r = await post({ akcia: "obnov", verziaId: "agents/strateg.json" });
ok("obnova mimo historie odmietnuta", r.status === 422);

// zmazanie rozpracovanej (po obnove prvej verzie už neexistuje — pridáme a zmažeme)
r = await post({ akcia: "uloz", povodnySlug: null, produkt: { ...nova, slug: "premium-131x45x80", skryta: true }, odtlacok: null });
s = await nacitaj();
const roz = s.katalog.find((p) => p.slug === "premium-131x45x80");
r = await post({ akcia: "zmaz", slug: roz.slug, odtlacok: odtlacok(roz) });
ok("zmazanie", r.status === 200);

// podvrhnutý autor
s = await nacitaj();
r = await post({ akcia: "poradie", slugy: s.katalog.map((p) => p.slug) }, { "x-aq-admin": "Hacker" });
j = await r.json();
ok("podvrhnuty autor sa ignoruje", j.ulozene?.kto === "Samuel", j.ulozene?.kto);


console.log(`\n${vysledky.filter((x) => x[0].startsWith("OK")).length}/${vysledky.length} prešlo`);
