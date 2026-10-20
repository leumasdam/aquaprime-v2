/**
 * Sety skrinka + akvárium, ako ich vidí web — z úložiska (po úprave
 * v administrácii), inak z kódu (sety.ts). Cache so značkou „katalog".
 */

import { unstable_cache } from "next/cache";
import { SETY, type Set } from "../sety";
import { TAG_KATALOG } from "./skrinky";
import { nacitajUlozene } from "./uloziste";

const NASADENIE = process.env.VERCEL_DEPLOYMENT_ID ?? process.env.VERCEL_GIT_COMMIT_SHA ?? "lokal";

/** Všetky vrátane rozpracovaných — pre administráciu. */
export const nacitajSetyVsetky = unstable_cache(
  async (): Promise<Set[]> => (await nacitajUlozene<Set[]>("sety")) ?? SETY,
  ["katalog-sety", NASADENIE],
  { tags: [TAG_KATALOG] },
);

/** Zverejnené sety — katalóg a detail. */
export async function nacitajSety(): Promise<Set[]> {
  return (await nacitajSetyVsetky()).filter((s) => !s.skryta);
}

export async function nacitajSet(id: string): Promise<Set | undefined> {
  return (await nacitajSety()).find((s) => s.id === id);
}
