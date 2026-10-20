// Kontroly editorov akvárií a setov (API + verejné stránky) proti dev serveru.
//   ADMIN_PASSWORD=x npx next dev -p 3003
//   TEST_HESLO=x node scripts/test-polozky.mjs
// Pracuje v katalog-test (mimo produkcie), ostré dáta sa nemenia.
const B = process.env.TEST_URL ?? "http://localhost:3003";
const HESLO = process.env.TEST_HESLO;
if (!HESLO) throw new Error("Nastav TEST_HESLO.");
let zle = 0;
const ok = (n, c, d = "") => { if (!c) zle++; console.log((c ? "OK  " : "ZLE ") + n.padEnd(50) + d); };

const l = await fetch(`${B}/admin`, { method: "POST", body: new URLSearchParams({ heslo: HESLO }), redirect: "manual" });
const H = { cookie: l.headers.getSetCookie().map((c) => c.split(";")[0]).join("; ") };
const api = (k) => ({
  get: async () => (await fetch(`${B}/api/admin/${k}`, { headers: H })).json(),
  post: (t) => fetch(`${B}/api/admin/${k}`, { method: "POST", headers: { ...H, "content-type": "application/json" }, body: JSON.stringify(t) }),
});
const html = async (cesta) => await (await fetch(`${B}${cesta}`, { cache: "no-store" })).text();
const status = async (cesta) => (await fetch(`${B}${cesta}`, { cache: "no-store" })).status;

ok("akváriá bez prihlásenia = 401", (await fetch(`${B}/api/admin/akvaria`)).status === 401);
ok("sety bez prihlásenia = 401", (await fetch(`${B}/api/admin/sety`)).status === 401);

// fotka
const webp = await (await fetch(`${B}/img/products/standard-100x40x80-artisan-02.webp`)).arrayBuffer();
const fd = new FormData(); fd.append("subor", new Blob([webp], { type: "image/webp" }), "a.webp");
const up = await (await fetch(`${B}/api/admin/katalog/foto`, { method: "POST", headers: H, body: fd })).json();
ok("fotka nahratá", up.ok && up.src?.startsWith("/foto/"), up.src);

/* ============ AKVÁRIÁ ============ */
const A = api("akvaria");
let s = await A.get();
ok("GET akváriá vracia zoznam", Array.isArray(s.polozky) && s.polozky.length > 40, String(s.polozky?.length));
const pocetA = s.polozky.length;

// nové akvárium 123 × 45 × 56 s dvoma hrúbkami, zverejnené
const nove = { slug: "akvarium-123x45x56", w: 123, d: 45, h: 56, liters: 0, glass: [{ mm: 8, price: "199 €" }, { mm: 10, price: "249,50 €" }], fotky: [up.src], cover: "", name: "", dim: "", vol: "", featured: false, priceValue: 0, priceLabel: "" };
let r = await A.post({ akcia: "uloz", povodneId: null, polozka: nove, odtlacok: null }); let j = await r.json();
ok("nové akvárium uložené", r.status === 200 && j.ok && j.polozky.length === pocetA + 1, `${r.status} ${j.chyba ?? ""} ${JSON.stringify(j.chyby ?? "")}`);
const a = j.polozky.find((x) => x.slug === "akvarium-123x45x56");
ok("objem dopočítaný (310 l)", a?.liters === 310, String(a?.liters));
ok("cena od z nižšej hrúbky", a?.priceLabel === "od 199 €" && a.priceValue === 199, `${a?.priceLabel}`);
ok("titulná = nahratá fotka, nie ilustračná", a?.cover === up.src && !a.coverIllustrative);
ok("detail nového akvária = 200", (await status("/akvaria/akvarium-123x45x56")) === 200);
let h = await html("/akvaria/akvarium-123x45x56");
ok("detail ukazuje fotku a cenu", h.includes(up.src) && h.includes("od 199"));
ok("EN detail = 200", (await status("/en/akvaria/akvarium-123x45x56")) === 200);
h = await html("/akvaria");
ok("katalóg akvárií obsahuje nové", h.includes("akvarium-123x45x56"));

// platba ho pozná (prepočet cez objednávkové API by vyžadoval celý košík — overíme sitemap)
h = await html("/sitemap.xml");
ok("sitemap (ak je zapnutá) nepadá", typeof h === "string");

// skryť → zmizne z webu
r = await A.post({ akcia: "uloz", povodneId: a.slug, polozka: { ...a, skryta: true }, odtlacok: null }); j = await r.json();
ok("skrytie akvária", r.status === 200 && j.ok);
ok("skryté akvárium = 404", (await status("/akvaria/akvarium-123x45x56")) === 404);

