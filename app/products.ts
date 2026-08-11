// Produktový katalóg AQUAPRIME — generované z podkladov klienta
// („Skrinky pod akvária": 3 rady × rozmery × dekory; fotky public/img/products)
// Objem = orientačný pri výške hladiny ~50 cm. Ceny zatiaľ na dopyt.

export type Decor = {
  id: string;
  name: string;
  /** vizuál dekoru: "#hex" = lak, "/cesta" = textúra z fotky; 2 položky = kombinácia (delený swatch) */
  swatch: string[];
  images: string[];
  /** fotky nie sú z tohto konkrétneho produktu */
  inherited?: boolean;
  /**
   * Čo presne sa na fotke líši:
   *  "rozmer" — ten istý rad aj dekor, len iná dĺžka (fotka je použiteľná)
   *  "rad"    — dekor máme nafotený len na inom rade (toto treba dofotiť)
   */
  illuFrom?: "rozmer" | "rad";
  /** rozmer, ktorý je na fotke — dopĺňa sa pri illuFrom: "rozmer" */
  illuSize?: string;
};

export type Tier = "premium" | "standard" | "basic";

export type Product = {
  slug: string;
  name: string;
  tier: Tier;
  tierLabel: string;
  tierNote: string;
  dim: string;
  w: number;
  d: number;
  h: number;
  aquarium: string;
  vol: string;
  price: string;
  /** plná cena LED verzie (podsvietenie), ak existuje v cenníku */
  priceLed?: string;
  desc: string;
  features: string[];
  decors: Decor[];
  cover: string;
};

export const TIERS: { id: Tier; label: string; note: string }[] = [
  { id: "premium", label: "PREMIUM", note: "Kompletne opláštená" },
  { id: "standard", label: "ŠTANDARD", note: "Bočnice a dvierka" },
  { id: "basic", label: "BASIC", note: "Kovový rám + vrchná doska" },
];

