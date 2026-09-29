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
    const res = await get(pathname, {
      access: "private",
      ifNoneMatch: request.headers.get("if-none-match") ?? undefined,
    });
    if (!res) return new Response("Not found", { status: 404 });

    const hlavicky = {
      "cache-control": "public, max-age=31536000, immutable",
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
