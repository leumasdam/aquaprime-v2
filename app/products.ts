export type Product = {
  slug: string;
  name: string;
  mod: "linea" | "prestige" | "signature";
  collection: string;
  dim: string;
  load: string;
  vol: string;
  price: string;
  desc: string;
};

export const PRODUCTS: Product[] = [
  {
    slug: "linea-100",
    name: "LINEA 100",
    mod: "linea",
    collection: "LINEA",
    dim: "100 × 45 × 70 cm",
    load: "350 kg",
    vol: "~250 l",
    price: "od 690 €",
    desc: "Minimalistická skrinka s čistými líniami a decentným povrchom. Ideálna do menších priestorov, kde má akvárium pôsobiť ľahko a elegantne.",
  },
  {
    slug: "linea-120",
    name: "LINEA 120",
    mod: "linea",
    collection: "LINEA",
    dim: "120 × 50 × 70 cm",
    load: "450 kg",
    vol: "~360 l",
    price: "od 790 €",
    desc: "Univerzálny rozmer pre obývačku. Oceľový rám zvládne aj plne osadené akvárium bez kompromisu v stabilite.",
  },
  {
    slug: "prestige-120",
    name: "PRESTIGE 120",
    mod: "prestige",
    collection: "PRESTIGE",
    dim: "120 × 50 × 75 cm",
    load: "550 kg",
    vol: "~400 l",
    price: "od 1 090 €",
    desc: "Prémiová kolekcia s bohatším dekorom a prepracovanými detailmi hrán. Pre náročnejší interiér a väčšie objemy.",
  },
  {
    slug: "prestige-150",
    name: "PRESTIGE 150",
    mod: "prestige",
    collection: "PRESTIGE",
    dim: "150 × 55 × 75 cm",
    load: "650 kg",
    vol: "~560 l",
    price: "od 1 390 €",
    desc: "Veľkorysá skrinka pre rozmernejšie nádrže. Vyšší rám, väčší úložný priestor a istota pri vysokej hmotnosti.",
  },
  {
    slug: "signature-150",
    name: "SIGNATURE 150",
    mod: "signature",
    collection: "SIGNATURE",
    dim: "150 × 60 × 80 cm",
    load: "770 kg",
    vol: "~650 l",
    price: "od 1 890 €",
    desc: "Vlajková kolekcia s LED akcentom a top vyhotovením. Maximálna nosnosť a výnimočný dizajn pre reprezentatívne priestory.",
  },
  {
    slug: "signature-180",
    name: "SIGNATURE 180",
    mod: "signature",
    collection: "SIGNATURE",
    dim: "180 × 60 × 80 cm",
    load: "770 kg",
    vol: "~800 l",
    price: "na dopyt",
    desc: "Najväčšia konfigurácia v ponuke. Riešenie na mieru pre extrémne objemy, kde rozhoduje každý detail konštrukcie.",
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
