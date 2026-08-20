import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Brány webu — zámok pre verejnosť (SITE_PASSWORD) a administrácia
 * (ADMIN_PASSWORD). Session je podpísaná HMAC-SHA256 cookie s expiráciou
 * (kľúč sa odvádza z hesla — zmena hesla zneplatní všetky sessions).
 * Neúspešné pokusy o heslo sa rátajú per-IP (best-effort v pamäti inštancie).
 *
 * Vpustenie: POST formulár na prihlasovacej stránke, alebo ?heslo=…
 * v odkaze (na zdieľanie klientovi). Cookie: web 30 dní, admin 14 dní.
 */

const COOKIE = "aq_vstup";
const ADMIN_COOKIE = "aq_admin";

/* ---------------- podpísané sessions (Web Crypto, edge-safe) ---------------- */

const enc = new TextEncoder();

function b64url(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function hmacKluc(tajomstvo: string): Promise<CryptoKey> {
  const surovina = await crypto.subtle.digest("SHA-256", enc.encode(tajomstvo));
  return crypto.subtle.importKey("raw", surovina, { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
    "verify",
  ]);
}

async function vytvorSession(tajomstvo: string, dni: number): Promise<string> {
  const payload = b64url(enc.encode(JSON.stringify({ exp: Date.now() + dni * 86_400_000 })).buffer as ArrayBuffer);
  const kluc = await hmacKluc(tajomstvo);
  const podpis = await crypto.subtle.sign("HMAC", kluc, enc.encode(payload));
  return `${payload}.${b64url(podpis)}`;
}

async function overSession(tajomstvo: string, cookie: string | undefined): Promise<boolean> {
  if (!cookie) return false;
  const [payload, podpis] = cookie.split(".");
  if (!payload || !podpis) return false;
  try {
    const kluc = await hmacKluc(tajomstvo);
    const raw = Uint8Array.from(
      atob(podpis.replace(/-/g, "+").replace(/_/g, "/")),
      (c) => c.charCodeAt(0),
    );
    const plati = await crypto.subtle.verify("HMAC", kluc, raw, enc.encode(payload));
    if (!plati) return false;
    const data = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/"))) as { exp?: number };
    return typeof data.exp === "number" && data.exp > Date.now();
  } catch {
    return false;
  }
}

/** porovnanie hesiel cez digesty — bez skratovania po prvom rozdielnom znaku */
async function rovnakeHeslo(zadane: string, spravne: string): Promise<boolean> {
  const [a, b] = await Promise.all([
    crypto.subtle.digest("SHA-256", enc.encode(zadane)),
    crypto.subtle.digest("SHA-256", enc.encode(spravne)),
  ]);
  const ua = new Uint8Array(a);
  const ub = new Uint8Array(b);
  let rozdiel = 0;
  for (let i = 0; i < ua.length; i++) rozdiel |= ua[i] ^ ub[i];
  return rozdiel === 0;
}

/* ---------------- limit pokusov (best-effort, pamäť inštancie) ---------------- */

const pokusy = new Map<string, { pocet: number; od: number }>();
const LIMIT_POKUSOV = 8;
const LIMIT_OKNO = 10 * 60 * 1000;

function ip(request: NextRequest): string {
  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "?"
  );
}

function prekroceny(kluc: string): boolean {
  const teraz = Date.now();
  const z = pokusy.get(kluc);
  if (!z || teraz - z.od > LIMIT_OKNO) return false;
  return z.pocet >= LIMIT_POKUSOV;
}

function zapisPokus(kluc: string): void {
  const teraz = Date.now();
  const z = pokusy.get(kluc);
  if (!z || teraz - z.od > LIMIT_OKNO) pokusy.set(kluc, { pocet: 1, od: teraz });
  else z.pocet++;
  // nech mapa nerastie donekonečna
  if (pokusy.size > 2000) {
    for (const [k, v] of pokusy) if (teraz - v.od > LIMIT_OKNO) pokusy.delete(k);
  }
}

/* ---------------- prihlasovacie stránky ---------------- */

