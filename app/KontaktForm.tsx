"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AQUARIUMS } from "./aquariums";
import { PRODUCTS } from "./products";
import { FRAME_LOAD_KG, cabinetPrice, tankLoadKg } from "./configurator-logic";

const OWNER_EMAIL = "ahoj@aquaprime.sk";
const DRAFT_KEY = "aq:kontakt:draft";

const TEMY = [
  { id: "akvarium", label: "Akvárium", hint: "Nádrž na mieru alebo z cenníka." },
  { id: "skrinka", label: "Skrinka", hint: "Podstavec na oceľovom ráme." },
  { id: "zostava", label: "Kompletná zostava", hint: "Nádrž aj skrinka spolu." },
  { id: "terarium", label: "Terárium", hint: "Suché aj vlhké, na mieru." },
  { id: "servis", label: "Servis a poradenstvo", hint: "Máte otázku k prevádzke." },
  { id: "ine", label: "Niečo iné", hint: "Spolupráca, veľkoobchod, médiá." },
] as const;

/** Domény, ktoré na Slovensku pokryjú väčšinu adries. */
const DOMENY = [
  "gmail.com",
  "zoznam.sk",
  "azet.sk",
  "centrum.sk",
  "post.sk",
  "outlook.com",
  "icloud.com",
  "seznam.cz",
];

type Draft = {
  tema: string;
  rozmer: string;
  meno: string;
  email: string;
  tel: string;
  sprava: string;
};

const EMPTY: Draft = { tema: "", rozmer: "", meno: "", email: "", tel: "", sprava: "" };

/** Z textu ako „120x50x60", „120 × 50 × 60 cm" či „120/50/60" vytiahne rozmery. */
function parseDims(s: string): { w: number; d: number; h: number } | null {
  const m = s
    .replace(/,/g, ".")
    .match(/(\d{2,3})\s*[x×*\/]\s*(\d{2,3})\s*[x×*\/]\s*(\d{2,3})/i);
  if (!m) return null;
  const [w, d, h] = [Number(m[1]), Number(m[2]), Number(m[3])];
  if (!w || !d || !h) return null;
  return { w, d, h };
}

/** Telefón priebežne formátuje do tvaru +421 9xx xxx xxx. */
function formatTel(raw: string): string {
  const digits = raw.replace(/[^\d+]/g, "").replace(/(?!^)\+/g, "");
  if (!digits) return "";
  let body = digits;
  let prefix = "";
  if (body.startsWith("+421")) {
    prefix = "+421 ";
    body = body.slice(4);
  } else if (body.startsWith("00421")) {
    prefix = "+421 ";
    body = body.slice(5);
  } else if (body.startsWith("0")) {
    prefix = "0";
    body = body.slice(1);
  } else if (body.startsWith("+")) {
    return digits;
  }
  const groups = body.match(/.{1,3}/g) ?? [];
  return (prefix + groups.join(" ")).trim();
}

