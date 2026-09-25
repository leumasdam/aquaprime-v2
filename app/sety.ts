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
};

export type Set = {
  id: string;
  nazov: string;
  podtitul: Record<Jazyk, string>;
  popis: Record<Jazyk, string>;
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
    nazov: "Scape 60",
    podtitul: {
      sk: "Set pre chovateľov krevietiek",
      en: "Set for shrimp keepers",
    },
    popis: {
      sk: "Krevetárium na úzkej skrinke, ktoré sa zmestí aj tam, kde by veľké akvárium prekážalo. Skrinka 60 × 35 × 75 cm s oceľovým rámom nesie akvárium 60 × 35 × 35 cm z klasického skla a LED podsvietenie pod jeho hranou. Tri dizajnové prevedenia, jedna výška, ktorá sedí k sedačke aj k pracovnému stolu.",
      en: "A shrimp tank on a narrow cabinet that fits where a large aquarium would get in the way. The 60 × 35 × 75 cm cabinet with a steel frame carries a 60 × 35 × 35 cm classic-glass aquarium with LED backlighting under its edge. Three design finishes, one height that works next to a sofa or a desk.",
    },
    preKoho: {
      sk: [
        "Krevetky Neocaridina a Caridina — pokojná hladina, malý objem, ľahká údržba.",
        "Byt alebo kancelária, kde je miesto len na pôdorys 60 × 35 cm.",
        "Prvé akvárium v domácnosti: set je zladený, nič netreba domeriavať.",
      ],
      en: [
        "Neocaridina and Caridina shrimp — calm water, small volume, easy upkeep.",
        "A flat or office with room for a 60 × 35 cm footprint only.",
        "A first aquarium at home: the set is matched, nothing to measure.",
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
        led: { sk: "teplá biela", en: "warm white" },
      },
      {
        id: "black-matt",
        nazov: "Black Matt",
        swatch: ["#17181a"],
        led: { sk: "teplá biela", en: "warm white" },
      },
      {
        id: "antracit",
        nazov: "Antracit",
        swatch: ["#40454a"],
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
