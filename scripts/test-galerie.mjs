// Kontroly fotiek setov a akvárií (API + verejné stránky) proti dev serveru.
//   ADMIN_PASSWORD=x npx next dev -p 3003
//   TEST_HESLO=x node scripts/test-galerie.mjs
// Pracuje v katalog-test (mimo produkcie), ostré galérie sa nemenia.
const B = process.env.TEST_URL ?? "http://localhost:3003";
const HESLO = process.env.TEST_HESLO;
if (!HESLO) throw new Error("Nastav TEST_HESLO.");
let zle = 0;
const ok = (n, c, d = "") => { if (!c) zle++; console.log((c ? "OK  " : "ZLE ") + n.padEnd(48) + d); };

const l = await fetch(`${B}/admin`, { method: "POST", body: new URLSearchParams({ heslo: HESLO }), redirect: "manual" });
const H = { cookie: l.headers.getSetCookie().map((c) => c.split(";")[0]).join("; ") };
const post = (t) => fetch(`${B}/api/admin/galerie`, { method: "POST", headers: { ...H, "content-type": "application/json" }, body: JSON.stringify(t) });
const html = async (cesta) => await (await fetch(`${B}${cesta}`, { cache: "no-store" })).text();

ok("bez prihlásenia = 401", (await fetch(`${B}/api/admin/galerie`)).status === 401);
const s = await (await fetch(`${B}/api/admin/galerie`, { headers: H })).json();
ok("GET vracia pôvodné sety", s.povodne?.sety?.some((x) => x.id === "scape-60"), String(s.povodne?.sety?.length));
ok("GET vracia pôvodné akváriá", s.povodne?.akvaria?.some((x) => x.slug === "akvarium-120x50x50"), String(s.povodne?.akvaria?.length));

// nahrať fotku
const webp = await (await fetch(`${B}/img/products/standard-100x40x80-artisan-02.webp`)).arrayBuffer();
const fd = new FormData(); fd.append("subor", new Blob([webp], { type: "image/webp" }), "a.webp");
const up = await (await fetch(`${B}/api/admin/katalog/foto`, { method: "POST", headers: H, body: fd })).json();
ok("fotka nahratá", up.ok && up.src?.startsWith("/foto/"), up.src);

// set: prevedenie Scape 60 / Antracit dostane novú titulnú + pôvodnú druhú
const povodne = s.povodne.sety.find((x) => x.id === "scape-60").prevedenia.find((p) => p.id === "antracit").fotky;
let r = await post({ sety: { "scape-60": { antracit: [up.src, povodne[0]] } } }); let j = await r.json();
ok("uloženie fotiek setu", r.status === 200 && j.ok && j.galerie?.sety?.["scape-60"]?.antracit?.[0] === up.src, `${r.status} ${j.chyba ?? ""}`);
let h = await html("/sety/scape-60?prevedenie=antracit");
ok("detail setu ukazuje novú fotku", h.includes(up.src));
h = await html("/sety");
ok("katalóg setov pozná novú fotku", h.includes(up.src));
h = await html("/en/sety/scape-60?prevedenie=antracit");
ok("EN detail setu ukazuje novú fotku", h.includes(up.src));

// akvárium: dve fotky → titulná na karte, galéria na detaile
r = await post({ akvaria: { "akvarium-120x50x50": [up.src, "/img/akvaria/akvarium-80x35x40.webp"] } }); j = await r.json();
ok("uloženie fotiek akvária", r.status === 200 && j.ok && j.galerie?.akvaria?.["akvarium-120x50x50"]?.length === 2, `${r.status} ${j.chyba ?? ""}`);
h = await html("/akvaria/akvarium-120x50x50");
ok("detail akvária ukazuje galériu", h.includes(up.src) && h.includes("pgal__thumbs"));
ok("detail akvária bez štítku „vizualizácia“", !h.includes("Ilustračné zobrazenie"));
h = await html("/akvaria");
ok("katalóg akvárií má novú titulnú", h.includes(up.src));
h = await html("/en/akvaria/akvarium-120x50x50");
ok("EN detail akvária ukazuje galériu", h.includes(up.src));

// odmietnutia
r = await post({ akvaria: { "akvarium-120x50x50": ["https://zly.example/x.webp"] } }); ok("cudzia adresa = 422", r.status === 422, String(r.status));
r = await post({ sety: "x" }); ok("zlé telo = 400", r.status === 400, String(r.status));
r = await post({}); ok("prázdne telo = 400", r.status === 400, String(r.status));
r = await post({ akvaria: { "neexistuje": [up.src] }, sety: { "scape-60": { nieje: [up.src] } } }); j = await r.json();
ok("neznáme položky sa ignorujú", r.status === 200 && !("neexistuje" in j.galerie.akvaria) && !("nieje" in (j.galerie.sety["scape-60"] ?? {})));
r = await post({ akvaria: { "akvarium-120x50x50": Array(13).fill(up.src) } }); ok("nad 12 fotiek = 422", r.status === 422, String(r.status));

// vrátiť pôvodné
r = await post({ sety: { "scape-60": { antracit: [] } }, akvaria: { "akvarium-120x50x50": [] } }); j = await r.json();
ok("vrátenie pôvodných", r.status === 200 && !j.galerie.sety["scape-60"] && !j.galerie.akvaria["akvarium-120x50x50"], JSON.stringify(j.galerie));
h = await html("/sety/scape-60?prevedenie=antracit");
ok("detail setu je späť na pôvodnej", h.includes(povodne[0]) && !h.includes(up.src));
h = await html("/akvaria/akvarium-120x50x50");
ok("detail akvária je späť bez galérie", !h.includes(up.src) && !h.includes("pgal__thumbs"));

console.log(`\n${zle ? zle + " ZLYHANÍ" : "VŠETKO PREŠLO"}`);
process.exitCode = zle ? 1 : 0;
