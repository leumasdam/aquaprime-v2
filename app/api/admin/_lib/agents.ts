// SEO agenti — samostatné joby, ktoré beží denný cron (a dajú sa spustiť
// aj ručne z adminu). Každý vráti výsledok v jednotnej obálke a uloží ho
// do Blob úložiska, takže admin vždy ukazuje posledný známy stav.
//
//  prieskumnik — živé návrhy z Google Autocomplete (funguje bez kľúčov)
//  volumes     — reálne dopyty + trend zo Search Console (potrebuje SA)
//  strateg     — Claude prehodnotí plán fráz podľa čerstvých dát (API kľúč)

import Anthropic from "@anthropic-ai/sdk";
import { PLAN_FRAZ } from "../../../admin/keywords";
import { googleFetch, googleNakonfigurovany } from "./google";
import { uloz, type VysledokAgenta } from "./store";

export const AGENTI = ["prieskumnik", "volumes", "strateg"] as const;
export type AgentId = (typeof AGENTI)[number];

/* ---------------- prieskumník: Google Autocomplete ---------------- */

export type Navrh = { fraza: string; skore: number; vPlane: boolean };

async function autocomplete(q: string): Promise<string[]> {
  const url = `https://suggestqueries.google.com/complete/search?client=firefox&hl=sk&gl=sk&q=${encodeURIComponent(q)}`;
  const res = await fetch(url, {
    headers: { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
  });
  if (!res.ok) return [];
  try {
    const data = (await res.json()) as [string, string[]];
    return Array.isArray(data?.[1]) ? data[1] : [];
  } catch {
    return [];
  }
}

async function prieskumnik(): Promise<{ navrhy: Navrh[]; dotazov: number }> {
  // dotazy: každá fráza z plánu + abecedné rozšírenie hlavných koreňov
  const korene = ["akvárium", "skrinka pod akvárium", "akvárium na mieru"];
  const abeceda = "abcdefghijklmnopqrstuvz".split("");
  const dotazy = [
    ...PLAN_FRAZ.map((f) => f.fraza),
    ...korene.flatMap((k) => abeceda.map((p) => `${k} ${p}`)),
  ];

  const skore = new Map<string, number>();
  let hotovo = 0;

  // mierna súbežnosť, nech beh netrvá minúty a Google nás nezarezáva
  const DAVKA = 4;
  for (let i = 0; i < dotazy.length; i += DAVKA) {
    const vysledky = await Promise.all(dotazy.slice(i, i + DAVKA).map(autocomplete));
    for (const navrhy of vysledky) {
      hotovo++;
      navrhy.forEach((n, idx) => {
        const kluc = n.toLowerCase().trim();
        skore.set(kluc, (skore.get(kluc) ?? 0) + (10 - Math.min(idx, 9)));
      });
    }
  }

  const vPlane = new Set(PLAN_FRAZ.map((f) => f.fraza.toLowerCase()));
  const navrhy = [...skore.entries()]
    .map(([fraza, s]) => ({ fraza, skore: s, vPlane: vPlane.has(fraza) }))
    .sort((a, b) => b.skore - a.skore)
    .slice(0, 60);

  return { navrhy, dotazov: hotovo };
}

/* ---------------- volumes: Search Console + trend ---------------- */

type GscRow = { keys?: string[]; clicks?: number; impressions?: number; position?: number };

export type VolumeRiadok = {
  fraza: string;
  zobrazenia: number;
  kliky: number;
  pozicia: number;
  /** zmena zobrazení oproti predchádzajúcim 28 dňom (absolútne) */
  zmena: number | null;
};

function den(pred: number): string {
  const d = new Date();
  d.setDate(d.getDate() - pred);
  return d.toISOString().slice(0, 10);
}

async function volumes(): Promise<{ riadky: VolumeRiadok[] }> {
  if (!googleNakonfigurovany()) {
    throw new Error("Search Console nie je zapojená (GOOGLE_SA_EMAIL / GOOGLE_SA_KEY)");
  }
  const site = process.env.GSC_SITE ?? "sc-domain:aquaprime.sk";
  const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`;

  const dopyt = (start: string, koniec: string) =>
    googleFetch(url, { startDate: start, endDate: koniec, dimensions: ["query"], rowLimit: 250 }) as Promise<{ rows?: GscRow[] }>;

  const [teraz, predtym] = await Promise.all([dopyt(den(28), den(1)), dopyt(den(56), den(29))]);

  const stare = new Map(
    (predtym.rows ?? []).map((r) => [r.keys?.[0] ?? "", r.impressions ?? 0]),
  );

  const riadky = (teraz.rows ?? []).map((r) => {
    const fraza = r.keys?.[0] ?? "";
    const zobr = r.impressions ?? 0;
    const pred = stare.get(fraza);
    return {
      fraza,
      zobrazenia: zobr,
      kliky: r.clicks ?? 0,
      pozicia: r.position ?? 0,
      zmena: pred === undefined ? null : zobr - pred,
    };
  });

  return { riadky };
}

/* ---------------- stratég: Claude nad čerstvými dátami ---------------- */

async function strateg(
  navrhy: Navrh[] | null,
  volumeRiadky: VolumeRiadok[] | null,
): Promise<{ report: string }> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("Claude API nie je zapojené (ANTHROPIC_API_KEY)");
  }
  const client = new Anthropic();
  const response = await client.messages.create({
    model: "claude-opus-5",
    max_tokens: 4096,
    system:
      "Si SEO stratég pre aquaprime.sk — slovenský e-shop s prémiovými akvarijnými " +
      "skrinkami (oceľový rám, nosnosť 770 kg, jediný na trhu) a akváriami na mieru. " +
      "Dostaneš aktuálny plán fráz, čerstvé návrhy z Google Autocomplete a prípadne " +
      "reálne dopyty zo Search Console. Odpovedaj po slovensky, Markdown. Štruktúra: " +
      "'## Čo hovoria dáta' (2–3 vety), '## Frázy na pridanie do plánu' (max 5, každá " +
      "s cieľovou stránkou a jednou vetou prečo — vyberaj len z dodaných návrhov, nič " +
      "si nevymýšľaj), '## Frázy na vyradenie alebo zmenu' (ak treba), '## Obsah na " +
      "tento týždeň' (1 konkrétna téma článku s osnovou 3–4 bodov). Ber do úvahy " +
      "nákupný zámer — e-shop živí predaj, nie návštevnosť.",
    messages: [
      {
        role: "user",
        content:
          `Plán fráz:\n${JSON.stringify(PLAN_FRAZ, null, 1)}\n\n` +
          `Návrhy z Autocomplete (skóre = sila výskytu):\n${JSON.stringify(navrhy?.slice(0, 40) ?? "agent prieskumník ešte nebežal", null, 1)}\n\n` +
          `Reálne dopyty zo Search Console:\n${JSON.stringify(volumeRiadky?.slice(0, 50) ?? "Search Console nie je zapojená", null, 1)}`,
      },
    ],
  });

  if (response.stop_reason === "refusal") throw new Error("Model odmietol požiadavku");

  const report = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");
  return { report };
}

/* ---------------- spúšťač ---------------- */

async function spusti<T>(agent: AgentId, fn: () => Promise<T>): Promise<VysledokAgenta<T>> {
  const zaciatok = Date.now();
  let vysledok: VysledokAgenta<T>;
  try {
    vysledok = {
      agent,
      bezal: new Date().toISOString(),
      trvanieMs: 0,
      ok: true,
      data: await fn(),
    };
  } catch (e) {
    vysledok = {
      agent,
      bezal: new Date().toISOString(),
      trvanieMs: 0,
      ok: false,
      chyba: e instanceof Error ? e.message : "Neznáma chyba",
      data: null,
    };
  }
  vysledok.trvanieMs = Date.now() - zaciatok;
  await uloz(agent, vysledok);
  return vysledok;
}

export async function spustiAgenta(
  agent: AgentId,
  ctx?: { navrhy?: Navrh[] | null; volumes?: VolumeRiadok[] | null },
): Promise<VysledokAgenta> {
  switch (agent) {
    case "prieskumnik":
      return spusti(agent, prieskumnik);
    case "volumes":
      return spusti(agent, volumes);
    case "strateg":
      return spusti(agent, () => strateg(ctx?.navrhy ?? null, ctx?.volumes ?? null));
  }
}

/** Denný beh: prieskumník → volumes → stratég (dostane čerstvé výstupy oboch). */
export async function spustiVsetkych(): Promise<VysledokAgenta[]> {
  const p = await spustiAgenta("prieskumnik");
  const v = await spustiAgenta("volumes");
  const s = await spustiAgenta("strateg", {
    navrhy: p.ok ? (p.data as { navrhy: Navrh[] }).navrhy : null,
    volumes: v.ok ? (v.data as { riadky: VolumeRiadok[] }).riadky : null,
  });
  return [p, v, s];
}
