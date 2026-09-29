"use client";

/**
 * Volania editora katalógu na server a úprava fotiek pred nahratím.
 * Všetko ide cez /api/admin/…, ktoré chráni admin brána v proxy.ts.
 */

import type { Product } from "../../products";
import type { Chyba } from "../../katalog/kontrola";

export type StavKatalogu = {
  katalog: Product[];
  ulozene: { kedy: string; kto: string } | null;
  uloziskoPripravene: boolean;
};

export type VysledokUlozenia =
  | ({ ok: true; poznamka: string } & StavKatalogu)
  | { ok: false; chyba: string; chyby: Chyba[]; konflikt: boolean };

export type Akcia =
  | { akcia: "uloz"; povodnySlug: string | null; produkt: Product; odtlacok: string | null }
  | { akcia: "zmaz"; slug: string; odtlacok: string | null }
  | { akcia: "poradie"; slugy: string[] }
  | { akcia: "dekor"; id: string; name: string; swatch: string[] }
  | { akcia: "obnov"; verziaId: string };

export type Verzia = { id: string; kedy: string; kto: string; poznamka: string };

async function json<T>(res: Response): Promise<T> {
  // brána vracia pri vypršanom prihlásení 401 — editor potom ponúkne nové prihlásenie
  if (res.status === 401) throw new Error("odhlaseny");
  return (await res.json()) as T;
}

export async function nacitaj(): Promise<StavKatalogu> {
  return json<StavKatalogu>(await fetch("/api/admin/katalog", { cache: "no-store" }));
}

export async function posli(akcia: Akcia): Promise<VysledokUlozenia> {
  try {
    const res = await fetch("/api/admin/katalog", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(akcia),
    });
    return await json<VysledokUlozenia>(res);
  } catch (e) {
    if (e instanceof Error && e.message === "odhlaseny")
      return { ok: false, chyba: "Prihlásenie vypršalo. Obnovte stránku a prihláste sa znova.", chyby: [], konflikt: false };
    return { ok: false, chyba: "Server neodpovedá. Skontrolujte pripojenie a skúste to znova.", chyby: [], konflikt: false };
  }
}

export async function historia(): Promise<Verzia[]> {
  const r = await json<{ ok: boolean; verzie: Verzia[] }>(
    await fetch("/api/admin/katalog/historia", { cache: "no-store" }),
  );
  return r.verzie ?? [];
}

/* ---------------- fotky ---------------- */

/** najdlhšia strana po zmenšení — produktové fotky na webe majú 1400 px */
const MAX_STRANA = 1600;

/**
 * Zmenší fotku v prehliadači a prevedie ju na WebP (Safari, ktorý WebP
 * neukladá, dostane JPG). Z telefónu tak namiesto 5 MB odíde okolo 200 kB
 * a server nepotrebuje platenú optimalizáciu obrázkov.
 */
export async function zmensiFotku(subor: File): Promise<Blob> {
  const bmp = await createImageBitmap(subor, { imageOrientation: "from-image" });
  const k = Math.min(1, MAX_STRANA / Math.max(bmp.width, bmp.height));
  const w = Math.max(1, Math.round(bmp.width * k));
  const h = Math.max(1, Math.round(bmp.height * k));
  const platno = document.createElement("canvas");
  platno.width = w;
  platno.height = h;
  const ctx = platno.getContext("2d");
  if (!ctx) throw new Error("Prehliadač nevie spracovať fotku.");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bmp, 0, 0, w, h);
  bmp.close();

  const ako = (typ: string, kvalita: number) =>
    new Promise<Blob | null>((r) => platno.toBlob(r, typ, kvalita));
  let blob = await ako("image/webp", 0.86);
  if (!blob || blob.type !== "image/webp") blob = await ako("image/jpeg", 0.88);
  if (!blob) throw new Error("Fotku sa nepodarilo pripraviť.");
  return blob;
}

/** Nahrá jednu fotku a vráti jej adresu na webe (/foto/…). */
export async function nahrajFotku(subor: File): Promise<string> {
  const zmensena = await zmensiFotku(subor);
  const forma = new FormData();
  forma.append("subor", zmensena, zmensena.type === "image/webp" ? "foto.webp" : "foto.jpg");
  const res = await fetch("/api/admin/katalog/foto", { method: "POST", body: forma });
  const r = await json<{ ok: boolean; src?: string; chyba?: string }>(res);
  if (!r.ok || !r.src) throw new Error(r.chyba ?? "Fotku sa nepodarilo nahrať.");
  return r.src;
}
