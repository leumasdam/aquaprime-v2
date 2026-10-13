// Úvodné fotky radov (a ďalšie nastavenia vzhľadu) — čítanie a uloženie
// z administrácie. Chráni admin brána v proxy.ts, ktorá sem pripíše meno
// prihláseného (x-aq-admin) ako autora do histórie.

import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { TAG_KATALOG } from "../../../katalog/skrinky";
import {
  normalizujVzhlad,
  RADY_VZHLADU,
  VZHLAD_POVODNY,
  type RadVzhladu,
  type Vzhlad,
} from "../../../katalog/vzhlad";
import { povolenaFotka } from "../../../katalog/kontrola";
import {
  nacitajSMetou,
  upravKolekciu,
  uloziskoPripravene,
  ZamietnutaZmena,
} from "../../../katalog/uloziste";

export const dynamic = "force-dynamic";

function autor(request: Request): string {
  const h = request.headers.get("x-aq-admin");
  try {
    return h ? decodeURIComponent(h) : "Neznámy";
  } catch {
    return "Neznámy";
  }
}

async function stav() {
  const ulozene = await nacitajSMetou<Vzhlad>("vzhlad");
  return {
    rady: normalizujVzhlad(ulozene?.data).rady,
    povodne: VZHLAD_POVODNY,
    ulozene: ulozene ? { kedy: ulozene.kedy, kto: ulozene.kto } : null,
    uloziskoPripravene: uloziskoPripravene(),
  };
}

export async function GET() {
  return NextResponse.json(await stav());
}

export async function POST(request: Request) {
  let telo: { rady?: unknown };
  try {
    telo = (await request.json()) as { rady?: unknown };
  } catch {
    return NextResponse.json({ ok: false, chyba: "Neplatná požiadavka." }, { status: 400 });
  }
  if (!telo || typeof telo.rady !== "object" || telo.rady === null) {
    return NextResponse.json({ ok: false, chyba: "Neplatná požiadavka." }, { status: 400 });
  }

  // každá zadaná fotka musí byť z webu alebo z úložiska — cudzie adresy nie
  const rady = telo.rady as Record<string, unknown>;
  for (const rad of RADY_VZHLADU) {
    const v = rady[rad];
    if (v !== undefined && v !== null && v !== "" && (typeof v !== "string" || !povolenaFotka(v))) {
      return NextResponse.json({ ok: false, chyba: `Fotka radu ${rad} má nepovolenú adresu.` }, { status: 422 });
    }
  }

  try {
    const { data, zaznam } = await upravKolekciu<Vzhlad>(
      "vzhlad",
      (aktualne) => {
        const novy = normalizujVzhlad({ rady: { ...normalizujVzhlad(aktualne).rady, ...rady } });
        // prázdna hodnota znamená „vrátiť pôvodnú fotku"
        for (const rad of RADY_VZHLADU) if (rady[rad] === "" || rady[rad] === null) delete novy.rady[rad];
        const zmenene = (Object.keys(rady) as RadVzhladu[]).filter((r) => RADY_VZHLADU.includes(r));
        return { data: novy, poznamka: `Úvodné fotky radov: ${zmenene.join(", ") || "bez zmeny"}` };
      },
      autor(request),
    );
    revalidateTag(TAG_KATALOG, { expire: 0 });
    return NextResponse.json({ ok: true, poznamka: zaznam.poznamka, rady: data.rady, povodne: VZHLAD_POVODNY, ulozene: { kedy: zaznam.kedy, kto: zaznam.kto } });
  } catch (e) {
    if (e instanceof ZamietnutaZmena) {
      return NextResponse.json({ ok: false, chyba: e.message }, { status: e.konflikt ? 409 : 422 });
    }
    console.error("vzhlad POST", e);
    return NextResponse.json({ ok: false, chyba: "Uloženie sa nepodarilo — úložisko neodpovedá." }, { status: 503 });
  }
}