function prihlasovaciaStranka(chyba: boolean, limitovany = false) {
  return `<!doctype html>
<html lang="sk"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>AQUAPRIME</title>
<style>
  *{box-sizing:border-box}
  body{margin:0;min-height:100vh;display:grid;place-items:center;background:#050606;
    color:#e2e5e7;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;padding:24px}
  .box{width:100%;max-width:360px;text-align:center}
  .mark{width:54px;height:54px;margin:0 auto 26px;color:#f4f1eb}
  h1{font-size:1.05rem;font-weight:600;letter-spacing:.02em;margin:0 0 8px}
  p{font-size:.8125rem;line-height:1.6;color:rgba(226,229,231,.55);margin:0 0 26px}
  form{display:flex;gap:8px}
  input{flex:1;padding:13px 15px;border-radius:9px;border:1px solid rgba(255,255,255,.14);
    background:rgba(255,255,255,.04);color:#fff;font-size:.875rem;font-family:inherit}
  input:focus{outline:none;border-color:#47c7e8}
  button{padding:13px 20px;border:0;border-radius:9px;background:#47c7e8;color:#04222b;
    font-weight:700;font-size:.75rem;letter-spacing:.1em;cursor:pointer;font-family:inherit}
  .err{margin-top:14px;font-size:.75rem;color:#e8a047}
</style></head>
<body><div class="box">
  <svg class="mark" viewBox="0 0 409.33 393.77" fill="currentColor" aria-hidden="true">
    <path d="M52.71,263.25l19.43-40c-19.55-9.75-42.7-11.05-61.84-1.53,20.64,9.05,30.52,23.91,42.41,41.53Z"/>
    <path d="M372.65,320.48c-17.3-17.36-38.18-23.96-61.41-22.43-14.46,4.52-29.08,8.63-43.29,15.12-19.69,7.49-40.17,8.17-60.37,2.97-12.77-1.76-24.7-1.12-33.66,8.94,14.51,12.26,26.88,23.7,41.52,33.98,30.41,19.57,65.18,18.13,93.7-.59,34.05-17.35,65.57-14.62,96.14,10.37-4.46-20.65-18.81-35.99-32.62-48.36Z"/>
    <path d="M270.04,281.67l-15.59-17.62c-31.61-38.64-79.35-57.1-129.16-48.04,12.44-17.86,30.53-25.3,49.86-31l47.35-89.41c12.95,16.52,17.93,35.4,30.09,51.84l67.53,134.55c23.64,1.88,43.27,11.36,62.19,25.29,10.78,6.26,14.74,19.78,27.02,25.68-2.32-13.48-12.4-22-15.78-34.34l-82.17-167.07-10.85-21.44-46.43-92.87c-2.35-7.32-5.99-14.11-13.23-17.23-15.2.94-29.19-.56-44.5,1.52l-37.59,73.71-83.84,165.52-37.2,74.88c-13.58,25.29-26.48,49.88-37.75,77.18,19.32,3.3,35.84-2.04,50.79-14.34,23.73-18.19,46.87-35.58,73.86-48.86,26.48-14.06,54.24-22.87,83.87-26.24,22.61-1.72,41.86-9.61,61.52-21.72ZM205.93,262.51c0-4.74,3.84-8.59,8.59-8.59s8.59,3.84,8.59,8.59-3.84,8.59-8.59,8.59-8.59-3.84-8.59-8.59Z"/>
  </svg>
  <h1>Web sa pripravuje</h1>
  <p>Stránka zatiaľ nie je verejná. Ak máte prístupové heslo, zadajte ho.</p>
  <form method="POST">
    <input type="password" name="heslo" placeholder="Heslo" autofocus aria-label="Heslo" ${limitovany ? "disabled" : ""}>
    <button type="submit" ${limitovany ? "disabled" : ""}>VSTÚPIŤ</button>
  </form>
  ${limitovany ? '<p class="err">Priveľa pokusov — skúste to o pár minút.</p>' : chyba ? '<p class="err">Nesprávne heslo, skúste to znova.</p>' : ""}
</div></body></html>`;
}

function adminStranka(chyba: boolean, limitovany = false) {
  return prihlasovaciaStranka(chyba, limitovany)
    .replace("Web sa pripravuje", "Administrácia")
    .replace(
      "Stránka zatiaľ nie je verejná. Ak máte prístupové heslo, zadajte ho.",
      "Prístup len pre majiteľa. Zadajte administrátorské heslo.",
    );
}

/* ---------------- spoločná logika brány ---------------- */

async function zadaneHeslo(request: NextRequest): Promise<string | null> {
  // POST formulár má prednosť; GET ?heslo= ostáva pre zdieľané odkazy
  if (request.method === "POST") {
    try {
      const forma = await request.formData();
      const h = forma.get("heslo");
      if (typeof h === "string") return h;
    } catch {
      /* nie je formulár */
    }
  }
  return request.nextUrl.searchParams.get("heslo");
}

