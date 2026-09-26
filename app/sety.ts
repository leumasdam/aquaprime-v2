import type { Jazyk } from "./jazyk";

/**
 * Hotové sety skrinka + akvárium. Prvé v ponuke sú krevetáriá na úzkych
 * skrinkách; ďalšie sety pribúdajú sem, stránka /sety ich vykreslí sama.
 *
 * Cena: kým ju klient nedodá, set sa ponúka na dopyt (cena === null).
 */
export type Prevedenie = {
  id: string;
  nazov: string;
  swatch: string[];
  led: Record<Jazyk, string>;
  /** výrez skrinky s akváriom (priehľadné pozadie) do hero */
  obrazok: string;
};

/** Kategórie v poradí, v akom stoja v prepínači na stránke Sety. */
export const KATEGORIE = ["akvariove", "krevetariove", "terariove"] as const;
export type KategoriaSetu = (typeof KATEGORIE)[number];

export type Set = {
  id: string;
  kategoria: KategoriaSetu;
  nazov: string;
  podtitul: Record<Jazyk, string>;
  /** odseky popisu */
  popis: Record<Jazyk, string[]>;
  preKoho: Record<Jazyk, string[]>;
  skrinka: string;
  akvarium: string;
  sklo: Record<Jazyk, string>;
  objem: number;
  prevedenia: Prevedenie[];
  cena: number | null;
  obrazok: string;
  nahlad: string;
  novinka?: boolean;
};

export const SETY: Set[] = [
  {
    id: "scape-60",
    kategoria: "krevetariove",
    nazov: "Scape 60",
    podtitul: {
      sk: "Kompaktný set pre chov kreviet",
      en: "A compact set for keeping shrimp",
    },
    popis: {
      sk: [
        "Scape 60 prináša plnohodnotné krevetárium aj do menšieho bytu či kancelárie. Akvárium s objemom 73 litrov stojí na úzkej skrinke s oceľovým rámom, ktorá zaberie pôdorys iba 60 × 35 cm.",
        "Vybrať si môžete z troch dekorov a LED podsvietenia v teplej bielej alebo modrej farbe.",
      ],
      en: [
        "Scape 60 brings a full shrimp tank into a smaller flat or an office. The 73-litre aquarium sits on a narrow steel-framed cabinet with a footprint of just 60 × 35 cm.",
        "Choose from three finishes and LED backlighting in warm white or blue.",
      ],
    },
    preKoho: {
      sk: [
        "Chovateľom kreviet rodov Neocaridina a Caridina, ktorí hľadajú samostatnú kompaktnú nádrž.",
        "Do bytu, pracovne či kancelárie, kde je k dispozícii pôdorys 60 × 35 cm.",
        "Každému, kto chce rozmerovo aj vizuálne zladený celok bez zdĺhavého domeriavania jednotlivých častí.",
      ],
      en: [
        "Keepers of Neocaridina and Caridina shrimp looking for a standalone compact tank.",
        "A flat, study or office with a 60 × 35 cm footprint available.",
        "Anyone who wants a set matched in size and look, with no measuring of separate parts.",
      ],
    },
    skrinka: "60 × 35 × 75 cm",
    akvarium: "60 × 35 × 35 cm",
    sklo: { sk: "Klasické sklo", en: "Classic glass" },
    objem: 73,
    prevedenia: [
      {
        id: "cool-white",
        nazov: "Cool White",
        swatch: ["#eef0f0"],
        obrazok: "/img/sety/scape-60-cool-white.webp",
        led: { sk: "teplá biela", en: "warm white" },
      },
      {
        id: "black-matt",
        nazov: "Black Matt",
        swatch: ["#17181a"],
        obrazok: "/img/sety/scape-60-black-matt.webp",
        led: { sk: "teplá biela", en: "warm white" },
      },
      {
        id: "antracit",
        nazov: "Antracit",
        swatch: ["#40454a"],
        obrazok: "/img/sety/scape-60-antracit.webp",
        led: { sk: "modrá", en: "blue" },
      },
    ],
    cena: null,
    obrazok: "/img/sety/scape-60.webp",
    nahlad: "/img/sety/scape-60-nahlad.webp",
    novinka: true,
  },
];

export function najdiSet(id: string): Set | undefined {
  return SETY.find((s) => s.id === id);
}
