// SEO report — Search Console (dopyty, stránky, vývoj) + on-site audit
// počítaný priamo z webu. GSC časť sa aktivuje po pridaní service accountu.

import { NextResponse } from "next/server";
import { googleFetch, googleNakonfigurovany } from "../_lib/google";
import { SKRYTY_PRED_VYHLADAVACMI } from "../../../site-config";
import { PRODUCTS } from "../../../products";
import { AQUARIUMS } from "../../../aquariums";

export const dynamic = "force-dynamic";

type GscRow = { keys?: string[]; clicks?: number; impressions?: number; ctr?: number; position?: number };

function onSiteAudit() {
  // fakty o webe, ktoré vieme povedať bez externých služieb
  const pocetStranok =
    8 /* hlavné sekcie */ + PRODUCTS.length + AQUARIUMS.length;
  return {
    indexovanie: !SKRYTY_PRED_VYHLADAVACMI,
    sitemapPocet: SKRYTY_PRED_VYHLADAVACMI ? 0 : pocetStranok,
    stranokSpolu: pocetStranok,
    poznamky: [
      SKRYTY_PRED_VYHLADAVACMI
        ? "Web je noindex — Google ho zámerne nevidí, kým sa nedokončí obsah. SEO dáta začnú pribúdať až po odomknutí."
        : "Web sa indexuje, sitemap je aktívna.",
      "Každý produkt aj akvárium má vlastnú URL s popisom — dobrý základ pre long-tail dopyty.",
      "Štruktúrované dáta: Organization schema je nasadená; po spustení sa oplatí doplniť Product schema s cenami.",
    ],
  };
}

export async function GET() {
  const audit = onSiteAudit();
  const site = process.env.GSC_SITE ?? "sc-domain:aquaprime.sk";

  if (!googleNakonfigurovany()) {
    return NextResponse.json({ configured: false, audit });
  }

  try {
    const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`;
    const [dopyty, stranky, dni] = (await Promise.all([
      googleFetch(url, {
        startDate: pred(28),
        endDate: pred(1),
        dimensions: ["query"],
        rowLimit: 20,
      }),
      googleFetch(url, {
        startDate: pred(28),
        endDate: pred(1),
        dimensions: ["page"],
        rowLimit: 10,
      }),
      googleFetch(url, {
        startDate: pred(28),
        endDate: pred(1),
        dimensions: ["date"],
      }),
    ])) as { rows?: GscRow[] }[];

    const map = (r: GscRow) => ({
      kluc: r.keys?.[0] ?? "",
      kliky: r.clicks ?? 0,
      zobrazenia: r.impressions ?? 0,
      ctr: r.ctr ?? 0,
      pozicia: r.position ?? 0,
    });

    return NextResponse.json({
      configured: true,
      audit,
      dopyty: (dopyty.rows ?? []).map(map),
      stranky: (stranky.rows ?? []).map(map),
      dni: (dni.rows ?? []).map(map),
    });
  } catch (e) {
    return NextResponse.json(
      { configured: true, audit, chyba: e instanceof Error ? e.message : "Neznáma chyba" },
      { status: 502 },
    );
  }
}

function pred(dni: number): string {
  const d = new Date();
  d.setDate(d.getDate() - dni);
  return d.toISOString().slice(0, 10);
}
