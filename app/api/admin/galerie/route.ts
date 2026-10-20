// Fotky setov a akvárií — čítanie a uloženie z administrácie. Chráni admin
// brána v proxy.ts, ktorá sem pripíše meno prihláseného (x-aq-admin).

import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { AQUARIUMS } from "../../../aquariums";
import { SETY } from "../../../sety";
import { TAG_KATALOG } from "../../../katalog/skrinky";
import { MAX_FOTIEK, normalizujGalerie, type Galerie } from "../../../katalog/galerie";
import { povolenaFotka } from "../../../katalog/kontrola";
import { nacitajSMetou, upravKolekciu, uloziskoPripravene, ZamietnutaZmena } from "../../../katalog/uloziste";

export const dynamic = "force-dynamic";

function autor(request: Request): string {
  const h = request.headers.get("x-aq-admin");
  try {
    return h ? decodeURIComponent(h) : "Neznámy";
  } catch {
    return "Neznámy";
  }
}

/** Pôvodné položky z kódu — editor z nich kreslí zoznam a vie sa k nim vrátiť. */
const POVODNE = {
  sety: SETY.map((s) => ({
    id: s.id,
    nazov: s.nazov,
    podtitul: s.podtitul.sk,
    prevedenia: s.prevedenia.map((p) => ({ id: p.id, nazov: p.nazov, swatch: p.swatch, fotky: p.fotky })),
  })),
  akvaria: AQUARIUMS.map((a) => ({
    slug: a.slug,
    nazov: a.name,
    dim: a.dim,
    vol: a.vol,
    cover: a.cover,
    ilustracna: Boolean(a.coverIllustrative),
  })),
};
export type PovodneGalerie = typeof POVODNE;

async function stav() {
  const ulozene = await nacitajSMetou<Galerie>("galerie");
  return {
    galerie: normalizujGalerie(ulozene?.data),
    povodne: POVODNE,
    ulozene: ulozene ? { kedy: ulozene.kedy, kto: ulozene.kto } : null,
    uloziskoPripravene: uloziskoPripravene(),
  };
}

export async function GET() {
  return NextResponse.json(await stav());
}

type Zmeny = {
  sety?: Record<string, Record<string, string[]>>;
  akvaria?: Record<string, string[]>;
};

/** Zoznam fotiek zo zmeny: pole povolených adries; prázdne = vrátiť pôvodné. */
function overZoznam(v: unknown, kde: string): string[] | string {
  if (!Array.isArray(v)) return `${kde}: zoznam fotiek má zlý tvar.`;
  if (v.length > MAX_FOTIEK) return `${kde}: najviac ${MAX_FOTIEK} fotiek.`;
  for (const f of v) if (typeof f !== "string" || !povolenaFotka(f)) return `${kde}: fotka má nepovolenú adresu.`;
  return v as string[];
}

export async function POST(request: Request) {
  let telo: Zmeny;
  try {
    telo = (await request.json()) as Zmeny;
  } catch {
    return NextResponse.json({ ok: false, chyba: "Neplatná požiadavka." }, { status: 400 });
  }
  if (!telo || typeof telo !== "object" || (telo.sety === undefined && telo.akvaria === undefined)) {
    return NextResponse.json({ ok: false, chyba: "Neplatná požiadavka." }, { status: 400 });
  }

  // zmeny si najprv celé overíme, až potom siahneme na úložisko
  const sety: Record<string, Record<string, string[]>> = {};
  const akvaria: Record<string, string[]> = {};
  const zmenene: string[] = [];

  if (telo.sety !== undefined) {
    if (!telo.sety || typeof telo.sety !== "object") return NextResponse.json({ ok: false, chyba: "Neplatná požiadavka." }, { status: 400 });
    for (const [setId, prevedenia] of Object.entries(telo.sety)) {
      const set = SETY.find((s) => s.id === setId);
      if (!set || !prevedenia || typeof prevedenia !== "object") continue;
      for (const [pId, fotky] of Object.entries(prevedenia)) {
        const p = set.prevedenia.find((x) => x.id === pId);
        if (!p) continue;
        const r = overZoznam(fotky, `${set.nazov} ${p.nazov}`);
        if (typeof r === "string") return NextResponse.json({ ok: false, chyba: r }, { status: 422 });
        (sety[setId] ??= {})[pId] = r;
        zmenene.push(`${set.nazov} ${p.nazov}`);
      }
    }
  }
  if (telo.akvaria !== undefined) {
    if (!telo.akvaria || typeof telo.akvaria !== "object") return NextResponse.json({ ok: false, chyba: "Neplatná požiadavka." }, { status: 400 });
    for (const [slug, fotky] of Object.entries(telo.akvaria)) {
      const a = AQUARIUMS.find((x) => x.slug === slug);
      if (!a) continue;
      const r = overZoznam(fotky, a.name);
      if (typeof r === "string") return NextResponse.json({ ok: false, chyba: r }, { status: 422 });
      akvaria[slug] = r;
      zmenene.push(a.dim);
    }
  }

  try {
    const { data, zaznam } = await upravKolekciu<Galerie>(
      "galerie",
      (aktualne) => {
        const novy = normalizujGalerie(aktualne);
        for (const [setId, prevedenia] of Object.entries(sety)) {
          for (const [pId, fotky] of Object.entries(prevedenia)) {
            if (fotky.length) (novy.sety[setId] ??= {})[pId] = fotky;
            else if (novy.sety[setId]) delete novy.sety[setId][pId];
          }
          if (novy.sety[setId] && !Object.keys(novy.sety[setId]).length) delete novy.sety[setId];
        }
        for (const [slug, fotky] of Object.entries(akvaria)) {
          if (fotky.length) novy.akvaria[slug] = fotky;
          else delete novy.akvaria[slug];
        }
        return { data: normalizujGalerie(novy), poznamka: `Fotky setov a akvárií: ${zmenene.join(", ") || "bez zmeny"}` };
      },
      autor(request),
    );
    revalidateTag(TAG_KATALOG, { expire: 0 });
    return NextResponse.json({ ok: true, poznamka: zaznam.poznamka, galerie: data, ulozene: { kedy: zaznam.kedy, kto: zaznam.kto } });
  } catch (e) {
    if (e instanceof ZamietnutaZmena) {
      return NextResponse.json({ ok: false, chyba: e.message }, { status: e.konflikt ? 409 : 422 });
    }
    console.error("galerie POST", e);
    return NextResponse.json({ ok: false, chyba: "Uloženie sa nepodarilo — úložisko neodpovedá." }, { status: 503 });
  }
}
