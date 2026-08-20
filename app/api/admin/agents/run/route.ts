// Ručné spustenie jedného agenta z adminu.

import { NextResponse } from "next/server";
import { AGENTI, spustiAgenta, type AgentId, type Navrh, type VolumeRiadok } from "../../_lib/agents";
import { nacitaj } from "../../_lib/store";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(request: Request) {
  let agent: string | undefined;
  try {
    agent = ((await request.json()) as { agent?: string }).agent;
  } catch {
    /* prázdne telo */
  }
  if (!agent || !AGENTI.includes(agent as AgentId)) {
    return NextResponse.json({ chyba: "Neznámy agent" }, { status: 400 });
  }

  // stratég dostane posledné uložené výstupy ostatných agentov
  if (agent === "strateg") {
    const [p, v] = await Promise.all([nacitaj("prieskumnik"), nacitaj("volumes")]);
    const vysledok = await spustiAgenta("strateg", {
      navrhy: p?.ok ? (p.data as { navrhy: Navrh[] }).navrhy : null,
      volumes: v?.ok ? (v.data as { riadky: VolumeRiadok[] }).riadky : null,
    });
    return NextResponse.json(vysledok);
  }

  return NextResponse.json(await spustiAgenta(agent as AgentId));
}
