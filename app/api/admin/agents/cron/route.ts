// Denný cron (vercel.json) — spustí všetkých agentov po rade.
// Autorizuje sa hlavičkou Bearer CRON_SECRET, ktorú púšťa proxy.ts.

import { NextResponse } from "next/server";
import { spustiVsetkych } from "../../_lib/agents";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET() {
  const vysledky = await spustiVsetkych();
  return NextResponse.json({
    bezalo: vysledky.length,
    ok: vysledky.filter((v) => v.ok).map((v) => v.agent),
    zlyhalo: vysledky.filter((v) => !v.ok).map((v) => `${v.agent}: ${v.chyba}`),
  });
}
