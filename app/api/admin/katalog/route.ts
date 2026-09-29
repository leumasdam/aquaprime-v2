// Editor katalógu skriniek — čítanie a všetky zmeny.
// Chráni ho admin brána v proxy.ts; tá sem pripíše aj meno prihláseného
// (hlavička x-aq-admin), ktoré ide do histórie ako autor zmeny.

import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { SEED_PRODUKTY, type Product } from "../../../products";
import { TAG_KATALOG } from "../../../katalog/skrinky";
import {
  chybyKatalogu,
  normalizuj,
  odtlacok,
  povolenaVzorka,
  type Chyba,
} from "../../../katalog/kontrola";
import {
  nacitajSMetou,
  nacitajVerziu,
  upravKolekciu,
  uloziskoPripravene,
  ZamietnutaZmena,
} from "../../../katalog/uloziste";

export const dynamic = "force-dynamic";

function autor(request: Request): string {
  const h = request.headers.get("x-aq-admin");
  if (!h) return "Neznámy";
  try {
    return decodeURIComponent(h);
  } catch {
    return "Neznámy";
  }
}

/** Editor pracuje s čerstvými dátami priamo z úložiska, nie s cache webu. */
async function aktualnyStav() {
  const ulozene = await nacitajSMetou<Product[]>("skrinky");
  return {
    katalog: ulozene?.data ?? SEED_PRODUKTY,
    ulozene: ulozene ? { kedy: ulozene.kedy, kto: ulozene.kto } : null,
    uloziskoPripravene: uloziskoPripravene(),
  };
}

export async function GET() {
  return NextResponse.json(await aktualnyStav());
}

/**
 * Chyby, ktoré sa týkajú práve menenej skrinky, plus pravidlá celého katalógu.
 * Keby sme hlásili všetky, jedna staršia chyba inde by zablokovala každé
 * uloženie — a klient by nevedel prečo.
 */
function relevantne(chyby: Chyba[], slugy: string[]): Chyba[] {
  return chyby.filter((c) => c.slug === "" || slugy.includes(c.slug));
}

type Telo =
  | { akcia: "uloz"; povodnySlug: string | null; produkt: Product; odtlacok: string | null }
  | { akcia: "zmaz"; slug: string; odtlacok: string | null }
  | { akcia: "poradie"; slugy: string[] }
  | { akcia: "dekor"; id: string; name: string; swatch: string[] }
  | { akcia: "obnov"; verziaId: string };