export const PRODUCTS: Product[] = [
    {
      "slug": "premium-100x40x80",
      "name": "PREMIUM 100 × 40 × 80",
      "tier": "premium",
      "tierLabel": "PREMIUM",
      "tierNote": "Kompletne opláštená",
      "dim": "100 × 40 × 80 cm",
      "w": 100,
      "d": 40,
      "h": 80,
      "aquarium": "100 × 40 cm (pôdorys)",
      "vol": "~200 l",
      "price": "335 €",
      "desc": "Vlajkový model — kompletne opláštená skrinka, v ktorej oceľový rám mizne v plášti z LDTD 18 mm. Bezrúčkové dvierka so symetrickou špárou a matný povrch z nej robia nábytkový kus, nie podstavec.",
      "features": [
        "Kompletné opláštenie LDTD 18 mm s precíznym olepením hrán",
        "Bezrúčkové dvierka so symetrickou dizajnovou špárou",
        "Oceľový rám 30 × 30 × 2 mm — váhu nesie kov, nie plášť",
        "Matný povrch odolný voči vlhkosti a poškodeniu",
        "Odolné kolieska pre jednoduchú manipuláciu",
        "Zákazková výroba s ručnou kontrolou"
      ],
      "decors": [
        {
          "id": "dub-hunton-black-matt",
          "name": "Dub Hunton / Black Matt",
          "swatch": [
            "/img/products/swatch-dub-hunton.webp",
            "#17181a"
          ],
          "images": [
            "/img/products/premium-100x40x90-dub-hunton-black-matt-05.webp",
            "/img/products/premium-100x40x90-dub-hunton-black-matt-07.webp",
            "/img/products/premium-100x40x90-dub-hunton-black-matt-01.webp",
            "/img/products/premium-100x40x90-dub-hunton-black-matt-02.webp",
            "/img/products/premium-100x40x90-dub-hunton-black-matt-08.webp",
            "/img/products/premium-100x40x90-dub-hunton-black-matt-04.webp",
            "/img/products/premium-100x40x90-dub-hunton-black-matt-03.webp",
            "/img/products/premium-100x40x90-dub-hunton-black-matt-06.webp"
          ]
        },
        {
          "id": "black-matt",
          "name": "Black Matt",
          "swatch": [
            "#17181a"
          ],
          "images": [
            "/img/products/premium-100x40x90-black-matt-04.webp",
            "/img/products/premium-100x40x90-black-matt-05.webp",
            "/img/products/premium-100x40x90-black-matt-01.webp",
            "/img/products/premium-100x40x90-black-matt-02.webp",
            "/img/products/premium-100x40x90-black-matt-03.webp",
            "/img/products/premium-100x40x90-black-matt-06.webp"
          ]
        },
        {
          "id": "black-matt-orech",
          "name": "Black Matt / Orech",
          "swatch": [
            "#17181a",
            "/img/products/swatch-orech.webp"
          ],
          "images": [
            "/img/products/standard-80x40x90-black-matt-orech-01.webp",
            "/img/products/premium-100x40x90-black-matt-orech-01.webp"
          ],
          "inherited": true,
          "illuFrom": "rad"
        },
        {
          "id": "cool-white",
          "name": "Cool White",
          "swatch": [
            "#eef0f0"
          ],
          "images": [
            "/img/products/premium-100x40x90-cool-white-07.webp",
            "/img/products/premium-100x40x90-cool-white-01.webp",
            "/img/products/premium-100x40x90-cool-white-03.webp",
            "/img/products/premium-100x40x90-cool-white-09.webp",
            "/img/products/premium-100x40x90-cool-white-02.webp",
            "/img/products/premium-100x40x90-cool-white-10.webp",
            "/img/products/premium-100x40x90-cool-white-04.webp",
            "/img/products/premium-100x40x90-cool-white-06.webp",
            "/img/products/premium-100x40x90-cool-white-05.webp",
            "/img/products/premium-100x40x90-cool-white-08.webp"
          ]
        },
        {
          "id": "dub-sonoma",
          "name": "Dub Sonoma",
          "swatch": [
            "/img/products/swatch-dub-sonoma.webp"
          ],
          "images": [
            "/img/products/premium-100x40x90-dub-sonoma-02.webp",
            "/img/products/premium-100x40x90-dub-sonoma-03.webp",
            "/img/products/premium-100x40x90-dub-sonoma-01.webp",
            "/img/products/premium-100x40x90-dub-sonoma-05.webp",
            "/img/products/premium-100x40x90-dub-sonoma-06.webp",
            "/img/products/premium-100x40x90-dub-sonoma-04.webp"
          ]
        },
        {
          "id": "choco-vintage-oak",
          "name": "Choco Vintage Oak",
          "swatch": [
            "/img/products/swatch-choco-vintage-oak.webp"
          ],
          "images": [
            "/img/products/choco-vintage-oak-03.webp",
            "/img/products/choco-vintage-oak-12.webp",
            "/img/products/choco-vintage-oak-02.webp",
            "/img/products/choco-vintage-oak-15.webp",
            "/img/products/choco-vintage-oak-14.webp",
            "/img/products/choco-vintage-oak-07.webp",
            "/img/products/choco-vintage-oak-06.webp",
            "/img/products/choco-vintage-oak-13.webp",
            "/img/products/choco-vintage-oak-09.webp",
            "/img/products/choco-vintage-oak-04.webp",
            "/img/products/choco-vintage-oak-08.webp",
            "/img/products/choco-vintage-oak-16.webp",
            "/img/products/choco-vintage-oak-05.webp",
            "/img/products/choco-vintage-oak-10.webp",
            "/img/products/choco-vintage-oak-01.webp",
            "/img/products/choco-vintage-oak-11.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer"
        },
        {
          "id": "dub-spanielsky",
          "name": "Dub španielsky",
          "swatch": [
            "/img/products/swatch-dub-spanielsky.webp"
          ],
          "images": [
            "/img/products/dub-spanielsky-10.webp",
            "/img/products/dub-spanielsky-04.webp",
            "/img/products/dub-spanielsky-05.webp",
            "/img/products/dub-spanielsky-02.webp",
            "/img/products/dub-spanielsky-06.webp",
            "/img/products/dub-spanielsky-03.webp",
            "/img/products/dub-spanielsky-08.webp",
            "/img/products/dub-spanielsky-09.webp",
            "/img/products/dub-spanielsky-11.webp",
            "/img/products/dub-spanielsky-01.webp",
            "/img/products/dub-spanielsky-07.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer"
        },
        {
          "id": "dub-spanielsky-black-matt",
          "name": "Dub španielsky / Čierna matná",
          "swatch": [
            "/img/products/swatch-dub-spanielsky.webp",
            "#121316"
          ],
          "images": [
            "/img/products/dub-spanielsky-black-matt-01.webp",
            "/img/products/dub-spanielsky-black-matt-11.webp",
            "/img/products/dub-spanielsky-black-matt-09.webp",
            "/img/products/dub-spanielsky-black-matt-05.webp",
            "/img/products/dub-spanielsky-black-matt-08.webp",
            "/img/products/dub-spanielsky-black-matt-06.webp",
            "/img/products/dub-spanielsky-black-matt-07.webp",
            "/img/products/dub-spanielsky-black-matt-04.webp",
            "/img/products/dub-spanielsky-black-matt-12.webp",
            "/img/products/dub-spanielsky-black-matt-13.webp",
            "/img/products/dub-spanielsky-black-matt-02.webp",
            "/img/products/dub-spanielsky-black-matt-03.webp",
            "/img/products/dub-spanielsky-black-matt-10.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer"
        }
      ],
      "cover": "/img/products/premium-100x40x90-dub-hunton-black-matt-05.webp",
      "priceLed": "385 €"
    },
    {
      "slug": "premium-120x40x80",
      "name": "PREMIUM 120 × 40 × 80",
      "tier": "premium",
      "tierLabel": "PREMIUM",
      "tierNote": "Kompletne opláštená",
      "dim": "120 × 40 × 80 cm",
      "w": 120,
      "d": 40,
      "h": 80,
      "aquarium": "120 × 40 cm (pôdorys)",
      "vol": "~240 l",
      "price": "350 €",
      "desc": "Kompletne opláštená skrinka — oceľový rám mizne v plášti z LDTD 18 mm. Reprezentatívne riešenie pre nádrže okolo 240 litrov.",
      "features": [
        "Kompletné opláštenie LDTD 18 mm s precíznym olepením hrán",
        "Bezrúčkové dvierka so symetrickou dizajnovou špárou",
        "Oceľový rám 30 × 30 × 2 mm — váhu nesie kov, nie plášť",
        "Matný povrch odolný voči vlhkosti a poškodeniu",
        "Odolné kolieska pre jednoduchú manipuláciu",
        "Zákazková výroba s ručnou kontrolou"
      ],
      "decors": [
        {
          "id": "dub-hunton-black-matt",
          "name": "Dub Hunton / Black Matt",
          "swatch": [
            "/img/products/swatch-dub-hunton.webp",
            "#17181a"
          ],
          "images": [
            "/img/products/premium-100x40x90-dub-hunton-black-matt-05.webp",
            "/img/products/premium-100x40x90-dub-hunton-black-matt-07.webp",
            "/img/products/premium-100x40x90-dub-hunton-black-matt-01.webp",
            "/img/products/premium-100x40x90-dub-hunton-black-matt-02.webp",
            "/img/products/premium-100x40x90-dub-hunton-black-matt-08.webp",
            "/img/products/premium-100x40x90-dub-hunton-black-matt-04.webp",
            "/img/products/premium-100x40x90-dub-hunton-black-matt-03.webp",
            "/img/products/premium-100x40x90-dub-hunton-black-matt-06.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer",
          "illuSize": "100 × 40 cm"
        },
        {
          "id": "black-matt",
          "name": "Black Matt",
          "swatch": [
            "#17181a"
          ],
          "images": [
            "/img/products/premium-100x40x90-black-matt-04.webp",
            "/img/products/premium-100x40x90-black-matt-05.webp",
            "/img/products/premium-100x40x90-black-matt-01.webp",
            "/img/products/premium-100x40x90-black-matt-02.webp",
            "/img/products/premium-100x40x90-black-matt-03.webp",
            "/img/products/premium-100x40x90-black-matt-06.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer",
          "illuSize": "100 × 40 cm"
        },
        {
          "id": "black-matt-orech",
          "name": "Black Matt / Orech",
          "swatch": [
            "#17181a",
            "/img/products/swatch-orech.webp"
          ],
          "images": [
            "/img/products/standard-80x40x90-black-matt-orech-01.webp",
            "/img/products/premium-100x40x90-black-matt-orech-01.webp"
          ],
          "inherited": true,
          "illuFrom": "rad"
        },
        {
          "id": "cool-white",
          "name": "Cool White",
          "swatch": [
            "#eef0f0"
          ],
          "images": [
            "/img/products/premium-100x40x90-cool-white-07.webp",
            "/img/products/premium-100x40x90-cool-white-01.webp",
            "/img/products/premium-100x40x90-cool-white-03.webp",
            "/img/products/premium-100x40x90-cool-white-09.webp",
            "/img/products/premium-100x40x90-cool-white-02.webp",
            "/img/products/premium-100x40x90-cool-white-10.webp",
            "/img/products/premium-100x40x90-cool-white-04.webp",
            "/img/products/premium-100x40x90-cool-white-06.webp",
            "/img/products/premium-100x40x90-cool-white-05.webp",
            "/img/products/premium-100x40x90-cool-white-08.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer",
          "illuSize": "100 × 40 cm"
        },
        {
          "id": "dub-sonoma",
          "name": "Dub Sonoma",
          "swatch": [
            "/img/products/swatch-dub-sonoma.webp"
          ],
          "images": [
            "/img/products/premium-100x40x90-dub-sonoma-02.webp",
            "/img/products/premium-100x40x90-dub-sonoma-03.webp",
            "/img/products/premium-100x40x90-dub-sonoma-01.webp",
            "/img/products/premium-100x40x90-dub-sonoma-05.webp",
            "/img/products/premium-100x40x90-dub-sonoma-06.webp",
            "/img/products/premium-100x40x90-dub-sonoma-04.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer",
          "illuSize": "100 × 40 cm"
        },
        {
          "id": "choco-vintage-oak",
          "name": "Choco Vintage Oak",
          "swatch": [
            "/img/products/swatch-choco-vintage-oak.webp"
          ],
          "images": [
            "/img/products/choco-vintage-oak-03.webp",
            "/img/products/choco-vintage-oak-12.webp",
            "/img/products/choco-vintage-oak-02.webp",
            "/img/products/choco-vintage-oak-15.webp",
            "/img/products/choco-vintage-oak-14.webp",
            "/img/products/choco-vintage-oak-07.webp",
            "/img/products/choco-vintage-oak-06.webp",
            "/img/products/choco-vintage-oak-13.webp",
            "/img/products/choco-vintage-oak-09.webp",
            "/img/products/choco-vintage-oak-04.webp",
            "/img/products/choco-vintage-oak-08.webp",
            "/img/products/choco-vintage-oak-16.webp",
            "/img/products/choco-vintage-oak-05.webp",
            "/img/products/choco-vintage-oak-10.webp",
            "/img/products/choco-vintage-oak-01.webp",
            "/img/products/choco-vintage-oak-11.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer"
        },
        {
          "id": "dub-spanielsky",
          "name": "Dub španielsky",
          "swatch": [
            "/img/products/swatch-dub-spanielsky.webp"
          ],
          "images": [
            "/img/products/dub-spanielsky-10.webp",
            "/img/products/dub-spanielsky-04.webp",
            "/img/products/dub-spanielsky-05.webp",
            "/img/products/dub-spanielsky-02.webp",
            "/img/products/dub-spanielsky-06.webp",
            "/img/products/dub-spanielsky-03.webp",
            "/img/products/dub-spanielsky-08.webp",
            "/img/products/dub-spanielsky-09.webp",
            "/img/products/dub-spanielsky-11.webp",
            "/img/products/dub-spanielsky-01.webp",
            "/img/products/dub-spanielsky-07.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer"
        },
        {
          "id": "dub-spanielsky-black-matt",
          "name": "Dub španielsky / Čierna matná",
          "swatch": [
            "/img/products/swatch-dub-spanielsky.webp",
            "#121316"
          ],
          "images": [
            "/img/products/dub-spanielsky-black-matt-01.webp",
            "/img/products/dub-spanielsky-black-matt-11.webp",
            "/img/products/dub-spanielsky-black-matt-09.webp",
            "/img/products/dub-spanielsky-black-matt-05.webp",
            "/img/products/dub-spanielsky-black-matt-08.webp",
            "/img/products/dub-spanielsky-black-matt-06.webp",
            "/img/products/dub-spanielsky-black-matt-07.webp",
            "/img/products/dub-spanielsky-black-matt-04.webp",
            "/img/products/dub-spanielsky-black-matt-12.webp",
            "/img/products/dub-spanielsky-black-matt-13.webp",
            "/img/products/dub-spanielsky-black-matt-02.webp",
            "/img/products/dub-spanielsky-black-matt-03.webp",
            "/img/products/dub-spanielsky-black-matt-10.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer"
        }
      ],
      "cover": "/img/products/premium-100x40x90-dub-hunton-black-matt-05.webp",
      "priceLed": "400 €"
    },
    {
      "slug": "premium-150x50x80",
      "name": "PREMIUM 150 × 50 × 80",
      "tier": "premium",
      "tierLabel": "PREMIUM",
      "tierNote": "Kompletne opláštená",
      "dim": "150 × 50 × 80 cm",
      "w": 150,
      "d": 50,
      "h": 80,
      "aquarium": "150 × 50 cm (pôdorys)",
      "vol": "~375 l",
      "price": "360 €",
      "desc": "Kompletne opláštená skrinka — oceľový rám mizne v plášti z LDTD 18 mm. Reprezentatívne riešenie pre nádrže okolo 375 litrov.",
      "features": [
        "Kompletné opláštenie LDTD 18 mm s precíznym olepením hrán",
        "Bezrúčkové dvierka so symetrickou dizajnovou špárou",
        "Oceľový rám 30 × 30 × 2 mm — váhu nesie kov, nie plášť",
        "Matný povrch odolný voči vlhkosti a poškodeniu",
        "Odolné kolieska pre jednoduchú manipuláciu",
        "Zákazková výroba s ručnou kontrolou"
      ],
      "decors": [
        {
          "id": "dub-hunton-black-matt",
          "name": "Dub Hunton / Black Matt",
          "swatch": [
            "/img/products/swatch-dub-hunton.webp",
            "#17181a"
          ],
          "images": [
            "/img/products/premium-100x40x90-dub-hunton-black-matt-05.webp",
            "/img/products/premium-100x40x90-dub-hunton-black-matt-07.webp",
            "/img/products/premium-100x40x90-dub-hunton-black-matt-01.webp",
            "/img/products/premium-100x40x90-dub-hunton-black-matt-02.webp",
            "/img/products/premium-100x40x90-dub-hunton-black-matt-08.webp",
            "/img/products/premium-100x40x90-dub-hunton-black-matt-04.webp",
            "/img/products/premium-100x40x90-dub-hunton-black-matt-03.webp",
            "/img/products/premium-100x40x90-dub-hunton-black-matt-06.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer",
          "illuSize": "100 × 40 cm"
        },
        {
          "id": "black-matt",
          "name": "Black Matt",
          "swatch": [
            "#17181a"
          ],
          "images": [
            "/img/products/premium-100x40x90-black-matt-04.webp",
            "/img/products/premium-100x40x90-black-matt-05.webp",
            "/img/products/premium-100x40x90-black-matt-01.webp",
            "/img/products/premium-100x40x90-black-matt-02.webp",
            "/img/products/premium-100x40x90-black-matt-03.webp",
            "/img/products/premium-100x40x90-black-matt-06.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer",
          "illuSize": "100 × 40 cm"
        },
        {
          "id": "black-matt-orech",
          "name": "Black Matt / Orech",
          "swatch": [
            "#17181a",
            "/img/products/swatch-orech.webp"
          ],
          "images": [
            "/img/products/standard-80x40x90-black-matt-orech-01.webp",
            "/img/products/premium-100x40x90-black-matt-orech-01.webp"
          ],
          "inherited": true,
          "illuFrom": "rad"
        },
        {
          "id": "cool-white",
          "name": "Cool White",
          "swatch": [
            "#eef0f0"
          ],
          "images": [
            "/img/products/premium-100x40x90-cool-white-07.webp",
            "/img/products/premium-100x40x90-cool-white-01.webp",
            "/img/products/premium-100x40x90-cool-white-03.webp",
            "/img/products/premium-100x40x90-cool-white-09.webp",
            "/img/products/premium-100x40x90-cool-white-02.webp",
            "/img/products/premium-100x40x90-cool-white-10.webp",
            "/img/products/premium-100x40x90-cool-white-04.webp",
            "/img/products/premium-100x40x90-cool-white-06.webp",
            "/img/products/premium-100x40x90-cool-white-05.webp",
            "/img/products/premium-100x40x90-cool-white-08.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer",
          "illuSize": "100 × 40 cm"
        },
        {
          "id": "dub-sonoma",
          "name": "Dub Sonoma",
          "swatch": [
            "/img/products/swatch-dub-sonoma.webp"
          ],
          "images": [
            "/img/products/premium-100x40x90-dub-sonoma-02.webp",
            "/img/products/premium-100x40x90-dub-sonoma-03.webp",
            "/img/products/premium-100x40x90-dub-sonoma-01.webp",
            "/img/products/premium-100x40x90-dub-sonoma-05.webp",
            "/img/products/premium-100x40x90-dub-sonoma-06.webp",
            "/img/products/premium-100x40x90-dub-sonoma-04.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer",
          "illuSize": "100 × 40 cm"
        },
        {
          "id": "choco-vintage-oak",
          "name": "Choco Vintage Oak",
          "swatch": [
            "/img/products/swatch-choco-vintage-oak.webp"
          ],
          "images": [
            "/img/products/choco-vintage-oak-03.webp",
            "/img/products/choco-vintage-oak-12.webp",
            "/img/products/choco-vintage-oak-02.webp",
            "/img/products/choco-vintage-oak-15.webp",
            "/img/products/choco-vintage-oak-14.webp",
            "/img/products/choco-vintage-oak-07.webp",
            "/img/products/choco-vintage-oak-06.webp",
            "/img/products/choco-vintage-oak-13.webp",
            "/img/products/choco-vintage-oak-09.webp",
            "/img/products/choco-vintage-oak-04.webp",
            "/img/products/choco-vintage-oak-08.webp",
            "/img/products/choco-vintage-oak-16.webp",
            "/img/products/choco-vintage-oak-05.webp",
            "/img/products/choco-vintage-oak-10.webp",
            "/img/products/choco-vintage-oak-01.webp",
            "/img/products/choco-vintage-oak-11.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer"
        },
        {
          "id": "dub-spanielsky",
          "name": "Dub španielsky",
          "swatch": [
            "/img/products/swatch-dub-spanielsky.webp"
          ],
          "images": [
            "/img/products/dub-spanielsky-10.webp",
            "/img/products/dub-spanielsky-04.webp",
            "/img/products/dub-spanielsky-05.webp",
            "/img/products/dub-spanielsky-02.webp",
            "/img/products/dub-spanielsky-06.webp",
            "/img/products/dub-spanielsky-03.webp",
            "/img/products/dub-spanielsky-08.webp",
            "/img/products/dub-spanielsky-09.webp",
            "/img/products/dub-spanielsky-11.webp",
            "/img/products/dub-spanielsky-01.webp",
            "/img/products/dub-spanielsky-07.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer"
        },
        {
          "id": "dub-spanielsky-black-matt",
          "name": "Dub španielsky / Čierna matná",
          "swatch": [
            "/img/products/swatch-dub-spanielsky.webp",
            "#121316"
          ],
          "images": [
            "/img/products/dub-spanielsky-black-matt-01.webp",
            "/img/products/dub-spanielsky-black-matt-11.webp",
            "/img/products/dub-spanielsky-black-matt-09.webp",
            "/img/products/dub-spanielsky-black-matt-05.webp",
            "/img/products/dub-spanielsky-black-matt-08.webp",
            "/img/products/dub-spanielsky-black-matt-06.webp",
            "/img/products/dub-spanielsky-black-matt-07.webp",
            "/img/products/dub-spanielsky-black-matt-04.webp",
            "/img/products/dub-spanielsky-black-matt-12.webp",
            "/img/products/dub-spanielsky-black-matt-13.webp",
            "/img/products/dub-spanielsky-black-matt-02.webp",
            "/img/products/dub-spanielsky-black-matt-03.webp",
            "/img/products/dub-spanielsky-black-matt-10.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer"
        }
      ],
      "cover": "/img/products/premium-100x40x90-dub-hunton-black-matt-05.webp",
      "priceLed": "410 €"
    },
    {
      "slug": "premium-160x60x80",
      "name": "PREMIUM 160 × 60 × 80",
      "tier": "premium",
      "tierLabel": "PREMIUM",
      "tierNote": "Kompletne opláštená",
      "dim": "160 × 60 × 80 cm",
      "w": 160,
      "d": 60,
      "h": 80,
      "aquarium": "160 × 60 cm (pôdorys)",
      "vol": "~480 l",
      "price": "370 €",
      "desc": "Kompletne opláštená skrinka — oceľový rám mizne v plášti z LDTD 18 mm. Reprezentatívne riešenie pre nádrže okolo 480 litrov.",
      "features": [
        "Kompletné opláštenie LDTD 18 mm s precíznym olepením hrán",
        "Bezrúčkové dvierka so symetrickou dizajnovou špárou",
        "Oceľový rám 30 × 30 × 2 mm — váhu nesie kov, nie plášť",
        "Matný povrch odolný voči vlhkosti a poškodeniu",
        "Odolné kolieska pre jednoduchú manipuláciu",
        "Zákazková výroba s ručnou kontrolou"
      ],
      "decors": [
        {
          "id": "dub-hunton-black-matt",
          "name": "Dub Hunton / Black Matt",
          "swatch": [
            "/img/products/swatch-dub-hunton.webp",
            "#17181a"
          ],
          "images": [
            "/img/products/premium-100x40x90-dub-hunton-black-matt-05.webp",
            "/img/products/premium-100x40x90-dub-hunton-black-matt-07.webp",
            "/img/products/premium-100x40x90-dub-hunton-black-matt-01.webp",
            "/img/products/premium-100x40x90-dub-hunton-black-matt-02.webp",
            "/img/products/premium-100x40x90-dub-hunton-black-matt-08.webp",
            "/img/products/premium-100x40x90-dub-hunton-black-matt-04.webp",
            "/img/products/premium-100x40x90-dub-hunton-black-matt-03.webp",
            "/img/products/premium-100x40x90-dub-hunton-black-matt-06.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer",
          "illuSize": "100 × 40 cm"
        },
        {
          "id": "black-matt",
          "name": "Black Matt",
          "swatch": [
            "#17181a"
          ],
          "images": [
            "/img/products/premium-100x40x90-black-matt-04.webp",
            "/img/products/premium-100x40x90-black-matt-05.webp",
            "/img/products/premium-100x40x90-black-matt-01.webp",
            "/img/products/premium-100x40x90-black-matt-02.webp",
            "/img/products/premium-100x40x90-black-matt-03.webp",
            "/img/products/premium-100x40x90-black-matt-06.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer",
          "illuSize": "100 × 40 cm"
        },
        {
          "id": "black-matt-orech",
          "name": "Black Matt / Orech",
          "swatch": [
            "#17181a",
            "/img/products/swatch-orech.webp"
          ],
          "images": [
            "/img/products/standard-80x40x90-black-matt-orech-01.webp",
            "/img/products/premium-100x40x90-black-matt-orech-01.webp"
          ],
          "inherited": true,
          "illuFrom": "rad"
        },
        {
          "id": "cool-white",
          "name": "Cool White",
          "swatch": [
            "#eef0f0"
          ],
          "images": [
            "/img/products/premium-100x40x90-cool-white-07.webp",
            "/img/products/premium-100x40x90-cool-white-01.webp",
            "/img/products/premium-100x40x90-cool-white-03.webp",
            "/img/products/premium-100x40x90-cool-white-09.webp",
            "/img/products/premium-100x40x90-cool-white-02.webp",
            "/img/products/premium-100x40x90-cool-white-10.webp",
            "/img/products/premium-100x40x90-cool-white-04.webp",
            "/img/products/premium-100x40x90-cool-white-06.webp",
            "/img/products/premium-100x40x90-cool-white-05.webp",
            "/img/products/premium-100x40x90-cool-white-08.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer",
          "illuSize": "100 × 40 cm"
        },
        {
          "id": "dub-sonoma",
          "name": "Dub Sonoma",
          "swatch": [
            "/img/products/swatch-dub-sonoma.webp"
          ],
          "images": [
            "/img/products/premium-100x40x90-dub-sonoma-02.webp",
            "/img/products/premium-100x40x90-dub-sonoma-03.webp",
            "/img/products/premium-100x40x90-dub-sonoma-01.webp",
            "/img/products/premium-100x40x90-dub-sonoma-05.webp",
            "/img/products/premium-100x40x90-dub-sonoma-06.webp",
            "/img/products/premium-100x40x90-dub-sonoma-04.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer",
          "illuSize": "100 × 40 cm"
        },
        {
          "id": "choco-vintage-oak",
          "name": "Choco Vintage Oak",
          "swatch": [
            "/img/products/swatch-choco-vintage-oak.webp"
          ],
          "images": [
            "/img/products/choco-vintage-oak-03.webp",
            "/img/products/choco-vintage-oak-12.webp",
            "/img/products/choco-vintage-oak-02.webp",
            "/img/products/choco-vintage-oak-15.webp",
            "/img/products/choco-vintage-oak-14.webp",
            "/img/products/choco-vintage-oak-07.webp",
            "/img/products/choco-vintage-oak-06.webp",
            "/img/products/choco-vintage-oak-13.webp",
            "/img/products/choco-vintage-oak-09.webp",
            "/img/products/choco-vintage-oak-04.webp",
            "/img/products/choco-vintage-oak-08.webp",
            "/img/products/choco-vintage-oak-16.webp",
            "/img/products/choco-vintage-oak-05.webp",
            "/img/products/choco-vintage-oak-10.webp",
            "/img/products/choco-vintage-oak-01.webp",
            "/img/products/choco-vintage-oak-11.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer"
        },
        {
          "id": "dub-spanielsky",
          "name": "Dub španielsky",
          "swatch": [
            "/img/products/swatch-dub-spanielsky.webp"
          ],
          "images": [
            "/img/products/dub-spanielsky-10.webp",
            "/img/products/dub-spanielsky-04.webp",
            "/img/products/dub-spanielsky-05.webp",
            "/img/products/dub-spanielsky-02.webp",
            "/img/products/dub-spanielsky-06.webp",
            "/img/products/dub-spanielsky-03.webp",
            "/img/products/dub-spanielsky-08.webp",
            "/img/products/dub-spanielsky-09.webp",
            "/img/products/dub-spanielsky-11.webp",
            "/img/products/dub-spanielsky-01.webp",
            "/img/products/dub-spanielsky-07.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer"
        },
        {
          "id": "dub-spanielsky-black-matt",
          "name": "Dub španielsky / Čierna matná",
          "swatch": [
            "/img/products/swatch-dub-spanielsky.webp",
            "#121316"
          ],
          "images": [
            "/img/products/dub-spanielsky-black-matt-01.webp",
            "/img/products/dub-spanielsky-black-matt-11.webp",
            "/img/products/dub-spanielsky-black-matt-09.webp",
            "/img/products/dub-spanielsky-black-matt-05.webp",
            "/img/products/dub-spanielsky-black-matt-08.webp",
            "/img/products/dub-spanielsky-black-matt-06.webp",
            "/img/products/dub-spanielsky-black-matt-07.webp",
            "/img/products/dub-spanielsky-black-matt-04.webp",
            "/img/products/dub-spanielsky-black-matt-12.webp",
            "/img/products/dub-spanielsky-black-matt-13.webp",
            "/img/products/dub-spanielsky-black-matt-02.webp",
            "/img/products/dub-spanielsky-black-matt-03.webp",
            "/img/products/dub-spanielsky-black-matt-10.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer"
        }
      ],
      "cover": "/img/products/premium-100x40x90-dub-hunton-black-matt-05.webp",
      "priceLed": "420 €"
    },
    {
      "slug": "premium-200x50x70",
      "name": "PREMIUM 200 × 50 × 70",
      "tier": "premium",
      "tierLabel": "PREMIUM",
      "tierNote": "Kompletne opláštená",
      "dim": "200 × 50 × 70 cm",
      "w": 200,
      "d": 50,
      "h": 70,
      "aquarium": "200 × 50 cm (pôdorys)",
      "vol": "~500 l",
      "price": "410 €",
      "desc": "Kompletne opláštená skrinka — oceľový rám mizne v plášti z LDTD 18 mm. Reprezentatívne riešenie pre nádrže okolo 500 litrov.",
      "features": [
        "Kompletné opláštenie LDTD 18 mm s precíznym olepením hrán",
        "Bezrúčkové dvierka so symetrickou dizajnovou špárou",
        "Oceľový rám 30 × 30 × 2 mm — váhu nesie kov, nie plášť",
        "Matný povrch odolný voči vlhkosti a poškodeniu",
        "Odolné kolieska pre jednoduchú manipuláciu",
        "Zákazková výroba s ručnou kontrolou"
      ],
      "decors": [
        {
          "id": "dub-hunton-black-matt",
          "name": "Dub Hunton / Black Matt",
          "swatch": [
            "/img/products/swatch-dub-hunton.webp",
            "#17181a"
          ],
          "images": [
            "/img/products/premium-100x40x90-dub-hunton-black-matt-05.webp",
            "/img/products/premium-100x40x90-dub-hunton-black-matt-07.webp",
            "/img/products/premium-100x40x90-dub-hunton-black-matt-01.webp",
            "/img/products/premium-100x40x90-dub-hunton-black-matt-02.webp",
            "/img/products/premium-100x40x90-dub-hunton-black-matt-08.webp",
            "/img/products/premium-100x40x90-dub-hunton-black-matt-04.webp",
            "/img/products/premium-100x40x90-dub-hunton-black-matt-03.webp",
            "/img/products/premium-100x40x90-dub-hunton-black-matt-06.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer",
          "illuSize": "100 × 40 cm"
        },
        {
          "id": "black-matt",
          "name": "Black Matt",
          "swatch": [
            "#17181a"
          ],
          "images": [
            "/img/products/premium-100x40x90-black-matt-04.webp",
            "/img/products/premium-100x40x90-black-matt-05.webp",
            "/img/products/premium-100x40x90-black-matt-01.webp",
            "/img/products/premium-100x40x90-black-matt-02.webp",
            "/img/products/premium-100x40x90-black-matt-03.webp",
            "/img/products/premium-100x40x90-black-matt-06.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer",
          "illuSize": "100 × 40 cm"
        },
        {
          "id": "black-matt-orech",
          "name": "Black Matt / Orech",
          "swatch": [
            "#17181a",
            "/img/products/swatch-orech.webp"
          ],
          "images": [
            "/img/products/standard-80x40x90-black-matt-orech-01.webp",
            "/img/products/premium-100x40x90-black-matt-orech-01.webp"
          ],
          "inherited": true,
          "illuFrom": "rad"
        },
        {
          "id": "cool-white",
          "name": "Cool White",
          "swatch": [
            "#eef0f0"
          ],
          "images": [
            "/img/products/premium-100x40x90-cool-white-07.webp",
            "/img/products/premium-100x40x90-cool-white-01.webp",
            "/img/products/premium-100x40x90-cool-white-03.webp",
            "/img/products/premium-100x40x90-cool-white-09.webp",
            "/img/products/premium-100x40x90-cool-white-02.webp",
            "/img/products/premium-100x40x90-cool-white-10.webp",
            "/img/products/premium-100x40x90-cool-white-04.webp",
            "/img/products/premium-100x40x90-cool-white-06.webp",
            "/img/products/premium-100x40x90-cool-white-05.webp",
            "/img/products/premium-100x40x90-cool-white-08.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer",
          "illuSize": "100 × 40 cm"
        },
        {
          "id": "dub-sonoma",
          "name": "Dub Sonoma",
          "swatch": [
            "/img/products/swatch-dub-sonoma.webp"
          ],
          "images": [
            "/img/products/premium-100x40x90-dub-sonoma-02.webp",
            "/img/products/premium-100x40x90-dub-sonoma-03.webp",
            "/img/products/premium-100x40x90-dub-sonoma-01.webp",
            "/img/products/premium-100x40x90-dub-sonoma-05.webp",
            "/img/products/premium-100x40x90-dub-sonoma-06.webp",
            "/img/products/premium-100x40x90-dub-sonoma-04.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer",
          "illuSize": "100 × 40 cm"
        },
        {
          "id": "choco-vintage-oak",
          "name": "Choco Vintage Oak",
          "swatch": [
            "/img/products/swatch-choco-vintage-oak.webp"
          ],
          "images": [
            "/img/products/choco-vintage-oak-03.webp",
            "/img/products/choco-vintage-oak-12.webp",
            "/img/products/choco-vintage-oak-02.webp",
            "/img/products/choco-vintage-oak-15.webp",
            "/img/products/choco-vintage-oak-14.webp",
            "/img/products/choco-vintage-oak-07.webp",
            "/img/products/choco-vintage-oak-06.webp",
            "/img/products/choco-vintage-oak-13.webp",
            "/img/products/choco-vintage-oak-09.webp",
            "/img/products/choco-vintage-oak-04.webp",
            "/img/products/choco-vintage-oak-08.webp",
            "/img/products/choco-vintage-oak-16.webp",
            "/img/products/choco-vintage-oak-05.webp",
            "/img/products/choco-vintage-oak-10.webp",
            "/img/products/choco-vintage-oak-01.webp",
            "/img/products/choco-vintage-oak-11.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer"
        },
        {
          "id": "dub-spanielsky",
          "name": "Dub španielsky",
          "swatch": [
            "/img/products/swatch-dub-spanielsky.webp"
          ],
          "images": [
            "/img/products/dub-spanielsky-10.webp",
            "/img/products/dub-spanielsky-04.webp",
            "/img/products/dub-spanielsky-05.webp",
            "/img/products/dub-spanielsky-02.webp",
            "/img/products/dub-spanielsky-06.webp",
            "/img/products/dub-spanielsky-03.webp",
            "/img/products/dub-spanielsky-08.webp",
            "/img/products/dub-spanielsky-09.webp",
            "/img/products/dub-spanielsky-11.webp",
            "/img/products/dub-spanielsky-01.webp",
            "/img/products/dub-spanielsky-07.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer"
        },
        {
          "id": "dub-spanielsky-black-matt",
          "name": "Dub španielsky / Čierna matná",
          "swatch": [
            "/img/products/swatch-dub-spanielsky.webp",
            "#121316"
          ],
          "images": [
            "/img/products/dub-spanielsky-black-matt-01.webp",
            "/img/products/dub-spanielsky-black-matt-11.webp",
            "/img/products/dub-spanielsky-black-matt-09.webp",
            "/img/products/dub-spanielsky-black-matt-05.webp",
            "/img/products/dub-spanielsky-black-matt-08.webp",
            "/img/products/dub-spanielsky-black-matt-06.webp",
            "/img/products/dub-spanielsky-black-matt-07.webp",
            "/img/products/dub-spanielsky-black-matt-04.webp",
            "/img/products/dub-spanielsky-black-matt-12.webp",
            "/img/products/dub-spanielsky-black-matt-13.webp",
            "/img/products/dub-spanielsky-black-matt-02.webp",
            "/img/products/dub-spanielsky-black-matt-03.webp",
            "/img/products/dub-spanielsky-black-matt-10.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer"
        }
      ],
      "cover": "/img/products/premium-100x40x90-dub-hunton-black-matt-05.webp",
      "priceLed": "460 €"
    },
    {
      "slug": "standard-100x40x80",
      "name": "ŠTANDARD 100 × 40 × 80",
      "tier": "standard",
      "tierLabel": "ŠTANDARD",
      "tierNote": "Bočnice a dvierka",
      "dim": "100 × 40 × 80 cm",
      "w": 100,
      "d": 40,
      "h": 80,
      "aquarium": "100 × 40 cm (pôdorys)",
      "vol": "~200 l",
      "price": "305 €",
      "desc": "Najuniverzálnejší rozmer do obývačky — metrové akvárium vo výške očí, technika schovaná za dvierkami v dekore.",
      "features": [
        "Bočnice a dvierka z LDTD 18 mm v dekore podľa výberu",
        "Oceľový rám 30 × 30 × 2 mm — váhu nesie kov, nie plášť",
        "Precízne lícovanie dvierok",
        "Matný povrch odolný voči vlhkosti",
        "Odolné kolieska pre jednoduchú manipuláciu",
        "Zákazková výroba s ručnou kontrolou"
      ],
      "decors": [
        {
          "id": "cool-white",
          "name": "Cool White",
          "swatch": [
            "#eef0f0"
          ],
          "images": [
            "/img/products/standard-100x40x90-cool-white-02.webp",
            "/img/products/standard-100x40x90-cool-white-01.webp"
          ]
        },
        {
          "id": "black-matt",
          "name": "Black Matt",
          "swatch": [
            "#17181a"
          ],
          "images": [
            "/img/products/standard-100x40x90-black-matt-02.webp",
            "/img/products/standard-100x40x90-black-matt-01.webp"
          ]
        },
        {
          "id": "black-matt-orech",
          "name": "Black Matt / Orech",
          "swatch": [
            "#17181a",
            "/img/products/swatch-orech.webp"
          ],
          "images": [
            "/img/products/standard-80x40x90-black-matt-orech-01.webp",
            "/img/products/standard-100x40x90-black-matt-orech-01.webp"
          ],
          "inherited": true,
          "illuFrom": "rad"
        },
        {
          "id": "antracit",
          "name": "Antracit",
          "swatch": [
            "#40454a"
          ],
          "images": [
            "/img/products/standard-80x40x90-antracit-03.webp",
            "/img/products/standard-80x40x90-antracit-06.webp",
            "/img/products/standard-80x40x90-antracit-07.webp",
            "/img/products/standard-80x40x90-antracit-02.webp",
            "/img/products/standard-80x40x90-antracit-08.webp",
            "/img/products/standard-80x40x90-antracit-05.webp",
            "/img/products/standard-80x40x90-antracit-01.webp",
            "/img/products/standard-80x40x90-antracit-04.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer",
          "illuSize": "80 × 40 cm"
        },
        {
          "id": "artisan-antracit",
          "name": "Artisan / Antracit",
          "swatch": [
            "/img/products/swatch-artisan.webp",
            "#40454a"
          ],
          "images": [
            "/img/products/standard-80x40x90-artisan-antracit-08.webp",
            "/img/products/standard-80x40x90-artisan-antracit-03.webp",
            "/img/products/standard-80x40x90-artisan-antracit-05.webp",
            "/img/products/standard-80x40x90-artisan-antracit-04.webp",
            "/img/products/standard-80x40x90-artisan-antracit-02.webp",
            "/img/products/standard-80x40x90-artisan-antracit-09.webp",
            "/img/products/standard-80x40x90-artisan-antracit-01.webp",
            "/img/products/standard-80x40x90-artisan-antracit-06.webp",
            "/img/products/standard-80x40x90-artisan-antracit-07.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer",
          "illuSize": "80 × 40 cm"
        },
        {
          "id": "dub-hunton-black-matt",
          "name": "Dub Hunton / Black Matt",
          "swatch": [
            "/img/products/swatch-dub-hunton.webp",
            "#17181a"
          ],
          "images": [
            "/img/products/premium-100x40x90-dub-hunton-black-matt-05.webp",
            "/img/products/premium-100x40x90-dub-hunton-black-matt-07.webp",
            "/img/products/premium-100x40x90-dub-hunton-black-matt-01.webp",
            "/img/products/premium-100x40x90-dub-hunton-black-matt-02.webp",
            "/img/products/premium-100x40x90-dub-hunton-black-matt-08.webp",
            "/img/products/premium-100x40x90-dub-hunton-black-matt-04.webp",
            "/img/products/premium-100x40x90-dub-hunton-black-matt-03.webp",
            "/img/products/premium-100x40x90-dub-hunton-black-matt-06.webp"
          ],
          "inherited": true,
          "illuFrom": "rad"
        },
        {
          "id": "dub-sonoma",
          "name": "Dub Sonoma",
          "swatch": [
            "/img/products/swatch-dub-sonoma.webp"
          ],
          "images": [
            "/img/products/standard-80x40x90-dub-sonoma-03.webp",
            "/img/products/standard-80x40x90-dub-sonoma-02.webp",
            "/img/products/standard-80x40x90-dub-sonoma-01.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer",
          "illuSize": "80 × 40 cm"
        },
        {
          "id": "choco-vintage-oak",
          "name": "Choco Vintage Oak",
          "swatch": [
            "/img/products/swatch-choco-vintage-oak.webp"
          ],
          "images": [
            "/img/products/choco-vintage-oak-03.webp",
            "/img/products/choco-vintage-oak-12.webp",
            "/img/products/choco-vintage-oak-02.webp",
            "/img/products/choco-vintage-oak-15.webp",
            "/img/products/choco-vintage-oak-14.webp",
            "/img/products/choco-vintage-oak-07.webp",
            "/img/products/choco-vintage-oak-06.webp",
            "/img/products/choco-vintage-oak-13.webp",
            "/img/products/choco-vintage-oak-09.webp",
            "/img/products/choco-vintage-oak-04.webp",
            "/img/products/choco-vintage-oak-08.webp",
            "/img/products/choco-vintage-oak-16.webp",
            "/img/products/choco-vintage-oak-05.webp",
            "/img/products/choco-vintage-oak-10.webp",
            "/img/products/choco-vintage-oak-01.webp",
            "/img/products/choco-vintage-oak-11.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer"
        },
        {
          "id": "dub-spanielsky",
          "name": "Dub španielsky",
          "swatch": [
            "/img/products/swatch-dub-spanielsky.webp"
          ],
          "images": [
            "/img/products/dub-spanielsky-10.webp",
            "/img/products/dub-spanielsky-04.webp",
            "/img/products/dub-spanielsky-05.webp",
            "/img/products/dub-spanielsky-02.webp",
            "/img/products/dub-spanielsky-06.webp",
            "/img/products/dub-spanielsky-03.webp",
            "/img/products/dub-spanielsky-08.webp",
            "/img/products/dub-spanielsky-09.webp",
            "/img/products/dub-spanielsky-11.webp",
            "/img/products/dub-spanielsky-01.webp",
            "/img/products/dub-spanielsky-07.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer"
        },
        {
          "id": "dub-spanielsky-black-matt",
          "name": "Dub španielsky / Čierna matná",
          "swatch": [
            "/img/products/swatch-dub-spanielsky.webp",
            "#121316"
          ],
          "images": [
            "/img/products/dub-spanielsky-black-matt-01.webp",
            "/img/products/dub-spanielsky-black-matt-11.webp",
            "/img/products/dub-spanielsky-black-matt-09.webp",
            "/img/products/dub-spanielsky-black-matt-05.webp",
            "/img/products/dub-spanielsky-black-matt-08.webp",
            "/img/products/dub-spanielsky-black-matt-06.webp",
            "/img/products/dub-spanielsky-black-matt-07.webp",
            "/img/products/dub-spanielsky-black-matt-04.webp",
            "/img/products/dub-spanielsky-black-matt-12.webp",
            "/img/products/dub-spanielsky-black-matt-13.webp",
            "/img/products/dub-spanielsky-black-matt-02.webp",
            "/img/products/dub-spanielsky-black-matt-03.webp",
            "/img/products/dub-spanielsky-black-matt-10.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer"
        }
      ],
      "cover": "/img/products/standard-100x40x90-cool-white-02.webp",
      "priceLed": "365 €"
    },
    {
      "slug": "standard-120x40x80",
      "name": "ŠTANDARD 120 × 40 × 80",
      "tier": "standard",
      "tierLabel": "ŠTANDARD",
      "tierNote": "Bočnice a dvierka",
      "dim": "120 × 40 × 80 cm",
      "w": 120,
      "d": 40,
      "h": 80,
      "aquarium": "120 × 40 cm (pôdorys)",
      "vol": "~240 l",
      "price": "330 €",
      "desc": "Bočnice a dvierka v dekore skryjú techniku, váhu nesie oceľový rám. Univerzálna voľba pre nádrže okolo 240 litrov.",
      "features": [
        "Bočnice a dvierka z LDTD 18 mm v dekore podľa výberu",
        "Oceľový rám 30 × 30 × 2 mm — váhu nesie kov, nie plášť",
        "Precízne lícovanie dvierok",
        "Matný povrch odolný voči vlhkosti",
        "Odolné kolieska pre jednoduchú manipuláciu",
        "Zákazková výroba s ručnou kontrolou"
      ],
      "decors": [
        {
          "id": "cool-white",
          "name": "Cool White",
          "swatch": [
            "#eef0f0"
          ],
          "images": [
            "/img/products/standard-100x40x90-cool-white-02.webp",
            "/img/products/standard-100x40x90-cool-white-01.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer",
          "illuSize": "100 × 40 cm"
        },
        {
          "id": "black-matt",
          "name": "Black Matt",
          "swatch": [
            "#17181a"
          ],
          "images": [
            "/img/products/standard-100x40x90-black-matt-02.webp",
            "/img/products/standard-100x40x90-black-matt-01.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer",
          "illuSize": "100 × 40 cm"
        },
        {
          "id": "black-matt-orech",
          "name": "Black Matt / Orech",
          "swatch": [
            "#17181a",
            "/img/products/swatch-orech.webp"
          ],
          "images": [
            "/img/products/standard-80x40x90-black-matt-orech-01.webp",
            "/img/products/standard-100x40x90-black-matt-orech-01.webp"
          ],
          "inherited": true,
          "illuFrom": "rad"
        },
        {
          "id": "antracit",
          "name": "Antracit",
          "swatch": [
            "#40454a"
          ],
          "images": [
            "/img/products/standard-80x40x90-antracit-03.webp",
            "/img/products/standard-80x40x90-antracit-06.webp",
            "/img/products/standard-80x40x90-antracit-07.webp",
            "/img/products/standard-80x40x90-antracit-02.webp",
            "/img/products/standard-80x40x90-antracit-08.webp",
            "/img/products/standard-80x40x90-antracit-05.webp",
            "/img/products/standard-80x40x90-antracit-01.webp",
            "/img/products/standard-80x40x90-antracit-04.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer",
          "illuSize": "80 × 40 cm"
        },
        {
          "id": "artisan-antracit",
          "name": "Artisan / Antracit",
          "swatch": [
            "/img/products/swatch-artisan.webp",
            "#40454a"
          ],
          "images": [
            "/img/products/standard-80x40x90-artisan-antracit-08.webp",
            "/img/products/standard-80x40x90-artisan-antracit-03.webp",
            "/img/products/standard-80x40x90-artisan-antracit-05.webp",
            "/img/products/standard-80x40x90-artisan-antracit-04.webp",
            "/img/products/standard-80x40x90-artisan-antracit-02.webp",
            "/img/products/standard-80x40x90-artisan-antracit-09.webp",
            "/img/products/standard-80x40x90-artisan-antracit-01.webp",
            "/img/products/standard-80x40x90-artisan-antracit-06.webp",
            "/img/products/standard-80x40x90-artisan-antracit-07.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer",
          "illuSize": "80 × 40 cm"
        },
        {
          "id": "dub-hunton-black-matt",
          "name": "Dub Hunton / Black Matt",
          "swatch": [
            "/img/products/swatch-dub-hunton.webp",
            "#17181a"
          ],
          "images": [
            "/img/products/premium-100x40x90-dub-hunton-black-matt-05.webp",
            "/img/products/premium-100x40x90-dub-hunton-black-matt-07.webp",
            "/img/products/premium-100x40x90-dub-hunton-black-matt-01.webp",
            "/img/products/premium-100x40x90-dub-hunton-black-matt-02.webp",
            "/img/products/premium-100x40x90-dub-hunton-black-matt-08.webp",
            "/img/products/premium-100x40x90-dub-hunton-black-matt-04.webp",
            "/img/products/premium-100x40x90-dub-hunton-black-matt-03.webp",
            "/img/products/premium-100x40x90-dub-hunton-black-matt-06.webp"
          ],
          "inherited": true,
          "illuFrom": "rad"
        },
        {
          "id": "dub-sonoma",
          "name": "Dub Sonoma",
          "swatch": [
            "/img/products/swatch-dub-sonoma.webp"
          ],
          "images": [
            "/img/products/standard-80x40x90-dub-sonoma-03.webp",
            "/img/products/standard-80x40x90-dub-sonoma-02.webp",
            "/img/products/standard-80x40x90-dub-sonoma-01.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer",
          "illuSize": "80 × 40 cm"
        },
        {
          "id": "choco-vintage-oak",
          "name": "Choco Vintage Oak",
          "swatch": [
            "/img/products/swatch-choco-vintage-oak.webp"
          ],
          "images": [
            "/img/products/choco-vintage-oak-03.webp",
            "/img/products/choco-vintage-oak-12.webp",
            "/img/products/choco-vintage-oak-02.webp",
            "/img/products/choco-vintage-oak-15.webp",
            "/img/products/choco-vintage-oak-14.webp",
            "/img/products/choco-vintage-oak-07.webp",
            "/img/products/choco-vintage-oak-06.webp",
            "/img/products/choco-vintage-oak-13.webp",
            "/img/products/choco-vintage-oak-09.webp",
            "/img/products/choco-vintage-oak-04.webp",
            "/img/products/choco-vintage-oak-08.webp",
            "/img/products/choco-vintage-oak-16.webp",
            "/img/products/choco-vintage-oak-05.webp",
            "/img/products/choco-vintage-oak-10.webp",
            "/img/products/choco-vintage-oak-01.webp",
            "/img/products/choco-vintage-oak-11.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer"
        },
        {
          "id": "dub-spanielsky",
          "name": "Dub španielsky",
          "swatch": [
            "/img/products/swatch-dub-spanielsky.webp"
          ],
          "images": [
            "/img/products/dub-spanielsky-10.webp",
            "/img/products/dub-spanielsky-04.webp",
            "/img/products/dub-spanielsky-05.webp",
            "/img/products/dub-spanielsky-02.webp",
            "/img/products/dub-spanielsky-06.webp",
            "/img/products/dub-spanielsky-03.webp",
            "/img/products/dub-spanielsky-08.webp",
            "/img/products/dub-spanielsky-09.webp",
            "/img/products/dub-spanielsky-11.webp",
            "/img/products/dub-spanielsky-01.webp",
            "/img/products/dub-spanielsky-07.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer"
        },
        {
          "id": "dub-spanielsky-black-matt",
          "name": "Dub španielsky / Čierna matná",
          "swatch": [
            "/img/products/swatch-dub-spanielsky.webp",
            "#121316"
          ],
          "images": [
            "/img/products/dub-spanielsky-black-matt-01.webp",
            "/img/products/dub-spanielsky-black-matt-11.webp",
            "/img/products/dub-spanielsky-black-matt-09.webp",
            "/img/products/dub-spanielsky-black-matt-05.webp",
            "/img/products/dub-spanielsky-black-matt-08.webp",
            "/img/products/dub-spanielsky-black-matt-06.webp",
            "/img/products/dub-spanielsky-black-matt-07.webp",
            "/img/products/dub-spanielsky-black-matt-04.webp",
            "/img/products/dub-spanielsky-black-matt-12.webp",
            "/img/products/dub-spanielsky-black-matt-13.webp",
            "/img/products/dub-spanielsky-black-matt-02.webp",
            "/img/products/dub-spanielsky-black-matt-03.webp",
            "/img/products/dub-spanielsky-black-matt-10.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer"
        }
      ],
      "cover": "/img/products/standard-100x40x90-cool-white-02.webp",
      "priceLed": "390 €"
    },
    {
      "slug": "standard-150x50x80",
      "name": "ŠTANDARD 150 × 50 × 80",
      "tier": "standard",
      "tierLabel": "ŠTANDARD",
      "tierNote": "Bočnice a dvierka",
      "dim": "150 × 50 × 80 cm",
      "w": 150,
      "d": 50,
      "h": 80,
      "aquarium": "150 × 50 cm (pôdorys)",
      "vol": "~375 l",
      "price": "340 €",
      "desc": "Rozmerná skrinka pre nádrže okolo 375 litrov. Oceľový rám drží presnú rovinu, dvierka sprístupnia celý úložný priestor.",
      "features": [
        "Bočnice a dvierka z LDTD 18 mm v dekore podľa výberu",
        "Oceľový rám 30 × 30 × 2 mm — váhu nesie kov, nie plášť",
        "Precízne lícovanie dvierok",
        "Matný povrch odolný voči vlhkosti",
        "Odolné kolieska pre jednoduchú manipuláciu",
        "Zákazková výroba s ručnou kontrolou"
      ],
      "decors": [
        {
          "id": "black-matt",
          "name": "Black Matt",
          "swatch": [
            "#17181a"
          ],
          "images": [
            "/img/products/standard-150x50x80-black-matt-02.webp",
            "/img/products/standard-150x50x80-black-matt-01.webp"
          ]
        },
        {
          "id": "black-matt-orech",
          "name": "Black Matt / Orech",
          "swatch": [
            "#17181a",
            "/img/products/swatch-orech.webp"
          ],
          "images": [
            "/img/products/standard-80x40x90-black-matt-orech-01.webp",
            "/img/products/standard-100x40x90-black-matt-orech-01.webp"
          ],
          "inherited": true,
          "illuFrom": "rad"
        },
        {
          "id": "antracit",
          "name": "Antracit",
          "swatch": [
            "#40454a"
          ],
          "images": [
            "/img/products/standard-200x60x60-antracit-02.webp",
            "/img/products/standard-200x60x60-antracit-05.webp",
            "/img/products/standard-200x60x60-antracit-03.webp",
            "/img/products/standard-200x60x60-antracit-04.webp",
            "/img/products/standard-200x60x60-antracit-01.webp",
            "/img/products/standard-200x60x60-antracit-06.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer",
          "illuSize": "200 × 60 cm"
        },
        {
          "id": "cool-white",
          "name": "Cool White",
          "swatch": [
            "#eef0f0"
          ],
          "images": [
            "/img/products/standard-100x40x90-cool-white-02.webp",
            "/img/products/standard-100x40x90-cool-white-01.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer",
          "illuSize": "100 × 40 cm"
        },
        {
          "id": "dub-sonoma",
          "name": "Dub Sonoma",
          "swatch": [
            "/img/products/swatch-dub-sonoma.webp"
          ],
          "images": [
            "/img/products/standard-200x60x60-dub-sonoma-04.webp",
            "/img/products/standard-200x60x60-dub-sonoma-03.webp",
            "/img/products/standard-200x60x60-dub-sonoma-05.webp",
            "/img/products/standard-200x60x60-dub-sonoma-02.webp",
            "/img/products/standard-200x60x60-dub-sonoma-01.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer",
          "illuSize": "200 × 60 cm"
        },
        {
          "id": "choco-vintage-oak",
          "name": "Choco Vintage Oak",
          "swatch": [
            "/img/products/swatch-choco-vintage-oak.webp"
          ],
          "images": [
            "/img/products/choco-vintage-oak-03.webp",
            "/img/products/choco-vintage-oak-12.webp",
            "/img/products/choco-vintage-oak-02.webp",
            "/img/products/choco-vintage-oak-15.webp",
            "/img/products/choco-vintage-oak-14.webp",
            "/img/products/choco-vintage-oak-07.webp",
            "/img/products/choco-vintage-oak-06.webp",
            "/img/products/choco-vintage-oak-13.webp",
            "/img/products/choco-vintage-oak-09.webp",
            "/img/products/choco-vintage-oak-04.webp",
            "/img/products/choco-vintage-oak-08.webp",
            "/img/products/choco-vintage-oak-16.webp",
            "/img/products/choco-vintage-oak-05.webp",
            "/img/products/choco-vintage-oak-10.webp",
            "/img/products/choco-vintage-oak-01.webp",
            "/img/products/choco-vintage-oak-11.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer"
        },
        {
          "id": "dub-spanielsky",
          "name": "Dub španielsky",
          "swatch": [
            "/img/products/swatch-dub-spanielsky.webp"
          ],
          "images": [
            "/img/products/dub-spanielsky-10.webp",
            "/img/products/dub-spanielsky-04.webp",
            "/img/products/dub-spanielsky-05.webp",
            "/img/products/dub-spanielsky-02.webp",
            "/img/products/dub-spanielsky-06.webp",
            "/img/products/dub-spanielsky-03.webp",
            "/img/products/dub-spanielsky-08.webp",
            "/img/products/dub-spanielsky-09.webp",
            "/img/products/dub-spanielsky-11.webp",
            "/img/products/dub-spanielsky-01.webp",
            "/img/products/dub-spanielsky-07.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer"
        },
        {
          "id": "dub-spanielsky-black-matt",
          "name": "Dub španielsky / Čierna matná",
          "swatch": [
            "/img/products/swatch-dub-spanielsky.webp",
            "#121316"
          ],
          "images": [
            "/img/products/dub-spanielsky-black-matt-01.webp",
            "/img/products/dub-spanielsky-black-matt-11.webp",
            "/img/products/dub-spanielsky-black-matt-09.webp",
            "/img/products/dub-spanielsky-black-matt-05.webp",
            "/img/products/dub-spanielsky-black-matt-08.webp",
            "/img/products/dub-spanielsky-black-matt-06.webp",
            "/img/products/dub-spanielsky-black-matt-07.webp",
            "/img/products/dub-spanielsky-black-matt-04.webp",
            "/img/products/dub-spanielsky-black-matt-12.webp",
            "/img/products/dub-spanielsky-black-matt-13.webp",
            "/img/products/dub-spanielsky-black-matt-02.webp",
            "/img/products/dub-spanielsky-black-matt-03.webp",
            "/img/products/dub-spanielsky-black-matt-10.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer"
        }
      ],
      "cover": "/img/products/standard-150x50x80-black-matt-02.webp",
      "priceLed": "400 €"
    },
    {
      "slug": "standard-160x60x80",
      "name": "ŠTANDARD 160 × 60 × 80",
      "tier": "standard",
      "tierLabel": "ŠTANDARD",
      "tierNote": "Bočnice a dvierka",
      "dim": "160 × 60 × 80 cm",
      "w": 160,
      "d": 60,
      "h": 80,
      "aquarium": "160 × 60 cm (pôdorys)",
      "vol": "~480 l",
      "price": "350 €",
      "desc": "Dlhý, nízky formát pre úzke nádrže. Pôsobí ľahko, no rám z ocele 30 × 30 mm unesie aj plne osadené akvárium.",
      "features": [
        "Bočnice a dvierka z LDTD 18 mm v dekore podľa výberu",
        "Oceľový rám 30 × 30 × 2 mm — váhu nesie kov, nie plášť",
        "Precízne lícovanie dvierok",
        "Matný povrch odolný voči vlhkosti",
        "Odolné kolieska pre jednoduchú manipuláciu",
        "Zákazková výroba s ručnou kontrolou"
      ],
      "decors": [
        {
          "id": "dub-sonoma",
          "name": "Dub Sonoma",
          "swatch": [
            "/img/products/swatch-dub-sonoma.webp"
          ],
          "images": [
            "/img/products/standard-200x60x60-dub-sonoma-04.webp",
            "/img/products/standard-200x60x60-dub-sonoma-03.webp",
            "/img/products/standard-200x60x60-dub-sonoma-05.webp",
            "/img/products/standard-200x60x60-dub-sonoma-02.webp",
            "/img/products/standard-200x60x60-dub-sonoma-01.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer",
          "illuSize": "200 × 60 cm"
        },
        {
          "id": "black-matt",
          "name": "Black Matt",
          "swatch": [
            "#17181a"
          ],
          "images": [
            "/img/products/standard-150x50x80-black-matt-02.webp",
            "/img/products/standard-150x50x80-black-matt-01.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer",
          "illuSize": "150 × 50 cm"
        },
        {
          "id": "black-matt-orech",
          "name": "Black Matt / Orech",
          "swatch": [
            "#17181a",
            "/img/products/swatch-orech.webp"
          ],
          "images": [
            "/img/products/standard-200x60x60-black-matt-orech-02.webp",
            "/img/products/standard-200x60x60-black-matt-orech-01.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer",
          "illuSize": "200 × 60 cm"
        },
        {
          "id": "antracit",
          "name": "Antracit",
          "swatch": [
            "#40454a"
          ],
          "images": [
            "/img/products/standard-200x60x60-antracit-02.webp",
            "/img/products/standard-200x60x60-antracit-05.webp",
            "/img/products/standard-200x60x60-antracit-03.webp",
            "/img/products/standard-200x60x60-antracit-04.webp",
            "/img/products/standard-200x60x60-antracit-01.webp",
            "/img/products/standard-200x60x60-antracit-06.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer",
          "illuSize": "200 × 60 cm"
        },
        {
          "id": "cool-white",
          "name": "Cool White",
          "swatch": [
            "#eef0f0"
          ],
          "images": [
            "/img/products/premium-100x40x90-cool-white-08.webp",
            "/img/products/standard-200x60x60-cool-white-01.webp"
          ],
          "inherited": true,
          "illuFrom": "rad"
        },
        {
          "id": "choco-vintage-oak",
          "name": "Choco Vintage Oak",
          "swatch": [
            "/img/products/swatch-choco-vintage-oak.webp"
          ],
          "images": [
            "/img/products/choco-vintage-oak-03.webp",
            "/img/products/choco-vintage-oak-12.webp",
            "/img/products/choco-vintage-oak-02.webp",
            "/img/products/choco-vintage-oak-15.webp",
            "/img/products/choco-vintage-oak-14.webp",
            "/img/products/choco-vintage-oak-07.webp",
            "/img/products/choco-vintage-oak-06.webp",
            "/img/products/choco-vintage-oak-13.webp",
            "/img/products/choco-vintage-oak-09.webp",
            "/img/products/choco-vintage-oak-04.webp",
            "/img/products/choco-vintage-oak-08.webp",
            "/img/products/choco-vintage-oak-16.webp",
            "/img/products/choco-vintage-oak-05.webp",
            "/img/products/choco-vintage-oak-10.webp",
            "/img/products/choco-vintage-oak-01.webp",
            "/img/products/choco-vintage-oak-11.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer"
        },
        {
          "id": "dub-spanielsky",
          "name": "Dub španielsky",
          "swatch": [
            "/img/products/swatch-dub-spanielsky.webp"
          ],
          "images": [
            "/img/products/dub-spanielsky-10.webp",
            "/img/products/dub-spanielsky-04.webp",
            "/img/products/dub-spanielsky-05.webp",
            "/img/products/dub-spanielsky-02.webp",
            "/img/products/dub-spanielsky-06.webp",
            "/img/products/dub-spanielsky-03.webp",
            "/img/products/dub-spanielsky-08.webp",
            "/img/products/dub-spanielsky-09.webp",
            "/img/products/dub-spanielsky-11.webp",
            "/img/products/dub-spanielsky-01.webp",
            "/img/products/dub-spanielsky-07.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer"
        },
        {
          "id": "dub-spanielsky-black-matt",
          "name": "Dub španielsky / Čierna matná",
          "swatch": [
            "/img/products/swatch-dub-spanielsky.webp",
            "#121316"
          ],
          "images": [
            "/img/products/dub-spanielsky-black-matt-01.webp",
            "/img/products/dub-spanielsky-black-matt-11.webp",
            "/img/products/dub-spanielsky-black-matt-09.webp",
            "/img/products/dub-spanielsky-black-matt-05.webp",
            "/img/products/dub-spanielsky-black-matt-08.webp",
            "/img/products/dub-spanielsky-black-matt-06.webp",
            "/img/products/dub-spanielsky-black-matt-07.webp",
            "/img/products/dub-spanielsky-black-matt-04.webp",
            "/img/products/dub-spanielsky-black-matt-12.webp",
            "/img/products/dub-spanielsky-black-matt-13.webp",
            "/img/products/dub-spanielsky-black-matt-02.webp",
            "/img/products/dub-spanielsky-black-matt-03.webp",
            "/img/products/dub-spanielsky-black-matt-10.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer"
        }
      ],
      "cover": "/img/products/standard-200x60x60-dub-sonoma-04.webp",
      "priceLed": "410 €"
    },
    {
      "slug": "standard-200x50x70",
      "name": "ŠTANDARD 200 × 50 × 70",
      "tier": "standard",
      "tierLabel": "ŠTANDARD",
      "tierNote": "Bočnice a dvierka",
      "dim": "200 × 50 × 70 cm",
      "w": 200,
      "d": 50,
      "h": 70,
      "aquarium": "200 × 50 cm (pôdorys)",
      "vol": "~500 l",
      "price": "420 €",
      "desc": "Dvojmetrový formát pre veľkoobjemové nádrže okolo 600 litrov. Nízka výška stabilizuje ťažisko a uľahčuje prístup zhora.",
      "features": [
        "Bočnice a dvierka z LDTD 18 mm v dekore podľa výberu",
        "Oceľový rám 30 × 30 × 2 mm — váhu nesie kov, nie plášť",
        "Precízne lícovanie dvierok",
        "Matný povrch odolný voči vlhkosti",
        "Odolné kolieska pre jednoduchú manipuláciu",
        "Zákazková výroba s ručnou kontrolou"
      ],
      "decors": [
        {
          "id": "antracit",
          "name": "Antracit",
          "swatch": [
            "#40454a"
          ],
          "images": [
            "/img/products/standard-200x60x60-antracit-02.webp",
            "/img/products/standard-200x60x60-antracit-05.webp",
            "/img/products/standard-200x60x60-antracit-03.webp",
            "/img/products/standard-200x60x60-antracit-04.webp",
            "/img/products/standard-200x60x60-antracit-01.webp",
            "/img/products/standard-200x60x60-antracit-06.webp"
          ]
        },
        {
          "id": "black-matt",
          "name": "Black Matt",
          "swatch": [
            "#17181a"
          ],
          "images": [
            "/img/products/standard-200x60x60-black-matt-02.webp",
            "/img/products/standard-200x60x60-black-matt-04.webp",
            "/img/products/standard-200x60x60-black-matt-01.webp",
            "/img/products/standard-200x60x60-black-matt-03.webp"
          ]
        },
        {
          "id": "black-matt-orech",
          "name": "Black Matt / Orech",
          "swatch": [
            "#17181a",
            "/img/products/swatch-orech.webp"
          ],
          "images": [
            "/img/products/standard-200x60x60-black-matt-orech-02.webp",
            "/img/products/standard-200x60x60-black-matt-orech-01.webp"
          ]
        },
        {
          "id": "cool-white",
          "name": "Cool White",
          "swatch": [
            "#eef0f0"
          ],
          "images": [
            "/img/products/premium-100x40x90-cool-white-08.webp",
            "/img/products/standard-200x60x60-cool-white-01.webp"
          ],
          "inherited": true,
          "illuFrom": "rad"
        },
        {
          "id": "dub-sonoma",
          "name": "Dub Sonoma",
          "swatch": [
            "/img/products/swatch-dub-sonoma.webp"
          ],
          "images": [
            "/img/products/standard-200x60x60-dub-sonoma-04.webp",
            "/img/products/standard-200x60x60-dub-sonoma-03.webp",
            "/img/products/standard-200x60x60-dub-sonoma-05.webp",
            "/img/products/standard-200x60x60-dub-sonoma-02.webp",
            "/img/products/standard-200x60x60-dub-sonoma-01.webp"
          ]
        },
        {
          "id": "choco-vintage-oak",
          "name": "Choco Vintage Oak",
          "swatch": [
            "/img/products/swatch-choco-vintage-oak.webp"
          ],
          "images": [
            "/img/products/choco-vintage-oak-03.webp",
            "/img/products/choco-vintage-oak-12.webp",
            "/img/products/choco-vintage-oak-02.webp",
            "/img/products/choco-vintage-oak-15.webp",
            "/img/products/choco-vintage-oak-14.webp",
            "/img/products/choco-vintage-oak-07.webp",
            "/img/products/choco-vintage-oak-06.webp",
            "/img/products/choco-vintage-oak-13.webp",
            "/img/products/choco-vintage-oak-09.webp",
            "/img/products/choco-vintage-oak-04.webp",
            "/img/products/choco-vintage-oak-08.webp",
            "/img/products/choco-vintage-oak-16.webp",
            "/img/products/choco-vintage-oak-05.webp",
            "/img/products/choco-vintage-oak-10.webp",
            "/img/products/choco-vintage-oak-01.webp",
            "/img/products/choco-vintage-oak-11.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer"
        },
        {
          "id": "dub-spanielsky",
          "name": "Dub španielsky",
          "swatch": [
            "/img/products/swatch-dub-spanielsky.webp"
          ],
          "images": [
            "/img/products/dub-spanielsky-10.webp",
            "/img/products/dub-spanielsky-04.webp",
            "/img/products/dub-spanielsky-05.webp",
            "/img/products/dub-spanielsky-02.webp",
            "/img/products/dub-spanielsky-06.webp",
            "/img/products/dub-spanielsky-03.webp",
            "/img/products/dub-spanielsky-08.webp",
            "/img/products/dub-spanielsky-09.webp",
            "/img/products/dub-spanielsky-11.webp",
            "/img/products/dub-spanielsky-01.webp",
            "/img/products/dub-spanielsky-07.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer"
        },
        {
          "id": "dub-spanielsky-black-matt",
          "name": "Dub španielsky / Čierna matná",
          "swatch": [
            "/img/products/swatch-dub-spanielsky.webp",
            "#121316"
          ],
          "images": [
            "/img/products/dub-spanielsky-black-matt-01.webp",
            "/img/products/dub-spanielsky-black-matt-11.webp",
            "/img/products/dub-spanielsky-black-matt-09.webp",
            "/img/products/dub-spanielsky-black-matt-05.webp",
            "/img/products/dub-spanielsky-black-matt-08.webp",
            "/img/products/dub-spanielsky-black-matt-06.webp",
            "/img/products/dub-spanielsky-black-matt-07.webp",
            "/img/products/dub-spanielsky-black-matt-04.webp",
            "/img/products/dub-spanielsky-black-matt-12.webp",
            "/img/products/dub-spanielsky-black-matt-13.webp",
            "/img/products/dub-spanielsky-black-matt-02.webp",
            "/img/products/dub-spanielsky-black-matt-03.webp",
            "/img/products/dub-spanielsky-black-matt-10.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer"
        }
      ],
      "cover": "/img/products/standard-200x60x60-antracit-02.webp",
      "priceLed": "480 €"
    },
    {
      "slug": "basic-100x40x80",
      "name": "BASIC 100 × 40 × 80",
      "tier": "basic",
      "tierLabel": "BASIC",
      "tierNote": "Kovový rám + vrchná doska",
      "dim": "100 × 40 × 80 cm",
      "w": 100,
      "d": 40,
      "h": 80,
      "aquarium": "100 × 40 cm (pôdorys)",
      "vol": "~200 l",
      "price": "235 €",
      "desc": "Metrový rám s vrchnou doskou v dekore. Čistý industriálny základ, ktorý nechá vyniknúť akvárium.",
      "features": [
        "Priznaný oceľový rám 30 × 30 × 2 mm v čiernom matnom laku",
        "Vrchná doska LDTD 18 mm v dekore podľa výberu",
        "Otvorená konštrukcia — plný prístup k technike",
        "Odolné kolieska pre jednoduchú manipuláciu",
        "Zákazková výroba s ručnou kontrolou"
      ],
      "decors": [
        {
          "id": "ram",
          "name": "Čierny rám + doska v dekore",
          "swatch": [
            "#17181a"
          ],
          "images": [
            "/img/products/basic-100x40x90-01.webp",
            "/img/products/basic-100x40x90-02.webp",
            "/img/products/basic-100x40x90-05.webp",
            "/img/products/basic-100x40x90-04.webp",
            "/img/products/basic-100x40x90-06.webp",
            "/img/products/basic-100x40x90-03.webp",
            "/img/products/basic-100x40x90-07.webp"
          ]
        },
        {
          "id": "choco-vintage-oak",
          "name": "Choco Vintage Oak",
          "swatch": [
            "/img/products/swatch-choco-vintage-oak.webp"
          ],
          "images": [
            "/img/products/choco-vintage-oak-03.webp",
            "/img/products/choco-vintage-oak-12.webp",
            "/img/products/choco-vintage-oak-02.webp",
            "/img/products/choco-vintage-oak-15.webp",
            "/img/products/choco-vintage-oak-14.webp",
            "/img/products/choco-vintage-oak-07.webp",
            "/img/products/choco-vintage-oak-06.webp",
            "/img/products/choco-vintage-oak-13.webp",
            "/img/products/choco-vintage-oak-09.webp",
            "/img/products/choco-vintage-oak-04.webp",
            "/img/products/choco-vintage-oak-08.webp",
            "/img/products/choco-vintage-oak-16.webp",
            "/img/products/choco-vintage-oak-05.webp",
            "/img/products/choco-vintage-oak-10.webp",
            "/img/products/choco-vintage-oak-01.webp",
            "/img/products/choco-vintage-oak-11.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer"
        },
        {
          "id": "dub-spanielsky",
          "name": "Dub španielsky",
          "swatch": [
            "/img/products/swatch-dub-spanielsky.webp"
          ],
          "images": [
            "/img/products/dub-spanielsky-10.webp",
            "/img/products/dub-spanielsky-04.webp",
            "/img/products/dub-spanielsky-05.webp",
            "/img/products/dub-spanielsky-02.webp",
            "/img/products/dub-spanielsky-06.webp",
            "/img/products/dub-spanielsky-03.webp",
            "/img/products/dub-spanielsky-08.webp",
            "/img/products/dub-spanielsky-09.webp",
            "/img/products/dub-spanielsky-11.webp",
            "/img/products/dub-spanielsky-01.webp",
            "/img/products/dub-spanielsky-07.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer"
        },
        {
          "id": "dub-spanielsky-black-matt",
          "name": "Dub španielsky / Čierna matná",
          "swatch": [
            "/img/products/swatch-dub-spanielsky.webp",
            "#121316"
          ],
          "images": [
            "/img/products/dub-spanielsky-black-matt-01.webp",
            "/img/products/dub-spanielsky-black-matt-11.webp",
            "/img/products/dub-spanielsky-black-matt-09.webp",
            "/img/products/dub-spanielsky-black-matt-05.webp",
            "/img/products/dub-spanielsky-black-matt-08.webp",
            "/img/products/dub-spanielsky-black-matt-06.webp",
            "/img/products/dub-spanielsky-black-matt-07.webp",
            "/img/products/dub-spanielsky-black-matt-04.webp",
            "/img/products/dub-spanielsky-black-matt-12.webp",
            "/img/products/dub-spanielsky-black-matt-13.webp",
            "/img/products/dub-spanielsky-black-matt-02.webp",
            "/img/products/dub-spanielsky-black-matt-03.webp",
            "/img/products/dub-spanielsky-black-matt-10.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer"
        }
      ],
      "cover": "/img/products/basic-100x40x90-01.webp"
    },
    {
      "slug": "basic-120x40x80",
      "name": "BASIC 120 × 40 × 80",
      "tier": "basic",
      "tierLabel": "BASIC",
      "tierNote": "Kovový rám + vrchná doska",
      "dim": "120 × 40 × 80 cm",
      "w": 120,
      "d": 40,
      "h": 80,
      "aquarium": "120 × 40 cm (pôdorys)",
      "vol": "~240 l",
      "price": "260 €",
      "desc": "Vysoký rám pre 120 cm nádrže — pohodlné sledovanie postojačky a veľkorysý priestor pod akváriom.",
      "features": [
        "Priznaný oceľový rám 30 × 30 × 2 mm v čiernom matnom laku",
        "Vrchná doska LDTD 18 mm v dekore podľa výberu",
        "Otvorená konštrukcia — plný prístup k technike",
        "Odolné kolieska pre jednoduchú manipuláciu",
        "Zákazková výroba s ručnou kontrolou"
      ],
      "decors": [
        {
          "id": "ram",
          "name": "Čierny rám + doska v dekore",
          "swatch": [
            "#17181a"
          ],
          "images": [
            "/img/products/basic-100x40x90-01.webp",
            "/img/products/basic-100x40x90-02.webp",
            "/img/products/basic-100x40x90-05.webp",
            "/img/products/basic-100x40x90-04.webp",
            "/img/products/basic-100x40x90-06.webp",
            "/img/products/basic-100x40x90-03.webp",
            "/img/products/basic-100x40x90-07.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer",
          "illuSize": "100 × 40 cm"
        },
        {
          "id": "choco-vintage-oak",
          "name": "Choco Vintage Oak",
          "swatch": [
            "/img/products/swatch-choco-vintage-oak.webp"
          ],
          "images": [
            "/img/products/choco-vintage-oak-03.webp",
            "/img/products/choco-vintage-oak-12.webp",
            "/img/products/choco-vintage-oak-02.webp",
            "/img/products/choco-vintage-oak-15.webp",
            "/img/products/choco-vintage-oak-14.webp",
            "/img/products/choco-vintage-oak-07.webp",
            "/img/products/choco-vintage-oak-06.webp",
            "/img/products/choco-vintage-oak-13.webp",
            "/img/products/choco-vintage-oak-09.webp",
            "/img/products/choco-vintage-oak-04.webp",
            "/img/products/choco-vintage-oak-08.webp",
            "/img/products/choco-vintage-oak-16.webp",
            "/img/products/choco-vintage-oak-05.webp",
            "/img/products/choco-vintage-oak-10.webp",
            "/img/products/choco-vintage-oak-01.webp",
            "/img/products/choco-vintage-oak-11.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer"
        },
        {
          "id": "dub-spanielsky",
          "name": "Dub španielsky",
          "swatch": [
            "/img/products/swatch-dub-spanielsky.webp"
          ],
          "images": [
            "/img/products/dub-spanielsky-10.webp",
            "/img/products/dub-spanielsky-04.webp",
            "/img/products/dub-spanielsky-05.webp",
            "/img/products/dub-spanielsky-02.webp",
            "/img/products/dub-spanielsky-06.webp",
            "/img/products/dub-spanielsky-03.webp",
            "/img/products/dub-spanielsky-08.webp",
            "/img/products/dub-spanielsky-09.webp",
            "/img/products/dub-spanielsky-11.webp",
            "/img/products/dub-spanielsky-01.webp",
            "/img/products/dub-spanielsky-07.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer"
        },
        {
          "id": "dub-spanielsky-black-matt",
          "name": "Dub španielsky / Čierna matná",
          "swatch": [
            "/img/products/swatch-dub-spanielsky.webp",
            "#121316"
          ],
          "images": [
            "/img/products/dub-spanielsky-black-matt-01.webp",
            "/img/products/dub-spanielsky-black-matt-11.webp",
            "/img/products/dub-spanielsky-black-matt-09.webp",
            "/img/products/dub-spanielsky-black-matt-05.webp",
            "/img/products/dub-spanielsky-black-matt-08.webp",
            "/img/products/dub-spanielsky-black-matt-06.webp",
            "/img/products/dub-spanielsky-black-matt-07.webp",
            "/img/products/dub-spanielsky-black-matt-04.webp",
            "/img/products/dub-spanielsky-black-matt-12.webp",
            "/img/products/dub-spanielsky-black-matt-13.webp",
            "/img/products/dub-spanielsky-black-matt-02.webp",
            "/img/products/dub-spanielsky-black-matt-03.webp",
            "/img/products/dub-spanielsky-black-matt-10.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer"
        }
      ],
      "cover": "/img/products/basic-100x40x90-01.webp"
    },
    {
      "slug": "basic-150x50x80",
      "name": "BASIC 150 × 50 × 80",
      "tier": "basic",
      "tierLabel": "BASIC",
      "tierNote": "Kovový rám + vrchná doska",
      "dim": "150 × 50 × 80 cm",
      "w": 150,
      "d": 50,
      "h": 80,
      "aquarium": "150 × 50 cm (pôdorys)",
      "vol": "~375 l",
      "price": "270 €",
      "desc": "Poldruhametrový rám pre ťažké nádrže. Otvorená konštrukcia rozloží váhu a sprístupní techniku zo všetkých strán.",
      "features": [
        "Priznaný oceľový rám 30 × 30 × 2 mm v čiernom matnom laku",
        "Vrchná doska LDTD 18 mm v dekore podľa výberu",
        "Otvorená konštrukcia — plný prístup k technike",
        "Odolné kolieska pre jednoduchú manipuláciu",
        "Zákazková výroba s ručnou kontrolou"
      ],
      "decors": [
        {
          "id": "ram",
          "name": "Čierny rám + doska v dekore",
          "swatch": [
            "#17181a"
          ],
          "images": [
            "/img/products/basic-150x50x80-02.webp",
            "/img/products/basic-150x50x80-01.webp",
            "/img/products/basic-150x50x80-06.webp",
            "/img/products/basic-150x50x80-03.webp",
            "/img/products/basic-150x50x80-04.webp",
            "/img/products/basic-150x50x80-05.webp"
          ]
        },
        {
          "id": "choco-vintage-oak",
          "name": "Choco Vintage Oak",
          "swatch": [
            "/img/products/swatch-choco-vintage-oak.webp"
          ],
          "images": [
            "/img/products/choco-vintage-oak-03.webp",
            "/img/products/choco-vintage-oak-12.webp",
            "/img/products/choco-vintage-oak-02.webp",
            "/img/products/choco-vintage-oak-15.webp",
            "/img/products/choco-vintage-oak-14.webp",
            "/img/products/choco-vintage-oak-07.webp",
            "/img/products/choco-vintage-oak-06.webp",
            "/img/products/choco-vintage-oak-13.webp",
            "/img/products/choco-vintage-oak-09.webp",
            "/img/products/choco-vintage-oak-04.webp",
            "/img/products/choco-vintage-oak-08.webp",
            "/img/products/choco-vintage-oak-16.webp",
            "/img/products/choco-vintage-oak-05.webp",
            "/img/products/choco-vintage-oak-10.webp",
            "/img/products/choco-vintage-oak-01.webp",
            "/img/products/choco-vintage-oak-11.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer"
        },
        {
          "id": "dub-spanielsky",
          "name": "Dub španielsky",
          "swatch": [
            "/img/products/swatch-dub-spanielsky.webp"
          ],
          "images": [
            "/img/products/dub-spanielsky-10.webp",
            "/img/products/dub-spanielsky-04.webp",
            "/img/products/dub-spanielsky-05.webp",
            "/img/products/dub-spanielsky-02.webp",
            "/img/products/dub-spanielsky-06.webp",
            "/img/products/dub-spanielsky-03.webp",
            "/img/products/dub-spanielsky-08.webp",
            "/img/products/dub-spanielsky-09.webp",
            "/img/products/dub-spanielsky-11.webp",
            "/img/products/dub-spanielsky-01.webp",
            "/img/products/dub-spanielsky-07.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer"
        },
        {
          "id": "dub-spanielsky-black-matt",
          "name": "Dub španielsky / Čierna matná",
          "swatch": [
            "/img/products/swatch-dub-spanielsky.webp",
            "#121316"
          ],
          "images": [
            "/img/products/dub-spanielsky-black-matt-01.webp",
            "/img/products/dub-spanielsky-black-matt-11.webp",
            "/img/products/dub-spanielsky-black-matt-09.webp",
            "/img/products/dub-spanielsky-black-matt-05.webp",
            "/img/products/dub-spanielsky-black-matt-08.webp",
            "/img/products/dub-spanielsky-black-matt-06.webp",
            "/img/products/dub-spanielsky-black-matt-07.webp",
            "/img/products/dub-spanielsky-black-matt-04.webp",
            "/img/products/dub-spanielsky-black-matt-12.webp",
            "/img/products/dub-spanielsky-black-matt-13.webp",
            "/img/products/dub-spanielsky-black-matt-02.webp",
            "/img/products/dub-spanielsky-black-matt-03.webp",
            "/img/products/dub-spanielsky-black-matt-10.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer"
        }
      ],
      "cover": "/img/products/basic-150x50x80-02.webp"
    },
    {
      "slug": "basic-160x60x80",
      "name": "BASIC 160 × 60 × 80",
      "tier": "basic",
      "tierLabel": "BASIC",
      "tierNote": "Kovový rám + vrchná doska",
      "dim": "160 × 60 × 80 cm",
      "w": 160,
      "d": 60,
      "h": 80,
      "aquarium": "160 × 60 cm (pôdorys)",
      "vol": "~480 l",
      "price": "280 €",
      "desc": "Dlhý úzky rám pre 160 cm nádrže. Minimalistický základ, maximálna stabilita.",
      "features": [
        "Priznaný oceľový rám 30 × 30 × 2 mm v čiernom matnom laku",
        "Vrchná doska LDTD 18 mm v dekore podľa výberu",
        "Otvorená konštrukcia — plný prístup k technike",
        "Odolné kolieska pre jednoduchú manipuláciu",
        "Zákazková výroba s ručnou kontrolou"
      ],
      "decors": [
        {
          "id": "ram",
          "name": "Čierny rám + doska v dekore",
          "swatch": [
            "#17181a"
          ],
          "images": [
            "/img/products/basic-150x50x80-02.webp",
            "/img/products/basic-150x50x80-01.webp",
            "/img/products/basic-150x50x80-06.webp",
            "/img/products/basic-150x50x80-03.webp",
            "/img/products/basic-150x50x80-04.webp",
            "/img/products/basic-150x50x80-05.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer",
          "illuSize": "150 × 50 cm"
        },
        {
          "id": "choco-vintage-oak",
          "name": "Choco Vintage Oak",
          "swatch": [
            "/img/products/swatch-choco-vintage-oak.webp"
          ],
          "images": [
            "/img/products/choco-vintage-oak-03.webp",
            "/img/products/choco-vintage-oak-12.webp",
            "/img/products/choco-vintage-oak-02.webp",
            "/img/products/choco-vintage-oak-15.webp",
            "/img/products/choco-vintage-oak-14.webp",
            "/img/products/choco-vintage-oak-07.webp",
            "/img/products/choco-vintage-oak-06.webp",
            "/img/products/choco-vintage-oak-13.webp",
            "/img/products/choco-vintage-oak-09.webp",
            "/img/products/choco-vintage-oak-04.webp",
            "/img/products/choco-vintage-oak-08.webp",
            "/img/products/choco-vintage-oak-16.webp",
            "/img/products/choco-vintage-oak-05.webp",
            "/img/products/choco-vintage-oak-10.webp",
            "/img/products/choco-vintage-oak-01.webp",
            "/img/products/choco-vintage-oak-11.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer"
        },
        {
          "id": "dub-spanielsky",
          "name": "Dub španielsky",
          "swatch": [
            "/img/products/swatch-dub-spanielsky.webp"
          ],
          "images": [
            "/img/products/dub-spanielsky-10.webp",
            "/img/products/dub-spanielsky-04.webp",
            "/img/products/dub-spanielsky-05.webp",
            "/img/products/dub-spanielsky-02.webp",
            "/img/products/dub-spanielsky-06.webp",
            "/img/products/dub-spanielsky-03.webp",
            "/img/products/dub-spanielsky-08.webp",
            "/img/products/dub-spanielsky-09.webp",
            "/img/products/dub-spanielsky-11.webp",
            "/img/products/dub-spanielsky-01.webp",
            "/img/products/dub-spanielsky-07.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer"
        },
        {
          "id": "dub-spanielsky-black-matt",
          "name": "Dub španielsky / Čierna matná",
          "swatch": [
            "/img/products/swatch-dub-spanielsky.webp",
            "#121316"
          ],
          "images": [
            "/img/products/dub-spanielsky-black-matt-01.webp",
            "/img/products/dub-spanielsky-black-matt-11.webp",
            "/img/products/dub-spanielsky-black-matt-09.webp",
            "/img/products/dub-spanielsky-black-matt-05.webp",
            "/img/products/dub-spanielsky-black-matt-08.webp",
            "/img/products/dub-spanielsky-black-matt-06.webp",
            "/img/products/dub-spanielsky-black-matt-07.webp",
            "/img/products/dub-spanielsky-black-matt-04.webp",
            "/img/products/dub-spanielsky-black-matt-12.webp",
            "/img/products/dub-spanielsky-black-matt-13.webp",
            "/img/products/dub-spanielsky-black-matt-02.webp",
            "/img/products/dub-spanielsky-black-matt-03.webp",
            "/img/products/dub-spanielsky-black-matt-10.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer"
        }
      ],
      "cover": "/img/products/basic-150x50x80-02.webp"
    },
    {
      "slug": "basic-200x50x70",
      "name": "BASIC 200 × 50 × 70",
      "tier": "basic",
      "tierLabel": "BASIC",
      "tierNote": "Kovový rám + vrchná doska",
      "dim": "200 × 50 × 70 cm",
      "w": 200,
      "d": 50,
      "h": 70,
      "aquarium": "200 × 50 cm (pôdorys)",
      "vol": "~500 l",
      "price": "320 €",
      "desc": "Dvojmetrový rám pre najväčšie objemy — nízke ťažisko a masívna konštrukcia pre stovky kilogramov.",
      "features": [
        "Priznaný oceľový rám 30 × 30 × 2 mm v čiernom matnom laku",
        "Vrchná doska LDTD 18 mm v dekore podľa výberu",
        "Otvorená konštrukcia — plný prístup k technike",
        "Odolné kolieska pre jednoduchú manipuláciu",
        "Zákazková výroba s ručnou kontrolou"
      ],
      "decors": [
        {
          "id": "ram",
          "name": "Čierny rám + doska v dekore",
          "swatch": [
            "#17181a"
          ],
          "images": [
            "/img/products/basic-150x50x80-02.webp",
            "/img/products/basic-150x50x80-01.webp",
            "/img/products/basic-150x50x80-06.webp",
            "/img/products/basic-150x50x80-03.webp",
            "/img/products/basic-150x50x80-04.webp",
            "/img/products/basic-150x50x80-05.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer",
          "illuSize": "150 × 50 cm"
        },
        {
          "id": "choco-vintage-oak",
          "name": "Choco Vintage Oak",
          "swatch": [
            "/img/products/swatch-choco-vintage-oak.webp"
          ],
          "images": [
            "/img/products/choco-vintage-oak-03.webp",
            "/img/products/choco-vintage-oak-12.webp",
            "/img/products/choco-vintage-oak-02.webp",
            "/img/products/choco-vintage-oak-15.webp",
            "/img/products/choco-vintage-oak-14.webp",
            "/img/products/choco-vintage-oak-07.webp",
            "/img/products/choco-vintage-oak-06.webp",
            "/img/products/choco-vintage-oak-13.webp",
            "/img/products/choco-vintage-oak-09.webp",
            "/img/products/choco-vintage-oak-04.webp",
            "/img/products/choco-vintage-oak-08.webp",
            "/img/products/choco-vintage-oak-16.webp",
            "/img/products/choco-vintage-oak-05.webp",
            "/img/products/choco-vintage-oak-10.webp",
            "/img/products/choco-vintage-oak-01.webp",
            "/img/products/choco-vintage-oak-11.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer"
        },
        {
          "id": "dub-spanielsky",
          "name": "Dub španielsky",
          "swatch": [
            "/img/products/swatch-dub-spanielsky.webp"
          ],
          "images": [
            "/img/products/dub-spanielsky-10.webp",
            "/img/products/dub-spanielsky-04.webp",
            "/img/products/dub-spanielsky-05.webp",
            "/img/products/dub-spanielsky-02.webp",
            "/img/products/dub-spanielsky-06.webp",
            "/img/products/dub-spanielsky-03.webp",
            "/img/products/dub-spanielsky-08.webp",
            "/img/products/dub-spanielsky-09.webp",
            "/img/products/dub-spanielsky-11.webp",
            "/img/products/dub-spanielsky-01.webp",
            "/img/products/dub-spanielsky-07.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer"
        },
        {
          "id": "dub-spanielsky-black-matt",
          "name": "Dub španielsky / Čierna matná",
          "swatch": [
            "/img/products/swatch-dub-spanielsky.webp",
            "#121316"
          ],
          "images": [
            "/img/products/dub-spanielsky-black-matt-01.webp",
            "/img/products/dub-spanielsky-black-matt-11.webp",
            "/img/products/dub-spanielsky-black-matt-09.webp",
            "/img/products/dub-spanielsky-black-matt-05.webp",
            "/img/products/dub-spanielsky-black-matt-08.webp",
            "/img/products/dub-spanielsky-black-matt-06.webp",
            "/img/products/dub-spanielsky-black-matt-07.webp",
            "/img/products/dub-spanielsky-black-matt-04.webp",
            "/img/products/dub-spanielsky-black-matt-12.webp",
            "/img/products/dub-spanielsky-black-matt-13.webp",
            "/img/products/dub-spanielsky-black-matt-02.webp",
            "/img/products/dub-spanielsky-black-matt-03.webp",
            "/img/products/dub-spanielsky-black-matt-10.webp"
          ],
          "inherited": true,
          "illuFrom": "rozmer"
        }
      ],
      "cover": "/img/products/basic-150x50x80-02.webp"
    }
  ];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
