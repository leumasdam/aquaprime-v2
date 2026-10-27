import type { Jazyk } from "./jazyk";
import type { Decor } from "./products";

/**
 * Hotové sety skrinka + akvárium. Prvé v ponuke sú krevetáriá na úzkych
 * skrinkách v troch veľkostiach; ďalšie sety pribúdajú sem, stránka /sety
 * ich vykreslí sama.
 *
 * Každé prevedenie má vlastnú sadu fotiek z interiéru — nie výrez skladaný
 * do pozadia, ale skutočný záber od klienta.
 *
 * Cena: kým ju klient nedodá, set sa ponúka na dopyt (cena === null).
 */

/** Kategórie v poradí, v akom stoja v prepínači na stránke Sety. */
export const KATEGORIE = ["akvariove", "krevetariove", "terariove"] as const;
export type KategoriaSetu = (typeof KATEGORIE)[number];

/**
 * Prevedenie setu = dekor skrinky: rovnaká knižnica dekorov, rovnaké fotky
 * (vrátane LED variantov) a rovnaká karta v katalógu. Výrezy do hero setov
 * sú v SetyHero.tsx, viazané na id dekoru.
 */
export type Prevedenie = Decor;

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
  /** cena s LED podsvietením — len keď má set LED fotky */
  cenaLed?: number | null;
  novinka?: boolean;
  /** rozpracovaný v administrácii — na webe sa neukazuje */
  skryta?: boolean;
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
        "Vybrať si môžete z troch dekorov, každý s LED podsvietením nad hladinou.",
      ],
      en: [
        "Scape 60 brings a full shrimp tank into a smaller flat or an office. The 73-litre aquarium sits on a narrow steel-framed cabinet with a footprint of just 60 × 35 cm.",
        "Choose from three finishes, each with LED lighting above the water.",
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
        id: "black-matt",
        name: "Black Matt",
        swatch: ["#17181a"],
        images: [
          "/img/sety/scape-60-black-matt-01.webp",
          "/img/sety/scape-60-black-matt-02.webp",
          "/img/sety/scape-60-black-matt-03.webp",
          "/img/sety/scape-60-black-matt-04.webp",
        ],
      },
      {
        id: "cool-white",
        name: "Cool White",
        swatch: ["#eef0f0"],
        images: [
          "/img/sety/scape-60-cool-white-01.webp",
          "/img/sety/scape-60-cool-white-02.webp",
          "/img/sety/scape-60-cool-white-03.webp",
          "/img/sety/scape-60-cool-white-04.webp",
        ],
      },
      {
        id: "antracit",
        name: "Antracit",
        swatch: ["#40454a"],
        images: [
          "/img/sety/scape-60-antracit-01.webp",
          "/img/sety/scape-60-antracit-02.webp",
          "/img/sety/scape-60-antracit-03.webp",
          "/img/sety/scape-60-antracit-04.webp",
        ],
      },
    ],
    cena: null,
    novinka: true,
  },
  {
    id: "midi-40",
    kategoria: "krevetariove",
    nazov: "Midi 40",
    podtitul: {
      sk: "Kocka do rohu izby aj na pracovňu",
      en: "A cube for a corner or a study",
    },
    popis: {
      sk: [
        "Midi 40 je kocka s objemom 64 litrov na skrinke s pôdorysom 40 × 40 cm. Postaví sa do rohu izby, vedľa pracovného stola aj do recepcie, kde nie je miesto na dlhú nádrž.",
        "Rovnaká konštrukcia ako pri väčších setoch: oceľový rám, nastaviteľné nožičky, priestor na techniku pod nádržou.",
      ],
      en: [
        "Midi 40 is a 64-litre cube on a cabinet with a 40 × 40 cm footprint. It fits a corner, a desk side or a reception where a long tank would not.",
        "Same build as the larger sets: a steel frame, adjustable feet and room for equipment under the tank.",
      ],
    },
    preKoho: {
      sk: [
        "Do rohu izby alebo vedľa pracovného stola, kde je miesto na štvorec, nie na dlhú nádrž.",
        "Chovateľom, ktorí chcú väčší objem vody než pri nano nádrži, ale menší pôdorys než pri šesťdesiatke.",
        "Na recepciu, do čakárne alebo do kancelárie ako samostatný prvok.",
      ],
      en: [
        "A corner or a desk side where there is room for a square, not a long tank.",
        "Keepers who want more water than a nano tank but a smaller footprint than the 60.",
        "A reception, a waiting room or an office as a standalone piece.",
      ],
    },
    skrinka: "40 × 40 × 75 cm",
    akvarium: "40 × 40 × 40 cm",
    sklo: { sk: "Klasické sklo", en: "Classic glass" },
    objem: 64,
    prevedenia: [
      {
        id: "black-matt",
        name: "Black Matt",
        swatch: ["#17181a"],
        images: [
          "/img/sety/midi-40-black-matt-01.webp",
          "/img/sety/midi-40-black-matt-02.webp",
          "/img/sety/midi-40-black-matt-03.webp",
          "/img/sety/midi-40-black-matt-04.webp",
        ],
      },
      {
        id: "cool-white",
        name: "Cool White",
        swatch: ["#eef0f0"],
        images: [
          "/img/sety/midi-40-cool-white-01.webp",
          "/img/sety/midi-40-cool-white-02.webp",
          "/img/sety/midi-40-cool-white-03.webp",
          "/img/sety/midi-40-cool-white-04.webp",
        ],
      },
      {
        id: "antracit",
        name: "Antracit",
        swatch: ["#40454a"],
        images: [
          "/img/sety/midi-40-antracit-01.webp",
          "/img/sety/midi-40-antracit-02.webp",
          "/img/sety/midi-40-antracit-03.webp",
          "/img/sety/midi-40-antracit-04.webp",
        ],
      },
    ],
    cena: null,
    novinka: true,
  },
  {
    id: "nano-30",
    kategoria: "krevetariove",
    nazov: "Nano 30",
    podtitul: {
      sk: "Najmenší set, zmestí sa aj na stôl",
      en: "The smallest set, it even fits on a desk",
    },
    popis: {
      sk: [
        "Nano 30 je najmenší set z ponuky. Nádrž s objemom 31 litrov na skrinke s pôdorysom 30 × 30 cm sa zmestí aj tam, kde by ostatné sety prekážali.",
        "Napriek veľkosti ide o rovnakú stavbu ako pri väčších setoch, len v štíhlejšej podobe.",
      ],
      en: [
        "Nano 30 is the smallest set in the range. A 31-litre tank on a 30 × 30 cm footprint fits where the other sets would get in the way.",
        "Despite the size it is the same build as the larger sets, only slimmer.",
      ],
    },
    preKoho: {
      sk: [
        "Prvé krevetárium: malý objem, jednoduchá údržba, nízka cena vstupu.",
        "Do bytu, kde je voľných len tridsať centimetrov šírky.",
        "Ako druhá nádrž k väčšiemu akváriu, napríklad na oddelený chov.",
      ],
      en: [
        "A first shrimp tank: small volume, easy upkeep, low cost to start.",
        "A flat where only thirty centimetres of width are free.",
        "As a second tank alongside a bigger aquarium, for separate breeding.",
      ],
    },
    skrinka: "30 × 30 × 75 cm",
    akvarium: "30 × 30 × 35 cm",
    sklo: { sk: "Klasické sklo", en: "Classic glass" },
    objem: 31,
    prevedenia: [
      {
        id: "black-matt",
        name: "Black Matt",
        swatch: ["#17181a"],
        images: [
          "/img/sety/nano-30-black-matt-01.webp",
          "/img/sety/nano-30-black-matt-02.webp",
          "/img/sety/nano-30-black-matt-03.webp",
          "/img/sety/nano-30-black-matt-04.webp",
        ],
      },
      {
        id: "cool-white",
        name: "Cool White",
        swatch: ["#eef0f0"],
        images: [
          "/img/sety/nano-30-cool-white-01.webp",
          "/img/sety/nano-30-cool-white-02.webp",
          "/img/sety/nano-30-cool-white-03.webp",
          "/img/sety/nano-30-cool-white-04.webp",
        ],
      },
      {
        id: "antracit",
        name: "Antracit",
        swatch: ["#40454a"],
        images: [
          "/img/sety/nano-30-antracit-01.webp",
          "/img/sety/nano-30-antracit-02.webp",
          "/img/sety/nano-30-antracit-03.webp",
          "/img/sety/nano-30-antracit-04.webp",
        ],
      },
    ],
    cena: null,
    novinka: true,
  },
];

