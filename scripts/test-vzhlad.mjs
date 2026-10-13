// Kontroly úvodných fotiek radov (API + domovská stránka) proti dev serveru.
//   ADMIN_PASSWORD=x npx next dev -p 3003
//   TEST_HESLO=x node scripts/test-vzhlad.mjs
// Pracuje v katalog-test (mimo produkcie), ostrý vzhľad sa nemení.
const B = process.env.TEST_URL ?? "http://localhost:3003";
const HESLO = process.env.TEST_HESLO;
if (!HESLO) throw new Error("Nastav TEST_HESLO.");
let zle = 0;
const ok = (n, c, d = "") => { if (!c) zle++; console.log((c ? "OK  " : "ZLE ") + n.padEnd(44) + d); };

const l = await fetch(`${B}/admin`, { method: "POST", body: new URLSearchParams({ heslo: HESLO }), redirect: "manual" });
const H = { cookie: l.headers.getSetCookie().map((c) => c.split(";")[0]).join("; ") };
const post = (t) => fetch(`${B}/api/admin/vzhlad`, { method: "POST", headers: { ...H, "content-type": "application/json" }, body: JSON.stringify(t) });

ok("bez prihlásenia = 401", (await fetch(`${B}/api/admin/vzhlad`)).status === 401);
let s = await (await fetch(`${B}/api/admin/vzhlad`, { headers: H })).json();
ok("GET vracia pôvodné fotky", s.povodne?.basic?.includes("kat-basic"), JSON.stringify(s.povodne?.basic));

// nahrať fotku a nastaviť ju Basicu
const webp = await (await fetch(`${B}/img/products/standard-100x40x80-artisan-02.webp`)).arrayBuffer();
const fd = new FormData(); fd.append("subor", new Blob([webp], { type: "image/webp" }), "a.webp");
const up = await (await fetch(`${B}/api/admin/katalog/foto`, { method: "POST", headers: H, body: fd })).json();
ok("fotka nahratá", up.ok && up.src?.startsWith("/foto/"), up.src);
let r = await post({ rady: { basic: up.src } }); let j = await r.json();
ok("uloženie fotky radu", r.status === 200 && j.ok && j.rady?.basic === up.src, `${r.status} ${j.poznamka ?? j.chyba}`);

// domovská stránka ju ukazuje
let html = await (await fetch(`${B}/`)).text();
ok("domov ukazuje novú fotku Basic", html.includes(up.src), "");
ok("domov stále ukazuje pôvodnú Premium", html.includes("kat-premium-v3.webp"));

// odmietnutia
r = await post({ rady: { basic: "https://zly.example/x.webp" } }); ok("cudzia adresa = 422", r.status === 422, String(r.status));
r = await post({ rady: "x" }); ok("zlé telo = 400", r.status === 400, String(r.status));
r = await post({ rady: { nieco: "/img/x.webp" } }); j = await r.json(); ok("neznámy rad sa ignoruje", r.status === 200 && !("nieco" in j.rady));

// vrátiť pôvodnú
r = await post({ rady: { basic: "" } }); j = await r.json();
ok("vrátenie pôvodnej", r.status === 200 && !("basic" in j.rady), JSON.stringify(j.rady));
html = await (await fetch(`${B}/`)).text();
ok("domov je späť na pôvodnej Basic", html.includes("kat-basic-v3.webp") && !html.includes(up.src));

// história
const h = await (await fetch(`${B}/api/admin/katalog/historia`, { headers: H })).json();
ok("história skriniek sa vzhľadom nemieša", Array.isArray(h.verzie));

console.log(`\n${zle ? zle + " ZLYHANÍ" : "VŠETKO PREŠLO"}`);
process.exitCode = zle ? 1 : 0;
