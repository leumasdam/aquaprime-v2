# AQUAPRIME — web prémiových akvarijných skriniek

Next.js (App Router) + TypeScript + čisté CSS. Tmavý „glass" dizajn, cyan LED akcent, Tinos (display serif) + Inter (UI), SK obsah.

**Live:** https://aquaprime-v2.vercel.app
**Repo:** https://github.com/leumasdam/aquaprime-v2

---

## Pokračovanie na ntb (pull & run)

```bash
git clone https://github.com/leumasdam/aquaprime-v2.git
cd aquaprime-v2
npm install
npm run dev
```

- Dev beží na **http://localhost:3000** (ak je 3000 obsadený, Next zvolí ďalší voľný port — v predošlej session to bolo 3003).
- Build: `npm run build` · Produkčný server: `npm start`
- Node 24 (vyvíjané na v24.15.0).

> Pozn.: `node_modules/`, `.next/` aj temp screenshoty (`_*.png`) sú v `.gitignore` — preto `npm install` po stiahnutí.

---

## Štruktúra

```
app/
  page.tsx              Homepage (hero, kolekcie, kompaktné dlaždice, konfigurátor, moduly, construct, recenzie, final)
  globals.css           VŠETKY štýly (~5000 r.) — sem ide väčšina úprav
  layout.tsx            Root layout (fonty Tinos/Inter, nav, footer, JSON-LD)
  brand.tsx             Logo (orámované „A" + LUXURY AQUARIUM CABINETS)
  SiteNav.tsx           Navbar (Skrinky/Materiály/Realizácie/Kontakt + Konfigurátor CTA)
  HeroFeatures.tsx      Spodná lišta hero — 5 ikon, auto-advance carousel (client)
  Configurator.tsx      Mini-konfigurátor na homepage (client)
  KonfiguratorFull.tsx  Plný konfigurátor (/konfigurator) — floating glass karty (client)
  konfigurator/         /konfigurator route + jeho konfigurator.css
  skrinky/ materialy/ realizacie/ kontakt/ dopyt/ o-nas/ akvaria-teraria/ doplnky-technika/  (podstránky)
  Subpage.tsx           Šablóna podstránok
  nav.ts products.ts    Dáta
public/img/             Obrázky (hero-room.webp, col-*, tile-*, cabinet.webp, safety-rock*.webp, tt/ atď.)
```

**Poradie sekcií homepage:** hero → **Bezpečnosť a nosnosť** (`.safety` — text vľavo, transparentný kameň `safety-rock.webp` v strede, glass štaty 770 kg/oceľ/na mieru vpravo) → kolekcie → kompaktné dlaždice → mini-konfigurátor → moduly → construct → recenzie → dopyt.

Pozn. k `.safety`: kameň je **transparentné PNG** položené na `--bg` (žiadny box). Pozícia/veľkosť `background: 54% bottom / auto 88%`. Pri 861–1400px sa zapína left gradient (čitateľnosť) + kameň `auto 80%`; ≤860px je kameň pás dole a text hore na čistom. Glass štaty = `backdrop-filter: blur(30px)`.

23 statických routes, produkčný build zelený.

---

## Dôležité: HERO je silne responzívny

Hero (`.hero` v `page.tsx` + `globals.css`) má niekoľko breakpointov — pri úpravách na to pozor:

- **≥2100px** — fotka zafixovaná na ~2100px (nezväčšuje sa), vycentrovaná, bočné hrany do stratena (`@media (min-width:2100px)`).
- **1301–2099px** — full-bleed cover.
- **901–1500px** — nižší hero (zoom-out, `min-height: clamp(430px,49vh,530px)`).
- **≤1300px** — „shift": akvárium odsunuté doprava (`background-position: 22%`) + tmavá ľavá strana pre text.
- **≤600px (mobil)** — **split layout**: fotka hore (44svh) + text/CTA dole na tmavej; nadpis zasahuje kúsok do fotky; CTA dole pri lište; spodná lišta = 1 ikona naraz, auto-swipe (bez cyan).
- Spodná feature lišta: na **desktope** cyan pulz putuje ikonami; na **mobile** bez cyan, len auto-swipe (riešené v `HeroFeatures.tsx` + CSS `@media (max-width:600)`).

## Pozadie / farby

- Jednotné pozadie sekcií: **`--bg: #0a0c0d`** (a `--bg-soft/--bg-mod/--bg-config/--bg-path/--footer` sú zarovnané naň). Sekcie nemajú vlastné odlišné tmavé pozadia.
- Akcent: `--cyan: #47c7e8`. Karty: `--card: #08090a`. Linky: `--line`, `--line-2`.

## Deploy (Vercel)

Projekt je prepojený s Vercel účtom `leumasdam`.
```bash
vercel --prod --yes      # manuálny deploy (alias https://aquaprime-v2.vercel.app)
```
`git push` na `master` tiež spustí deploy (ak je git-integrácia aktívna). Vercel CLI: `npm i -g vercel`, potom `vercel login`.

---

## Stav / TODO

- ✅ Homepage, hero (responzívny), konfigurátor, kolekcie, dlaždice, podstránky, SEO/sitemap/robots, deploy.
- ⏳ **SK copy** v hero feature lište a podtituloch je **draft** — odporúčaný native/GPT polish.
- ⏳ Kolekcie karty (Basic/Standard/Premium) vedú na `/skrinky` — neskôr filtre podľa kolekcie (`?kolekcia=…`).
- ⏳ Konfigurátor 2D náhľad = jedna fotka skrinky; **farebné varianty** (fotky per povrch) doplniť neskôr → mapovanie swatch → fotka.
- ⏳ Reálne 3D gify skriniek do konfigurátora (3D náhľad).
- ⚠️ `globals.css` je veľký jeden súbor — viacero `@media` blokov pre hero; pri zmene farieb meniť **tokeny v `:root`**, nie jednotlivé hodnoty.

## Posledný stav tejto session (zhrnutie)

Hlavná práca: kompletný redizajn **hero** (full-bleed room fotka, 2-riadkový nadpis, 2 CTA, 5-ikonová glassy lišta s cyan pulzom, scroll cue, badge), **mobilný split hero**, responzívne ladenie fotky (shift ≤1300, zoom-out 901–1500, fix ≥2100 + fade hrán), **mini + plný konfigurátor**, sekcia **„Vyberte si svoju kolekciu"**, **kompaktné dlaždice** (max-šírka + full-width linky), zjednotenie **fontov a farieb** (vrátane jednotného `--bg #0a0c0d`). Detaily v `git log`.
