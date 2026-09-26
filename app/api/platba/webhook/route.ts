import { NextResponse } from "next/server";
import { mailNastaveny, posliMail } from "../../_lib/mail";
import { mailHtml } from "../../_lib/sablona";
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

  if (!mailNastaveny()) {
    // platba prešla, len ju nemáme ako oznámiť — 200, nech Stripe neopakuje
    return NextResponse.json({ ok: true, mailom: false });
  }

  await posliMail({
    predmet: `Zaplatená záloha ${eur(zaplatene)} — objednávka ${cislo}`,
    html: mailHtml({
      nahlad: `Objednávka ${cislo} — záloha zaplatená kartou`,
      eyebrow: "Platba prijatá",
      titul: `Záloha k objednávke ${cislo} je zaplatená`,
      bloky: [
        { typ: "suma", popis: "Zaplatená záloha", hodnota: eur(zaplatene) },
        {
          typ: "tabulka",
          riadky: [
            ["Objednávka", cislo],
            ...(doplatok ? ([["Doplatok pri prevzatí", eur(doplatok)]] as [string, string][]) : []),
            ...(email ? ([["Zákazník", email]] as [string, string][]) : []),
            ["Spôsob", "Platobná karta (Stripe)"],
          ],
        },
        { typ: "text", text: "Výrobu možno spustiť." },
      ],
    }),
  }).catch((e) => console.error("interné oznámenie o platbe zlyhalo", e));

  if (email) {
    await posliMail({
      komu: email,
      predmet: `Záloha prijatá — objednávka ${cislo}`,
      html: mailHtml({
        nahlad: `Zálohu ${eur(zaplatene)} sme prijali, výrobu spúšťame.`,
        eyebrow: `Objednávka ${cislo}`,
        titul: "Zálohu sme prijali.",
        perex: "Výrobu spúšťame a ozveme sa vám s termínom dodania.",
        bloky: [
          { typ: "suma", popis: "Zaplatená záloha", hodnota: eur(zaplatene) },
          ...(doplatok
            ? ([
                {
                  typ: "tabulka",
                  riadky: [["Zvyšok pri prevzatí", eur(doplatok)]] as [string, string][],
                },
              ] as const)
            : []),
          {
            typ: "obrazok",
            src: "https://aquaprime.sk/mail/skrinka.jpg",
            popis: "Zváraný oceľový rám 30 × 30 mm a opláštenie vo zvolenom dekore.",
          },
        ],
        zaver: "Na tento e-mail môžete kedykoľvek odpovedať.",
      }),
    }).catch((e) => console.error("potvrdenie zákazníkovi zlyhalo", e));
  }

  return NextResponse.json({ ok: true, mailom: true });
}
