import { NextResponse } from "next/server";
import { centy, stripe, zaklad } from "./_lib/stripe";
import { prepocitaj } from "./_lib/suma";
import { ipZ, prekrocenyLimit } from "../_lib/limit";

/**
 * Založenie platby kartou za zálohu 30 %. Objednávka už v tej chvíli
 * existuje (prišla cez /api/objednavka), tu ide len o platbu.
 *
 * Používame hostovaný Stripe Checkout, nie vlastný formulár — karta sa
 * tak nikdy nedotkne nášho servera a zákazník z ČR dostane aj svoje
 * platobné metódy, čo bol pri prevode z Česka hlavný problém.
 */

/**
 * Je platba kartou vôbec zapnutá? Košík sa pýta pred vykreslením výberu —
 * bez kľúčov nemá zmysel ponúkať dlaždicu, ktorá by po kliknutí zlyhala.
 */
export function GET() {
  return NextResponse.json(
    { karta: Boolean(process.env.STRIPE_SECRET_KEY) },
    { headers: { "cache-control": "no-store" } },
  );
}

export async function POST(req: Request) {
  if (prekrocenyLimit(`platba:${ipZ(req)}`)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const s = stripe();
  if (!s) {
    return NextResponse.json(
      { ok: false, error: "stripe_nenastaveny" },
      { status: 503 },
    );
  }

  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const cislo = String(b.cislo ?? "").trim();
  const email = String(b.email ?? "").trim();
  if (!/^AQ\d{8}-\d{4}$/.test(cislo)) {
    return NextResponse.json({ ok: false, error: "zle_cislo" }, { status: 400 });
  }

  // sumu si rátame sami z katalógu, klientovi neveríme
  const p = prepocitaj(
    (b.polozky as { slug?: unknown; druh?: unknown; ks?: unknown }[]) ?? [],
    b.dorucenie === "odber",
  );
  if (!p.ok) {
    return NextResponse.json({ ok: false, error: p.dovod }, { status: 400 });
  }

  const url = zaklad(req);

  try {
    const session = await s.checkout.sessions.create({
      mode: "payment",
      client_reference_id: cislo,
      customer_email: /.+@.+\..+/.test(email) ? email : undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: centy(p.zaloha),
            product_data: {
              name: `Záloha 30 % — objednávka ${cislo}`,
              description: `Z celkovej sumy ${p.spolu.toFixed(2)} €. Zvyšok ${p.doplatok.toFixed(
                2,
              )} € zaplatíte pri prevzatí.`,
            },
          },
        },
      ],
      // do webhooku aj do Stripe dashboardu, nech je platba spárovateľná
      metadata: {
        cislo,
        spolu: p.spolu.toFixed(2),
        zaloha: p.zaloha.toFixed(2),
        doplatok: p.doplatok.toFixed(2),
      },
      payment_intent_data: {
        description: `AQUAPRIME ${cislo} — záloha 30 %`,
        metadata: { cislo },
      },
      locale: "sk",
      success_url: `${url}/kosik/platba?stav=ok&cislo=${encodeURIComponent(cislo)}`,
      cancel_url: `${url}/kosik/platba?stav=zrusena&cislo=${encodeURIComponent(cislo)}`,
    });

    if (!session.url) throw new Error("Stripe nevrátil URL");
    return NextResponse.json({ ok: true, url: session.url, zaloha: p.zaloha });
  } catch (e) {
    console.error(`PLATBA ${cislo} — Stripe session zlyhala`, e);
    return NextResponse.json({ ok: false, error: "stripe_zlyhal" }, { status: 502 });
  }
}
