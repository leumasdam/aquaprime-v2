// Katalóg akvárií AQUAPRIME — nádrže na mieru z čírého float skla.
// Texty, rozmery aj fotky sú podklady od klienta (zip „Akváriá", 2026-08-10).
// Ceny zatiaľ nie sú v cenníku → všade „Cena na dopyt".

import { PRODUCTS, type Product } from "./products";

export type Aquarium = {
  slug: string;
  /** krátky názov do karty a nadpisu */
  name: string;
  dim: string;
  w: number;
  d: number;
  h: number;
  /** objem v litroch — číslo pre filter aj badge */
  liters: number;
  /** objem ako text (niektoré sú „približne") */
  vol: string;
  /** úvodný odsek — pod nadpisom na detaile, skrátený v karte */
  lead: string;
  /** ďalšie odseky popisu */
  body: string[];
  features: string[];
  /** hrúbka skla v mm — z cenníka klienta */
  glass?: number;
  /** cena vrátane DPH, napr. „199 €". Kým chýba, všade sa píše „Cena na dopyt". */
  price?: string;
  /** sklenené výstuhy — nie každý rozmer ich má */
  braces?: string;
  /** sladkovodné / aj morské */
  use: string;
  cover: string;
};

export const AQUARIUMS: Aquarium[] = [
  {
    slug: "akvarium-80x35x40",
    name: "Akvárium 80 × 35 × 40",
    dim: "80 × 35 × 40 cm",
    w: 80,
    d: 35,
    h: 40,
    liters: 112,
    vol: "112 l",
    lead: "Akvárium Aqua Prime 80 × 35 × 40 cm je navrhnuté pre akvaristov, ktorí hľadajú spojenie kvalitného spracovania, moderného dizajnu a dlhej životnosti. Každý kus je vyrábaný na mieru s dôrazom na precíznosť detailov a vysokú kvalitu použitých materiálov.",
    body: [
      "Na výrobu používame kvalitné číre float sklo, ktoré poskytuje prirodzený pohľad na podvodný svet bez rušivých optických deformácií. Jednotlivé sklenené diely sú starostlivo zlepené odolným akvaristickým silikónom, čím vzniká pevná a spoľahlivá konštrukcia vhodná na dlhodobú prevádzku.",
      "Rozmer 80 × 35 × 40 cm ponúka ideálny priestor pre vytvorenie prírodného aquascapu, spoločenského akvária alebo biotopového projektu. Vďaka väčšej hĺbke 35 cm poskytuje dostatok priestoru na kreatívne usporiadanie dekorácií, koreňov, kameňov a rastlín.",
    ],
    features: [
      "Výroba na mieru s dôrazom na kvalitu",
      "Kvalitné číre float sklo",
      "Precízne spracovanie detailov",
      "Odolné a spoľahlivé lepenie",
      "Moderný minimalistický vzhľad",
      "Vhodné pre aquascaping aj klasickú akvaristiku",
      "Stabilná a pevná konštrukcia",
    ],
    use: "sladkovodné aj morské akvárium",
    cover: "/img/akvaria/akvarium-80x35x40.webp",
  },
  {
    slug: "akvarium-100x40x50",
    name: "Akvárium 100 × 40 × 50",
    dim: "100 × 40 × 50 cm",
    w: 100,
    d: 40,
    h: 50,
    liters: 200,
    vol: "~200 l",
    lead: "Akvárium Aqua Prime 100 × 40 × 50 cm predstavuje ideálnu voľbu pre náročnejších akvaristov, ktorí požadujú dostatok priestoru pre ryby, rastliny aj kreatívny aquascaping. Vďaka objemu približne 200 litrov poskytuje stabilné prostredie a široké možnosti pri tvorbe jedinečného podvodného sveta.",
    body: [
      "Každé akvárium je vyrábané na mieru s dôrazom na precízne spracovanie, pevnosť a dlhú životnosť. Používame kvalitné číre float sklo, ktoré zabezpečuje maximálnu priehľadnosť a prirodzené podanie farieb. Starostlivé lepenie odolným akvaristickým silikónom vytvára pevnú a bezpečnú konštrukciu vhodnú na dlhodobú prevádzku.",
      "Pri tomto rozmere sú použité pozdĺžne sklenené výstuhy, ktoré zvyšujú pevnosť celej konštrukcie a zabezpečujú maximálnu stabilitu aj pri plnom objeme vody. Moderný minimalistický dizajn zároveň umožňuje, aby vynikla samotná krása akvária a jeho zariadenia.",
    ],
    features: [
      "Výroba na mieru podľa vysokých kvalitatívnych štandardov",
      "Kvalitné číre float sklo s vysokou priehľadnosťou",
      "Precízne ručné spracovanie každého kusu",
      "Odolné akvaristické lepenie pre maximálnu bezpečnosť",
      "Sklenené výstuhy pre vyššiu pevnosť konštrukcie",
      "Ideálne pre aquascaping, spoločenské aj biotopové akváriá",
      "Moderný a nadčasový vzhľad",
    ],
    braces: "sklenené pozdĺžne výstuhy",
    use: "sladkovodné akvárium",
    cover: "/img/akvaria/akvarium-100x40x50.webp",
  },
  {
    slug: "akvarium-120x50x50",
    name: "Akvárium 120 × 50 × 50",
    dim: "120 × 50 × 50 cm",
    w: 120,
    d: 50,
    h: 50,
    liters: 300,
    vol: "~300 l",
    lead: "Akvárium Aqua Prime 120 × 50 × 50 cm je navrhnuté pre akvaristov, ktorí chcú vytvoriť skutočne pôsobivý podvodný svet. S objemom približne 300 litrov poskytuje dostatok priestoru pre rozsiahle aquascapy, väčšie spoločenstvá rýb aj náročnejšie biotopové projekty.",
    body: [
      "Každé akvárium vyrábame na mieru s dôrazom na kvalitu, presnosť a dlhodobú spoľahlivosť. Použité číre float sklo zabezpečuje výbornú priehľadnosť a verné podanie farieb, vďaka čomu naplno vynikne krása rastlín, dekorácií aj samotných rýb. Precízne lepenie kvalitným akvaristickým silikónom zaručuje pevnosť a bezpečnosť celej konštrukcie.",
      "Vďaka šírke 50 cm ponúka toto akvárium výrazne viac priestoru na tvorbu hĺbky a prirodzených kompozícií. Je ideálne pre rozsiahle skalné zostavy, koreňové layouty aj profesionálne aquascapingové projekty. Sklenené výstuhy zabezpečujú vysokú pevnosť a stabilitu aj pri plnom objeme vody.",
    ],
    features: [
      "Výroba na mieru s dôrazom na každý detail",
      "Kvalitné číre float sklo s vysokou priehľadnosťou",
      "Precízne ručné spracovanie",
      "Pevná a spoľahlivá konštrukcia",
      "Sklenené výstuhy pre maximálnu bezpečnosť",
      "Ideálne pre veľké aquascapingové projekty",
      "Moderný a elegantný dizajn",
    ],
    braces: "sklenené pozdĺžne výstuhy",
    use: "sladkovodné akvárium",
    cover: "/img/akvaria/akvarium-120x50x50.webp",
  },
  {
    slug: "akvarium-150x50x50",
    name: "Akvárium 150 × 50 × 50",
    dim: "150 × 50 × 50 cm",
    w: 150,
    d: 50,
    h: 50,
    liters: 375,
    vol: "~375 l",
    lead: "Akvárium Aqua Prime 150 × 50 × 50 cm je určené pre akvaristov, ktorí chcú vytvoriť dominantný prvok interiéru a zároveň poskytnúť svojim rybám a rastlinám veľkorysý životný priestor. S objemom približne 375 litrov ponúka ideálne podmienky pre rozsiahle aquascapingové projekty, väčšie druhy rýb aj náročnejšie biotopové nádrže.",
    body: [
      "Každé akvárium je vyrábané na mieru s dôrazom na precízne spracovanie a maximálnu spoľahlivosť. Používame kvalitné číre float sklo, ktoré zabezpečuje výbornú priehľadnosť a umožňuje ničím nerušený pohľad na podvodný svet. Všetky spoje sú starostlivo lepené profesionálnym akvaristickým silikónom, čím vzniká pevná a odolná konštrukcia pripravená na dlhoročné používanie.",
      "Dĺžka 150 cm vytvára pôsobivý panoramatický efekt a poskytuje dostatok priestoru na tvorbu rozsiahlych prírodných scenérií. Šírka 50 cm zároveň umožňuje vytvárať realistickú hĺbku aquascapu a prirodzené usporiadanie dekorácií, kameňov či koreňov. Sklenené výstuhy zabezpečujú vysokú pevnosť celej nádrže a prispievajú k bezpečnej prevádzke aj pri plnom objeme vody.",
    ],
    features: [
      "Výroba na mieru podľa vysokých štandardov kvality",
      "Kvalitné číre float sklo s vysokou priehľadnosťou",
      "Precízne ručné spracovanie každého detailu",
      "Profesionálne lepenie odolným akvaristickým silikónom",
      "Sklenené výstuhy pre maximálnu pevnosť a bezpečnosť",
      "Ideálne pre veľké spoločenské akváriá a aquascaping",
      "Moderný dizajn vhodný do domácností aj reprezentatívnych priestorov",
    ],
    braces: "sklenené pozdĺžne výstuhy",
    use: "sladkovodné akvárium",
    cover: "/img/akvaria/akvarium-150x50x50.webp",
  },
  {
    slug: "akvarium-150x50x60",
    name: "Akvárium 150 × 50 × 60",
    dim: "150 × 50 × 60 cm",
    w: 150,
    d: 50,
    h: 60,
    liters: 450,
    vol: "~450 l",
    lead: "Akvárium Aqua Prime 150 × 50 × 60 cm predstavuje ideálnu voľbu pre akvaristov, ktorí hľadajú veľkorysý priestor, prémiové spracovanie a pôsobivý vizuálny efekt. Vďaka objemu približne 450 litrov poskytuje dostatok miesta na vytvorenie rozsiahlych aquascapingových kompozícií, biotopových nádrží aj chov väčších druhov rýb.",
    body: [
      "Každé akvárium Aqua Prime je vyrábané na mieru s dôrazom na precízne spracovanie a dlhodobú spoľahlivosť. Na výrobu používame kvalitné číre float sklo, ktoré zabezpečuje vysokú priehľadnosť a verné podanie farieb. Profesionálne lepenie odolným akvaristickým silikónom vytvára pevnú a bezpečnú konštrukciu pripravenú na každodenné používanie po mnoho rokov.",
      "Výška 60 cm dodáva akváriu výnimočný priestorový efekt a umožňuje vytvárať monumentálne podvodné scenérie s výraznou hĺbkou. V kombinácii s dĺžkou 150 cm vzniká reprezentatívna nádrž, ktorá sa stane dominantou každého interiéru. Sklenené výstuhy zabezpečujú maximálnu pevnosť a stabilitu celej konštrukcie aj pri plnom objeme vody.",
    ],
    features: [
      "Výroba na mieru podľa požiadaviek zákazníka",
      "Kvalitné číre float sklo s vysokou priehľadnosťou",
      "Precízne ručné spracovanie každého detailu",
      "Profesionálne lepenie odolným akvaristickým silikónom",
      "Sklenené výstuhy pre maximálnu pevnosť a bezpečnosť",
      "Ideálne pre veľké aquascapingové a biotopové projekty",
      "Elegantný a nadčasový dizajn",
    ],
    braces: "sklenené pozdĺžne výstuhy",
    use: "sladkovodné aj morské akvárium",
    cover: "/img/akvaria/akvarium-150x50x60.webp",
  },
  {
    slug: "akvarium-160x60x60",
    name: "Akvárium 160 × 60 × 60",
    dim: "160 × 60 × 60 cm",
    w: 160,
    d: 60,
    h: 60,
    liters: 576,
    vol: "~576 l",
    lead: "Akvárium Aqua Prime 160 × 60 × 60 cm patrí do kategórie veľkoobjemových nádrží určených pre skutočne náročných akvaristov. S objemom takmer 600 litrov poskytuje neobmedzený priestor na realizáciu veľkolepých aquascapingových projektov, biotopových nádrží aj chov väčších a náročnejších druhov rýb.",
    body: [
      "Každé akvárium vyrábame na mieru s dôrazom na maximálnu kvalitu, precízne spracovanie a dlhodobú spoľahlivosť. Používame kvalitné číre float sklo, ktoré zabezpečuje výbornú priehľadnosť a dokonale v ňom vyniknú všetky detaily podvodného sveta. Všetky spoje sú precízne lepené profesionálnym akvaristickým silikónom, ktorý zaručuje pevnosť a bezpečnosť celej konštrukcie aj pri takto veľkom objeme vody.",
      "Vďaka dĺžke 160 cm a šírke 60 cm ponúka akvárium výnimočný priestor na vytváranie rozsiahlych prírodných scenérií s realistickou hĺbkou. Výška 60 cm dodáva nádrži majestátny vzhľad a umožňuje vytvárať pôsobivé kompozície, ktoré sa stanú dominantou každého interiéru. Robustný systém sklenených výstuh zabezpečuje vysokú pevnosť a stabilitu aj pri plnom zaťažení.",
      "Tento model je určený pre akvaristov, ktorí nehľadajú kompromisy a požadujú profesionálnu kvalitu, veľkorysý priestor a prémiové spracovanie.",
    ],
    features: [
      "Individuálna výroba na mieru",
      "Prémiové číre float sklo",
      "Precízne ručné spracovanie každého detailu",
      "Profesionálne lepenie odolným akvaristickým silikónom",
      "Zosilnená konštrukcia so sklenenými výstuhami",
      "Ideálne pre veľké aquascapingové projekty a biotopy",
      "Reprezentatívny vzhľad vhodný do moderných interiérov",
      "Navrhnuté pre dlhodobú a bezpečnú prevádzku",
    ],
    braces: "sklenené pozdĺžne a priečne výstuhy",
    use: "sladkovodné akvárium",
    cover: "/img/akvaria/akvarium-160x60x60.webp",
  },
  {
    slug: "akvarium-200x60x60",
    name: "Akvárium 200 × 60 × 60",
    dim: "200 × 60 × 60 cm",
    w: 200,
    d: 60,
    h: 60,
    liters: 720,
    vol: "720 l",
    lead: "Akvárium Aqua Prime 200 × 60 × 60 cm predstavuje vrchol ponuky pre najnáročnejších akvaristov. S objemom 720 litrov ponúka výnimočný priestor na vytvorenie rozsiahlych prírodných scenérií, profesionálnych aquascapingových projektov a chov väčších druhov rýb. Ide o nádrž, ktorá sa stáva dominantným prvkom interiéru a poskytuje neobmedzené možnosti pri tvorbe vlastného podvodného sveta.",
    body: [
      "Každé akvárium Aqua Prime je vyrábané na mieru s dôrazom na maximálnu kvalitu spracovania, pevnosť a dlhodobú spoľahlivosť. Používame kvalitné číre float sklo, ktoré zabezpečuje krištáľovo čistý pohľad na každý detail pod hladinou. Všetky spoje sú precízne lepené profesionálnym akvaristickým silikónom, čo zaručuje vysokú pevnosť a bezpečnosť aj pri takto veľkom objeme vody.",
      "Dĺžka 200 cm poskytuje panoramatický pohľad, ktorý umožňuje vytvárať rozsiahle horské scenérie, prírodné riečne biotopy alebo veľkolepé aquascapingové kompozície s realistickou perspektívou. Šírka 60 cm vytvára dostatočný priestor na budovanie hĺbky a prirodzeného rozloženia dekorácií, zatiaľ čo výška 60 cm dodáva celej nádrži majestátny vzhľad.",
      "Pri takto veľkom akváriu je mimoriadne dôležitá pevnosť konštrukcie. Preto je model vybavený systémom sklenených pozdĺžnych a priečnych výstuh, ktoré zabezpečujú maximálnu stabilitu a bezpečnosť pri dlhodobom používaní.",
    ],
    features: [
      "Výroba na mieru podľa najvyšších štandardov kvality",
      "Prémiové číre float sklo s vysokou priehľadnosťou",
      "Precízne ručné spracovanie každého detailu",
      "Profesionálne lepenie odolným akvaristickým silikónom",
      "Zosilnená konštrukcia pre maximálnu bezpečnosť",
      "Ideálne pre veľké aquascapingové a biotopové projekty",
      "Reprezentatívny vzhľad vhodný do moderných interiérov",
      "Navrhnuté pre dlhoročnú bezproblémovú prevádzku",
    ],
    braces: "sklenené pozdĺžne a priečne výstuhy",
    use: "sladkovodné akvárium",
    cover: "/img/akvaria/akvarium-200x60x60.webp",
  },
];

export function getAquarium(slug: string): Aquarium | undefined {
  return AQUARIUMS.find((a) => a.slug === slug);
}

/** Cena nádrže ako číslo, alebo null keď ju cenník zatiaľ nemá. */
export function aquariumPriceValue(a: Aquarium): number | null {
  if (!a.price) return null;
  const n = Number(a.price.replace(/[^\d]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
}

/**
 * Skrinky z katalógu s rovnakou šírkou ako nádrž — nádrž a skrinka sa predávajú
 * ako jeden celok, tak nech je preklik priamo na detaile. Hĺbka sa môže líšiť
 * (napr. nádrž 200 × 60 vs. skrinka 200 × 50), preto sa páruje len šírka.
 */
export function matchingCabinets(a: Aquarium): Product[] {
  return PRODUCTS.filter((p) => p.w === a.w);
}
