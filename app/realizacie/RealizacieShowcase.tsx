"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type TouchEvent } from "react";
import RealizacieHero from "./RealizacieHero";
import { categories, photo, projects as PROJEKTY_SK, type Category, type Project } from "./projects";
import { projektEN } from "./projects-en";
import s from "./realizacie.module.css";
import { odkaz, type Jazyk } from "../jazyk";
import type { Slovnik } from "../preklady";

function Review({ project }: { project: Project }) {
  return <p className={s.review}>{project.review}</p>;
}
function Arrow({ back = false }: { back?: boolean }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden style={{ transform: back ? "rotate(180deg)" : undefined }}><path d="M4 12h15m-6-6 6 6-6 6" /></svg>;
}

export default function RealizacieShowcase({ t, jazyk }: { t: Slovnik["realizacie"]; jazyk: Jazyk }) {
  /* zobrazované texty sú v jazyku stránky, filtrovanie beží na SK kategóriách */
  const projects = jazyk === "en" ? PROJEKTY_SK.map(projektEN) : PROJEKTY_SK;
  const [category, setCategory] = useState<Category>(categories[0]);
  const [selected, setSelected] = useState<Project | null>(null);
  const [split, setSplit] = useState(50);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const visible = projects.filter(p => category === categories[0] || p.category === category);
  const movePhoto = (direction: number) => setSelected(p => {
    const index = visible.findIndex(item => item.id === p?.id);
    return visible[(index + direction + visible.length) % visible.length];
  });
  const openPhoto = (project: Project) => { opener.current = document.activeElement as HTMLElement; setSelected(project); };
  const closePhoto = () => { dialog.current?.close(); setSelected(null); opener.current?.focus(); };
  const touchStart = (e: TouchEvent) => { touch.current = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY }; };
  const touchEnd = (e: TouchEvent, move: (n: number) => void) => {
    if (!touch.current) return;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) move(dx < 0 ? 1 : -1);
    touch.current = null;
  };
  const isOpen = selected !== null;
  useEffect(() => {
    if (!isOpen) return;
    dialog.current?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = overflow; };
  }, [isOpen]);

  return <>
    <RealizacieHero t={t} jazyk={jazyk} />

    <section id="galeria" className={s.gallery} aria-labelledby="gallery-title">
      <h2 id="gallery-title" className={s.galleryTitle}>{t.galeria}</h2>
      <div className={s.filterBar}><div className={s.filters} role="group" aria-label={t.filtrovat}>{categories.map((c, ci) => <button type="button" key={c} aria-pressed={category === c} onClick={() => setCategory(c)}>{t.kategorie[ci]}<span>{c === categories[0] ? projects.length : projects.filter(p => p.category === c).length}</span></button>)}</div><span className={s.resultCount} role="status">{t.zabery} {visible.length} / {projects.length}</span></div>
      <div className={s.grid}>{visible.map(p => <article className={s.card} key={p.id}>
        <button type="button" className={s.cardImage} onClick={() => openPhoto(p)} aria-label={`${t.zvacsit}: ${p.title}`}><Image src={photo(p)} alt={p.alt} fill sizes="(max-width: 620px) 90vw, (max-width: 1000px) 44vw, 29vw" /><span className={s.zoom} aria-hidden>↗</span><span className={s.cardCategory}>{t.kategorie[categories.indexOf(p.category)]}</span></button>
        <div className={s.cardText}><p className={s.detail}>{p.detail}</p><h3><button type="button" onClick={() => openPhoto(p)}>{p.title}</button></h3><Review project={p} /></div>
      </article>)}</div>
    </section>

    <section className={s.transformation} aria-labelledby="transformation-title">
      <div className={s.transformCopy}><p className={s.kicker}>{t.predPoKicker}</p><h2 id="transformation-title">{t.predPoTitul1}<br />{t.predPoTitul2}</h2><p>{t.predPoText}</p><p className={s.small}>{t.predPoPozn}</p><Link href={odkaz("/dopyt", jazyk)} className={s.textLink}>{t.predPoCta} <span aria-hidden>↗</span></Link></div>
      <div className={s.compareBlock}>
        <div className={s.compare} style={{ "--split": `${split}%` } as CSSProperties}>
          <Image src={photo(projects[4])} alt={t.altPo} fill sizes="(max-width: 760px) 90vw, 52vw" />
          <div className={s.before}><Image src={photo(projects[6])} alt={t.altPred} fill sizes="(max-width: 760px) 90vw, 52vw" /></div>
          <span className={s.beforeLabel}>{t.pred}</span><span className={s.afterLabel}>{t.po}</span><span className={s.divider} aria-hidden><span>‹ ›</span></span>
          <input type="range" min="0" max="100" value={split} onChange={e => setSplit(Number(e.target.value))} aria-label={t.porovnat} aria-valuetext={t.porovnatHodnota.replace("{n}", String(split))} />
        </div><p className={s.compareHint}>{t.potiahnite}</p>
      </div>
    </section>

    <dialog ref={dialog} className={s.lightbox} aria-labelledby="photo-title" onCancel={e => { e.preventDefault(); closePhoto(); }} onClick={e => { if (e.target === e.currentTarget) closePhoto(); }} onKeyDown={e => { if (e.key === "ArrowRight") { e.preventDefault(); movePhoto(1); } if (e.key === "ArrowLeft") { e.preventDefault(); movePhoto(-1); } }}>
      {selected && <div className={s.lightboxInner}>
        <button type="button" className={s.close} aria-label={t.zavriet} onClick={closePhoto} autoFocus>✕</button>
        <div className={s.lightboxImage} onTouchStart={touchStart} onTouchEnd={e => touchEnd(e, movePhoto)}><Image src={photo(selected)} alt={selected.alt} fill sizes="(max-width: 760px) 94vw, 68vw" /></div>
        <div className={s.lightboxCopy}><div aria-live="polite" aria-atomic="true"><p className={s.kicker}>{t.kategorie[categories.indexOf(selected.category)]}</p><h2 id="photo-title">{selected.title}</h2><p className={s.detail}>{selected.detail}</p><Review project={selected} /></div><Link href={odkaz("/dopyt", jazyk)} className={s.primary}>{t.chcem}</Link><div className={s.arrows}><button type="button" disabled={visible.length < 2} onClick={() => movePhoto(-1)} aria-label={t.predchadzajuca}><Arrow back /></button><span>{visible.findIndex(p => p.id === selected.id) + 1} / {visible.length}</span><button type="button" disabled={visible.length < 2} onClick={() => movePhoto(1)} aria-label={t.nasledujuca}><Arrow /></button></div></div>
      </div>}
    </dialog>
  </>;
}
