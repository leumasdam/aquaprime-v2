"use client";

/**
 * Administrácia AQUAPRIME — dashboard pre majiteľa.
 *
 * Princíp: nič sa nefejkuje. Sekcie postavené na dátach webu sú živé vždy;
 * sekcie závislé od externých služieb (GA4, Search Console, AI) sa samé
 * zapnú, keď pribudnú kľúče vo Verceli — dovtedy ukazujú návod.
 * SEO agenti bežia denným cronom a výsledky sa držia v Blob úložisku.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { AquaFishMark } from "../brand";
import { PLAN_FRAZ } from "./keywords";

/* ---------- typy podľa API ---------- */

type Stav = {
  katalog: {
    skrinky: { pocet: number; rady: Record<string, number>; cenaOd: number; cenaDo: number; sLed: number };
    akvaria: { pocet: number; sVlastnymTextom: number; cenaOd: number; cenaDo: number };
    fotky: { variantovSpolu: number; vlastne: number; fotoInehoRozmeru: number; fotoInehoRadu: number; naDofotenie: string[] };
  };
  zdravie: { id: string; ok: boolean; titul: string; detail: string }[];
  integracie: Record<string, boolean>;
  generovane: string;
};

type Analytics = {
  configured: boolean;
  chyba?: string;
  dni?: { datum: string; pouzivatelia: number; navstevy: number; zobrazenia: number }[];
  stranky?: { cesta: string; zobrazenia: number; pouzivatelia: number }[];
  kanaly?: { kanal: string; navstevy: number }[];
};

type SeoRow = { kluc: string; kliky: number; zobrazenia: number; ctr: number; pozicia: number };
type Seo = {
  configured: boolean;
  chyba?: string;
  audit: { indexovanie: boolean; sitemapPocet: number; stranokSpolu: number; poznamky: string[] };
  dopyty?: SeoRow[];
  stranky?: SeoRow[];
};

type Ai = { configured: boolean; chyba?: string; report?: string; generovane?: string };

type Navrh = { fraza: string; skore: number; vPlane: boolean };
type VolumeRiadok = { fraza: string; zobrazenia: number; kliky: number; pozicia: number; zmena: number | null };
type VysledokAgenta = {
  agent: string;
  bezal: string;
  trvanieMs: number;
  ok: boolean;
  chyba?: string;
  data: unknown;
};
type Agenti = {
  ulozisko: boolean;
  agenti: { prieskumnik: VysledokAgenta | null; volumes: VysledokAgenta | null; strateg: VysledokAgenta | null };
};

/* ---------- pomôcky ---------- */

const eur = (n: number) => `${n.toLocaleString("sk-SK")} €`;
const kedy = (iso: string) =>
  new Date(iso).toLocaleString("sk-SK", { day: "numeric", month: "numeric", hour: "2-digit", minute: "2-digit" });

