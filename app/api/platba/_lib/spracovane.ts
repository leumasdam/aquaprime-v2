import { put } from "@vercel/blob";

/**
 * Pamäť spracovaných udalostí zo Stripu.
 *
 * Stripe tú istú udalosť pošle znova, keď od nás nedostane odpoveď včas —
 * a pri každom opakovaní by odišli oba e-maily ešte raz. Každú udalosť si
 * preto zapíšeme do úložiska pod jej číslom; zápis bez prepisu zlyhá, keď
 * už záznam je, a to je presne signál „toto sme už vybavili".
 *
 * Bez úložiska (chýba BLOB_READ_WRITE_TOKEN) sa nič nezapisuje a každá
 * udalosť sa spracuje — radšej dva maily ako žiadny.
 */
const KOREN = process.env.VERCEL_ENV === "production" ? "platby" : "platby-test";

export async function uzSpracovana(udalostId: string): Promise<boolean> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return false;
  // id od Stripu má tvar evt_…; cudzie znaky nepustíme do cesty v úložisku
  const bezpecne = udalostId.replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 80);
  try {
    await put(`${KOREN}/${bezpecne}.json`, JSON.stringify({ kedy: new Date().toISOString() }), {
      access: "private",
      contentType: "application/json",
      allowOverwrite: false,
    });
    return false;
  } catch (e) {
    if (e instanceof Error && /already exists/i.test(e.message)) return true;
    // výpadok úložiska nesmie zastaviť potvrdenie platby
    console.warn("pamäť webhookov nedostupná", e);
    return false;
  }
}
