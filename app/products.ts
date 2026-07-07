// Produktový katalóg AQUAPRIME — generované z podkladov klienta
// („Skrinky pod akvária": 3 rady × rozmery × dekory; fotky public/img/products)
// Objem = orientačný pri výške hladiny ~50 cm. Ceny zatiaľ na dopyt.

export type Decor = {
  id: string;
  name: string;
  /** vizuál dekoru: "#hex" = lak, "/cesta" = textúra z fotky; 2 položky = kombinácia (delený swatch) */
  swatch: string[];
  images: string[];
  /** fotky prevzaté z iného rozmeru toho istého radu (ilustračné) */
  inherited?: boolean;
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
    "slug": "premium-100x40x90",
    "name": "PREMIUM 100 × 40 × 90",
    "tier": "premium",
    "tierLabel": "PREMIUM",
    "tierNote": "Kompletne opláštená",
    "dim": "100 × 40 × 90 cm",
    "w": 100,
    "d": 40,
    "h": 90,
    "aquarium": "100 × 40 cm (pôdorys)",
    "vol": "~200 l",
    "price": "na dopyt",
    "desc": "Vlajkový model — kompletne opláštená skrinka, v ktorej oceľový rám mizne v plášti z LDTD 18 mm. Bezrúčkové dvierka so symetrickou špárou a matný povrch z nej robia nábytkový kus, nie podstavec.",
    "features": [
      "Kompletné opláštenie LDTD 18 mm s precíznym olepením hrán",
      "Bezrúčkové dvierka so symetrickou dizajnovou špárou",
      "Oceľový rám 30 × 30 × 2 mm — váhu nesie kov, nie plášť",
      "Matný povrch odolný voči vlhkosti a poškodeniu",
      "Výškovo nastaviteľné nožičky pre dokonalé vyrovnanie",
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
          "/img/products/premium-100x40x90-dub-hunton-black-matt-01.webp",
          "/img/products/premium-100x40x90-dub-hunton-black-matt-02.webp",
          "/img/products/premium-100x40x90-dub-hunton-black-matt-04.webp",
          "/img/products/premium-100x40x90-dub-hunton-black-matt-07.webp",
          "/img/products/premium-100x40x90-dub-hunton-black-matt-03.webp",
          "/img/products/premium-100x40x90-dub-hunton-black-matt-06.webp",
          "/img/products/premium-100x40x90-dub-hunton-black-matt-08.webp"
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
          "/img/products/premium-100x40x90-black-matt-01.webp",
          "/img/products/premium-100x40x90-black-matt-02.webp",
          "/img/products/premium-100x40x90-black-matt-05.webp",
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
          "/img/products/premium-100x40x90-black-matt-orech-01.webp"
        ]
      },
      {
        "id": "cool-white",
        "name": "Cool White",
        "swatch": [
          "#eef0f0"
        ],
        "images": [
          "/img/products/premium-100x40x90-cool-white-03.webp",
          "/img/products/premium-100x40x90-cool-white-07.webp",
          "/img/products/premium-100x40x90-cool-white-10.webp",
          "/img/products/premium-100x40x90-cool-white-01.webp",
          "/img/products/premium-100x40x90-cool-white-02.webp",
          "/img/products/premium-100x40x90-cool-white-09.webp",
          "/img/products/premium-100x40x90-cool-white-05.webp",
          "/img/products/premium-100x40x90-cool-white-06.webp",
          "/img/products/premium-100x40x90-cool-white-08.webp",
          "/img/products/premium-100x40x90-cool-white-04.webp"
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
          "/img/products/premium-100x40x90-dub-sonoma-01.webp",
          "/img/products/premium-100x40x90-dub-sonoma-03.webp",
          "/img/products/premium-100x40x90-dub-sonoma-05.webp",
          "/img/products/premium-100x40x90-dub-sonoma-04.webp",
          "/img/products/premium-100x40x90-dub-sonoma-06.webp"
        ]
      }
    ],
    "cover": "/img/products/premium-100x40x90-dub-hunton-black-matt-05.webp"
  },
  {
    "slug": "standard-80x40x90",
    "name": "ŠTANDARD 80 × 40 × 90",
    "tier": "standard",
    "tierLabel": "ŠTANDARD",
    "tierNote": "Bočnice a dvierka",
    "dim": "80 × 40 × 90 cm",
    "w": 80,
    "d": 40,
    "h": 90,
    "aquarium": "80 × 40 cm (pôdorys)",
    "vol": "~160 l",
    "price": "na dopyt",
    "desc": "Kompaktná skrinka s akváriom vo výške očí. Oceľový rám nesie váhu, bočnice a dvierka v dekore schovajú techniku aj príslušenstvo.",
    "features": [
      "Bočnice a dvierka z LDTD 18 mm v dekore podľa výberu",
      "Oceľový rám 30 × 30 × 2 mm — váhu nesie kov, nie plášť",
      "Precízne lícovanie dvierok",
      "Matný povrch odolný voči vlhkosti",
      "Výškovo nastaviteľné nožičky pre dokonalé vyrovnanie",
      "Zákazková výroba s ručnou kontrolou"
    ],
    "decors": [
      {
        "id": "artisan-antracit",
        "name": "Artisan / Antracit",
        "swatch": [
          "/img/products/swatch-artisan.webp",
          "#40454a"
        ],
        "images": [
          "/img/products/standard-80x40x90-artisan-antracit-05.webp",
          "/img/products/standard-80x40x90-artisan-antracit-03.webp",
          "/img/products/standard-80x40x90-artisan-antracit-04.webp",
          "/img/products/standard-80x40x90-artisan-antracit-09.webp",
          "/img/products/standard-80x40x90-artisan-antracit-02.webp",
          "/img/products/standard-80x40x90-artisan-antracit-06.webp",
          "/img/products/standard-80x40x90-artisan-antracit-07.webp",
          "/img/products/standard-80x40x90-artisan-antracit-01.webp",
          "/img/products/standard-80x40x90-artisan-antracit-08.webp"
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
          "/img/products/standard-80x40x90-black-matt-04.webp",
          "/img/products/premium-100x40x90-black-matt-01.webp",
          "/img/products/premium-100x40x90-black-matt-02.webp",
          "/img/products/premium-100x40x90-black-matt-05.webp",
          "/img/products/standard-100x40x90-black-matt-01.webp",
          "/img/products/standard-80x40x90-black-matt-01.webp",
          "/img/products/standard-80x40x90-black-matt-02.webp",
          "/img/products/standard-80x40x90-black-matt-03.webp",
          "/img/products/standard-200x60x60-antracit-06.webp",
          "/img/products/standard-200x60x60-black-matt-01.webp"
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
          "/img/products/standard-80x40x90-black-matt-orech-04.webp",
          "/img/products/standard-80x40x90-black-matt-orech-02.webp",
          "/img/products/standard-80x40x90-black-matt-orech-03.webp",
          "/img/products/standard-80x40x90-black-matt-orech-06.webp",
          "/img/products/standard-80x40x90-black-matt-orech-08.webp",
          "/img/products/standard-100x40x90-black-matt-orech-01.webp",
          "/img/products/standard-80x40x90-black-matt-orech-01.webp",
          "/img/products/standard-80x40x90-black-matt-orech-05.webp",
          "/img/products/standard-80x40x90-black-matt-orech-07.webp",
          "/img/products/standard-200x60x60-black-matt-orech-01.webp",
          "/img/products/standard-200x60x60-black-matt-orech-02.webp",
          "/img/products/standard-80x40x90-black-matt-orech-09.webp"
        ]
      },
      {
        "id": "antracit",
        "name": "Antracit",
        "swatch": [
          "#40454a"
        ],
        "images": [
          "/img/products/standard-80x40x90-antracit-03.webp",
          "/img/products/standard-80x40x90-antracit-02.webp",
          "/img/products/standard-80x40x90-antracit-05.webp",
          "/img/products/standard-80x40x90-antracit-06.webp",
          "/img/products/standard-80x40x90-antracit-07.webp",
          "/img/products/standard-80x40x90-antracit-01.webp",
          "/img/products/standard-80x40x90-antracit-04.webp",
          "/img/products/standard-80x40x90-antracit-08.webp",
          "/img/products/standard-200x60x60-antracit-06.webp"
        ]
      },
      {
        "id": "cool-white",
        "name": "Cool White",
        "swatch": [
          "#eef0f0"
        ],
        "images": [
          "/img/products/premium-100x40x90-cool-white-03.webp",
          "/img/products/premium-100x40x90-cool-white-07.webp",
          "/img/products/premium-100x40x90-cool-white-10.webp",
          "/img/products/premium-100x40x90-cool-white-01.webp",
          "/img/products/premium-100x40x90-cool-white-02.webp",
          "/img/products/premium-100x40x90-cool-white-09.webp",
          "/img/products/standard-100x40x90-cool-white-01.webp",
          "/img/products/standard-100x40x90-cool-white-02.webp",
          "/img/products/standard-200x60x60-cool-white-01.webp",
          "/img/products/premium-100x40x90-cool-white-04.webp"
        ]
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
          "/img/products/premium-100x40x90-dub-hunton-black-matt-01.webp",
          "/img/products/premium-100x40x90-dub-hunton-black-matt-02.webp",
          "/img/products/premium-100x40x90-dub-hunton-black-matt-04.webp",
          "/img/products/premium-100x40x90-dub-hunton-black-matt-07.webp",
          "/img/products/premium-100x40x90-dub-hunton-black-matt-03.webp",
          "/img/products/premium-100x40x90-dub-hunton-black-matt-06.webp",
          "/img/products/premium-100x40x90-dub-hunton-black-matt-08.webp"
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
          "/img/products/premium-100x40x90-dub-sonoma-01.webp",
          "/img/products/premium-100x40x90-dub-sonoma-03.webp",
          "/img/products/premium-100x40x90-dub-sonoma-05.webp",
          "/img/products/standard-80x40x90-dub-sonoma-01.webp",
          "/img/products/standard-80x40x90-dub-sonoma-02.webp",
          "/img/products/standard-80x40x90-dub-sonoma-03.webp",
          "/img/products/premium-100x40x90-dub-sonoma-06.webp"
        ]
      }
    ],
    "cover": "/img/products/standard-80x40x90-artisan-antracit-05.webp"
  },
  {
    "slug": "standard-100x40x90",
    "name": "ŠTANDARD 100 × 40 × 90",
    "tier": "standard",
    "tierLabel": "ŠTANDARD",
    "tierNote": "Bočnice a dvierka",
    "dim": "100 × 40 × 90 cm",
    "w": 100,
    "d": 40,
    "h": 90,
    "aquarium": "100 × 40 cm (pôdorys)",
    "vol": "~200 l",
    "price": "na dopyt",
    "desc": "Najuniverzálnejší rozmer do obývačky — metrové akvárium vo výške očí, technika schovaná za dvierkami v dekore.",
    "features": [
      "Bočnice a dvierka z LDTD 18 mm v dekore podľa výberu",
      "Oceľový rám 30 × 30 × 2 mm — váhu nesie kov, nie plášť",
      "Precízne lícovanie dvierok",
      "Matný povrch odolný voči vlhkosti",
      "Výškovo nastaviteľné nožičky pre dokonalé vyrovnanie",
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
          "/img/products/premium-100x40x90-cool-white-03.webp",
          "/img/products/premium-100x40x90-cool-white-07.webp",
          "/img/products/premium-100x40x90-cool-white-10.webp",
          "/img/products/premium-100x40x90-cool-white-01.webp",
          "/img/products/premium-100x40x90-cool-white-02.webp",
          "/img/products/premium-100x40x90-cool-white-09.webp",
          "/img/products/standard-100x40x90-cool-white-01.webp",
          "/img/products/standard-100x40x90-cool-white-02.webp",
          "/img/products/standard-200x60x60-cool-white-01.webp",
          "/img/products/premium-100x40x90-cool-white-04.webp"
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
          "/img/products/standard-80x40x90-black-matt-04.webp",
          "/img/products/premium-100x40x90-black-matt-01.webp",
          "/img/products/premium-100x40x90-black-matt-02.webp",
          "/img/products/premium-100x40x90-black-matt-05.webp",
          "/img/products/standard-100x40x90-black-matt-01.webp",
          "/img/products/standard-80x40x90-black-matt-01.webp",
          "/img/products/standard-80x40x90-black-matt-02.webp",
          "/img/products/standard-80x40x90-black-matt-03.webp",
          "/img/products/standard-200x60x60-antracit-06.webp",
          "/img/products/standard-200x60x60-black-matt-01.webp"
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
          "/img/products/standard-80x40x90-black-matt-orech-04.webp",
          "/img/products/standard-80x40x90-black-matt-orech-02.webp",
          "/img/products/standard-80x40x90-black-matt-orech-03.webp",
          "/img/products/standard-80x40x90-black-matt-orech-06.webp",
          "/img/products/standard-80x40x90-black-matt-orech-08.webp",
          "/img/products/standard-100x40x90-black-matt-orech-01.webp",
          "/img/products/standard-80x40x90-black-matt-orech-01.webp",
          "/img/products/standard-80x40x90-black-matt-orech-05.webp",
          "/img/products/standard-80x40x90-black-matt-orech-07.webp",
          "/img/products/standard-200x60x60-black-matt-orech-01.webp",
          "/img/products/standard-200x60x60-black-matt-orech-02.webp",
          "/img/products/standard-80x40x90-black-matt-orech-09.webp"
        ]
      },
      {
        "id": "antracit",
        "name": "Antracit",
        "swatch": [
          "#40454a"
        ],
        "images": [
          "/img/products/standard-80x40x90-antracit-03.webp",
          "/img/products/standard-80x40x90-antracit-02.webp",
          "/img/products/standard-80x40x90-antracit-05.webp",
          "/img/products/standard-80x40x90-antracit-06.webp",
          "/img/products/standard-80x40x90-antracit-07.webp",
          "/img/products/standard-80x40x90-antracit-01.webp",
          "/img/products/standard-80x40x90-antracit-04.webp",
          "/img/products/standard-80x40x90-antracit-08.webp",
          "/img/products/standard-200x60x60-antracit-06.webp"
        ],
        "inherited": true
      },
      {
        "id": "artisan-antracit",
        "name": "Artisan / Antracit",
        "swatch": [
          "/img/products/swatch-artisan.webp",
          "#40454a"
        ],
        "images": [
          "/img/products/standard-80x40x90-artisan-antracit-05.webp",
          "/img/products/standard-80x40x90-artisan-antracit-03.webp",
          "/img/products/standard-80x40x90-artisan-antracit-04.webp",
          "/img/products/standard-80x40x90-artisan-antracit-09.webp",
          "/img/products/standard-80x40x90-artisan-antracit-02.webp",
          "/img/products/standard-80x40x90-artisan-antracit-06.webp",
          "/img/products/standard-80x40x90-artisan-antracit-07.webp",
          "/img/products/standard-80x40x90-artisan-antracit-01.webp",
          "/img/products/standard-80x40x90-artisan-antracit-08.webp"
        ],
        "inherited": true
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
          "/img/products/premium-100x40x90-dub-hunton-black-matt-01.webp",
          "/img/products/premium-100x40x90-dub-hunton-black-matt-02.webp",
          "/img/products/premium-100x40x90-dub-hunton-black-matt-04.webp",
          "/img/products/premium-100x40x90-dub-hunton-black-matt-07.webp",
          "/img/products/premium-100x40x90-dub-hunton-black-matt-03.webp",
          "/img/products/premium-100x40x90-dub-hunton-black-matt-06.webp",
          "/img/products/premium-100x40x90-dub-hunton-black-matt-08.webp"
        ],
        "inherited": true
      },
      {
        "id": "dub-sonoma",
        "name": "Dub Sonoma",
        "swatch": [
          "/img/products/swatch-dub-sonoma.webp"
        ],
        "images": [
          "/img/products/premium-100x40x90-dub-sonoma-02.webp",
          "/img/products/premium-100x40x90-dub-sonoma-01.webp",
          "/img/products/premium-100x40x90-dub-sonoma-03.webp",
          "/img/products/premium-100x40x90-dub-sonoma-05.webp",
          "/img/products/standard-80x40x90-dub-sonoma-01.webp",
          "/img/products/standard-80x40x90-dub-sonoma-02.webp",
          "/img/products/standard-80x40x90-dub-sonoma-03.webp",
          "/img/products/premium-100x40x90-dub-sonoma-06.webp"
        ],
        "inherited": true
      }
    ],
    "cover": "/img/products/premium-100x40x90-cool-white-03.webp"
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
    "price": "na dopyt",
    "desc": "Rozmerná skrinka pre nádrže okolo 375 litrov. Oceľový rám drží presnú rovinu, dvierka sprístupnia celý úložný priestor.",
    "features": [
      "Bočnice a dvierka z LDTD 18 mm v dekore podľa výberu",
      "Oceľový rám 30 × 30 × 2 mm — váhu nesie kov, nie plášť",
      "Precízne lícovanie dvierok",
      "Matný povrch odolný voči vlhkosti",
      "Výškovo nastaviteľné nožičky pre dokonalé vyrovnanie",
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
          "/img/products/standard-200x60x60-black-matt-02.webp",
          "/img/products/standard-100x40x90-black-matt-02.webp",
          "/img/products/standard-150x50x80-black-matt-02.webp",
          "/img/products/standard-200x60x60-black-matt-04.webp",
          "/img/products/standard-150x50x80-black-matt-01.webp",
          "/img/products/standard-200x60x60-black-matt-03.webp",
          "/img/products/standard-200x60x60-antracit-06.webp",
          "/img/products/standard-200x60x60-black-matt-01.webp"
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
          "/img/products/standard-80x40x90-black-matt-orech-04.webp",
          "/img/products/standard-80x40x90-black-matt-orech-02.webp",
          "/img/products/standard-80x40x90-black-matt-orech-03.webp",
          "/img/products/standard-80x40x90-black-matt-orech-06.webp",
          "/img/products/standard-80x40x90-black-matt-orech-08.webp",
          "/img/products/standard-100x40x90-black-matt-orech-01.webp",
          "/img/products/standard-80x40x90-black-matt-orech-01.webp",
          "/img/products/standard-80x40x90-black-matt-orech-05.webp",
          "/img/products/standard-80x40x90-black-matt-orech-07.webp",
          "/img/products/standard-200x60x60-black-matt-orech-01.webp",
          "/img/products/standard-200x60x60-black-matt-orech-02.webp",
          "/img/products/standard-80x40x90-black-matt-orech-09.webp"
        ],
        "inherited": true
      },
      {
        "id": "antracit",
        "name": "Antracit",
        "swatch": [
          "#40454a"
        ],
        "images": [
          "/img/products/standard-200x60x60-antracit-02.webp",
          "/img/products/standard-200x60x60-antracit-03.webp",
          "/img/products/standard-200x60x60-antracit-04.webp",
          "/img/products/standard-200x60x60-antracit-05.webp",
          "/img/products/standard-200x60x60-antracit-01.webp",
          "/img/products/standard-200x60x60-antracit-06.webp"
        ],
        "inherited": true
      },
      {
        "id": "cool-white",
        "name": "Cool White",
        "swatch": [
          "#eef0f0"
        ],
        "images": [
          "/img/products/premium-100x40x90-cool-white-03.webp",
          "/img/products/premium-100x40x90-cool-white-07.webp",
          "/img/products/premium-100x40x90-cool-white-10.webp",
          "/img/products/premium-100x40x90-cool-white-01.webp",
          "/img/products/premium-100x40x90-cool-white-02.webp",
          "/img/products/premium-100x40x90-cool-white-09.webp",
          "/img/products/standard-100x40x90-cool-white-01.webp",
          "/img/products/standard-100x40x90-cool-white-02.webp",
          "/img/products/standard-200x60x60-cool-white-01.webp",
          "/img/products/premium-100x40x90-cool-white-04.webp"
        ],
        "inherited": true
      },
      {
        "id": "dub-sonoma",
        "name": "Dub Sonoma",
        "swatch": [
          "/img/products/swatch-dub-sonoma.webp"
        ],
        "images": [
          "/img/products/standard-200x60x60-dub-sonoma-04.webp",
          "/img/products/standard-200x60x60-dub-sonoma-01.webp",
          "/img/products/standard-200x60x60-dub-sonoma-03.webp",
          "/img/products/standard-200x60x60-dub-sonoma-05.webp",
          "/img/products/standard-200x60x60-dub-sonoma-02.webp",
          "/img/products/premium-100x40x90-dub-sonoma-06.webp"
        ],
        "inherited": true
      }
    ],
    "cover": "/img/products/standard-200x60x60-black-matt-02.webp"
  },
  {
    "slug": "standard-160x40x80",
    "name": "ŠTANDARD 160 × 40 × 80",
    "tier": "standard",
    "tierLabel": "ŠTANDARD",
    "tierNote": "Bočnice a dvierka",
    "dim": "160 × 40 × 80 cm",
    "w": 160,
    "d": 40,
    "h": 80,
    "aquarium": "160 × 40 cm (pôdorys)",
    "vol": "~320 l",
    "price": "na dopyt",
    "desc": "Dlhý, nízky formát pre úzke nádrže. Pôsobí ľahko, no rám z ocele 30 × 30 mm unesie aj plne osadené akvárium.",
    "features": [
      "Bočnice a dvierka z LDTD 18 mm v dekore podľa výberu",
      "Oceľový rám 30 × 30 × 2 mm — váhu nesie kov, nie plášť",
      "Precízne lícovanie dvierok",
      "Matný povrch odolný voči vlhkosti",
      "Výškovo nastaviteľné nožičky pre dokonalé vyrovnanie",
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
          "/img/products/standard-200x60x60-dub-sonoma-01.webp",
          "/img/products/standard-200x60x60-dub-sonoma-03.webp",
          "/img/products/standard-200x60x60-dub-sonoma-05.webp",
          "/img/products/standard-200x60x60-dub-sonoma-02.webp",
          "/img/products/premium-100x40x90-dub-sonoma-06.webp"
        ],
        "inherited": true
      },
      {
        "id": "black-matt",
        "name": "Black Matt",
        "swatch": [
          "#17181a"
        ],
        "images": [
          "/img/products/standard-200x60x60-black-matt-02.webp",
          "/img/products/standard-100x40x90-black-matt-02.webp",
          "/img/products/standard-150x50x80-black-matt-02.webp",
          "/img/products/standard-200x60x60-black-matt-04.webp",
          "/img/products/standard-150x50x80-black-matt-01.webp",
          "/img/products/standard-200x60x60-black-matt-03.webp",
          "/img/products/standard-200x60x60-antracit-06.webp",
          "/img/products/standard-200x60x60-black-matt-01.webp"
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
          "/img/products/standard-80x40x90-black-matt-orech-04.webp",
          "/img/products/standard-80x40x90-black-matt-orech-02.webp",
          "/img/products/standard-80x40x90-black-matt-orech-03.webp",
          "/img/products/standard-80x40x90-black-matt-orech-06.webp",
          "/img/products/standard-80x40x90-black-matt-orech-08.webp",
          "/img/products/standard-100x40x90-black-matt-orech-01.webp",
          "/img/products/standard-80x40x90-black-matt-orech-01.webp",
          "/img/products/standard-80x40x90-black-matt-orech-05.webp",
          "/img/products/standard-80x40x90-black-matt-orech-07.webp",
          "/img/products/standard-200x60x60-black-matt-orech-01.webp",
          "/img/products/standard-200x60x60-black-matt-orech-02.webp",
          "/img/products/standard-80x40x90-black-matt-orech-09.webp"
        ],
        "inherited": true
      },
      {
        "id": "antracit",
        "name": "Antracit",
        "swatch": [
          "#40454a"
        ],
        "images": [
          "/img/products/standard-200x60x60-antracit-02.webp",
          "/img/products/standard-200x60x60-antracit-03.webp",
          "/img/products/standard-200x60x60-antracit-04.webp",
          "/img/products/standard-200x60x60-antracit-05.webp",
          "/img/products/standard-200x60x60-antracit-01.webp",
          "/img/products/standard-200x60x60-antracit-06.webp"
        ],
        "inherited": true
      },
      {
        "id": "cool-white",
        "name": "Cool White",
        "swatch": [
          "#eef0f0"
        ],
        "images": [
          "/img/products/premium-100x40x90-cool-white-03.webp",
          "/img/products/premium-100x40x90-cool-white-07.webp",
          "/img/products/premium-100x40x90-cool-white-10.webp",
          "/img/products/premium-100x40x90-cool-white-01.webp",
          "/img/products/premium-100x40x90-cool-white-02.webp",
          "/img/products/premium-100x40x90-cool-white-09.webp",
          "/img/products/standard-100x40x90-cool-white-01.webp",
          "/img/products/standard-100x40x90-cool-white-02.webp",
          "/img/products/standard-200x60x60-cool-white-01.webp",
          "/img/products/premium-100x40x90-cool-white-04.webp"
        ],
        "inherited": true
      }
    ],
    "cover": "/img/products/standard-200x60x60-dub-sonoma-04.webp"
  },
  {
    "slug": "standard-200x60x60",
    "name": "ŠTANDARD 200 × 60 × 60",
    "tier": "standard",
    "tierLabel": "ŠTANDARD",
    "tierNote": "Bočnice a dvierka",
    "dim": "200 × 60 × 60 cm",
    "w": 200,
    "d": 60,
    "h": 60,
    "aquarium": "200 × 60 cm (pôdorys)",
    "vol": "~600 l",
    "price": "na dopyt",
    "desc": "Dvojmetrový formát pre veľkoobjemové nádrže okolo 600 litrov. Nízka výška stabilizuje ťažisko a uľahčuje prístup zhora.",
    "features": [
      "Bočnice a dvierka z LDTD 18 mm v dekore podľa výberu",
      "Oceľový rám 30 × 30 × 2 mm — váhu nesie kov, nie plášť",
      "Precízne lícovanie dvierok",
      "Matný povrch odolný voči vlhkosti",
      "Výškovo nastaviteľné nožičky pre dokonalé vyrovnanie",
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
          "/img/products/standard-200x60x60-antracit-03.webp",
          "/img/products/standard-200x60x60-antracit-04.webp",
          "/img/products/standard-200x60x60-antracit-05.webp",
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
          "/img/products/standard-100x40x90-black-matt-02.webp",
          "/img/products/standard-150x50x80-black-matt-02.webp",
          "/img/products/standard-200x60x60-black-matt-04.webp",
          "/img/products/standard-150x50x80-black-matt-01.webp",
          "/img/products/standard-200x60x60-black-matt-03.webp",
          "/img/products/standard-200x60x60-antracit-06.webp",
          "/img/products/standard-200x60x60-black-matt-01.webp"
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
          "/img/products/standard-80x40x90-black-matt-orech-04.webp",
          "/img/products/standard-80x40x90-black-matt-orech-02.webp",
          "/img/products/standard-80x40x90-black-matt-orech-03.webp",
          "/img/products/standard-80x40x90-black-matt-orech-06.webp",
          "/img/products/standard-80x40x90-black-matt-orech-08.webp",
          "/img/products/standard-100x40x90-black-matt-orech-01.webp",
          "/img/products/standard-80x40x90-black-matt-orech-01.webp",
          "/img/products/standard-80x40x90-black-matt-orech-05.webp",
          "/img/products/standard-80x40x90-black-matt-orech-07.webp",
          "/img/products/standard-200x60x60-black-matt-orech-01.webp",
          "/img/products/standard-200x60x60-black-matt-orech-02.webp",
          "/img/products/standard-80x40x90-black-matt-orech-09.webp"
        ],
        "inherited": true
      },
      {
        "id": "cool-white",
        "name": "Cool White",
        "swatch": [
          "#eef0f0"
        ],
        "images": [
          "/img/products/premium-100x40x90-cool-white-03.webp",
          "/img/products/premium-100x40x90-cool-white-07.webp",
          "/img/products/premium-100x40x90-cool-white-10.webp",
          "/img/products/premium-100x40x90-cool-white-01.webp",
          "/img/products/premium-100x40x90-cool-white-02.webp",
          "/img/products/premium-100x40x90-cool-white-09.webp",
          "/img/products/standard-100x40x90-cool-white-01.webp",
          "/img/products/standard-100x40x90-cool-white-02.webp",
          "/img/products/standard-200x60x60-cool-white-01.webp",
          "/img/products/premium-100x40x90-cool-white-04.webp"
        ],
        "inherited": true
      },
      {
        "id": "dub-sonoma",
        "name": "Dub Sonoma",
        "swatch": [
          "/img/products/swatch-dub-sonoma.webp"
        ],
        "images": [
          "/img/products/standard-200x60x60-dub-sonoma-04.webp",
          "/img/products/standard-200x60x60-dub-sonoma-01.webp",
          "/img/products/standard-200x60x60-dub-sonoma-03.webp",
          "/img/products/standard-200x60x60-dub-sonoma-05.webp",
          "/img/products/standard-200x60x60-dub-sonoma-02.webp",
          "/img/products/premium-100x40x90-dub-sonoma-06.webp"
        ]
      }
    ],
    "cover": "/img/products/standard-200x60x60-antracit-02.webp"
  },
  {
    "slug": "basic-80x40x90",
    "name": "BASIC 80 × 40 × 90",
    "tier": "basic",
    "tierLabel": "BASIC",
    "tierNote": "Kovový rám + vrchná doska",
    "dim": "80 × 40 × 90 cm",
    "w": 80,
    "d": 40,
    "h": 90,
    "aquarium": "80 × 40 cm (pôdorys)",
    "vol": "~160 l",
    "price": "na dopyt",
    "desc": "Najkompaktnejší rám v ponuke — akvárium vo výške očí a voľný priestor na techniku pod ním.",
    "features": [
      "Priznaný oceľový rám 30 × 30 × 2 mm v čiernom matnom laku",
      "Vrchná doska LDTD 18 mm v dekore podľa výberu",
      "Otvorená konštrukcia — plný prístup k technike",
      "Výškovo nastaviteľné nožičky pre dokonalé vyrovnanie",
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
          "/img/products/basic-100x40x90-06.webp",
          "/img/products/basic-100x40x90-01.webp",
          "/img/products/basic-100x40x90-03.webp",
          "/img/products/basic-100x40x90-04.webp",
          "/img/products/basic-100x40x90-02.webp",
          "/img/products/basic-100x40x90-05.webp",
          "/img/products/basic-100x40x90-07.webp"
        ]
      }
    ],
    "cover": "/img/products/basic-100x40x90-06.webp"
  },
  {
    "slug": "basic-100x40x90",
    "name": "BASIC 100 × 40 × 90",
    "tier": "basic",
    "tierLabel": "BASIC",
    "tierNote": "Kovový rám + vrchná doska",
    "dim": "100 × 40 × 90 cm",
    "w": 100,
    "d": 40,
    "h": 90,
    "aquarium": "100 × 40 cm (pôdorys)",
    "vol": "~200 l",
    "price": "na dopyt",
    "desc": "Metrový rám s vrchnou doskou v dekore. Čistý industriálny základ, ktorý nechá vyniknúť akvárium.",
    "features": [
      "Priznaný oceľový rám 30 × 30 × 2 mm v čiernom matnom laku",
      "Vrchná doska LDTD 18 mm v dekore podľa výberu",
      "Otvorená konštrukcia — plný prístup k technike",
      "Výškovo nastaviteľné nožičky pre dokonalé vyrovnanie",
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
          "/img/products/basic-100x40x90-03.webp",
          "/img/products/basic-100x40x90-04.webp",
          "/img/products/basic-100x40x90-06.webp",
          "/img/products/basic-100x40x90-02.webp",
          "/img/products/basic-100x40x90-05.webp",
          "/img/products/basic-100x40x90-07.webp"
        ]
      }
    ],
    "cover": "/img/products/basic-100x40x90-01.webp"
  },
  {
    "slug": "basic-120x50x90",
    "name": "BASIC 120 × 50 × 90",
    "tier": "basic",
    "tierLabel": "BASIC",
    "tierNote": "Kovový rám + vrchná doska",
    "dim": "120 × 50 × 90 cm",
    "w": 120,
    "d": 50,
    "h": 90,
    "aquarium": "120 × 50 cm (pôdorys)",
    "vol": "~300 l",
    "price": "na dopyt",
    "desc": "Vysoký rám pre 120 cm nádrže — pohodlné sledovanie postojačky a veľkorysý priestor pod akváriom.",
    "features": [
      "Priznaný oceľový rám 30 × 30 × 2 mm v čiernom matnom laku",
      "Vrchná doska LDTD 18 mm v dekore podľa výberu",
      "Otvorená konštrukcia — plný prístup k technike",
      "Výškovo nastaviteľné nožičky pre dokonalé vyrovnanie",
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
          "/img/products/basic-100x40x90-04.webp",
          "/img/products/basic-100x40x90-01.webp",
          "/img/products/basic-100x40x90-03.webp",
          "/img/products/basic-100x40x90-06.webp",
          "/img/products/basic-100x40x90-02.webp",
          "/img/products/basic-100x40x90-05.webp",
          "/img/products/basic-100x40x90-07.webp"
        ]
      }
    ],
    "cover": "/img/products/basic-100x40x90-04.webp"
  },
  {
    "slug": "basic-120x60x80",
    "name": "BASIC 120 × 60 × 80",
    "tier": "basic",
    "tierLabel": "BASIC",
    "tierNote": "Kovový rám + vrchná doska",
    "dim": "120 × 60 × 80 cm",
    "w": 120,
    "d": 60,
    "h": 80,
    "aquarium": "120 × 60 cm (pôdorys)",
    "vol": "~360 l",
    "price": "na dopyt",
    "desc": "Hlbší formát pre 60 cm široké nádrže — stabilný základ pre akvascaping s väčšou hĺbkou.",
    "features": [
      "Priznaný oceľový rám 30 × 30 × 2 mm v čiernom matnom laku",
      "Vrchná doska LDTD 18 mm v dekore podľa výberu",
      "Otvorená konštrukcia — plný prístup k technike",
      "Výškovo nastaviteľné nožičky pre dokonalé vyrovnanie",
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
          "/img/products/basic-100x40x90-03.webp",
          "/img/products/basic-100x40x90-01.webp",
          "/img/products/basic-100x40x90-04.webp",
          "/img/products/basic-100x40x90-06.webp",
          "/img/products/basic-100x40x90-02.webp",
          "/img/products/basic-100x40x90-05.webp",
          "/img/products/basic-100x40x90-07.webp"
        ]
      }
    ],
    "cover": "/img/products/basic-100x40x90-03.webp"
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
    "price": "na dopyt",
    "desc": "Poldruhametrový rám pre ťažké nádrže. Otvorená konštrukcia rozloží váhu a sprístupní techniku zo všetkých strán.",
    "features": [
      "Priznaný oceľový rám 30 × 30 × 2 mm v čiernom matnom laku",
      "Vrchná doska LDTD 18 mm v dekore podľa výberu",
      "Otvorená konštrukcia — plný prístup k technike",
      "Výškovo nastaviteľné nožičky pre dokonalé vyrovnanie",
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
          "/img/products/basic-150x50x80-05.webp",
          "/img/products/basic-150x50x80-02.webp",
          "/img/products/basic-150x50x80-03.webp",
          "/img/products/basic-150x50x80-04.webp",
          "/img/products/basic-150x50x80-01.webp",
          "/img/products/basic-150x50x80-06.webp"
        ]
      }
    ],
    "cover": "/img/products/basic-150x50x80-05.webp"
  },
  {
    "slug": "basic-160x40x80",
    "name": "BASIC 160 × 40 × 80",
    "tier": "basic",
    "tierLabel": "BASIC",
    "tierNote": "Kovový rám + vrchná doska",
    "dim": "160 × 40 × 80 cm",
    "w": 160,
    "d": 40,
    "h": 80,
    "aquarium": "160 × 40 cm (pôdorys)",
    "vol": "~320 l",
    "price": "na dopyt",
    "desc": "Dlhý úzky rám pre 160 cm nádrže. Minimalistický základ, maximálna stabilita.",
    "features": [
      "Priznaný oceľový rám 30 × 30 × 2 mm v čiernom matnom laku",
      "Vrchná doska LDTD 18 mm v dekore podľa výberu",
      "Otvorená konštrukcia — plný prístup k technike",
      "Výškovo nastaviteľné nožičky pre dokonalé vyrovnanie",
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
          "/img/products/basic-150x50x80-03.webp",
          "/img/products/basic-150x50x80-02.webp",
          "/img/products/basic-150x50x80-04.webp",
          "/img/products/basic-150x50x80-05.webp",
          "/img/products/basic-150x50x80-01.webp",
          "/img/products/basic-150x50x80-06.webp"
        ]
      }
    ],
    "cover": "/img/products/basic-150x50x80-03.webp"
  },
  {
    "slug": "basic-200x60x60",
    "name": "BASIC 200 × 60 × 60",
    "tier": "basic",
    "tierLabel": "BASIC",
    "tierNote": "Kovový rám + vrchná doska",
    "dim": "200 × 60 × 60 cm",
    "w": 200,
    "d": 60,
    "h": 60,
    "aquarium": "200 × 60 cm (pôdorys)",
    "vol": "~600 l",
    "price": "na dopyt",
    "desc": "Dvojmetrový rám pre najväčšie objemy — nízke ťažisko a masívna konštrukcia pre stovky kilogramov.",
    "features": [
      "Priznaný oceľový rám 30 × 30 × 2 mm v čiernom matnom laku",
      "Vrchná doska LDTD 18 mm v dekore podľa výberu",
      "Otvorená konštrukcia — plný prístup k technike",
      "Výškovo nastaviteľné nožičky pre dokonalé vyrovnanie",
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
          "/img/products/basic-150x50x80-06.webp",
          "/img/products/basic-150x50x80-02.webp",
          "/img/products/basic-150x50x80-03.webp",
          "/img/products/basic-150x50x80-04.webp",
          "/img/products/basic-150x50x80-05.webp",
          "/img/products/basic-150x50x80-01.webp"
        ]
      }
    ],
    "cover": "/img/products/basic-150x50x80-06.webp"
  }
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
