// Stav webu pre administráciu — katalóg, zdravie, integrácie.
// Chráni sa v proxy.ts (admin brána), tu sa už len počíta.

import { NextResponse } from "next/server";
import { katalogStats, integracie, zdravieWebu } from "../../../admin-data";
import { nacitajSkrinky } from "../../../katalog/skrinky";

export const dynamic = "force-dynamic";

export async function GET() {
  const katalog = await nacitajSkrinky();
  return NextResponse.json({
    katalog: katalogStats(katalog),
    zdravie: zdravieWebu(katalog),
    integracie: integracie(),
    generovane: new Date().toISOString(),
  });
}
