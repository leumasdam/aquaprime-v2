// Zoznam uložených verzií katalógu — na návrat k staršej. Chráni ho admin
// brána v proxy.ts. Samotný návrat robí POST /api/admin/katalog (akcia "obnov").

import { NextResponse } from "next/server";
import { historia } from "../../../../katalog/uloziste";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json({ ok: true, verzie: await historia("skrinky") });
  } catch {
    return NextResponse.json({ ok: false, verzie: [] }, { status: 503 });
  }
}
