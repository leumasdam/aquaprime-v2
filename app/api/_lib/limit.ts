// Jednoduchý per-IP limit pre verejné formulárové endpointy.
// Best-effort: počíta v pamäti warm inštancie (na serverless to nechytí
// všetko, ale zastaví naivné boty a skriptované dávky). Honeypot vo
// formulároch ostáva prvou obranou.

const zaznamy = new Map<string, { pocet: number; od: number }>();

export function ipZ(req: Request): string {
  return (
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "?"
  );
}

/** true = limit prekročený, request odmietnuť (429) */
export function prekrocenyLimit(kluc: string, max = 5, oknoMs = 10 * 60 * 1000): boolean {
  const teraz = Date.now();
  const z = zaznamy.get(kluc);
  if (!z || teraz - z.od > oknoMs) {
    zaznamy.set(kluc, { pocet: 1, od: teraz });
    if (zaznamy.size > 2000) {
      for (const [k, v] of zaznamy) if (teraz - v.od > oknoMs) zaznamy.delete(k);
    }
    return false;
  }
  z.pocet++;
  return z.pocet > max;
}
