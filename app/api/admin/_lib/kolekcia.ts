/**
 * Spoločný editor pre kolekcie položiek s vlastnou adresou (akváriá, sety) —
 * rovnaký protokol, aký má editor skriniek v /api/admin/katalog:
 *
 *   GET  → { polozky, ulozene, uloziskoPripravene }
 *   POST → { akcia: "uloz" | "zmaz" | "poradie" | "obnov", … }
 *
 * Každé uloženie prejde kontrolou (len zmenená položka + pravidlá celku),
 * podmieneným zápisom (odtlačok proti súbežnej úprave) a zneplatní cache webu.
 */

import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { TAG_KATALOG } from "../../../katalog/skrinky";
import { odtlacok, type Chyba } from "../../../katalog/kontrola";
import {
  nacitajSMetou,
  nacitajVerziu,
  upravKolekciu,
  uloziskoPripravene,
  ZamietnutaZmena,
  type Kolekcia,
} from "../../../katalog/uloziste";

export type Popis<T> = {
  kolekcia: Kolekcia;
  seed: T[];
  /** jedno slovo do histórie a chybových hlášok, napr. „akvárium" */
  nazovVeci: string;
  id: (t: T) => string;
  meno: (t: T) => string;
  normalizuj: (t: T) => T;
  chyby: (zoznam: T[]) => Chyba[];
};

function autor(request: Request): string {
  const h = request.headers.get("x-aq-admin");
  try {
    return h ? decodeURIComponent(h) : "Neznámy";
  } catch {
    return "Neznámy";
  }
}

type Telo<T> =
  | { akcia: "uloz"; povodneId: string | null; polozka: T; odtlacok: string | null }
  | { akcia: "zmaz"; id: string; odtlacok: string | null }
  | { akcia: "poradie"; idcka: string[] }
  | { akcia: "obnov"; verziaId: string };

export function vytvorHandlery<T>(popis: Popis<T>) {
  const { kolekcia, seed, nazovVeci, id, meno, normalizuj, chyby } = popis;

  async function stav() {
    const ulozene = await nacitajSMetou<T[]>(kolekcia);
    return {
      polozky: ulozene?.data ?? seed,
      ulozene: ulozene ? { kedy: ulozene.kedy, kto: ulozene.kto } : null,
      uloziskoPripravene: uloziskoPripravene(),
    };
  }

  const relevantne = (vsetky: Chyba[], idcka: string[]) => vsetky.filter((c) => c.slug === "" || idcka.includes(c.slug));

  async function GET() {
    return NextResponse.json(await stav());
  }

  async function POST(request: Request) {
    let telo: Telo<T>;
    try {
      telo = (await request.json()) as Telo<T>;
    } catch {
      return NextResponse.json({ ok: false, chyba: "Neplatná požiadavka." }, { status: 400 });
    }
    const jeObjekt = (x: unknown): x is Record<string, unknown> => typeof x === "object" && x !== null;
    const platne =
      jeObjekt(telo) &&
      ((telo.akcia === "uloz" && jeObjekt(telo.polozka)) ||
        (telo.akcia === "zmaz" && typeof telo.id === "string") ||
        (telo.akcia === "poradie" && Array.isArray(telo.idcka)) ||
        (telo.akcia === "obnov" && typeof telo.verziaId === "string"));
    if (!platne) return NextResponse.json({ ok: false, chyba: "Neplatná požiadavka." }, { status: 400 });

    try {
      let obnovena: T[] | null = null;
      if (telo.akcia === "obnov") {
        obnovena = await nacitajVerziu<T[]>(kolekcia, telo.verziaId);
        if (!obnovena) throw new ZamietnutaZmena("Táto verzia sa v histórii nenašla.");
      }

      const { data, zaznam } = await upravKolekciu<T[]>(
        kolekcia,
        (aktualne) => {
          const zoznam: T[] = structuredClone(aktualne ?? seed);
          switch (telo.akcia) {
            case "uloz": {
              const nova = normalizuj(telo.polozka);
              const idx = telo.povodneId ? zoznam.findIndex((p) => id(p) === telo.povodneId) : -1;
              if (telo.povodneId && idx < 0)
                throw new ZamietnutaZmena(`Toto ${nazovVeci} medzitým niekto zmazal. Obnovte editor.`, undefined, true);
              if (idx >= 0 && telo.odtlacok && odtlacok(zoznam[idx]) !== telo.odtlacok)
                throw new ZamietnutaZmena(
                  "Túto položku medzitým upravil niekto iný. Obnovte editor, aby ste nepremazali jeho zmeny.",
                  undefined,
                  true,
                );
              if (idx >= 0) zoznam[idx] = nova;
              else zoznam.push(nova);
              const ch = relevantne(chyby(zoznam), [id(nova)]);
              if (ch.length) throw new ZamietnutaZmena("Nedá sa uložiť.", ch);
              let poznamka = idx >= 0 ? `Upravené ${meno(nova)}` : `Pridané ${meno(nova)}`;
              if (idx >= 0 && telo.povodneId !== id(nova)) poznamka += ` (adresa ${telo.povodneId} → ${id(nova)})`;
              return { data: zoznam, poznamka };
            }
            case "zmaz": {
              const idx = zoznam.findIndex((p) => id(p) === telo.id);
              if (idx < 0) throw new ZamietnutaZmena("Táto položka už v zozname nie je.", undefined, true);
              if (telo.odtlacok && odtlacok(zoznam[idx]) !== telo.odtlacok)
                throw new ZamietnutaZmena("Položku medzitým upravil niekto iný. Obnovte editor.", undefined, true);
              const [zmazana] = zoznam.splice(idx, 1);
              const ch = relevantne(chyby(zoznam), []);
              if (ch.length) throw new ZamietnutaZmena("Nedá sa zmazať.", ch);
              return { data: zoznam, poznamka: `Zmazané ${meno(zmazana)}` };
            }
            case "poradie": {
              const idcka = telo.idcka.map(String);
              const povodne = new Set(zoznam.map(id));
              if (idcka.length !== povodne.size || !idcka.every((s) => povodne.has(s)))
                throw new ZamietnutaZmena("Zoznam sa medzitým zmenil. Obnovte editor a zoraďte znova.", undefined, true);
              const podla = new Map(zoznam.map((p) => [id(p), p]));
              return { data: idcka.map((s) => podla.get(s)!), poznamka: "Zmenené poradie" };
            }
            case "obnov": {
              const obnoveny = obnovena!.map(normalizuj);
              const ch = chyby(obnoveny);
              if (ch.length) throw new ZamietnutaZmena("Táto verzia neprešla kontrolou.", ch);
              return { data: obnoveny, poznamka: "Obnovená staršia verzia" };
            }
            default:
              throw new ZamietnutaZmena("Neznáma akcia.");
          }
        },
        autor(request),
      );

      revalidateTag(TAG_KATALOG, { expire: 0 });
      return NextResponse.json({
        ok: true,
        poznamka: zaznam.poznamka,
        polozky: data,
        ulozene: { kedy: zaznam.kedy, kto: zaznam.kto },
        uloziskoPripravene: true,
      });
    } catch (e) {
      if (e instanceof ZamietnutaZmena) {
        return NextResponse.json(
          { ok: false, chyba: e.message, chyby: e.detail ?? [], konflikt: e.konflikt },
          { status: e.konflikt ? 409 : 422 },
        );
      }
      console.error(`${kolekcia} POST`, e);
      return NextResponse.json(
        { ok: false, chyba: "Uloženie sa nepodarilo — úložisko neodpovedá. Skúste to znova." },
        { status: 503 },
      );
    }
  }

  return { GET, POST };
}
