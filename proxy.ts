import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Zámok celého webu, kým sa obsah dokončí.
 *
 * Bez správnej cookie sa nedostane dnu nikto, ani kto pozná adresu. Heslo sa
 * berie z premennej SITE_PASSWORD; keď nie je nastavená, zámok je vypnutý a
 * web beží normálne (aby sa nedal omylom zamknúť sám pred sebou).
 *
 * Vpustenie: /?heslo=… alebo formulár nižšie. Cookie platí 30 dní.
 */

const COOKIE = "aq_vstup";

function hashuj(s: string): string {
  // stačí na odlíšenie cookie od hesla — nie je to ochrana tajomstva,
  // heslo pozná aj tak každý, komu ho pošleme
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return `v1.${Math.abs(h).toString(36)}`;
}

function prihlasovaciaStranka(chyba: boolean) {
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
  <form method="GET">
    <input type="password" name="heslo" placeholder="Heslo" autofocus aria-label="Heslo">
    <button type="submit">VSTÚPIŤ</button>
  </form>
  ${chyba ? '<p class="err">Nesprávne heslo, skúste to znova.</p>' : ""}
</div></body></html>`;
}

export function proxy(request: NextRequest) {
  const heslo = process.env.SITE_PASSWORD;
  if (!heslo) return NextResponse.next();

  const ocakavane = hashuj(heslo);
  const { searchParams, pathname } = request.nextUrl;

  // už vpustený
  if (request.cookies.get(COOKIE)?.value === ocakavane) {
    return NextResponse.next();
  }

  // pokus o zadanie hesla
  const zadane = searchParams.get("heslo");
  if (zadane !== null) {
    if (zadane === heslo) {
      const cielova = request.nextUrl.clone();
      cielova.searchParams.delete("heslo");
      const res = NextResponse.redirect(cielova);
      res.cookies.set(COOKIE, ocakavane, {
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
      return res;
    }
    return new NextResponse(prihlasovaciaStranka(true), {
      status: 401,
      headers: { "content-type": "text/html; charset=utf-8", "x-robots-tag": "noindex" },
    });
  }

  // robots.txt necháme prejsť, nech aj tak zakazuje indexovanie
  if (pathname === "/robots.txt") return NextResponse.next();

  return new NextResponse(prihlasovaciaStranka(false), {
    status: 401,
    headers: { "content-type": "text/html; charset=utf-8", "x-robots-tag": "noindex" },
  });
}

export const config = {
  // statické súbory a favicon musia prejsť, inak sa nenačíta ani prihlásenie
  matcher: ["/((?!_next/static|_next/image|icon.svg|favicon.ico).*)"],
};
