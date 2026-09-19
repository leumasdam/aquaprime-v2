import fs from "node:fs";
import path from "node:path";

/**
 * Blog — články sú Markdown súbory v `content/blog/<slug>.md` s hlavičkou
 * (title, description, date, category, keywords, cover, faq). Čítajú sa pri
 * builde (stránky sú statické), takže na serveri nič nebeží.
 *
 * Parser je zámerne malý a bez závislostí: nadpisy, odseky, zoznamy,
 * tabuľky, citácie, tučné/kurzíva/odkazy. Nič viac články nepotrebujú.
 */

export type Faq = { q: string; a: string };

export type Clanok = {
  slug: string;
  title: string;
  /** kratsi titulok do <title> a vysledkov vyhladavania; inak sa pouzije title */
  seoTitle: string;
  description: string;
  /** ISO dátum (2026-09-19) */
  date: string;
  category: string;
  keywords: string[];
  cover: string;
  coverAlt: string;
  faq: Faq[];
  /** hotové HTML tela článku */
  html: string;
  /** obsah z H2 nadpisov */
  osnova: { id: string; text: string }[];
  minut: number;
  slova: number;
  /** slugy súvisiacich článkov (z hlavičky alebo automaticky z odkazov) */
  suvisiace: string[];
};

const ADRESAR = path.join(process.cwd(), "content", "blog");

/** Predvolená fotka článku podľa kategórie, ak hlavička neuvádza vlastnú. */
const COVER_SLUG: Record<string, string> = {
  "vybrat-skrinku-pod-akvarium": "/realizacie/galeria/antracit.webp",
  "nosnost-hmotnost-akvaria": "/realizacie/galeria/konstrukcia.webp",
  "hrubka-skla-akvarium": "/img/akvaria/akvarium-120x50x50.webp",
  "prve-akvarium-zacinajuci": "/img/hero-natural-m-poster.webp",
  "umiestnenie-akvaria-v-byte": "/realizacie/galeria/dubovy-interier.webp",
  "akvarium-200-litrov": "/img/kontakt-hero-poster.webp",
  "led-podsvietenie-akvaria": "/img/col-premium-led.webp",
  "aquascaping-rastliny": "/img/vetva-akvaria.webp",
  "morske-vs-sladkovodne": "/realizacie/galeria/biela-hotova.webp",
  "udrzba-stabilita-akvaria": "/img/vetva-technika.webp",
};
const COVER_KATEGORIE: Record<string, string> = {
  skrinky: "/img/products/standard-100x40x80-black-matt-01.webp",
  akvaria: "/img/akvaria/akvarium-120x50x50.webp",
  zaklady: "/img/akvaria/hero-akvarium-v3.webp",
  interier: "/img/hero-room.webp",
};
const COVER_DEFAULT = "/img/hero.webp";

