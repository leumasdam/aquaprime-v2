"use client";

/**
 * Moderný filter systém pre katalógy — jeden vizuálny jazyk pre skrinky,
 * akváriá aj čokoľvek ďalšie:
 *
 *  <FilterLista>   sticky sklenená lišta pod hlavičkou
 *  <Segmented>     prepínač s posuvným indikátorom (rad, objemové pásmo…)
 *  <Filter>        chip otvárajúci panel (desktop popover, mobil bottom-sheet)
 *  <FilterVolba>   riadok voľby v paneli (checkbox / radio štýl)
 *  <FilterChipy>   aktívne filtre s krížikom + „Zrušiť všetko"
 *  <PocetVysledkov> počítadlo s mikro-animáciou pri zmene
 */

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

/* ---------- lišta ---------- */

export function FilterLista({ children }: { children: ReactNode }) {
  return (
    <div className="fbar" role="group" aria-label="Filtre katalógu">
      {children}
    </div>
  );
}

/* ---------- segmented prepínač ---------- */

export type SegVolba<T extends string> = { id: T; label: string; count?: number };

export function Segmented<T extends string>({
  volby,
  value,
  onChange,
  ariaLabel,
}: {
  volby: SegVolba<T>[];
  value: T;
  onChange: (v: T) => void;
  ariaLabel: string;
}) {
  const idx = Math.max(0, volby.findIndex((v) => v.id === value));
  return (
    <div
      className="fseg"
      role="tablist"
      aria-label={ariaLabel}
      style={{ "--n": volby.length, "--i": idx } as CSSProperties}
    >
      <span className="fseg__ind" aria-hidden />
      {volby.map((v) => (
        <button
          key={v.id}
          type="button"
          role="tab"
          aria-selected={v.id === value}
          className={`fseg__opt${v.id === value ? " is-on" : ""}`}
          onClick={() => onChange(v.id)}
        >
          {v.label}
          {v.count !== undefined && <span className="fseg__count">{v.count}</span>}
        </button>
      ))}
    </div>
  );
}

/* ---------- prepínač áno/nie ---------- */

/**
 * Samostatná zapínateľná voľba v lište — na vlastnosť, ktorá sa buď má
 * alebo nemá (podsvietenie). Dropdown s dvoma položkami by tu bol zbytočný
 * krok navyše.
 */
export function Prepinac({
  label,
  zapnuty,
  onToggle,
  ikona,
  count,
}: {
  label: string;
  zapnuty: boolean;
  onToggle: () => void;
  ikona?: ReactNode;
  count?: number;
}) {
  return (
    <button
      type="button"
      className={`fsw${zapnuty ? " is-on" : ""}`}
      aria-pressed={zapnuty}
      onClick={onToggle}
    >
      {ikona && (
        <span className="fsw__ico" aria-hidden>
          {ikona}
        </span>
      )}
      {label}
      {count !== undefined && <span className="fsw__count">{count}</span>}
    </button>
  );
}

/* ---------- dropdown filter ---------- */

const ZavriContext = createContext<() => void>(() => {});

export function Filter({
  label,
  hodnota,
  aktivny,
  children,
}: {
  label: string;
  /** zhrnutie výberu na chipe — napr. „120, 150 cm" */
  hodnota: string;
  aktivny: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const zavri = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", zavri);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", zavri);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <div className={`fdd${open ? " is-open" : ""}`} ref={ref}>
      <button
        type="button"
        className={`fdd__btn${aktivny ? " is-active" : ""}`}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="fdd__label">{label}</span>
        <span className="fdd__value">{hodnota}</span>
        <svg className="fdd__chev" viewBox="0 0 12 12" aria-hidden>
          <path d="m2.5 4.5 3.5 3.5 3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="fdd__panel" role="listbox">
          <ZavriContext.Provider value={() => setOpen(false)}>{children}</ZavriContext.Provider>
        </div>
      )}
    </div>
  );
}

export function FilterVolba({
  checked,
  onSelect,
  label,
  count,
  typ = "check",
}: {
  checked: boolean;
  onSelect: () => void;
  label: string;
  count?: number;
  /** radio voľba panel po výbere zavrie, checkbox necháva otvorený */
  typ?: "check" | "radio";
}) {
  const zavri = useContext(ZavriContext);
  return (
    <button
      type="button"
      role="option"
      aria-selected={checked}
      className={`fopt${checked ? " is-on" : ""}`}
      onClick={() => {
        onSelect();
        if (typ === "radio") zavri();
      }}
    >
      <span className={`fopt__box fopt__box--${typ}`} aria-hidden>
        {checked && (
          <svg viewBox="0 0 12 12">
            <path d="m2.5 6.5 2.5 2.5 4.5-5.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      {label}
      {count !== undefined && <span className="fopt__count">{count}</span>}
    </button>
  );
}

/* ---------- aktívne filtre ---------- */

export function FilterChipy({
  chipy,
  onZrusVsetko,
}: {
  chipy: { id: string; label: string; onRemove: () => void }[];
  onZrusVsetko: () => void;
}) {
  if (chipy.length === 0) return null;
  return (
    <div className="fchips">
      {chipy.map((c) => (
        <button key={c.id} type="button" className="fchip" onClick={c.onRemove}>
          {c.label}
          <span aria-hidden>×</span>
        </button>
      ))}
      {chipy.length > 1 && (
        <button type="button" className="fchip fchip--clear" onClick={onZrusVsetko}>
          Zrušiť všetko
        </button>
      )}
    </div>
  );
}

/* ---------- počítadlo ---------- */

export function PocetVysledkov({ pocet, spolu, slovo }: { pocet: number; spolu: number; slovo: string }) {
  return (
    <span className="fbar__count" key={pocet} aria-live="polite">
      <b>{pocet === spolu ? spolu : `${pocet} z ${spolu}`}</b> {slovo}
    </span>
  );
}