export function najdiSet(id: string): Set | undefined {
  return SETY.find((s) => s.id === id);
}

/** titulná fotka setu — prvý záber prvého prevedenia */
/**
 * Texty setu pre web. Keď klient v administrácii podtitul, popis alebo
 * „komu bude vyhovovať" nevyplní, web ich odvodí z parametrov setu
 * (rozmery, sklo, objem) — set tak nikdy nevyzerá nedorobene.
 */
export function textySetu(s: Set, jazyk: Jazyk): { podtitul: string; popis: string[]; preKoho: string[] } {
  const cm = (r: string) => r.replace(/\s*[x×]\s*/g, "×");
  const skr = cm(s.skrinka);
  const akv = cm(s.akvarium);
  const sklo = (s.sklo[jazyk] || s.sklo.sk || "").toLowerCase();
  const l = s.objem;
  const nahrada =
    jazyk === "en"
      ? {
          podtitul: `Cabinet and ${l}-litre aquarium in one`,
          popis: [
            `A ${akv} cm aquarium${sklo ? ` (${sklo})` : ""} on a ${skr} cm AQUAPRIME cabinet. Tank and cabinet are matched in size, so the set only needs to be placed, filled and decorated.`,
            "The cabinet comes in the decors listed below — pick a finish and see it in the photos.",
          ],
          preKoho: [
            "Anyone who wants a complete solution without matching parts",
            "Living rooms and offices where the aquarium should look like furniture",
            `A community tank with fish and plants up to ${l} litres`,
          ],
        }
      : {
          podtitul: `Skrinka a akvárium ${l} l v jednom`,
          popis: [
            `Akvárium ${akv} cm${sklo ? ` (${sklo})` : ""} na skrinke AQUAPRIME ${skr} cm. Nádrž a skrinka sú rozmerovo zladené, takže set stačí postaviť, napustiť a zariadiť.`,
            "Skrinku vyrábame v dekoroch uvedených nižšie — vyberte si prevedenie a pozrite si ho na fotkách.",
          ],
          preKoho: [
            "Tým, ktorí chcú kompletné riešenie bez skladania dielov",
            "Do obývačky alebo kancelárie, kde má akvárium pôsobiť ako nábytok",
            `Pre spoločenské akvárium s rybami aj rastlinami do ${l} litrov`,
          ],
        };
  /* výplňové hodnoty z rozpracovaného setu („dddd", „D") — kratšie než
     6 znakov nie je žiadny skutočný text, web ich berie ako nevyplnené */
  const skutocny = (t: string) => t.trim().length >= 6;
  const popis = s.popis[jazyk].filter(skutocny);
  const preKoho = s.preKoho[jazyk].filter(skutocny);
  return {
    podtitul: skutocny(s.podtitul[jazyk]) ? s.podtitul[jazyk].trim() : nahrada.podtitul,
    popis: popis.length ? popis : nahrada.popis,
    preKoho: preKoho.length ? preKoho : nahrada.preKoho,
  };
}

export function titulnaFotka(s: Set): string {
  return s.prevedenia.find((p) => !p.chyba && p.images.length)?.images[0] ?? "";
}