export default function KontaktForm() {
  const [d, setD] = useState<Draft>(EMPTY);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  /** true = odišlo priamo z webu, false = otvorili sme mailový klient */
  const [delivered, setDelivered] = useState(false);
  /** pasca na roboty — pole je skryté, človek doň nenapíše */
  const [hp, setHp] = useState("");
  const [copied, setCopied] = useState(false);
  const [restored, setRestored] = useState(false);
  const [openList, setOpenList] = useState(false);
  const [hi, setHi] = useState(0);
  const [online, setOnline] = useState<boolean | null>(null);
  const rozmerRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) =>
    setD((prev) => ({ ...prev, [k]: v }));

  /* ---- obnovenie rozpísaného dopytu + predvyplnenie z URL ---- */
  useEffect(() => {
    const url = new URLSearchParams(window.location.search);
    const fromUrl: Partial<Draft> = {};
    if (url.get("tema")) fromUrl.tema = url.get("tema")!;
    if (url.get("rozmer")) fromUrl.rozmer = url.get("rozmer")!;

    let saved: Partial<Draft> = {};
    try {
      saved = JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}");
    } catch {
      saved = {};
    }
    const merged = { ...EMPTY, ...saved, ...fromUrl };
    const hasSaved = Object.values(saved).some((v) => v);
    if (hasSaved || Object.keys(fromUrl).length) {
      setD(merged);
      setRestored(hasSaved && !Object.keys(fromUrl).length);
    }

    // pracovný čas Po–Pia 9–17 sa počíta až v prehliadači (inak by sa server a klient rozišli)
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    setOnline(day >= 1 && day <= 5 && hour >= 9 && hour < 17);
  }, []);

  /* ---- priebežné ukladanie rozpísaného dopytu ---- */
  useEffect(() => {
    if (d === EMPTY) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(d));
      } catch {
        /* súkromný režim — bez uloženia */
      }
    }, 400);
    return () => clearTimeout(t);
  }, [d]);

  /* ---- našepkávač rozmerov z reálneho cenníka ---- */
  const navrhy = useMemo(() => {
    const q = d.rozmer.replace(/\s/g, "").toLowerCase();
    if (!q) return AQUARIUMS.slice(0, 6);
    const digits = q.replace(/[^\d]/g, "");
    return AQUARIUMS.filter((a) => {
      const key = `${a.w}${a.d}${a.h}`;
      return (
        key.startsWith(digits) ||
        String(a.w).startsWith(digits) ||
        `${a.w}x${a.d}x${a.h}`.includes(q.replace(/[×*\/]/g, "x"))
      );
    }).slice(0, 6);
  }, [d.rozmer]);

  /* ---- odvodené fakty: objem, sklo, zaťaženie, skrinka, cena ---- */
  const odvodene = useMemo(() => {
    const dims = parseDims(d.rozmer);
    if (!dims) return null;
    const liters = Math.round((dims.w * dims.d * dims.h) / 1000);
    const exact = AQUARIUMS.find(
      (a) => a.w === dims.w && a.d === dims.d && a.h === dims.h
    );
    const near = AQUARIUMS.reduce((a, b) =>
      Math.abs(b.liters - liters) < Math.abs(a.liters - liters) ? b : a
    );
    const cabinet = PRODUCTS.filter((p) => p.w === dims.w).sort(
      (x, y) => Number(x.price.replace(/\D/g, "")) - Number(y.price.replace(/\D/g, ""))
    )[0];
    const cab = cabinet
      ? { name: `${cabinet.w} × ${cabinet.d} × ${cabinet.h} cm`, price: cabinet.price }
      : {
          name: `${dims.w} × ${dims.d} cm na mieru`,
          price: `od ${cabinetPrice("standard", dims.w, dims.d, 80, false).value} €`,
        };
    return {
      dims,
      liters,
      exact,
      glass: (exact ?? near).glass.map((g) => g.mm),
      load: tankLoadKg(liters),
      loadPct: Math.min(100, Math.round((tankLoadKg(liters) / FRAME_LOAD_KG) * 100)),
      cab,
    };
  }, [d.rozmer]);

  /* ---- doplnenie e-mailovej domény ---- */
  const emailNavrh = useMemo(() => {
    const at = d.email.indexOf("@");
    if (at < 1) return null;
    const local = d.email.slice(0, at);
    const rest = d.email.slice(at + 1).toLowerCase();
    if (!rest || rest.includes(".") ) {
      const exact = DOMENY.find((x) => x === rest);
      if (exact) return null;
    }
    const hit = DOMENY.find((x) => x.startsWith(rest) && x !== rest);
    return hit ? `${local}@${hit}` : null;
  }, [d.email]);

  /* ---- ukazovateľ, koľko z dopytu je vyplnené ---- */
  const hotovo = useMemo(() => {
    const kroky = [
      !!d.tema,
      !!d.rozmer || d.tema === "servis" || d.tema === "ine",
      d.meno.trim().length > 1,
      /.+@.+\..+/.test(d.email),
      d.sprava.trim().length > 9,
    ];
    return Math.round((kroky.filter(Boolean).length / kroky.length) * 100);
  }, [d]);

  const emailOk = /.+@.+\..+/.test(d.email);
  const canSend = !!d.meno.trim() && emailOk;

  const sprava = useMemo(() => {
    const t = TEMY.find((x) => x.id === d.tema);
    return [
      `Téma: ${t ? t.label : "—"}`,
      `Rozmer: ${d.rozmer || "—"}`,
      odvodene
        ? `Odvodené: ~${odvodene.liters} l · sklo ${odvodene.glass.join(
            "/"
          )} mm · zaťaženie ~${odvodene.load} kg · skrinka ${odvodene.cab.name}`
        : "",
      "",
      `Meno: ${d.meno || "—"}`,
      `E-mail: ${d.email || "—"}`,
      `Telefón: ${d.tel || "—"}`,
      "",
      "Správa:",
      d.sprava || "—",
    ]
      .filter((x) => x !== "")
      .join("\n");
  }, [d, odvodene]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSend || sending) return;
    setSending(true);

    // Primárne odoslanie priamo z webu. Keď endpoint nie je nastavený alebo
    // zlyhá, spadneme na mailto — zákazník tak neostane bez cesty.
    let odoslane = false;
    try {
      const res = await fetch("/api/dopyt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tema: TEMY.find((x) => x.id === d.tema)?.label ?? "",
          rozmer: d.rozmer,
          meno: d.meno,
          email: d.email,
          tel: d.tel,
          sprava: d.sprava,
          odvodene: odvodene
            ? `~${odvodene.liters} l · sklo ${odvodene.glass.join(
                "/"
              )} mm · zaťaženie ~${odvodene.load} kg · skrinka ${odvodene.cab.name}`
            : "",
          web: hp,
        }),
      });
      odoslane = res.ok;
    } catch {
      odoslane = false;
    }

    if (!odoslane) {
      window.location.href = `mailto:${OWNER_EMAIL}?subject=${encodeURIComponent(
        `Správa z webu — ${TEMY.find((x) => x.id === d.tema)?.label ?? "kontakt"}`
      )}&body=${encodeURIComponent(sprava)}`;
    }

    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* ignore */
    }
    setDelivered(odoslane);
    setSending(false);
    setSent(true);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${sprava}\n\n— odoslať na ${OWNER_EMAIL}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2600);
    } catch {
      setCopied(false);
    }
  };

  if (sent) {
    return (
      <div className="kf2__done" role="status">
        <div className="kf2__done-ico" aria-hidden>
          ✓
        </div>
        <h2 className="kf2__done-title">
          {delivered ? "Správa odoslaná." : "Správa je pripravená na odoslanie."}
        </h2>
        <p className="kf2__done-body">
          {delivered ? (
            <>
              Máme ju u seba a potvrdenie sme poslali aj na váš e-mail. Ozveme sa
              spravidla do 24 hodín v pracovný deň.
            </>
          ) : (
            <>
              Otvorili sme váš e-mailový klient s vyplnenými údajmi — stačí
              stlačiť odoslať. Ak sa neotvoril, skopírujte si správu a pošlite ju
              na <a href={`mailto:${OWNER_EMAIL}`}>{OWNER_EMAIL}</a>.
            </>
          )}
        </p>
        <div className="kf2__done-actions">
          <button type="button" className="btn-outline" onClick={copy}>
            {copied ? "Skopírované ✓" : "Skopírovať správu"}
          </button>
          <button
            type="button"
            className="btn-outline"
            onClick={() => {
              setD(EMPTY);
              setSent(false);
            }}
          >
            Napísať ďalšiu
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="kf2" onSubmit={submit} noValidate>
      {/* stav a postup */}
      <div className="kf2__top">
        <div className="kf2__status">
          <span
            className={`kf2__dot${online ? " is-on" : ""}`}
            aria-hidden
          />
          {online === null
            ? "Zisťujeme dostupnosť…"
            : online
              ? "Sme pri telefóne — ozveme sa dnes."
              : "Mimo pracovného času — ozveme sa hneď v pracovný deň ráno."}
        </div>
        <div className="kf2__progress" aria-hidden>
          <i style={{ width: `${hotovo}%` }} />
        </div>
      </div>

      {restored && (
        <p className="kf2__restored" role="status">
          Načítali sme váš rozpísaný dopyt.{" "}
          <button
            type="button"
            onClick={() => {
              setD(EMPTY);
              setRestored(false);
              try {
                localStorage.removeItem(DRAFT_KEY);
              } catch {
                /* ignore */
              }
            }}
          >
            Začať odznova
          </button>
        </p>
      )}

      {/* 01 téma */}
      <fieldset className="kf2__field">
        <legend className="kf2__legend">
          <span className="kf2__n">01</span> S čím vám pomôžeme?
        </legend>
        <div className="kf2__temy">
          {TEMY.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`kf2__tema${d.tema === t.id ? " is-on" : ""}`}
              onClick={() => set("tema", d.tema === t.id ? "" : t.id)}
              aria-pressed={d.tema === t.id}
            >
              <strong>{t.label}</strong>
              <span>{t.hint}</span>
            </button>
          ))}
        </div>
      </fieldset>

      {/* 02 rozmer s našepkávačom */}
      <fieldset className="kf2__field">
        <legend className="kf2__legend">
          <span className="kf2__n">02</span> Rozmer
          <em>nepovinné — ale zrýchli to odpoveď</em>
        </legend>
        <div className="kf2__combo">
          <input
            ref={rozmerRef}
            className="kf2__input"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder="napíšte napr. 120 alebo 120 × 50 × 50"
            value={d.rozmer}
            onChange={(e) => {
              set("rozmer", e.target.value);
              setOpenList(true);
              setHi(0);
            }}
            onFocus={() => setOpenList(true)}
            onBlur={() => setTimeout(() => setOpenList(false), 140)}
            onKeyDown={(e) => {
              if (!openList || !navrhy.length) return;
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setHi((i) => (i + 1) % navrhy.length);
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setHi((i) => (i - 1 + navrhy.length) % navrhy.length);
              } else if (e.key === "Enter") {
                e.preventDefault();
                set("rozmer", navrhy[hi].dim);
                setOpenList(false);
              } else if (e.key === "Escape") {
                setOpenList(false);
              }
            }}
            role="combobox"
            aria-expanded={openList && navrhy.length > 0}
            aria-controls="kf2-navrhy"
            aria-autocomplete="list"
          />
          {openList && navrhy.length > 0 && (
            <ul className="kf2__list" id="kf2-navrhy" role="listbox">
              {navrhy.map((a, i) => (
                <li key={a.slug}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={i === hi}
                    className={`kf2__opt${i === hi ? " is-hi" : ""}`}
                    onMouseEnter={() => setHi(i)}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      set("rozmer", a.dim);
                      setOpenList(false);
                      rozmerRef.current?.focus();
                    }}
                  >
                    <span className="kf2__opt-dim">{a.dim}</span>
                    <span className="kf2__opt-meta">
                      {a.vol} · {a.priceLabel}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {odvodene && (
          <div className="kf2__derived" role="status">
            <div className="kf2__derived-head">
              <span className="kf2__derived-tag">
                {odvodene.exact ? "Máme v cenníku" : "Dopočítali sme"}
              </span>
              <strong>
                {odvodene.dims.w} × {odvodene.dims.d} × {odvodene.dims.h} cm
              </strong>
            </div>
            <dl className="kf2__facts">
              <div>
                <dt>Objem</dt>
                <dd>~{odvodene.liters} l</dd>
              </div>
              <div>
                <dt>Hrúbka skla</dt>
                <dd>{odvodene.glass.join(" / ")} mm</dd>
              </div>
              <div>
                <dt>Zaťaženie</dt>
                <dd>~{odvodene.load} kg</dd>
              </div>
              <div>
                <dt>Sadne skrinka</dt>
                <dd>{odvodene.cab.name}</dd>
              </div>
            </dl>
            <div className="kf2__load">
              <i style={{ width: `${odvodene.loadPct}%` }} />
            </div>
            <p className="kf2__derived-note">
              {odvodene.exact ? (
                <>
                  Nádrž je v ponuke za <b>{odvodene.exact.priceLabel}</b>, skrinka{" "}
                  {odvodene.cab.price}. Rám je testovaný na {FRAME_LOAD_KG} kg.
                </>
              ) : (
                <>
                  Tento rozmer v cenníku nie je, ale vyrobíme ho na mieru.
                  Najbližšia skrinka {odvodene.cab.name} ({odvodene.cab.price}).
                </>
              )}
            </p>
          </div>
        )}
      </fieldset>

      {/* 03 kontakt */}
      <fieldset className="kf2__field">
        <legend className="kf2__legend">
          <span className="kf2__n">03</span> Kam vám odpovedať
        </legend>
        <div className="kf2__row">
          <label className="kf2__label">
            <span>Meno</span>
            <input
              className="kf2__input"
              type="text"
              autoComplete="name"
              placeholder="Jana Nováková"
              value={d.meno}
              onChange={(e) => set("meno", e.target.value)}
              required
            />
          </label>
          <label className="kf2__label">
            <span>Telefón — nepovinné</span>
            <input
              className="kf2__input"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              placeholder="+421 900 000 000"
              value={d.tel}
              onChange={(e) => set("tel", formatTel(e.target.value))}
            />
          </label>
        </div>
        <label className="kf2__label">
          <span>E-mail</span>
          <input
            className={`kf2__input${d.email && !emailOk ? " is-warn" : ""}`}
            type="email"
            autoComplete="email"
            placeholder="jana@gmail.com"
            value={d.email}
            onChange={(e) => set("email", e.target.value)}
            onKeyDown={(e) => {
              if ((e.key === "Tab" || e.key === "Enter") && emailNavrh) {
                e.preventDefault();
                set("email", emailNavrh);
              }
            }}
            required
          />
          {emailNavrh && (
            <button
              type="button"
              className="kf2__ghost"
              onClick={() => set("email", emailNavrh)}
            >
              Doplniť na <b>{emailNavrh}</b> <em>Tab</em>
            </button>
          )}
          {d.email && !emailOk && !emailNavrh && (
            <span className="kf2__warn">E-mail zatiaľ nevyzerá úplne.</span>
          )}
        </label>
      </fieldset>

      {/* 04 správa */}
      <fieldset className="kf2__field">
        <legend className="kf2__legend">
          <span className="kf2__n">04</span> Vaša správa
        </legend>
        <textarea
          className="kf2__input kf2__textarea"
          rows={5}
          placeholder={
            d.tema === "servis"
              ? "Opíšte, čo sa deje — objem nádrže, ako dlho beží, čo ste už skúsili…"
              : "Priestor, termín, predstava… pokojne aj v bodoch."
          }
          value={d.sprava}
          onChange={(e) => set("sprava", e.target.value)}
        />
      </fieldset>

      {/* pasca na roboty — pre človeka neviditeľná a mimo tab poradia */}
      <input
        type="text"
        name="web"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={hp}
        onChange={(e) => setHp(e.target.value)}
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          opacity: 0,
          pointerEvents: "none",
        }}
      />

      <div className="kf2__send">
        <button
          type="submit"
          className="btn-cyan kf2__submit"
          disabled={!canSend || sending}
        >
          {sending ? "ODOSIELAM…" : "ODOSLAŤ SPRÁVU"} <span aria-hidden>→</span>
        </button>
        <button type="button" className="btn-outline" onClick={copy}>
          {copied ? "Skopírované ✓" : "Skopírovať"}
        </button>
      </div>
      <p className="kf2__note">
        {canSend
          ? "Otvorí sa váš e-mailový klient s predvyplnenou správou."
          : "Doplňte meno a e-mail — potom vás pustíme ďalej."}{" "}
        Rozpísanú správu si web pamätá, aj keď stránku zavriete.
      </p>
    </form>
  );
}
