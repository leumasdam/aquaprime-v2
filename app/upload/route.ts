import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

/**
 * Ukladanie z vizuálneho editora (public/tools/editor.html).
 *
 * Editor je stavaný na statický web a súbory posiela na `POST /upload`,
 * čo v pôvodnom balíku obsluhoval serve.ps1. Ten tu ale použiť nevieme —
 * stránky renderuje Next za behu, statický server by servíroval zdrojáky.
 * Editor preto beží priamo na dev serveri (rovnaký pôvod, iframe funguje)
 * a zápis súborov robí táto route.
 *
 * LEN VO VÝVOJI. V produkcii je to zapisovací endpoint bez autentifikácie,
 * takže sa tvári, že neexistuje.
 */

const POVOLENE = /\.(png|jpe?g|webp|svg|css|json)$/i;
const LIMIT = 12 * 1024 * 1024;

function zakazane() {
  return new NextResponse("Not found", { status: 404 });
}

export async function POST(req: Request) {
  if (process.env.NODE_ENV !== "development") return zakazane();

  const meno = path.basename(new URL(req.url).searchParams.get("name") ?? "");
  if (!meno || !POVOLENE.test(meno)) {
    return NextResponse.json({ ok: false, error: "zla_pripona" }, { status: 400 });
  }

  const data = Buffer.from(await req.arrayBuffer());
  if (data.length > LIMIT) {
    return NextResponse.json({ ok: false, error: "prilis_velke" }, { status: 413 });
  }

  // css/json patria k overrides, obrázky medzi assety — rovnako ako serve.ps1
  const priecinok = /\.(css|json)$/i.test(meno) ? "css" : "assets";
  const ciel = path.join(process.cwd(), "public", priecinok, meno);

  await mkdir(path.dirname(ciel), { recursive: true });
  await writeFile(ciel, data);
  console.info(`editor → public/${priecinok}/${meno} (${data.length} B)`);

  return new NextResponse(`saved ${meno} ${data.length} bytes`, { status: 200 });
}

export async function GET() {
  return zakazane();
}