function mdNaHtml(md: string): string {
  const esc = md.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  let html = "";
  let vLi = false;
  for (const r of esc.split("\n")) {
    const odrazka = r.match(/^\s*[-*]\s+(.*)/);
    const nadpis = r.match(/^#{2,3}\s+(.*)/);
    if (odrazka) {
      if (!vLi) { html += "<ul>"; vLi = true; }
      html += `<li>${odrazka[1]}</li>`;
      continue;
    }
    if (vLi) { html += "</ul>"; vLi = false; }
    if (nadpis) html += `<h3>${nadpis[1]}</h3>`;
    else if (r.trim()) html += `<p>${r}</p>`;
  }
  if (vLi) html += "</ul>";
  return html
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
}

/* ---------- ikony (line-art, currentColor) ---------- */

function Ikona({ id }: { id: string }) {
  const spolocne = {
    viewBox: "0 0 20 20",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (id) {
    case "prehlad":
      return (
        <svg {...spolocne}>
          <rect x="3" y="3" width="6" height="6" rx="1.5" /><rect x="11" y="3" width="6" height="6" rx="1.5" />
          <rect x="3" y="11" width="6" height="6" rx="1.5" /><rect x="11" y="11" width="6" height="6" rx="1.5" />
        </svg>
      );
    case "navstevnost":
      return (
        <svg {...spolocne}>
          <path d="M3 16.5V13m4.5 3.5V9M12 16.5v-6m4.5 6V5.5" />
        </svg>
      );
    case "seo":
      return (
        <svg {...spolocne}>
          <circle cx="9" cy="9" r="5.5" /><path d="m13.2 13.2 3.8 3.8" />
        </svg>
      );
    case "slova":
      return (
        <svg {...spolocne}>
          <path d="M4 5.5h12M4 10h8.5M4 14.5h11" /><circle cx="17" cy="10" r="0.5" fill="currentColor" />
        </svg>
      );
    case "agenti":
      return (
        <svg {...spolocne}>
          <circle cx="10" cy="6" r="3" /><path d="M4.5 16.5a5.5 5.5 0 0 1 11 0" /><path d="M10 3V1.5" />
        </svg>
      );
    case "ai":
      return (
        <svg {...spolocne}>
          <path d="M10 3.5 11.6 8l4.4 2-4.4 2L10 16.5 8.4 12 4 10l4.4-2Z" />
        </svg>
      );
    case "blog":
      return (
        <svg {...spolocne}>
          <path d="m12.5 4 3.5 3.5L7.5 16H4v-3.5Z" /><path d="m11 5.5 3.5 3.5" />
        </svg>
      );
    case "nastavenia":
      return (
        <svg {...spolocne}>
          <path d="M3.5 6h9m3 0h1m-13 8h3m4 0h6" />
          <circle cx="14.5" cy="6" r="1.8" /><circle cx="8.5" cy="14" r="1.8" />
        </svg>
      );
    default:
      return null;
  }
}

/* ---------- štruktúra navigácie ---------- */

const TABY = {
  prehlad: "Prehľad",
  navstevnost: "Návštevnosť",
  seo: "SEO",
  slova: "Kľúčové slová",
  agenti: "SEO agenti",
  ai: "AI analytik",
  blog: "Blog",
  nastavenia: "Nastavenia",
} as const;

type TabId = keyof typeof TABY;

const SKUPINY: { label: string | null; taby: TabId[] }[] = [
  { label: null, taby: ["prehlad"] },
  { label: "Marketing", taby: ["navstevnost", "seo", "slova", "agenti"] },
  { label: "Obsah", taby: ["ai", "blog"] },
  { label: "Systém", taby: ["nastavenia"] },
];

const POPIS_AGENTOV: Record<string, { nazov: string; popis: string; potrebuje: string | null }> = {
  prieskumnik: {
    nazov: "Prieskumník",
    popis: "Každé ráno sa opýta Google Autocomplete na desiatky variácií fráz a zozbiera, čo Slováci naozaj píšu do vyhľadávania.",
    potrebuje: null,
  },
  volumes: {
    nazov: "Volumes",
    popis: "Ťahá reálne dopyty zo Search Console — zobrazenia, kliky, pozície a trend oproti predchádzajúcim 28 dňom.",
    potrebuje: "Search Console (service account)",
  },
  strateg: {
    nazov: "Stratég",
    popis: "Claude si prečíta plán fráz, čerstvé návrhy aj reálne dopyty a navrhne, čo do plánu pridať, čo vyradiť a o čom písať.",
    potrebuje: "Claude API kľúč",
  },
};

function Nastroj({ nazov, kroky }: { nazov: string; kroky: string[] }) {
  return (
    <div className="ad-setup">
      <div className="ad-setup__badge">ČAKÁ NA ZAPOJENIE</div>
      <h3>{nazov}</h3>
      <ol>
        {kroky.map((k) => (
          <li key={k}>{k}</li>
        ))}
      </ol>
      <p className="ad-muted">Po pridaní premenných vo Verceli a novom nasadení sa táto sekcia sama naplní dátami.</p>
    </div>
  );
}

/* ---------- hlavný komponent ---------- */

export default function AdminApp() {
  const [tab, setTab] = useState<TabId>("prehlad");
  const [stav, setStav] = useState<Stav | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [seo, setSeo] = useState<Seo | null>(null);
  const [ai, setAi] = useState<Ai | null>(null);
  const [aiBezi, setAiBezi] = useState(false);
  const [agenti, setAgenti] = useState<Agenti | null>(null);
  const [beziAgent, setBeziAgent] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/stav").then((r) => r.json()).then(setStav).catch(() => setStav(null));
  }, []);

  useEffect(() => {
    if ((tab === "navstevnost" || tab === "ai") && !analytics) {
      fetch("/api/admin/analytics").then((r) => r.json()).then(setAnalytics).catch(() => null);
    }
    if ((tab === "seo" || tab === "slova" || tab === "ai") && !seo) {
      fetch("/api/admin/seo").then((r) => r.json()).then(setSeo).catch(() => null);
    }
    if (tab === "agenti" && !agenti) {
      fetch("/api/admin/agents").then((r) => r.json()).then(setAgenti).catch(() => null);
    }
  }, [tab, analytics, seo, agenti]);

  useEffect(() => {
    try {
      const ulozene = localStorage.getItem("aq:admin:ai");
      if (ulozene) setAi(JSON.parse(ulozene));
    } catch { /* nevadí */ }
  }, []);

  const generujAi = useCallback(async () => {
    setAiBezi(true);
    try {
      const res = await fetch("/api/admin/ai", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          navstevnost: analytics?.configured ? analytics : "nemerané — GA4 nie je zapojené",
          seo: seo?.configured ? { dopyty: seo.dopyty, stranky: seo.stranky } : "nemerané — Search Console nie je zapojená",
        }),
      });
      const data = (await res.json()) as Ai;
      setAi(data);
      if (data.report) localStorage.setItem("aq:admin:ai", JSON.stringify(data));
    } finally {
      setAiBezi(false);
    }
  }, [analytics, seo]);

  const spustiAgenta = useCallback(async (id: string) => {
    setBeziAgent(id);
    try {
      const res = await fetch("/api/admin/agents/run", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ agent: id }),
      });
      const vysledok = (await res.json()) as VysledokAgenta;
      setAgenti((a) =>
        a ? { ...a, agenti: { ...a.agenti, [id]: vysledok } } : a,
      );
    } finally {
      setBeziAgent(null);
    }
  }, []);

  const varovania = useMemo(() => (stav ? stav.zdravie.filter((z) => !z.ok).length : 0), [stav]);
  const zdrave = useMemo(() => stav?.zdravie.filter((z) => z.ok).length ?? 0, [stav]);
  const datum = useMemo(
    () => new Date().toLocaleDateString("sk-SK", { weekday: "long", day: "numeric", month: "long" }),
    [],
  );

  const navrhy = agenti?.agenti.prieskumnik?.ok
    ? (agenti.agenti.prieskumnik.data as { navrhy: Navrh[] }).navrhy
    : null;
  const volumeRiadky = agenti?.agenti.volumes?.ok
    ? (agenti.agenti.volumes.data as { riadky: VolumeRiadok[] }).riadky
    : null;
  const strategReport = agenti?.agenti.strateg?.ok
    ? (agenti.agenti.strateg.data as { report: string }).report
    : null;

  return (
    <div className="admin-root">
      <div className="ad-ambient" aria-hidden />

      <aside className="ad-side">
        <div className="ad-side__brand">
          <span className="ad-side__mark">
            <AquaFishMark />
          </span>
          <div>
            <strong>AQUAPRIME</strong>
            <span>Riadiaci panel</span>
          </div>
        </div>

        <nav className="ad-side__nav">
          {SKUPINY.map((skupina, i) => (
            <div key={i} className="ad-side__group">
              {skupina.label && <span className="ad-side__label">{skupina.label}</span>}
              {skupina.taby.map((id) => (
                <button
                  key={id}
                  className={`ad-side__link${tab === id ? " is-active" : ""}`}
                  onClick={() => setTab(id)}
                >
                  <span className="ad-side__ico">
                    <Ikona id={id} />
                  </span>
                  {TABY[id]}
                  {id === "prehlad" && varovania > 0 && <span className="ad-side__badge">{varovania}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="ad-side__foot">
          <div className={`ad-status${stav?.integracie.zamokWebu ? " is-locked" : " is-open"}`}>
            <span className="ad-status__dot" />
            {stav ? (stav.integracie.zamokWebu ? "Web zamknutý heslom" : "Web je verejný") : "…"}
          </div>
          <a className="ad-side__out" href="/" target="_blank" rel="noreferrer">
            Zobraziť web ↗
          </a>
        </div>
      </aside>

      <main className="ad-main">
        <div className="ad-topbar">
          <span className="ad-topbar__crumb">Administrácia · {TABY[tab]}</span>
          <span className="ad-topbar__date">{datum}</span>
        </div>

        {/* ============ PREHĽAD ============ */}
        {tab === "prehlad" && (
          <section key="prehlad" className="ad-section">
            <header className="ad-head">
              <h1>Prehľad</h1>
              <p>Živé čísla priamo z nasadeného webu — vždy aktuálne.</p>
            </header>

            {!stav ? (
              <p className="ad-muted">Načítavam…</p>
            ) : (
              <>
                <div className="ad-cards">
                  <div className="ad-card">
                    <span className="ad-card__n">{stav.katalog.skrinky.pocet}</span>
                    <span className="ad-card__t">skriniek v katalógu</span>
                    <span className="ad-card__d">
                      {eur(stav.katalog.skrinky.cenaOd)} – {eur(stav.katalog.skrinky.cenaDo)} · {stav.katalog.skrinky.sLed} s LED
                    </span>
                  </div>
                  <div className="ad-card">
                    <span className="ad-card__n">{stav.katalog.akvaria.pocet}</span>
                    <span className="ad-card__t">akvárií v cenníku</span>
                    <span className="ad-card__d">
                      {eur(stav.katalog.akvaria.cenaOd)} – {eur(stav.katalog.akvaria.cenaDo)} · {stav.katalog.akvaria.sVlastnymTextom} s vlastným textom
                    </span>
                  </div>
                  <div className="ad-card">
                    <span className="ad-card__n">
                      {Math.round(((stav.katalog.fotky.vlastne + stav.katalog.fotky.fotoInehoRozmeru) / stav.katalog.fotky.variantovSpolu) * 100)}%
                    </span>
                    <span className="ad-card__t">variantov s použiteľným fotom</span>
                    <span className="ad-card__d">{stav.katalog.fotky.fotoInehoRadu} čaká na dofotenie</span>
                  </div>
                  <div className="ad-card">
                    <span className="ad-card__n">
                      {zdrave}<em>/{stav.zdravie.length}</em>
                    </span>
                    <span className="ad-card__t">kontrol zdravia OK</span>
                    <span className="ad-card__d">detaily nižšie</span>
                  </div>
                </div>

                <h2 className="ad-h2">Zdravie webu</h2>
                <ul className="ad-check">
                  {stav.zdravie.map((z) => (
                    <li key={z.id} className={z.ok ? "is-ok" : "is-warn"}>
                      <span className="ad-check__ico" aria-hidden>{z.ok ? "✓" : "!"}</span>
                      <div>
                        <strong>{z.titul}</strong>
                        <p>{z.detail}</p>
                      </div>
                    </li>
                  ))}
                </ul>

                {stav.katalog.fotky.naDofotenie.length > 0 && (
                  <details className="ad-details">
                    <summary>Varianty na dofotenie ({stav.katalog.fotky.naDofotenie.length})</summary>
                    <ul>
                      {stav.katalog.fotky.naDofotenie.map((v) => (
                        <li key={v}>{v}</li>
                      ))}
                    </ul>
                  </details>
                )}

                <h2 className="ad-h2">Rýchle odkazy</h2>
                <div className="ad-links">
                  <a href="https://aquaprime-cenotvorba.vercel.app" target="_blank" rel="noreferrer">Cenotvorba a stratégia ↗</a>
                  <a href="https://vercel.com" target="_blank" rel="noreferrer">Vercel (hosting) ↗</a>
                  <a href="https://search.google.com/search-console" target="_blank" rel="noreferrer">Search Console ↗</a>
                  <a href="https://analytics.google.com" target="_blank" rel="noreferrer">Google Analytics ↗</a>
                  <a href="https://resend.com" target="_blank" rel="noreferrer">Resend (maily) ↗</a>
                </div>
              </>
            )}
          </section>
        )}

        {/* ============ NÁVŠTEVNOSŤ ============ */}
        {tab === "navstevnost" && (
          <section key="navstevnost" className="ad-section">
            <header className="ad-head">
              <h1>Návštevnosť</h1>
              <p>Google Analytics 4 · posledných 28 dní.</p>
            </header>

            {!analytics ? (
              <p className="ad-muted">Načítavam…</p>
            ) : !analytics.configured ? (
              <Nastroj
                nazov="Google Analytics 4"
                kroky={[
                  "Na analytics.google.com vytvoriť GA4 property pre aquaprime.sk a skopírovať Measurement ID (G-…).",
                  "Vo Verceli pridať premennú NEXT_PUBLIC_GA4_ID = G-… (tým sa merací kód nasadí na web).",
                  "V Google Cloud vytvoriť service account, stiahnuť JSON kľúč.",
                  "V GA4 → Admin → Property access management pridať e-mail service accountu ako Viewer.",
                  "Vo Verceli pridať GA4_PROPERTY_ID (číselné ID property), GOOGLE_SA_EMAIL a GOOGLE_SA_KEY (private_key z JSONu).",
                ]}
              />
            ) : analytics.chyba ? (
              <p className="ad-err">GA4 vrátilo chybu: {analytics.chyba}</p>
            ) : (
              <>
                <div className="ad-cards">
                  {(() => {
                    const s = analytics.dni ?? [];
                    const sum = (k: "pouzivatelia" | "navstevy" | "zobrazenia") => s.reduce((a, d) => a + d[k], 0);
                    return (
                      <>
                        <div className="ad-card"><span className="ad-card__n">{sum("pouzivatelia")}</span><span className="ad-card__t">používateľov</span></div>
                        <div className="ad-card"><span className="ad-card__n">{sum("navstevy")}</span><span className="ad-card__t">návštev</span></div>
                        <div className="ad-card"><span className="ad-card__n">{sum("zobrazenia")}</span><span className="ad-card__t">zobrazení stránok</span></div>
                      </>
                    );
                  })()}
                </div>

                <h2 className="ad-h2">Vývoj po dňoch</h2>
                <div className="ad-bars">
                  {(analytics.dni ?? []).map((d) => {
                    const max = Math.max(1, ...(analytics.dni ?? []).map((x) => x.navstevy));
                    return (
                      <div
                        key={d.datum}
                        className="ad-bar"
                        style={{ height: `${Math.max(4, (d.navstevy / max) * 100)}%` }}
                        title={`${d.datum}: ${d.navstevy} návštev`}
                      />
                    );
                  })}
                </div>

                <div className="ad-two">
                  <div>
                    <h2 className="ad-h2">Najnavštevovanejšie stránky</h2>
                    <table className="ad-table">
                      <thead><tr><th>Stránka</th><th>Zobrazenia</th></tr></thead>
                      <tbody>
                        {(analytics.stranky ?? []).map((s) => (
                          <tr key={s.cesta}><td>{s.cesta}</td><td>{s.zobrazenia}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <h2 className="ad-h2">Odkiaľ ľudia prichádzajú</h2>
                    <table className="ad-table">
                      <thead><tr><th>Kanál</th><th>Návštevy</th></tr></thead>
                      <tbody>
                        {(analytics.kanaly ?? []).map((k) => (
                          <tr key={k.kanal}><td>{k.kanal}</td><td>{k.navstevy}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </section>
        )}

        {/* ============ SEO ============ */}
        {tab === "seo" && (
          <section key="seo" className="ad-section">
            <header className="ad-head">
              <h1>SEO</h1>
              <p>Stav indexovania + dáta zo Search Console.</p>
            </header>

            {!seo ? (
              <p className="ad-muted">Načítavam…</p>
            ) : (
              <>
                <div className={`ad-banner${seo.audit.indexovanie ? "" : " is-warn"}`}>
                  {seo.audit.indexovanie
                    ? `Web sa indexuje · sitemap ponúka ${seo.audit.sitemapPocet} stránok.`
                    : "Web je zámerne skrytý pred Googlom (noindex + zámok). SEO dáta začnú pribúdať po odomknutí."}
                </div>
                <ul className="ad-notes">
                  {seo.audit.poznamky.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>

                {!seo.configured ? (
                  <Nastroj
                    nazov="Google Search Console"
                    kroky={[
                      "Na search.google.com/search-console overiť doménu aquaprime.sk (DNS TXT záznam vo Websupporte).",
                      "Použiť ten istý service account ako pri GA4 — v Search Console → Settings → Users pridať jeho e-mail (Full permission).",
                      "Vo Verceli pridať GOOGLE_SA_EMAIL a GOOGLE_SA_KEY (ak už sú z GA4, netreba nič navyše).",
                    ]}
                  />
                ) : seo.chyba ? (
                  <p className="ad-err">Search Console vrátila chybu: {seo.chyba}</p>
                ) : (
                  <div className="ad-two">
                    <div>
                      <h2 className="ad-h2">Top dopyty (28 dní)</h2>
                      <table className="ad-table">
                        <thead><tr><th>Dopyt</th><th>Kliky</th><th>Zobr.</th><th>Pozícia</th></tr></thead>
                        <tbody>
                          {(seo.dopyty ?? []).map((d) => (
                            <tr key={d.kluc}>
                              <td>{d.kluc}</td><td>{d.kliky}</td><td>{d.zobrazenia}</td><td>{d.pozicia.toFixed(1)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div>
                      <h2 className="ad-h2">Top stránky</h2>
                      <table className="ad-table">
                        <thead><tr><th>Stránka</th><th>Kliky</th><th>Zobr.</th></tr></thead>
                        <tbody>
                          {(seo.stranky ?? []).map((s) => (
                            <tr key={s.kluc}>
                              <td>{s.kluc.replace("https://aquaprime.sk", "")}</td><td>{s.kliky}</td><td>{s.zobrazenia}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
          </section>
        )}

        {/* ============ KĽÚČOVÉ SLOVÁ ============ */}
        {tab === "slova" && (
          <section key="slova" className="ad-section">
            <header className="ad-head">
              <h1>Kľúčové slová</h1>
              <p>Plán fráz podľa katalógu. Čerstvé návrhy a reálne objemy zbiera denne sekcia SEO agenti.</p>
            </header>

            <h2 className="ad-h2">Plán fráz</h2>
            <table className="ad-table">
              <thead><tr><th>Fráza</th><th>Zámer</th><th>Priorita</th><th>Cieľ</th><th>Poznámka</th></tr></thead>
              <tbody>
                {PLAN_FRAZ.map((f) => (
                  <tr key={f.fraza}>
                    <td><strong>{f.fraza}</strong></td>
                    <td><span className={`ad-tag is-${f.zamer === "produkt" ? "a" : f.zamer === "brand" ? "c" : "b"}`}>{f.zamer}</span></td>
                    <td className="ad-prio">{"●".repeat(4 - f.priorita)}<span>{"●".repeat(f.priorita - 1)}</span></td>
                    <td>{f.ciel}</td>
                    <td className="ad-muted">{f.pozn}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h2 className="ad-h2">Skutočné dopyty z Googlu</h2>
            {!seo ? (
              <p className="ad-muted">Načítavam…</p>
            ) : !seo.configured ? (
              <p className="ad-muted">
                Objemy vyhľadávania sa neodhadujú — po zapojení Search Console (záložka SEO) ich denne aktualizuje
                agent Volumes. Medzitým zbiera agent Prieskumník aspoň reálne návrhy z Google Autocomplete —
                pozri sekciu SEO agenti.
              </p>
            ) : (
              <table className="ad-table">
                <thead><tr><th>Dopyt</th><th>Zobrazenia</th><th>Kliky</th><th>Pozícia</th></tr></thead>
                <tbody>
                  {(seo.dopyty ?? []).map((d) => (
                    <tr key={d.kluc}>
                      <td>{d.kluc}</td><td>{d.zobrazenia}</td><td>{d.kliky}</td><td>{d.pozicia.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        )}

        {/* ============ SEO AGENTI ============ */}
        {tab === "agenti" && (
          <section key="agenti" className="ad-section">
            <header className="ad-head">
              <h1>SEO agenti</h1>
              <p>
                Traja agenti bežia automaticky každé ráno (cron o 5:00 UTC) a výsledky sa ukladajú —
                tu je vždy posledný známy stav. Každého vieš spustiť aj hneď.
              </p>
            </header>

            {!agenti ? (
              <p className="ad-muted">Načítavam…</p>
            ) : (
              <>
                {!agenti.ulozisko && (
                  <p className="ad-err">Blob úložisko nie je pripojené — výsledky sa medzi behmi nezachovajú.</p>
                )}

                <div className="ad-agents">
                  {(Object.keys(POPIS_AGENTOV) as (keyof typeof POPIS_AGENTOV)[]).map((id) => {
                    const info = POPIS_AGENTOV[id];
                    const v = agenti.agenti[id as keyof Agenti["agenti"]];
                    const bezi = beziAgent === id;
                    return (
                      <div key={id} className={`ad-agent${bezi ? " is-busy" : ""}`}>
                        <div className="ad-agent__top">
                          <h3>{info.nazov}</h3>
                          {v ? (
                            <span className={`ad-tag ${v.ok ? "is-a" : "is-off"}`}>
                              {v.ok ? "OK" : "chyba"}
                            </span>
                          ) : (
                            <span className="ad-tag is-c">ešte nebežal</span>
                          )}
                        </div>
                        <p>{info.popis}</p>
                        {info.potrebuje && !v?.ok && (
                          <p className="ad-agent__req">Potrebuje: {info.potrebuje}</p>
                        )}
                        {v && (
                          <p className="ad-agent__meta">
                            Posledný beh {kedy(v.bezal)} · {(v.trvanieMs / 1000).toFixed(1)} s
                            {!v.ok && v.chyba ? ` · ${v.chyba}` : ""}
                          </p>
                        )}
                        <button className="ad-btn ad-btn--ghost" onClick={() => spustiAgenta(id)} disabled={beziAgent !== null}>
                          {bezi ? "Beží…" : "Spustiť teraz"}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {navrhy && (
                  <>
                    <h2 className="ad-h2">Prieskumník — čo Slováci píšu do Googlu</h2>
                    <table className="ad-table">
                      <thead><tr><th>Návrh</th><th>Sila</th><th>Stav</th></tr></thead>
                      <tbody>
                        {navrhy.slice(0, 30).map((n) => {
                          const max = navrhy[0]?.skore ?? 1;
                          return (
                            <tr key={n.fraza}>
                              <td>{n.fraza}</td>
                              <td className="ad-sila">
                                <span style={{ width: `${Math.max(6, (n.skore / max) * 100)}%` }} />
                              </td>
                              <td>
                                {n.vPlane
                                  ? <span className="ad-tag is-a">v pláne</span>
                                  : <span className="ad-tag is-b">nový</span>}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </>
                )}

                {volumeRiadky && (
                  <>
                    <h2 className="ad-h2">Volumes — reálne dopyty a trend</h2>
                    <table className="ad-table">
                      <thead><tr><th>Dopyt</th><th>Zobrazenia</th><th>Kliky</th><th>Pozícia</th><th>Trend</th></tr></thead>
                      <tbody>
                        {volumeRiadky.slice(0, 30).map((r) => (
                          <tr key={r.fraza}>
                            <td>{r.fraza}</td>
                            <td>{r.zobrazenia}</td>
                            <td>{r.kliky}</td>
                            <td>{r.pozicia.toFixed(1)}</td>
                            <td className={r.zmena === null ? "" : r.zmena >= 0 ? "ad-up" : "ad-down"}>
                              {r.zmena === null ? "nové" : r.zmena >= 0 ? `▲ +${r.zmena}` : `▼ ${r.zmena}`}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}

                {strategReport && (
                  <>
                    <h2 className="ad-h2">Stratég — odporúčania</h2>
                    <article className="ad-report">
                      <div dangerouslySetInnerHTML={{ __html: mdNaHtml(strategReport) }} />
                      {agenti.agenti.strateg && (
                        <p className="ad-muted">Vygenerované {kedy(agenti.agenti.strateg.bezal)}</p>
                      )}
                    </article>
                  </>
                )}
              </>
            )}
          </section>
        )}

        {/* ============ AI ANALYTIK ============ */}
        {tab === "ai" && (
          <section key="ai" className="ad-section">
            <header className="ad-head">
              <h1>AI analytik</h1>
              <p>Claude si prečíta aktuálny stav webu (katalóg, zdravie, návštevnosť, SEO) a napíše, čo riešiť ďalej.</p>
            </header>

            {stav?.integracie.ai === false || ai?.configured === false ? (
              <Nastroj
                nazov="Claude API"
                kroky={[
                  "Na platform.claude.com vytvoriť API kľúč.",
                  "Vo Verceli pridať premennú ANTHROPIC_API_KEY.",
                ]}
              />
            ) : (
              <>
                <button className="ad-btn" onClick={generujAi} disabled={aiBezi}>
                  {aiBezi ? "Analyzujem…" : ai?.report ? "Vygenerovať nový report" : "Vygenerovať report"}
                </button>
                {ai?.chyba && <p className="ad-err">Chyba: {ai.chyba}</p>}
                {ai?.report && (
                  <article className="ad-report">
                    <div dangerouslySetInnerHTML={{ __html: mdNaHtml(ai.report) }} />
                    {ai.generovane && (
                      <p className="ad-muted">Vygenerované {new Date(ai.generovane).toLocaleString("sk-SK")}</p>
                    )}
                  </article>
                )}
                {!ai?.report && !aiBezi && (
                  <p className="ad-muted">
                    Report sa generuje na požiadanie (každé spustenie volá Claude API). Výsledok sa uloží
                    a prežije aj zatvorenie prehliadača.
                  </p>
                )}
              </>
            )}
          </section>
        )}

        {/* ============ BLOG ============ */}
        {tab === "blog" && (
          <section key="blog" className="ad-section">
            <header className="ad-head">
              <h1>Blog</h1>
              <p>Obsahový plán je pripravený — editor čaká na jedno rozhodnutie.</p>
            </header>

            <div className="ad-setup">
              <div className="ad-setup__badge">ČAKÁ NA ROZHODNUTIE</div>
              <h3>Kam sa budú ukladať články</h3>
              <p>
                Aby sa dal článok napísať a publikovať priamo odtiaľto (bez programátora a bez nasadzovania webu),
                potrebuje blog databázu. Odporúčanie: <strong>Supabase</strong> (bezplatný tier stačí, rovnaké riešenie
                beží na iných projektoch). Po založení projektu a pridaní kľúčov sem pribudne plnohodnotný editor
                s konceptmi, publikovaním a SEO náhľadom.
              </p>
            </div>

            <h2 className="ad-h2">Zásobník tém (podľa plánu fráz)</h2>
            <ul className="ad-notes">
              <li><strong>Aká skrinka unesie 200-litrové akvárium?</strong> — nosnosť, oceľový rám, kalkulačka zaťaženia (fráza: „nosnosť skrinky pod akvárium“)</li>
              <li><strong>Hrúbka skla podľa rozmeru akvária</strong> — tabuľka priamo z výrobného cenníka (fráza: „aké sklo na akvárium“)</li>
              <li><strong>Koľko váži akvárium s vodou a čo to znamená pre podlahu</strong> — prepojenie na konfigurátor</li>
              <li><strong>Skrinka z nábytkovej dosky vs. oceľový rám</strong> — hlavný predajný argument značky</li>
              <li><strong>Ako pripraviť miesto pre akvárium na mieru</strong> — checklist pred objednávkou</li>
            </ul>
          </section>
        )}

        {/* ============ NASTAVENIA ============ */}
        {tab === "nastavenia" && (
          <section key="nastavenia" className="ad-section">
            <header className="ad-head">
              <h1>Nastavenia</h1>
              <p>Stav všetkých integrácií a premenných prostredia.</p>
            </header>

            {!stav ? (
              <p className="ad-muted">Načítavam…</p>
            ) : (
              <>
                <table className="ad-table">
                  <thead><tr><th>Integrácia</th><th>Stav</th><th>Premenné</th></tr></thead>
                  <tbody>
                    {(
                      [
                        ["Maily z formulárov (Resend)", stav.integracie.resend, "RESEND_API_KEY, DOPYT_TO, DOPYT_FROM"],
                        ["Merací kód na webe (GA4)", stav.integracie.ga4NaWebe, "NEXT_PUBLIC_GA4_ID"],
                        ["Merací kód na webe (GTM)", stav.integracie.gtmNaWebe, "NEXT_PUBLIC_GTM_ID"],
                        ["Čítanie štatistík GA4", stav.integracie.ga4, "GA4_PROPERTY_ID, GOOGLE_SA_EMAIL, GOOGLE_SA_KEY"],
                        ["Search Console", stav.integracie.gsc, "GOOGLE_SA_EMAIL, GOOGLE_SA_KEY (+ overená doména)"],
                        ["AI analytik (Claude)", stav.integracie.ai, "ANTHROPIC_API_KEY"],
                        ["QR platba zálohy (IBAN)", stav.integracie.iban, "FIRMA_IBAN (+ voliteľne FIRMA_NAZOV)"],
                        ["Zámok webu", stav.integracie.zamokWebu, "SITE_PASSWORD (zmazať = web verejný)"],
                        ["Admin heslo", stav.integracie.adminHeslo, "ADMIN_PASSWORD"],
                      ] as [string, boolean, string][]
                    ).map(([nazov, ok, env]) => (
                      <tr key={nazov}>
                        <td>{nazov}</td>
                        <td>{ok ? <span className="ad-tag is-a">aktívne</span> : <span className="ad-tag is-off">vypnuté</span>}</td>
                        <td className="ad-muted ad-mono">{env}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <h2 className="ad-h2">Ako odomknúť web pre verejnosť</h2>
                <ol className="ad-steps">
                  <li>Potvrdiť ceny (2 otázniky v cenníku) a doplniť reálne realizácie.</li>
                  <li>Zapojiť Resend, nech chodia maily z formulárov.</li>
                  <li>Vo Verceli zmazať premennú SITE_PASSWORD → zámok zmizne.</li>
                  <li>V kóde prepnúť SKRYTY_PRED_VYHLADAVACMI na false → zapne sa indexovanie a sitemap.</li>
                  <li>Overiť doménu v Search Console a odoslať sitemap.</li>
                </ol>
                <p className="ad-muted">Stav načítaný {new Date(stav.generovane).toLocaleString("sk-SK")}.</p>
              </>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
