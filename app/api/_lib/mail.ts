import nodemailer from "nodemailer";
import { Resend } from "resend";

/**
 * Jedno miesto, cez ktoré odchádzajú všetky maily z webu — dopyty,
 * objednávky aj oznámenia o platbe.
 *
 * Primárne sa posiela cez SMTP (Gmail s heslom aplikácie), lebo to nevyžaduje
 * overenú doménu ani platený plán. Keď je namiesto toho nastavený kľúč
 * Resendu, použije sa ten. Bez oboch endpointy vrátia 503 a formuláre
 * na webe sa prepnú na otvorenie poštového klienta.
 *
 * Premenné prostredia (Vercel → Settings → Environment Variables):
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS   prístup k SMTP
 *   RESEND_API_KEY                               alternatíva k SMTP
 *   DOPYT_TO    kam chodia správy; viac adries oddelí čiarka
 *   DOPYT_FROM  odosielateľ (pri Gmaile musí byť totožný s SMTP_USER)
 */

export type Sprava = {
  predmet: string;
  html: string;
  /** neuvedené = ide na DOPYT_TO */
  komu?: string | string[];
  odpovedatNa?: string;
};

/** DOPYT_TO môže obsahovať viac adries oddelených čiarkou. */
export const prijemcovia = (v: string) =>
  v.split(/[,;]/).map((s) => s.trim()).filter(Boolean);

export function mailNastaveny() {
  const to = process.env.DOPYT_TO;
  const from = process.env.DOPYT_FROM;
  const smtp = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;
  return Boolean(to && from && (smtp || process.env.RESEND_API_KEY));
}

export async function posliMail(s: Sprava) {
  const to = process.env.DOPYT_TO;
  const from = process.env.DOPYT_FROM;
  if (!to || !from) throw new Error("mail nie je nastavený");
  const komu = s.komu ? (Array.isArray(s.komu) ? s.komu : [s.komu]) : prijemcovia(to);

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (host && user && pass) {
    const port = Number(process.env.SMTP_PORT || 465);
    const prenos = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
    await prenos.sendMail({
      from,
      to: komu,
      replyTo: s.odpovedatNa,
      subject: s.predmet,
      html: s.html,
    });
    return;
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("mail nie je nastavený");
  const { error } = await new Resend(key).emails.send({
    from,
    to: komu,
    replyTo: s.odpovedatNa,
    subject: s.predmet,
    html: s.html,
  });
  if (error) throw new Error(error.message);
}
