import { NextResponse } from "next/server";
import { Resend } from "resend";
import { stripe } from "../_lib/stripe";

/**
 * Potvrdenie platby od Stripu. Chodí zo servera Stripu, nie z prehliadača,
 * takže ho proxy.ts púšťa cez zámok webu — pravosť overuje podpis nižšie.
 *
 * Nespoliehame sa na návrat zákazníka na success_url: ten môže zavrieť
 * okno a platba je aj tak zaplatená. Zdroj pravdy je tento webhook.
 */

export const dynamic = "force-dynamic";

const eur = (n: number) =>
  n.toLocaleString("sk-SK", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";

export async function POST(req: Request) {
  const s = stripe();
  const tajomstvo = process.env.STRIPE_WEBHOOK_SECRET;
  if (!s || !tajomstvo) {
    return NextResponse.json({ ok: false, error: "stripe_nenastaveny" }, { status: 503 });
  }

  const podpis = req.headers.get("stripe-signature");
  if (!podpis) return NextResponse.json({ ok: false }, { status: 400 });

  // podpis sa overuje nad surovým telom — parsovanie by ho rozbilo
  const telo = await req.text();

  let udalost;
  try {
    udalost = await s.webhooks.constructEventAsync(telo, podpis, tajomstvo);
  } catch (e) {
    console.warn("Stripe webhook — neplatný podpis", e);
    return NextResponse.json({ ok: false, error: "zly_podpis" }, { status: 400 });
  }

  if (udalost.type !== "checkout.session.completed") {
    // ostatné typy nás nezaujímajú, ale musíme na ne odpovedať 200,
    // inak ich Stripe skúša znova
    return NextResponse.json({ ok: true, ignorovane: udalost.type });
  }

  const session = udalost.data.object;
  const cislo = session.client_reference_id ?? session.metadata?.cislo ?? "?";
  const zaplatene = (session.amount_total ?? 0) / 100;
  const doplatok = Number(session.metadata?.doplatok ?? 0);
  const email = session.customer_details?.email ?? session.customer_email ?? null;

  console.info(`PLATBA ${cislo} — záloha ${eur(zaplatene)} zaplatená kartou`);

  const key = process.env.RESEND_API_KEY;
  const to = process.env.DOPYT_TO;
  const from = process.env.DOPYT_FROM;
  if (!key || !to || !from) {
    // platba prešla, len ju nemáme ako oznámiť — 200, nech Stripe neopakuje
    return NextResponse.json({ ok: true, mailom: false });
  }

  const resend = new Resend(key);
  await resend.emails
    .send({
      from,
      to: [to],
      subject: `Zaplatená záloha ${eur(zaplatene)} — objednávka ${cislo}`,
      html: `<div style="font-family:system-ui,-apple-system,sans-serif;font-size:14px;line-height:1.6">
          <p><b>Objednávka ${cislo}</b> — záloha <b>${eur(zaplatene)}</b> je zaplatená kartou.</p>
          ${doplatok ? `<p>Doplatok pri prevzatí: <b>${eur(doplatok)}</b></p>` : ""}
          ${email ? `<p>Zákazník: ${email}</p>` : ""}
          <p style="color:#666;font-size:13px">Výrobu možno spustiť.</p>
        </div>`,
    })
    .catch((e) => console.error("Resend (interné) zlyhal", e));

  if (email) {
    await resend.emails
      .send({
        from,
        to: [email],
        subject: `Záloha prijatá — objednávka ${cislo}`,
        html: `<div style="font-family:system-ui,-apple-system,sans-serif;font-size:14px;line-height:1.7;color:#111">
            <p>Dobrý deň,</p>
            <p>zálohu <b>${eur(zaplatene)}</b> k objednávke <b>${cislo}</b> sme prijali.
            Výrobu spúšťame a ozveme sa s termínom.</p>
            ${doplatok ? `<p>Zvyšok <b>${eur(doplatok)}</b> zaplatíte až pri prevzatí.</p>` : ""}
            <p style="color:#666;font-size:13px">AQUAPRIME · aquaprime.sk</p>
          </div>`,
      })
      .catch((e) => console.error("Resend (zákazník) zlyhal", e));
  }

  return NextResponse.json({ ok: true, mailom: true });
}
