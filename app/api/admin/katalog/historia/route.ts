// Zoznam uložených verzií katalógu — na návrat k staršej. Chráni ho admin
// brána v proxy.ts. Samotný návrat robí POST /api/admin/katalog (akcia "obnov").

import { NextResponse } from "next/server";
import { historia, type Kolekcia } from "../../../../katalog/uloziste";

const KOLEKCIE: Kolekcia[] = ["skrinky", "akvaria", "sety"];

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const k = new URL(request.url).searchParams.get("kolekcia") ?? "skrinky";
  if (!KOLEKCIE.includes(k as Kolekcia)) return NextResponse.json({ ok: false, verzie: [] }, { status: 400 });
  try {
    return NextResponse.json({ ok: true, verzie: await historia(k as Kolekcia) });
  } catch {
    return NextResponse.json({ ok: false, verzie: [] }, { status: 503 });
  }
}
