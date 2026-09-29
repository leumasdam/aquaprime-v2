// Nahratie fotky z editora katalógu. Chráni ho admin brána v proxy.ts.
//
// Fotku zmenší a prevedie na WebP už prehliadač (editor), takže sem chodia
// súbory okolo 100–300 kB. Server ich len overí a uloží — nepoužíva
// platenú optimalizáciu obrázkov, ktorej kvóta raz zhodila fotky na webe.

import { NextResponse } from "next/server";
import { ulozFotku, uloziskoPripravene } from "../../../../katalog/uloziste";

export const dynamic = "force-dynamic";

/** strop na jeden súbor — zmenšená fotka sa doň zmestí s veľkou rezervou */
const LIMIT = 4 * 1024 * 1024;

/**
 * Formát podľa prvých bajtov, nie podľa názvu či hlavičky od prehliadača.
 * Tak sa pod príponou .webp nedá nahrať nič iné než naozajstný obrázok.
 */
function rozpoznaj(b: Uint8Array): "webp" | "jpg" | "png" | null {
  if (b.length < 12) return null;
  const ascii = (od: number, dlzka: number) => String.fromCharCode(...b.slice(od, od + dlzka));
  if (ascii(0, 4) === "RIFF" && ascii(8, 4) === "WEBP") return "webp";
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "jpg";
  if (b[0] === 0x89 && ascii(1, 3) === "PNG") return "png";
  return null;
}

export async function POST(request: Request) {
  if (!uloziskoPripravene())
    return NextResponse.json({ ok: false, chyba: "Úložisko nie je nastavené." }, { status: 503 });

  let subor: File | null = null;
  try {
    const forma = await request.formData();
    const f = forma.get("subor");
    if (f instanceof File) subor = f;
  } catch {
    /* nie je formulár */
  }
  if (!subor) return NextResponse.json({ ok: false, chyba: "Chýba súbor." }, { status: 400 });
  if (subor.size > LIMIT)
    return NextResponse.json({ ok: false, chyba: "Fotka je príliš veľká (nad 4 MB)." }, { status: 413 });

  const bajty = new Uint8Array(await subor.arrayBuffer());
  const format = rozpoznaj(bajty);
  if (!format)
    return NextResponse.json({ ok: false, chyba: "Súbor nie je fotka vo formáte WebP, JPG ani PNG." }, { status: 415 });

  try {
    const src = await ulozFotku("skrinky", new Blob([bajty]), format);
    return NextResponse.json({ ok: true, src });
  } catch (e) {
    console.error("katalog foto", e);
    return NextResponse.json({ ok: false, chyba: "Fotku sa nepodarilo uložiť. Skúste to znova." }, { status: 503 });
  }
}
