/** Import novej sady fotenej na 120 × 40 × 80 (3 dvierka) do všetkých rozmerov radu od 120 cm.
 *  node scripts/_tmp-sada.mjs <id dekoru> <počet záberov> [rad=standard] */
import fs from "node:fs";
import { PRODUCTS } from "../app/products.ts";
const [ID, POCET = "6", RAD = "standard", DVIERKA = "3"] = process.argv.slice(2);
/* dvojdverove sady su fotene na 100 x 40 x 80 a idu do rozmerov pod 120 cm */
const ROZMER = DVIERKA === "2" ? "100x40x80" : "120x40x80";
const ROZMER_TEXT = DVIERKA === "2" ? "100 × 40 × 80 cm" : "120 × 40 × 80 cm";
const PATRI = (p) => (DVIERKA === "2" ? p.w < 120 : p.w >= 120);
const SUBOR = "app/products.ts";
const FOTKY = Array.from({ length: Number(POCET) }, (_, i) => `/img/products/${RAD}-${ROZMER}-${ID}-${String(i + 1).padStart(2, "0")}.webp`);
/* vzorku berieme zo štandardu 100 × 40 × 80, ten má všetkých desať dekorov */
const vzor = PRODUCTS.find((p) => p.slug === "standard-100x40x80").decors.find((d) => d.id === ID);
let n = 0;
const vsetky = PRODUCTS.map((p) => {
  if (p.tier !== RAD || !PATRI(p)) return p;
  const bez = p.decors.filter((d) => d.id !== ID);
  const posledny = bez.findLastIndex((d) => !d.chyba);
  const novy = { id: ID, name: vzor.name, swatch: [...vzor.swatch], images: [...FOTKY] };
  if (p.slug !== `${RAD}-${ROZMER}`) Object.assign(novy, { inherited: true, illuFrom: "rozmer", illuSize: ROZMER_TEXT });
  n++;
  return { ...p, decors: [...bez.slice(0, posledny + 1), novy, ...bez.slice(posledny + 1)] };
});
const s = fs.readFileSync(SUBOR, "utf8");
const a = s.indexOf("export const PRODUCTS: Product[] = [");
const b = s.indexOf("\n  ];", a);
const telo = JSON.stringify(vsetky, null, 2).split("\n").map((r, i) => (i ? "  " + r : r)).join("\n");
fs.writeFileSync(SUBOR, s.slice(0, a) + "export const PRODUCTS: Product[] = " + telo + ";\n" + s.slice(b + "\n  ];\n".length), "utf8");
console.log(RAD, ID, "| rozmerov:", n, "| bez fotky zostáva:", vsetky.flatMap((p) => p.decors).filter((d) => d.chyba).length);
