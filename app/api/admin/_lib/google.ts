// Prístup ku Google API (GA4 Data API + Search Console) cez service account.
// Žiadna knižnica — JWT sa podpisuje priamo cez node:crypto, token sa krátko
// drží v pamäti, aby sa nevymieňal pri každom requeste.

import { createSign } from "node:crypto";

const SCOPES = [
  "https://www.googleapis.com/auth/analytics.readonly",
  "https://www.googleapis.com/auth/webmasters.readonly",
].join(" ");

let cache: { token: string; do_: number } | null = null;

function b64url(vstup: string | Buffer): string {
  return Buffer.from(vstup).toString("base64url");
}

export function googleNakonfigurovany(): boolean {
  return Boolean(process.env.GOOGLE_SA_EMAIL && process.env.GOOGLE_SA_KEY);
}

export async function googleToken(): Promise<string> {
  const email = process.env.GOOGLE_SA_EMAIL;
  // kľúč z env má \n ako literal — vrátiť mu riadky
  const kluc = process.env.GOOGLE_SA_KEY?.replace(/\\n/g, "\n");
  if (!email || !kluc) throw new Error("Service account nie je nakonfigurovaný");

  if (cache && cache.do_ > Date.now() + 60_000) return cache.token;

  const teraz = Math.floor(Date.now() / 1000);
  const hlavicka = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const telo = b64url(
    JSON.stringify({
      iss: email,
      scope: SCOPES,
      aud: "https://oauth2.googleapis.com/token",
      iat: teraz,
      exp: teraz + 3600,
    }),
  );
  const podpis = createSign("RSA-SHA256")
    .update(`${hlavicka}.${telo}`)
    .sign(kluc, "base64url");

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${hlavicka}.${telo}.${podpis}`,
    }),
  });
  if (!res.ok) throw new Error(`Google token: ${res.status} ${await res.text()}`);
  const data = (await res.json()) as { access_token: string; expires_in: number };
  cache = { token: data.access_token, do_: Date.now() + data.expires_in * 1000 };
  return data.access_token;
}

export async function googleFetch(url: string, body: unknown): Promise<unknown> {
  const token = await googleToken();
  const res = await fetch(url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Google API ${res.status}: ${await res.text()}`);
  return res.json();
}
