import { NextResponse } from "next/server";
import { ipZ, prekrocenyLimit } from "../_lib/limit";
import { mailNastaveny, posliMail } from "../_lib/mail";

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

  const html = `
    <div style="font-family:system-ui,-apple-system,sans-serif;font-size:14px;line-height:1.6;color:#111">
      <h2 style="font-size:16px;margin:0 0 14px">Nový dopyt z webu</h2>
      <table style="border-collapse:collapse">
        ${riadky
          .map(
            ([k, v]) =>
              `<tr><td style="padding:3px 14px 3px 0;color:#666">${k}</td><td style="padding:3px 0"><b>${esc(
                String(v)
              )}</b></td></tr>`
          )
          .join("")}
      </table>
      ${
        sprava
          ? `<p style="margin:16px 0 4px;color:#666">Správa</p><p style="white-space:pre-wrap;margin:0">${esc(
              sprava
            )}</p>`
          : ""
      }
    </div>`;

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
        html: `
          <div style="font-family:system-ui,-apple-system,sans-serif;font-size:14px;line-height:1.7;color:#111">
            <p>Dobrý deň${meno ? `, ${esc(meno.split(" ")[0])}` : ""},</p>
            <p>ďakujeme za správu — dorazila nám a ozveme sa vám v pracovný deň.</p>
            ${sprava ? `<p style="color:#666">Čo ste nám napísali:</p><p style="white-space:pre-wrap;padding-left:14px;border-left:2px solid #ddd;margin:0 0 16px">${esc(sprava)}</p>` : ""}
            <p style="color:#666;font-size:13px">AQUAPRIME · akváriá a skrinky na mieru<br/>aquaprime.sk</p>
          </div>`,
    }).catch(() => null);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("dopyt: odoslanie zlyhalo", e);
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }
}
