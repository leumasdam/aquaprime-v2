import { get } from "@vercel/blob";
import { FOTO_PREFIX } from "../../katalog/uloziste";

/**
 * Fotky nahraté v administrácii ležia v súkromnom úložisku, kam prehliadač
 * návštevníka nevidí. Táto adresa ich prečíta na serveri a pošle ďalej.
 *
 * Každá fotka má pri nahratí náhodný, nemenný názov — zmena fotky znamená
 * nový súbor, nikdy prepis starého. Vďaka tomu smie odpoveď ostať v CDN aj
 * v prehliadači navždy a funkcia sa pre danú fotku spustí len raz.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ cesta: string[] }> },
) {
  const { cesta } = await params;
  const pathname = cesta.join("/");

  // pustíme len fotky katalógu, nič iné z úložiska
  if (!pathname.startsWith(FOTO_PREFIX) || pathname.includes("..")) {
    return new Response("Not found", { status: 404 });
  }

  try {
    /* useCache: false — knižnica úložiska si inak odpovede pamätá v cache
       Nextu, vrátane 404. Jedna taká odpoveď potom ostala nalepená na adrese
       fotky aj po jej nahratí (zistené 13. 10. 2026). Cachovanie tu robí
       CDN cez s-maxage nižšie, nič ďalšie netreba. */
    const res = await get(pathname, {
      access: "private",
      useCache: false,
      ifNoneMatch: request.headers.get("if-none-match") ?? undefined,
    });
    if (!res) return new Response("Not found", { status: 404 });

    /* s-maxage je pre CDN Vercelu — samotné max-age platí len pre prehliadač
       a CDN by odpoveď neuložila. Bez neho každé zobrazenie fotky spustilo
       funkciu aj čítanie z úložiska a minulo jeho mesačný limit; 12. 10. 2026
       tak Vercel úložisko pozastavil. S ním sa fotka z úložiska prečíta raz
       na oblasť CDN a ďalej ide z cache. */
    const hlavicky = {
      "cache-control": "public, max-age=31536000, s-maxage=31536000, immutable",
      etag: res.blob.etag,
    };
    if (res.statusCode === 304) return new Response(null, { status: 304, headers: hlavicky });

    return new Response(res.stream, {
      headers: { ...hlavicky, "content-type": res.blob.contentType },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
