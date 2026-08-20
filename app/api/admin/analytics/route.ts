// Návštevnosť z GA4 Data API (posledných 28 dní). Bez kľúčov vracia
// configured:false a admin ukáže návod na zapojenie — žiadne vymyslené čísla.

import { NextResponse } from "next/server";
import { googleFetch, googleNakonfigurovany } from "../_lib/google";

export const dynamic = "force-dynamic";

type Riadok = { dimensionValues?: { value: string }[]; metricValues?: { value: string }[] };
type Report = { rows?: Riadok[] };

export async function GET() {
  const property = process.env.GA4_PROPERTY_ID;
  if (!property || !googleNakonfigurovany()) {
    return NextResponse.json({ configured: false });
  }

  try {
    const data = (await googleFetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${property}:batchRunReports`,
      {
        requests: [
          {
            dateRanges: [{ startDate: "28daysAgo", endDate: "today" }],
            dimensions: [{ name: "date" }],
            metrics: [{ name: "activeUsers" }, { name: "sessions" }, { name: "screenPageViews" }],
            orderBys: [{ dimension: { dimensionName: "date" } }],
          },
          {
            dateRanges: [{ startDate: "28daysAgo", endDate: "today" }],
            dimensions: [{ name: "pagePath" }],
            metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
            orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
            limit: 10,
          },
          {
            dateRanges: [{ startDate: "28daysAgo", endDate: "today" }],
            dimensions: [{ name: "sessionDefaultChannelGroup" }],
            metrics: [{ name: "sessions" }],
            orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
          },
        ],
      },
    )) as { reports?: Report[] };

    const [dni, stranky, kanaly] = data.reports ?? [];
    const cislo = (r: Riadok, i: number) => Number(r.metricValues?.[i]?.value ?? 0);
    const dim = (r: Riadok, i = 0) => r.dimensionValues?.[i]?.value ?? "";

    return NextResponse.json({
      configured: true,
      dni: (dni?.rows ?? []).map((r) => ({
        datum: dim(r),
        pouzivatelia: cislo(r, 0),
        navstevy: cislo(r, 1),
        zobrazenia: cislo(r, 2),
      })),
      stranky: (stranky?.rows ?? []).map((r) => ({
        cesta: dim(r),
        zobrazenia: cislo(r, 0),
        pouzivatelia: cislo(r, 1),
      })),
      kanaly: (kanaly?.rows ?? []).map((r) => ({ kanal: dim(r), navstevy: cislo(r, 0) })),
    });
  } catch (e) {
    return NextResponse.json(
      { configured: true, chyba: e instanceof Error ? e.message : "Neznáma chyba" },
      { status: 502 },
    );
  }
}