function presmerujBezHesla(request: NextRequest): NextResponse {
  const cielova = request.nextUrl.clone();
  cielova.searchParams.delete("heslo");
  // 303 → po POSTe sa cieľ načíta GETom
  return NextResponse.redirect(cielova, 303);
}

type Brana = {
  heslo: string;
  cookie: string;
  tajomstvo: string;
  dni: number;
  stranka: (chyba: boolean, limitovany?: boolean) => string;
  jeApi: boolean;
};

async function brana(request: NextRequest, b: Brana): Promise<NextResponse | null> {
  if (await overSession(b.tajomstvo, request.cookies.get(b.cookie)?.value)) return null;

  const adresa = ip(request);
  const limitKluc = `${b.cookie}:${adresa}`;

  const zadane = await zadaneHeslo(request);
  if (zadane !== null) {
    if (prekroceny(limitKluc)) {
      return new NextResponse(b.stranka(false, true), {
        status: 429,
        headers: {
          "content-type": "text/html; charset=utf-8",
          "x-robots-tag": "noindex",
          "retry-after": "600",
        },
      });
    }
    if (await rovnakeHeslo(zadane, b.heslo)) {
      const res = presmerujBezHesla(request);
      res.cookies.set(b.cookie, await vytvorSession(b.tajomstvo, b.dni), {
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        path: "/",
        maxAge: 60 * 60 * 24 * b.dni,
      });
      return res;
    }
    zapisPokus(limitKluc);
    return new NextResponse(b.stranka(true, prekroceny(limitKluc)), {
      status: 401,
      headers: { "content-type": "text/html; charset=utf-8", "x-robots-tag": "noindex" },
    });
  }

  if (b.jeApi) return NextResponse.json({ chyba: "Neprihlásený" }, { status: 401 });
  return new NextResponse(b.stranka(false), {
    status: 401,
    headers: { "content-type": "text/html; charset=utf-8", "x-robots-tag": "noindex" },
  });
}

/* ---------------- vstupný bod ---------------- */

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // administrácia — vlastná, prísnejšia brána; bez ADMIN_PASSWORD sa nedá vojsť
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const jeApi = pathname.startsWith("/api/admin");

    // denný cron od Vercelu sa hlási hlavičkou, nie cookie
    const cron = process.env.CRON_SECRET;
    if (cron && request.headers.get("authorization") === `Bearer ${cron}`) {
      return NextResponse.next();
    }

    const heslo = process.env.ADMIN_PASSWORD;
    if (!heslo) {
      return jeApi
        ? NextResponse.json({ chyba: "ADMIN_PASSWORD nie je nastavené" }, { status: 503 })
        : new NextResponse(
            "<h1 style='font-family:system-ui;padding:40px'>Administrácia nie je nakonfigurovaná (ADMIN_PASSWORD chýba).</h1>",
            { status: 503, headers: { "content-type": "text/html; charset=utf-8" } },
          );
    }

    const stop = await brana(request, {
      heslo,
      cookie: ADMIN_COOKIE,
      tajomstvo: `admin|${heslo}`,
      dni: 14,
      stranka: adminStranka,
      jeApi,
    });
    return stop ?? NextResponse.next();
  }

  const heslo = process.env.SITE_PASSWORD;
  if (!heslo) return NextResponse.next();

  // platná admin session púšťa aj cez zámok webu — majiteľ sa loguje len raz
  const adminHeslo = process.env.ADMIN_PASSWORD;
  if (
    adminHeslo &&
    (await overSession(`admin|${adminHeslo}`, request.cookies.get(ADMIN_COOKIE)?.value))
  ) {
    return NextResponse.next();
  }

  // robots.txt necháme prejsť, nech aj tak zakazuje indexovanie
  if (pathname === "/robots.txt") return NextResponse.next();

  const stop = await brana(request, {
    heslo,
    cookie: COOKIE,
    tajomstvo: `vstup|${heslo}`,
    dni: 30,
    stranka: prihlasovaciaStranka,
    jeApi: pathname.startsWith("/api/"),
  });
  return stop ?? NextResponse.next();
}

export const config = {
  // statické súbory a favicon musia prejsť, inak sa nenačíta ani prihlásenie
  matcher: ["/((?!_next/static|_next/image|icon.svg|favicon.ico).*)"],
};