/* ---------- pomocné ---------- */

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** inline Markdown → HTML (po escapovaní) */
function inline(s: string): string {
  let t = esc(s);
  t = t.replace(/`([^`]+)`/g, "<code>$1</code>");
  t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  t = t.replace(/(^|[^*\w])\*([^*\n]+)\*(?!\w)/g, "$1<em>$2</em>");
  t = t.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, text, href) => {
    const h = String(href);
    const ext = /^https?:\/\//.test(h) && !h.startsWith("https://aquaprime.sk");
    return `<a href="${esc(h)}"${ext ? ' target="_blank" rel="noopener"' : ""}>${text}</a>`;
  });
  /* pevné medzery pred jednotkami a v rozmeroch: „300 l", „120 × 50 cm" */
  t = t.replace(/(\d) (l|kg|mm|cm|m|€|%|ks)(?=[\s.,;:)]|$)/g, "$1\u00a0$2");
  t = t.replace(/ × /g, "\u00a0×\u00a0");
  return t;
}

/** Bloky Markdownu → HTML + osnova. */
function markdown(src: string): { html: string; osnova: { id: string; text: string }[]; slova: number } {
  const riadky = src.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  const osnova: { id: string; text: string }[] = [];
  const ids = new Set<string>();
  let i = 0;

  const uniqId = (text: string) => {
    let id = slugify(text) || "sekcia";
    let n = 2;
    while (ids.has(id)) id = `${slugify(text)}-${n++}`;
    ids.add(id);
    return id;
  };

  while (i < riadky.length) {
    const r = riadky[i];
    if (!r.trim()) {
      i++;
      continue;
    }
    /* nadpisy */
    const h = /^(#{1,4})\s+(.*)$/.exec(r);
    if (h) {
      const uroven = Math.max(2, h[1].length); // H1 je titulok stránky — v tele max H2
      const text = h[2].replace(/\s*#+$/, "").trim();
      const id = uniqId(text);
      if (uroven === 2) osnova.push({ id, text });
      out.push(`<h${uroven} id="${id}">${inline(text)}</h${uroven}>`);
      i++;
      continue;
    }
    /* vodorovná čiara */
    if (/^\s*(-{3,}|\*{3,})\s*$/.test(r)) {
      out.push("<hr />");
      i++;
      continue;
    }
    /* tabuľka */
    if (r.trim().startsWith("|") && i + 1 < riadky.length && /^\s*\|?\s*:?-{2,}/.test(riadky[i + 1])) {
      const bunky = (l: string) =>
        l
          .trim()
          .replace(/^\||\|$/g, "")
          .split("|")
          .map((c) => c.trim());
      const hlava = bunky(r);
      i += 2;
      const telo: string[][] = [];
      while (i < riadky.length && riadky[i].trim().startsWith("|")) {
        telo.push(bunky(riadky[i]));
        i++;
      }
      out.push(
        `<div class="blog__tab"><table><thead><tr>${hlava
          .map((c) => `<th>${inline(c)}</th>`)
          .join("")}</tr></thead><tbody>${telo
          .map((row) => `<tr>${row.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`)
          .join("")}</tbody></table></div>`
      );
      continue;
    }
    /* citácia / tip */
    if (r.startsWith(">")) {
      const buf: string[] = [];
      while (i < riadky.length && riadky[i].startsWith(">")) {
        buf.push(riadky[i].replace(/^>\s?/, ""));
        i++;
      }
      const text = buf.join(" ").trim();
      const tip = /^\*\*(Tip|Pozor|Poznámka|Príklad)[^*]*\*\*/i.exec(text);
      out.push(`<blockquote${tip ? ' class="blog__tip"' : ""}><p>${inline(text)}</p></blockquote>`);
      continue;
    }
    /* zoznamy */
    const li = /^(\s*)([-*]|\d+[.)])\s+(.*)$/.exec(r);
    if (li) {
      const ordered = /\d/.test(li[2]);
      const polozky: string[] = [];
      while (i < riadky.length) {
        const m = /^(\s*)([-*]|\d+[.)])\s+(.*)$/.exec(riadky[i]);
        if (m && /\d/.test(m[2]) === ordered) {
          polozky.push(m[3]);
          i++;
        } else if (riadky[i].trim() && /^\s{2,}/.test(riadky[i]) && polozky.length) {
          /* pokračovanie odrážky na ďalšom riadku */
          polozky[polozky.length - 1] += " " + riadky[i].trim();
          i++;
        } else break;
      }
      const tag = ordered ? "ol" : "ul";
      out.push(`<${tag}>${polozky.map((p) => `<li>${inline(p)}</li>`).join("")}</${tag}>`);
      continue;
    }
    /* obrázok na samostatnom riadku */
    const img = /^!\[([^\]]*)\]\(([^)\s]+)\)\s*$/.exec(r.trim());
    if (img) {
      out.push(`<figure><img src="${esc(img[2])}" alt="${esc(img[1])}" loading="lazy" /></figure>`);
      i++;
      continue;
    }
    /* odsek — do prvého prázdneho riadku alebo blokového prvku */
    const buf: string[] = [];
    while (
      i < riadky.length &&
      riadky[i].trim() &&
      !/^(#{1,4})\s/.test(riadky[i]) &&
      !riadky[i].startsWith(">") &&
      !/^(\s*)([-*]|\d+[.)])\s+/.test(riadky[i]) &&
      !riadky[i].trim().startsWith("|") &&
      !/^\s*-{3,}\s*$/.test(riadky[i])
    ) {
      buf.push(riadky[i].trim());
      i++;
    }
    out.push(`<p>${inline(buf.join(" "))}</p>`);
  }
  const text = src.replace(/[#*>|`\-]/g, " ");
  const slova = text.split(/\s+/).filter((w) => /[\p{L}\d]/u.test(w)).length;
  return { html: out.join("\n"), osnova, slova };
}

