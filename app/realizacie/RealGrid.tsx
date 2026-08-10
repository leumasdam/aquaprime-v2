"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type CSSProperties } from "react";

type Cat = "obyvacie" | "komercne" | "hotely" | "kancelarie";

const CATS: { id: Cat | "all"; label: string }[] = [
  { id: "all", label: "Všetky projekty" },
  { id: "obyvacie", label: "Obývacie priestory" },
  { id: "komercne", label: "Komerčné priestory" },
  { id: "hotely", label: "Hotely & wellness" },
  { id: "kancelarie", label: "Kancelárie" },
];

type Project = {
  name: string;
  place: string;
  cat: Cat;
  img: string;
};

// Ukážkové projekty — mená a lokality sú draft, vymenia sa za reálne realizácie klienta.
const FEATURED = {
  name: "Vila Devín",
  place: "Bratislava, Slovensko",
  desc: "Akvárium ako architektonický prvok, ktorý prepája prírodu s minimalistickým interiérom.",
  img: "/materialy/interier-1.webp",
};

const PROJECTS: Project[] = [
  { name: "Rezidencia Horský park", place: "Bratislava, Slovensko", cat: "obyvacie", img: "/materialy/interier-2.webp" },
  { name: "Penthouse Eurovea", place: "Bratislava, Slovensko", cat: "obyvacie", img: "/materialy/interier-3.webp" },
  { name: "Vila Tatranská", place: "Vysoké Tatry, Slovensko", cat: "obyvacie", img: "/materialy/interier-4.webp" },
  { name: "Wellness hotel Chopok", place: "Demänovská dolina, Slovensko", cat: "hotely", img: "/materialy/interier-5.webp" },
  { name: "Kancelárie Riverside", place: "Bratislava, Slovensko", cat: "kancelarie", img: "/img/mod-realizations.webp" },
  { name: "Rezidencia Slnečnice", place: "Bratislava, Slovensko", cat: "komercne", img: "/img/tile-realizacie.webp" },
];

export default function RealGrid() {
  const [cat, setCat] = useState<Cat | "all">("all");
  const items = PROJECTS.filter((p) => cat === "all" || p.cat === cat);
  const showFeatured = cat === "all" || cat === "obyvacie";

  return (
    <>
      <div className="real-filter">
        <div className="wrap real-filter__row" role="group" aria-label="Filter projektov">
          {CATS.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`real-filter__btn${cat === c.id ? " is-on" : ""}`}
              aria-pressed={cat === c.id}
              onClick={() => setCat(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="wrap real-grid" key={cat}>
        {showFeatured && (
          <article className="real-feat">
            <div className="real-feat__copy">
              <span className="real-feat__tag">Vybraný projekt</span>
              <h2 className="real-feat__name display">{FEATURED.name}</h2>
              <span className="real-feat__place">{FEATURED.place}</span>
              <p className="real-feat__desc">{FEATURED.desc}</p>
              <Link href="/dopyt" className="real-feat__cta">
                CHCEM PODOBNÉ RIEŠENIE <span aria-hidden>⟶</span>
              </Link>
            </div>
            <div className="real-feat__img">
              <Image
                src={FEATURED.img}
                alt={`${FEATURED.name} — realizácia AQUAPRIME`}
                fill
                sizes="(max-width: 900px) 92vw, 34vw"
              />
            </div>
          </article>
        )}

        {items.map((p, i) => (
          <article
            className="real-card"
            key={p.name}
            style={{ "--rd": `${(i % 3) * 80}ms` } as CSSProperties}
          >
            <Image
              src={p.img}
              alt={`${p.name} — realizácia AQUAPRIME`}
              fill
              sizes="(max-width: 900px) 92vw, 22vw"
            />
            <span className="real-card__shade" aria-hidden />
            <span className="real-card__meta">
              <b>{p.name}</b>
              {p.place}
            </span>
          </article>
        ))}
      </div>

      {items.length === 0 && (
        <p className="wrap real-empty">
          V tejto kategórii zatiaľ nemáme zverejnenú realizáciu —{" "}
          <Link href="/dopyt">buďte prvá</Link>.
        </p>
      )}
    </>
  );
}