export async function POST(request: Request) {
  let telo: Telo;
  try {
    telo = (await request.json()) as Telo;
  } catch {
    return NextResponse.json({ ok: false, chyba: "Neplatná požiadavka." }, { status: 400 });
  }
  const kto = autor(request);

  try {
    let obnovena: Product[] | null = null;
    if (telo.akcia === "obnov") {
      obnovena = await nacitajVerziu<Product[]>("skrinky", String(telo.verziaId ?? ""));
      if (!obnovena) throw new ZamietnutaZmena("Táto verzia sa v histórii nenašla.");
    }

    const { data, zaznam } = await upravKolekciu<Product[]>(
      "skrinky",
      (aktualne) => {
        const katalog: Product[] = structuredClone(aktualne ?? SEED_PRODUKTY);

        switch (telo.akcia) {
          case "uloz": {
            const nova = normalizuj(telo.produkt);
            const idx = telo.povodnySlug ? katalog.findIndex((p) => p.slug === telo.povodnySlug) : -1;
            if (telo.povodnySlug && idx < 0)
              throw new ZamietnutaZmena("Túto skrinku medzitým niekto zmazal. Obnovte editor.", undefined, true);
            if (idx >= 0 && telo.odtlacok && odtlacok(katalog[idx]) !== telo.odtlacok)
              throw new ZamietnutaZmena(
                "Túto skrinku medzitým upravil niekto iný. Obnovte editor, aby ste nepremazali jeho zmeny.",
                undefined,
                true,
              );
            if (idx >= 0) katalog[idx] = nova;
            else katalog.push(nova);
            const chyby = relevantne(chybyKatalogu(katalog), [nova.slug]);
            if (chyby.length) throw new ZamietnutaZmena("Skrinku sa nedá uložiť.", chyby);
            let poznamka = idx >= 0 ? `Upravená ${nova.name}` : `Pridaná ${nova.name}`;
            if (idx >= 0 && telo.povodnySlug !== nova.slug)
              poznamka += ` (adresa ${telo.povodnySlug} → ${nova.slug})`;
            return { data: katalog, poznamka };
          }

          case "zmaz": {
            const idx = katalog.findIndex((p) => p.slug === telo.slug);
            if (idx < 0) throw new ZamietnutaZmena("Táto skrinka už v katalógu nie je.", undefined, true);
            if (telo.odtlacok && odtlacok(katalog[idx]) !== telo.odtlacok)
              throw new ZamietnutaZmena("Skrinku medzitým upravil niekto iný. Obnovte editor.", undefined, true);
            const [zmazana] = katalog.splice(idx, 1);
            const chyby = relevantne(chybyKatalogu(katalog), []);
            if (chyby.length) throw new ZamietnutaZmena("Skrinku sa nedá zmazať.", chyby);
            return { data: katalog, poznamka: `Zmazaná ${zmazana.name}` };
          }

          case "poradie": {
            const slugy = Array.isArray(telo.slugy) ? telo.slugy.map(String) : [];
            const povodne = new Set(katalog.map((p) => p.slug));
            // nové poradie musí obsahovať presne tie isté skrinky — nič nesmie
            // zmiznúť ani pribudnúť (napríklad keď medzitým niekto pridal skrinku)
            if (slugy.length !== povodne.size || !slugy.every((s) => povodne.has(s)))
              throw new ZamietnutaZmena("Katalóg sa medzitým zmenil. Obnovte editor a zoraďte znova.", undefined, true);
            const podla = new Map(katalog.map((p) => [p.slug, p]));
            return { data: slugy.map((s) => podla.get(s)!), poznamka: "Zmenené poradie skriniek" };
          }

          case "dekor": {
            const id = String(telo.id ?? "");
            const name = String(telo.name ?? "").trim();
            const swatch = (Array.isArray(telo.swatch) ? telo.swatch : []).map(String).filter(Boolean).slice(0, 2);
            if (!name) throw new ZamietnutaZmena("Dekor musí mať názov.");
            if (!swatch.length || !swatch.every(povolenaVzorka))
              throw new ZamietnutaZmena("Dekor musí mať platnú vzorku farby.");
            let pocet = 0;
            for (const p of katalog)
              for (const d of p.decors)
                if (d.id === id) {
                  d.name = name;
                  d.swatch = swatch;
                  pocet++;
                }
            if (!pocet) throw new ZamietnutaZmena("Taký dekor v katalógu nie je.");
            return { data: katalog, poznamka: `Dekor ${name} upravený v ${pocet} skrinkách` };
          }

          case "obnov": {
            const obnoveny = obnovena!.map(normalizuj);
            const chyby = chybyKatalogu(obnoveny);
            if (chyby.length) throw new ZamietnutaZmena("Táto verzia neprešla kontrolou.", chyby);
            return { data: obnoveny, poznamka: "Obnovená staršia verzia" };
          }

          default:
            throw new ZamietnutaZmena("Neznáma akcia.");
        }
      },
      kto,
    );

    // web sa prekreslí pri najbližšej návšteve každej stránky — okamžite,
    // nie až po uplynutí cache (preto expire: 0, nie profil "max")
    revalidateTag(TAG_KATALOG, { expire: 0 });
    return NextResponse.json({
      ok: true,
      poznamka: zaznam.poznamka,
      katalog: data,
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
    console.error("katalog POST", e);
    return NextResponse.json(
      { ok: false, chyba: "Uloženie sa nepodarilo — úložisko neodpovedá. Skúste to znova." },
      { status: 503 },
    );
  }
}
