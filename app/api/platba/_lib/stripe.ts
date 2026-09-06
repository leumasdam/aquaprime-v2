import Stripe from "stripe";

/**
 * Spoločný Stripe klient. Kľúč zámerne nečítame na úrovni modulu do
 * konštanty — build beží aj bez neho a route má vedieť povedať „platba
 * kartou zatiaľ nie je nastavená" namiesto pádu.
 */
export function stripe(): Stripe | null {
  const kluc = process.env.STRIPE_SECRET_KEY;
  if (!kluc) return null;
  return new Stripe(kluc, { apiVersion: "2026-08-26.dahlia" });
}

/**
 * Základ pre návratové URL zo Stripu.
 *
 * Prednosť má doména, z ktorej zákazník naozaj prišiel — web je za heslom
 * a cookie platí len pre jednu doménu, takže návrat na inú by ho vyhodil
 * na prihlasovaciu obrazovku. NEXT_PUBLIC_SITE_URL to vie prebiť natvrdo.
 */
export function zaklad(req: Request): string {
  const verejna = process.env.NEXT_PUBLIC_SITE_URL;
  if (verejna) return verejna.replace(/\/$/, "");

  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (host) {
    const schema = req.headers.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
    return `${schema}://${host}`;
  }
  return new URL(req.url).origin;
}

/** Suma v centoch — Stripe neberie desatinné čísla. */
export const centy = (eur: number) => Math.round(eur * 100);
