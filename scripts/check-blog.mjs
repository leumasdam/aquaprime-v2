import { vsetkyClanky } from "../app/blog/clanky.ts";
for (const c of vsetkyClanky()) {
  const chyby = [];
  if (!c.description || c.description.length < 100 || c.description.length > 165) chyby.push(`desc ${c.description.length}`);
  if (c.seoTitle.length > 58) chyby.push(`seoTitle ${c.seoTitle.length}`);
  if (c.title.length > 85) chyby.push(`title ${c.title.length}`);
  if (c.faq.length < 3) chyby.push(`faq ${c.faq.length}`);
  if (c.osnova.length < 5) chyby.push(`h2 ${c.osnova.length}`);
  if (/&lt;|\*\*|^#/.test(c.html)) chyby.push("raw md");
  const zle = [...c.html.matchAll(/href="([^"]+)"/g)].map(m=>m[1]).filter(h=>!/^\/(skrinky|akvaria|technologia|konfigurator|materialy|realizacie|dopyt|kontakt|blog)(\/|$)|^#/.test(h));
  if (zle.length) chyby.push("links: "+zle.join(","));
  console.log(c.slug.padEnd(30), c.date, String(c.slova).padStart(5), "slov", c.minut+"min", "H2:"+c.osnova.length, "faq:"+c.faq.length, "tab:"+(c.html.match(/<table/g)||[]).length, "cat:"+c.category, chyby.length? "  !! "+chyby.join(" | "):"");
}
