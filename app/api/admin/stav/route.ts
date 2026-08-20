// Stav webu pre administráciu — katalóg, zdravie, integrácie.
// Chráni sa v proxy.ts (admin brána), tu sa už len počíta.

import { NextResponse } from "next/server";
import { katalogStats, integracie, zdravieWebu } from "../../../admin-data";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({
    katalog: katalogStats(),
    zdravie: zdravieWebu(),
    integracie: integracie(),
    generovane: new Date().toISOString(),
  });
}
