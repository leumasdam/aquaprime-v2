/**
 * Odoslanie dopytu na /api/dopyt so záchranou cez mailto.
 *
 * Endpoint vráti 503, kým nie je nastavený Resend. V tom prípade (a pri
 * akomkoľvek výpadku) otvoríme mailového klienta, aby zákazník neostal
 * bez cesty. Vracia true, keď správa naozaj odišla z webu.
 */

export type DopytPayload = {
  tema: string;
  meno: string;
  email: string;
  tel?: string;
  rozmer?: string;
  sprava?: string;
  odvodene?: string;
};

export async function posliDopyt(
  payload: DopytPayload,
  fallback: { predmet: string; telo: string; komu: string }
): Promise<boolean> {
  try {
    const res = await fetch("/api/dopyt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) return true;
  } catch {
    /* sieť zlyhala — ideme na mailto */
  }

  window.location.href = `mailto:${fallback.komu}?subject=${encodeURIComponent(
    fallback.predmet
  )}&body=${encodeURIComponent(fallback.telo)}`;
  return false;
}
