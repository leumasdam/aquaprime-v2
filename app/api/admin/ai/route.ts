// AI analytik — Claude si prečíta aktuálny stav webu (katalóg, zdravie,
// návštevnosť, SEO) a vráti konkrétne tipy pre majiteľa. Bez ANTHROPIC_API_KEY
// vracia configured:false a admin ukáže návod.

import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { katalogStats, zdravieWebu, integracie } from "../../../admin-data";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ configured: false });
  }

  // klient môže poslať aj čerstvé GA4/GSC dáta — keď nie sú, analytik
  // pracuje aspoň s tým, čo web vie o sebe sám
  let extra: unknown = null;
  try {
    extra = await request.json();
  } catch {
    /* prázdne telo je v poriadku */
  }

  const kontext = {
    web: "aquaprime.sk — prémiové akvarijné skrinky s oceľovým rámom a akváriá na mieru, slovenský trh",
    stavWebu: {
      katalog: katalogStats(),
      zdravie: zdravieWebu(),
      integracie: integracie(),
    },
    analytika: extra,
  };

  try {
    const client = new Anthropic();
    const response = await client.messages.create({
      model: "claude-opus-5",
      max_tokens: 4096,
      system:
        "Si e-commerce a SEO konzultant pre majiteľa malého slovenského e-shopu. " +
        "Dostaneš JSON so stavom webu. Odpovedaj po slovensky, vecne a konkrétne. " +
        "Vráť: (1) krátke zhrnutie stavu v 2–3 vetách, (2) 3–5 najdôležitejších " +
        "krokov zoradených podľa dopadu, každý s jednou vetou prečo, (3) jeden " +
        "rýchly tip týždňa. Píš pre majiteľa-neajťáka: žiadny žargón, žiadne " +
        "vymyslené čísla — opieraj sa len o dáta v JSONe. Formátuj ako Markdown " +
        "s nadpismi '## Zhrnutie', '## Ďalšie kroky', '## Tip týždňa'.",
      messages: [
        {
          role: "user",
          content: `Aktuálny stav webu:\n\`\`\`json\n${JSON.stringify(kontext, null, 1)}\n\`\`\``,
        },
      ],
    });

    if (response.stop_reason === "refusal") {
      return NextResponse.json(
        { configured: true, chyba: "Model odmietol požiadavku" },
        { status: 502 },
      );
    }

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n");

    return NextResponse.json({
      configured: true,
      report: text,
      generovane: new Date().toISOString(),
    });
  } catch (e) {
    return NextResponse.json(
      { configured: true, chyba: e instanceof Error ? e.message : "Neznáma chyba" },
      { status: 502 },
    );
  }
}
