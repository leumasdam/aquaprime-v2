# AQUAPRIME — web

Prémiový landing + web pre AQUAPRIME (akvarijné skrinky na mieru). Postavené z Figma dizajnu a doplnené podľa IA blueprintov.

**Stack:** Next.js 16 (App Router), TypeScript, čisté CSS (žiadny Tailwind), `next/font` (Tinos + Inter).

## Spustenie

```bash
npm run dev      # vývoj na http://localhost:3000 (alebo 3003 ak je 3000 obsadený)
npm run build    # produkčný build (všetko statické)
npm start        # spustenie produkčného buildu
```

## Štruktúra stránok (podľa IA)

| Route | Obsah |
|---|---|
| `/` | Landing: hero → konštrukcia (360° model) → dôkaz kvality → vetvy → dôvera → dopyt |
| `/skrinky` | Katalóg: filtre + kolekcie-predvoľby + produkty + „prečo rám" + CTA |
| `/skrinky/[slug]` | Detail produktu (6 ks, SSG) — foto, specs, cena, súvisiace |
| `/akvaria-teraria` | Vetva nádrží na mieru (zelený akcent) |
| `/doplnky-technika` | Technika a príslušenstvo (modrý akcent) |
| `/materialy` | Povrchy a remeslo (zlatý akcent) |
| `/realizacie` | Portfólio realizácií (cyan) |
| `/o-nas` | Značka a výroba |
| `/dopyt` | Interaktívny dopytový formulár |
| `/kontakt` | Kontaktné info + CTA |

+ `sitemap.xml`, `robots.txt`, custom `404`, favicon z brand marku.

## Kľúčové komponenty (`app/`)

- `SiteNav.tsx` — navbar + mobilné menu (client), `SiteFooter.tsx` — pätička
- `Turntable.tsx` — interaktívny 360° model rámu (crossfade cez rAF, drag + auto-spin; hover šípky s argumentmi sú v `page.tsx`)
- `brand.tsx` — logo (A + vlna) a hero ikony POKOJ / REMESLO / ESTETIKA
- `Subpage.tsx` — zdieľaná šablóna podstránok (header + hlavný blok + karty + CTA)
- `DopytForm.tsx` — dopytový formulár so success stavom
- `ScrollFx.tsx` — scroll-reveal (`[data-reveal]`), `ScrollProgress.tsx` — progress bar, `CountUp.tsx` — počítadlo čísel
- `products.ts` — zdroj produktových dát, `nav.ts` — navigácia

## Mikroanimácie

scroll-reveal (stagger), count-up čísel, hero load-in + Ken Burns zoom, route-fade pri navigácii, scroll-progress bar, hover lift/zoom na kartách, nav underline, hover anotácie na 3D modeli, mobilné menu. Všetko rešpektuje `prefers-reduced-motion`.

## Assety

`public/img/` — `hero.webp`, `col-*.webp` (kolekcie), `mod-*.webp` (moduly), `turntable/f0–f24.webp` (snímky 360° modelu). Pôvodné PNG (~9 MB) prevedené na WebP (~1,2 MB).

## TODO / ďalšie kroky

- Napojiť dopytový formulár na backend (napr. Web3Forms / e-mail)
- Doplniť reálne produktové fotky a dáta do `products.ts`
- Naplniť subpages reálnym obsahom a fotkami
- Voliteľne: konfigurátor skriniek (IA ho parkuje na neskôr ako nástroj)