/** Minimálna hlavička YAML: skalár, čiarkový zoznam, zoznam objektov (faq). */
function hlavicka(src: string): { meta: Record<string, unknown>; telo: string } {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(src);
  if (!m) return { meta: {}, telo: src };
  const meta: Record<string, unknown> = {};
  const riadky = m[1].split(/\r?\n/);
  let kluc = "";
  let zoznam: Record<string, string>[] | null = null;
  for (const r of riadky) {
    const top = /^([a-zA-Z_]+):\s*(.*)$/.exec(r);
    if (top) {
      if (zoznam) meta[kluc] = zoznam;
      kluc = top[1];
      const val = top[2].trim();
      if (val === "") {
        zoznam = [];
      } else {
        zoznam = null;
        meta[kluc] = val.replace(/^["']|["']$/g, "");
      }
      continue;
    }
    const polozka = /^\s+-\s+([a-zA-Z_]+):\s*(.*)$/.exec(r);
    if (polozka && zoznam) {
      zoznam.push({ [polozka[1]]: polozka[2].trim().replace(/^["']|["']$/g, "") });
      continue;
    }
    const pole = /^\s+([a-zA-Z_]+):\s*(.*)$/.exec(r);
    if (pole && zoznam && zoznam.length) {
      zoznam[zoznam.length - 1][pole[1]] = pole[2].trim().replace(/^["']|["']$/g, "");
      continue;
    }
    const prosta = /^\s+-\s+(.*)$/.exec(r);
    if (prosta && zoznam) {
      zoznam.push({ _: prosta[1].trim().replace(/^["']|["']$/g, "") });
    }
  }
  if (zoznam) meta[kluc] = zoznam;
  return { meta, telo: src.slice(m[0].length) };
}

function nacitaj(subor: string): Clanok {
  const slug = path.basename(subor, ".md");
  const src = fs.readFileSync(path.join(ADRESAR, subor), "utf8");
  const { meta, telo } = hlavicka(src);
  /* H1 v tele je titulok — z tela ho vyhodíme, ak sa zhoduje s hlavičkou */
  const teloBezH1 = telo.replace(/^\s*#\s+[^\n]*\n/, "");
  const { html, osnova, slova } = markdown(teloBezH1);
  const kategoria = String(meta.category ?? "zaklady");
  const kw = String(meta.keywords ?? "")
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
  const faqRaw = Array.isArray(meta.faq) ? (meta.faq as Record<string, string>[]) : [];
  const faq = faqRaw.filter((f) => f.q && f.a).map((f) => ({ q: f.q, a: f.a }));
  const suvisiaceRaw = Array.isArray(meta.related)
    ? (meta.related as Record<string, string>[]).map((r) => r._ ?? "")
    : String(meta.related ?? "")
        .split(",")
        .map((s) => s.trim());
  const zOdkazov = [...html.matchAll(/href="\/blog\/([a-z0-9-]+)"/g)].map((m) => m[1]);
  const suvisiace = [...new Set([...suvisiaceRaw, ...zOdkazov])].filter((s) => s && s !== slug);
  return {
    slug,
    title: String(meta.title ?? slug),
    seoTitle: String(meta.seoTitle ?? meta.title ?? slug),
    description: String(meta.description ?? ""),
    date: String(meta.date ?? "2026-09-19"),
    category: kategoria,
    keywords: kw,
    cover: String(meta.cover ?? COVER_SLUG[slug] ?? COVER_KATEGORIE[kategoria] ?? COVER_DEFAULT),
    coverAlt: String(meta.coverAlt ?? meta.title ?? slug),
    faq,
    html,
    osnova,
    minut: Math.max(2, Math.round(slova / 200)),
    slova,
    suvisiace,
  };
}

let cache: Clanok[] | null = null;

/** Všetky články, najnovší prvý. */
export function vsetkyClanky(): Clanok[] {
  if (cache) return cache;
  if (!fs.existsSync(ADRESAR)) return (cache = []);
  cache = fs
    .readdirSync(ADRESAR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map(nacitaj)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.title.localeCompare(b.title)));
  return cache;
}

export function najdiClanok(slug: string): Clanok | undefined {
  return vsetkyClanky().find((c) => c.slug === slug);
}

/** Súvisiace články: najprv tie, na ktoré článok odkazuje, doplnené rovnakou kategóriou. */
export function suvisiaceClanky(c: Clanok, n = 3): Clanok[] {
  const vsetky = vsetkyClanky().filter((x) => x.slug !== c.slug);
  const prve = c.suvisiace.map((s) => vsetky.find((x) => x.slug === s)).filter(Boolean) as Clanok[];
  const dalsie = vsetky.filter((x) => !prve.includes(x) && x.category === c.category);
  const zvysok = vsetky.filter((x) => !prve.includes(x) && !dalsie.includes(x));
  return [...prve, ...dalsie, ...zvysok].slice(0, n);
}

export const KATEGORIE: Record<string, { sk: string; en: string }> = {
  skrinky: { sk: "Skrinky", en: "Cabinets" },
  akvaria: { sk: "Akváriá", en: "Aquariums" },
  zaklady: { sk: "Základy akvaristiky", en: "Aquarium basics" },
  interier: { sk: "Interiér", en: "Interior" },
};

export function datumSk(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d}. ${m}. ${y}`;
}
