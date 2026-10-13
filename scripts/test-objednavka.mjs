// Kontroly verejných ciest objednávky a dopytu proti lokálnemu dev serveru.
//
//   DOPYT_TO= ADMIN_PASSWORD=x CRON_SECRET=y npx next dev -p 3003
//   TEST_HESLO=x TEST_CRON=y node scripts/test-objednavka.mjs
//
// DOPYT_TO musí byť prázdne — inak by test posielal skutočné e-maily.
const B = process.env.TEST_URL ?? "http://localhost:3003";
const HESLO = process.env.TEST_HESLO;
const CRON = process.env.TEST_CRON ?? "x";
if (!HESLO) throw new Error("Nastav TEST_HESLO.");

let zle = 0;
const ok = (nazov, podmienka, detail = "") => {
  if (!podmienka) zle++;
  console.log(podmienka ? "OK  " : "ZLE ", nazov.padEnd(46), detail);
};
const json = (url, telo, hlavicky = {}) =>
  fetch(`${B}${url}`, { method: "POST", headers: { "content-type": "application/json", ...hlavicky }, body: JSON.stringify(telo) });

// katalóg (cez admin API) — cena skrinky, s ktorou test počíta
const l = await fetch(`${B}/admin`, { method: "POST", body: new URLSearchParams({ heslo: HESLO }), redirect: "manual" });
const H = { cookie: l.headers.getSetCookie().map((c) => c.split(";")[0]).join("; ") };
const s = await (await fetch(`${B}/api/admin/katalog`, { headers: H })).json();
const skrinka = s.katalog.find((p) => !p.skryta && /\d/.test(p.price) && Number(p.price.replace(/\D/g, "")) < 500);
const cena = Number(skrinka.price.replace(/\D/g, ""));
console.log(`testovaná skrinka: ${skrinka.slug}, katalógová cena ${cena} €\n`);

/* ---- objednávka: podvrhnutá suma ---- */
const zaklad = { meno: "Test Tester", email: "test@example.com", ulica: "Ulica 1", psc: "01001", mesto: "Žilina" };
let r = await json("/api/objednavka", { ...zaklad, polozky: [{ slug: skrinka.slug, druh: "skrinka", ks: 1, cena: 1, nazov: "X" }], suma: 1, doprava: 0, spolu: 1, odber: false });
let j = await r.json();
ok("objednávka prijatá", r.status === 200 && j.ok, `${r.status} ${j.error ?? j.cislo}`);
const ocakSpolu = cena + 39;
ok("suma z katalógu, nie od klienta", j.zaloha === Math.round(ocakSpolu * 0.3 * 100) / 100, `záloha ${j.zaloha} (klient poslal spolu=1; čakané ${Math.round(ocakSpolu * 0.3 * 100) / 100})`);
ok("doplatok sedí", Math.round((j.zaloha + j.doplatok) * 100) / 100 === ocakSpolu, `${j.zaloha} + ${j.doplatok}`);
ok("číslo objednávky na sekundy", /^AQ\d{8}-\d{6}$/.test(j.cislo), j.cislo);
ok("variabilný symbol má 10 číslic", /^\d{10}$/.test(j.vs), j.vs);
ok("mail sa pri teste neposiela", j.mailom === false, `mailom=${j.mailom}`);

/* ---- osobný odber bez dopravy, s nožičkami (príplatok zatiaľ 0) ----
   Limit je 5 objednávok z jednej adresy za 10 minút a počíta sa každá
   požiadavka — preto test posiela najviac päť. */
r = await json("/api/objednavka", { ...zaklad, polozky: [{ slug: skrinka.slug, druh: "skrinka", ks: 1, nozicky: true }], odber: true });
j = await r.json();
ok("osobný odber s nožičkami: bez dopravy", r.status === 200 && j.zaloha === Math.round(cena * 0.3 * 100) / 100, `${r.status} záloha ${j.zaloha}`);

/* ---- odmietnutia ---- */
r = await json("/api/objednavka", { ...zaklad, polozky: Array.from({ length: 31 }, () => ({ slug: skrinka.slug, druh: "skrinka", ks: 1 })) });
ok("31 položiek odmietnutých", r.status === 400, `${r.status} ${(await r.json()).error}`);
r = await json("/api/objednavka", { ...zaklad, polozky: [{ slug: "neexistuje-1x1x1", druh: "skrinka", ks: 99 }] });
ok("neznámy tovar / 99 ks odmietnuté", r.status === 400, `${r.status} ${(await r.json()).error}`);
r = await json("/api/objednavka", { ...zaklad, email: "nie-email", polozky: [{ slug: skrinka.slug, druh: "skrinka", ks: 1 }] });
ok("zlý e-mail odmietnutý", r.status === 400, `${r.status}`);
r = await json("/api/objednavka", { ...zaklad, polozky: [{ slug: skrinka.slug, druh: "skrinka", ks: 1 }] });
ok("šiesta objednávka z tej istej adresy = 429", r.status === 429, `${r.status}`);

/* ---- dopyt: pasca na roboty ---- */
r = await json("/api/dopyt", { meno: "Robot", email: "r@r.sk", sprava: "spam", web: "http://spam" });
j = await r.json();
ok("honeypot vracia bežnú odpoveď", r.status === 200 && j.ok === true && !("skipped" in j), JSON.stringify(j));

/* ---- cron tajomstvo len na cron cestu ---- */
r = await fetch(`${B}/api/admin/katalog`, { headers: { authorization: `Bearer ${CRON}` } });
ok("CRON_SECRET nepustí do katalógu", r.status === 401, `${r.status}`);

/* ---- admin: neplatné telo = 400 ---- */
r = await json("/api/admin/katalog", { akcia: "uloz" }, H);
ok("admin: chýbajúci produkt = 400", r.status === 400, `${r.status}`);
r = await json("/api/admin/katalog", { akcia: "nieco" }, H);
ok("admin: neznáma akcia = 400", r.status === 400, `${r.status}`);

console.log(`\n${zle === 0 ? "VŠETKO PREŠLO" : zle + " ZLYHANÍ"}`);
process.exitCode = zle ? 1 : 0;
