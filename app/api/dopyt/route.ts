import { NextResponse } from "next/server";
import { ipZ, prekrocenyLimit } from "../_lib/limit";
import { mailNastaveny, posliMail } from "../_lib/mail";
import { mailHtml } from "../_lib/sablona";

/**
 * Príjem dopytov z formulárov. Odosiela dva maily — jeden do firmy s obsahom
 * dopytu, druhý zákazníkovi ako potvrdenie, že správa dorazila.
 *
 * Odosielanie rieši spoločný pomocník app/api/_lib/mail.ts (SMTP alebo
 * Resend). Kým nie je nastavené, endpoint vráti 503 a formulár na webe sa
 * prepne na otvorenie poštového klienta.
 */

const MAX = 5000;

type Payload = {
  tema?: string;
  rozmer?: string;
  meno?: string;
  email?: string;
  tel?: string;
  sprava?: string;
  odvodene?: string;
  /** honeypot — vyplní ho len robot */
  web?: string;
};

/** DOPYT_TO môže obsahovať viac adries oddelených čiarkou. */
export const prijemcovia = (v: string) =>
  v.split(/[,;]/).map((s) => s.trim()).filter(Boolean);

const esc = (s: string) =>
  s.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c]!);

export async function POST(req: Request) {
  if (prekrocenyLimit(`dopyt:${ipZ(req)}`)) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429, headers: { "retry-after": "600" } }
    );
  }

  if (!mailNastaveny()) {
    return NextResponse.json(
      { ok: false, error: "not_configured" },
      { status: 503 }
    );
  }

  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  // pasca na roboty — pole je v DOM skryté, človek ho nevyplní
  if (body.web) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const meno = (body.meno ?? "").trim().slice(0, 200);
  const email = (body.email ?? "").trim().slice(0, 200);
  if (!meno || !/.+@.+\..+/.test(email)) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  const riadky = [
    ["Téma", body.tema],
    ["Rozmer", body.rozmer],
    ["Dopočítané", body.odvodene],
    ["Meno", meno],
    ["E-mail", email],
    ["Telefón", body.tel],
  ].filter(([, v]) => v) as [string, string][];

  const sprava = (body.sprava ?? "").trim().slice(0, MAX);

  const html = mailHtml({
    nahlad: `${meno} — ${body.tema || "kontakt"}`,
    eyebrow: "Nový dopyt z webu",
    titul: meno,
    perex: body.tema ? `Téma: ${body.tema}` : undefined,
    bloky: [
      { typ: "tabulka", riadky: riadky.map(([k, v]) => [k, String(v)] as [string, string]) },
      ...(sprava ? ([{ typ: "citat", nadpis: "Správa od zákazníka", text: sprava }] as const) : []),
      { typ: "tlacidlo", text: "Odpovedať", href: `mailto:${email}` },
    ],
    zaver: "Odpoveď na tento mail ide priamo zákazníkovi.",
  });

  try {
    await posliMail({
      odpovedatNa: email,
      predmet: `Dopyt z webu — ${body.tema || "kontakt"} · ${meno}`,
      html,
    });

    // potvrdenie zákazníkovi; keď zlyhá, dopyt aj tak prešiel
    await posliMail({
      komu: email,
      predmet: "Vaša správa dorazila — AQUAPRIME",
      html: mailHtml({
        nahlad: "Máme vašu správu a ozveme sa v pracovný deň.",
        eyebrow: "Ďakujeme za správu",
        titul: `Dobrý deň${meno ? `, ${meno.split(" ")[0]}` : ""}.`,
        perex:
          "Vaša správa nám dorazila. Pozrieme si ju a ozveme sa najneskôr nasledujúci pracovný deň.",
        bloky: [
          ...(sprava ? ([{ typ: "citat", nadpis: "Čo ste nám napísali", text: sprava }] as const) : []),
          {
            typ: "obrazok",
            src: "https://aquaprime.sk/mail/skrinka.jpg",
            popis: "Skrinky staviame na zváranom oceľovom ráme 30 × 30 mm.",
          },
          { typ: "text", text: "Kým čakáte, môžete si pozrieť ponuku rozmerov a dekorov." },
          { typ: "tlacidlo", text: "Prezrieť skrinky", href: "https://aquaprime.sk/skrinky" },
        ],
        zaver: "Ak chcete niečo doplniť, stačí odpovedať na tento e-mail.",
      }),
    }).catch(() => null);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("dopyt: odoslanie zlyhalo", e);
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }
}
