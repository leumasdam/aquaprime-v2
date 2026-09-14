/** Import novej trojdverovej sady ŠTANDARD (fotené na 120 × 40 × 80) do všetkých rozmerov od 120 cm. */
import fs from "node:fs";
import { PRODUCTS } from "../app/products.ts";
const ID = process.argv[2];
const SUBOR = "app/products.ts";
const FOTKY = Array.from({ length: 6 }, (_, i) => `/img/products/standard-120x40x80-${ID}-${String(i + 1).padStart(2, "0")}.webp`);
const vzor = PRODUCTS.find((p) => p.slug === "standard-100x40x80").decors.find((d) => d.id === ID);
let n = 0;
const vsetky = PRODUCTS.map((p) => {
  if (p.tier !== "standard" || p.w < 120) return p;
  const bez = p.decors.filter((d) => d.id !== ID);
  const posledny = bez.findLastIndex((d) => !d.chyba);
  const novy = { id: ID, name: vzor.name, swatch: [...vzor.swatch], images: [...FOTKY] };
  if (p.slug !== "standard-120x40x80") Object.assign(novy, { inherited: true, illuFrom: "rozmer", illuSize: "120 × 40 × 80 cm" });
  n++;
  return { ...p, decors: [...bez.slice(0, posledny + 1), novy, ...bez.slice(posledny + 1)] };
});
const s = fs.readFileSync(SUBOR, "utf8");
const a = s.indexOf("export const PRODUCTS: Product[] = [");
const b = s.indexOf("\n  ];", a);
const telo = JSON.stringify(vsetky, null, 2).split("\n").map((r, i) => (i ? "  " + r : r)).join("\n");
fs.writeFileSync(SUBOR, s.slice(0, a) + "export const PRODUCTS: Product[] = " + telo + ";\n" + s.slice(b + "\n  ];\n".length), "utf8");
console.log(ID, "| rozmerov:", n, "| bez fotky zostáva:", vsetky.flatMap((p) => p.decors).filter((d) => d.chyba).length);
