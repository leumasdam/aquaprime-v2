// Trvalé úložisko výsledkov agentov — Vercel Blob (privátny store
// aquaprime-admin). Bez BLOB_READ_WRITE_TOKEN funguje všetko ďalej,
// len sa výsledky nedajú uložiť medzi behmi.

import { put, get } from "@vercel/blob";

export type VysledokAgenta<T = unknown> = {
  agent: string;
  bezal: string;
  trvanieMs: number;
  ok: boolean;
  chyba?: string;
  data: T | null;
};

export function ulozisko(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export async function uloz(agent: string, vysledok: VysledokAgenta): Promise<void> {
  if (!ulozisko()) return;
  await put(`agents/${agent}.json`, JSON.stringify(vysledok), {
    access: "private",
    allowOverwrite: true,
    contentType: "application/json",
  });
}

export async function nacitaj(agent: string): Promise<VysledokAgenta | null> {
  if (!ulozisko()) return null;
  try {
    const res = await get(`agents/${agent}.json`, { access: "private", useCache: false });
    if (!res || !("stream" in res) || !res.stream) return null;
    const text = await new Response(res.stream).text();
    return JSON.parse(text) as VysledokAgenta;
  } catch {
    return null;
  }
}