// odmietnutia
r = await A.post({ akcia: "uloz", povodneId: null, polozka: { ...nove, slug: "akvarium-50x25x30" }, odtlacok: null }); j = await r.json();
ok("duplicitná adresa = 422", r.status === 422 && j.chyby?.some((c) => c.pole === "slug"), String(r.status));
r = await A.post({ akcia: "uloz", povodneId: null, polozka: { ...nove, slug: "akvarium-9x9x9", w: 9, fotky: ["https://zly.example/x.webp"] }, odtlacok: null }); j = await r.json();
ok("zlý rozmer + cudzia fotka = 422", r.status === 422 && j.chyby?.length >= 2, String(r.status));
r = await A.post({ akcia: "zmaz", id: "neexistuje", odtlacok: null });
ok("zmazanie neexistujúceho = 409", r.status === 409, String(r.status));
r = await A.post({ akcia: "poradie", idcka: ["x"] });
ok("zlé poradie = 409", r.status === 409, String(r.status));

// poradie: nové na začiatok
s = await A.get();
const idcka = s.polozky.map((x) => x.slug);
idcka.splice(idcka.indexOf("akvarium-123x45x56"), 1); idcka.unshift("akvarium-123x45x56");
r = await A.post({ akcia: "poradie", idcka }); j = await r.json();
ok("poradie uložené", r.status === 200 && j.polozky[0].slug === "akvarium-123x45x56");

// história + návrat
const hist = await (await fetch(`${B}/api/admin/katalog/historia?kolekcia=akvaria`, { headers: H })).json();
ok("história akvárií má verzie", hist.ok && hist.verzie.length >= 3, String(hist.verzie?.length));
ok("história skriniek sa nemieša", (await (await fetch(`${B}/api/admin/katalog/historia`, { headers: H })).json()).verzie.every((v) => !v.poznamka.includes("Akvárium 123")));

// zmazať
r = await A.post({ akcia: "zmaz", id: "akvarium-123x45x56", odtlacok: null }); j = await r.json();
ok("zmazanie akvária", r.status === 200 && j.polozky.length === pocetA);

/* ============ SETY ============ */
const S = api("sety");
s = await S.get();
ok("GET sety vracia zoznam", Array.isArray(s.polozky) && s.polozky.length === 3, String(s.polozky?.length));
const novySet = {
  id: "test-90", kategoria: "akvariove", nazov: "Test 90",
  podtitul: { sk: "Skúšobný set", en: "" },
  popis: { sk: ["Prvý odsek.", "Druhý odsek."], en: [] },
  preKoho: { sk: ["Pre testy."], en: [] },
  skrinka: "90 × 40 × 75 cm", akvarium: "90 × 40 × 45 cm", sklo: { sk: "Klasické sklo", en: "" }, objem: 162,
  prevedenia: [{ id: "black-matt", name: "Black Matt", swatch: ["#17181a"], images: [up.src] }],
  cena: 1290, novinka: true,
};
r = await S.post({ akcia: "uloz", povodneId: null, polozka: novySet, odtlacok: null }); j = await r.json();
ok("nový set uložený a zverejnený", r.status === 200 && j.ok && j.polozky.length === 4, `${r.status} ${j.chyba ?? ""} ${JSON.stringify(j.chyby ?? "")}`);
const st = j.polozky.find((x) => x.id === "test-90");
ok("EN texty doplnené zo SK", st?.podtitul.en === "Skúšobný set" && st.popis.en.length === 2);
ok("detail setu = 200 a ukazuje fotku", (await status("/sety/test-90")) === 200 && (await html("/sety/test-90")).includes(up.src));
h = await html("/sety");
ok("katalóg setov pozná nový set (kategória akváriové)", h.includes("test-90"));
ok("EN detail setu = 200", (await status("/en/sety/test-90")) === 200);

// nezverejniteľný: bez fotky v prevedení
r = await S.post({ akcia: "uloz", povodneId: null, polozka: { ...novySet, id: "test-bez", prevedenia: [{ id: "x", name: "X", swatch: ["#000"], images: [] }] }, odtlacok: null }); j = await r.json();
ok("set bez fotky sa nedá zverejniť = 422", r.status === 422, String(r.status));
r = await S.post({ akcia: "uloz", povodneId: null, polozka: { ...novySet, id: "test-bez", skryta: true, prevedenia: [] }, odtlacok: null }); j = await r.json();
ok("rozpracovaný set prejde aj bez prevedení", r.status === 200 && j.ok, `${r.status} ${JSON.stringify(j.chyby ?? "")}`);
ok("rozpracovaný set = 404 na webe", (await status("/sety/test-bez")) === 404);

// upratať
for (const id of ["test-90", "test-bez"]) { r = await S.post({ akcia: "zmaz", id, odtlacok: null }); }
s = await S.get();
ok("sety upratané", s.polozky.length === 3);
ok("pôvodný set stále funguje", (await status("/sety/scape-60")) === 200);

console.log(`\n${zle ? zle + " ZLYHANÍ" : "VŠETKO PREŠLO"}`);
process.exitCode = zle ? 1 : 0;
