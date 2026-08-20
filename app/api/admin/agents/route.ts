// Posledné známe výsledky všetkých agentov (z Blob úložiska).

import { NextResponse } from "next/server";
import { AGENTI } from "../_lib/agents";
import { nacitaj, ulozisko } from "../_lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const vysledky = await Promise.all(AGENTI.map((a) => nacitaj(a)));
  return NextResponse.json({
    ulozisko: ulozisko(),
    agenti: Object.fromEntries(AGENTI.map((a, i) => [a, vysledky[i]])),
  });
}
