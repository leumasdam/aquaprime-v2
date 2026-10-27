/**
 * Súhlas s cookies — jedno miesto, kde sa číta a zapisuje.
 *
 * Ukladá sa do localStorage aj do cookie (kvôli serveru a dlhšej životnosti).
 * Kým návštevník nerozhodne, meracie skripty sa vôbec nenačítajú.
 */
export type Suhlas = {
  analyticke: boolean;
  marketingove: boolean;
  /** kedy sa rozhodol — po 13 mesiacoch sa spýtame znova */
  kedy: number;
};

export const KLUC = "aq-cookies";
/** 13 mesiacov — strop podľa usmernení k GDPR (EDPB/CNIL); Chrome drží cookie max. 400 dní */
const PLATNOST = 395 * 24 * 60 * 60;
/** o zmene súhlasu sa dozvie lišta aj meranie cez túto udalosť */
export const UDALOST = "aq-suhlas";

/** záloha z cookie — keď prehliadač localStorage vymazal alebo zakázal */
function zCookie(): Suhlas | null {
  const m = document.cookie.match(new RegExp(`(?:^|; )${KLUC}=([01])([01])`));
  if (!m) return null;
  /* cookie má platnosť sama; dátum rozhodnutia nenesie, preto „teraz" */
  return { analyticke: m[1] === "1", marketingove: m[2] === "1", kedy: Date.now() };
}

export function precitaj(): Suhlas | null {
  if (typeof window === "undefined") return null;
  try {
    const z = window.localStorage.getItem(KLUC);
    if (!z) return zCookie();
    const s = JSON.parse(z) as Suhlas;
    if (typeof s?.analyticke !== "boolean") return zCookie();
    // rozhodnutie staršie ako 13 mesiacov sa pýtame znova
    if (!s.kedy || Date.now() - s.kedy > PLATNOST * 1000) return null;
    return s;
  } catch {
    return zCookie();
  }
}

export function zapis(s: Omit<Suhlas, "kedy">) {
  const cely: Suhlas = { ...s, kedy: Date.now() };
  try {
    window.localStorage.setItem(KLUC, JSON.stringify(cely));
  } catch {
    /* súkromné okno — stačí cookie */
  }
  document.cookie = `${KLUC}=${cely.analyticke ? 1 : 0}${cely.marketingove ? 1 : 0}; path=/; max-age=${PLATNOST}; samesite=lax`;
  window.dispatchEvent(new CustomEvent(UDALOST, { detail: cely }));
  /* Google Consent Mode — keď je nasadený GTM alebo GA4 */
  const w = window as unknown as { gtag?: (...a: unknown[]) => void; dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  const gtag = w.gtag ?? ((...a: unknown[]) => w.dataLayer!.push(a));
  gtag("consent", "update", {
    analytics_storage: cely.analyticke ? "granted" : "denied",
    ad_storage: cely.marketingove ? "granted" : "denied",
    ad_user_data: cely.marketingove ? "granted" : "denied",
    ad_personalization: cely.marketingove ? "granted" : "denied",
  });
}
