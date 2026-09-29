"use client";

import { useRef, useState, type DragEvent } from "react";
import { nahrajFotku } from "./api";

type Nahravanie = { id: string; nazov: string; chyba?: string };

/**
 * Galéria fotiek jedného dekoru v editore. Fotky sa dajú nahrať (tlačidlom
 * alebo pretiahnutím súborov), preusporiadať (šípkami alebo ťahaním)
 * a zmazať. Zmena sa na web dostane až uložením celej skrinky.
 */
export default function Fotky({
  fotky,
  onZmena,
  titulna = false,
  popis = "fotku",
}: {
  fotky: string[];
  onZmena: (fotky: string[]) => void;
  /** prvá fotka tejto galérie je titulná fotka skrinky */
  titulna?: boolean;
  popis?: string;
}) {
  const vstup = useRef<HTMLInputElement>(null);
  const [nahravane, setNahravane] = useState<Nahravanie[]>([]);
  const [nadZonou, setNadZonou] = useState(false);
  const [tahana, setTahana] = useState<number | null>(null);
  // posledný známy zoznam — nahrávanie beží dlhšie a medzitým sa môže zmeniť
  const aktualne = useRef(fotky);
  aktualne.current = fotky;

  const presun = (z: number, na: number) => {
    if (na < 0 || na >= fotky.length || z === na) return;
    const nove = [...fotky];
    const [x] = nove.splice(z, 1);
    nove.splice(na, 0, x);
    onZmena(nove);
  };

  const nahraj = async (subory: FileList | File[]) => {
    const zoznam = [...subory].filter((f) => f.type.startsWith("image/") || /\.(heic|heif)$/i.test(f.name));
    if (!zoznam.length) return;
    const polozky = zoznam.map((f) => ({ id: crypto.randomUUID(), nazov: f.name }));
    setNahravane((n) => [...n, ...polozky]);

    // nahrávame po jednej, nech poradie fotiek sedí s poradím výberu
    for (let i = 0; i < zoznam.length; i++) {
      const id = polozky[i].id;
      try {
        const src = await nahrajFotku(zoznam[i]);
        aktualne.current = [...aktualne.current, src];
        onZmena(aktualne.current);
        setNahravane((n) => n.filter((x) => x.id !== id));
      } catch (e) {
        const sprava = e instanceof Error ? e.message : "Nahratie zlyhalo.";
        setNahravane((n) => n.map((x) => (x.id === id ? { ...x, chyba: sprava } : x)));
      }
    }
  };

  const pustenie = (e: DragEvent) => {
    e.preventDefault();
    setNadZonou(false);
    if (e.dataTransfer.files?.length) void nahraj(e.dataTransfer.files);
  };

  return (
    <div className="kt-foto">
      <ul className="kt-foto__mriezka">
        {fotky.map((src, i) => (
          <li
            key={`${src}-${i}`}
            className={`kt-foto__kus${tahana === i ? " is-tahana" : ""}`}
            draggable
            onDragStart={(e) => {
              setTahana(i);
              e.dataTransfer.effectAllowed = "move";
            }}
            onDragEnd={() => setTahana(null)}
            onDragOver={(e) => {
              if (tahana !== null) e.preventDefault();
            }}
            onDrop={(e) => {
              if (tahana === null) return;
              e.preventDefault();
              e.stopPropagation();
              presun(tahana, i);
              setTahana(null);
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={`${popis} ${i + 1}`} loading="lazy" draggable={false} />
            <span className="kt-foto__cislo">{i + 1}</span>
            {titulna && i === 0 && <span className="kt-foto__titulna">Titulná</span>}
            <div className="kt-foto__akcie">
              <button type="button" onClick={() => presun(i, i - 1)} disabled={i === 0} aria-label="Posunúť dopredu">
                ←
              </button>
              <button
                type="button"
                onClick={() => presun(i, i + 1)}
                disabled={i === fotky.length - 1}
                aria-label="Posunúť dozadu"
              >
                →
              </button>
              {i > 0 && (
                <button type="button" onClick={() => presun(i, 0)} aria-label="Dať na začiatok" title="Dať na začiatok">
                  ⤒
                </button>
              )}
              <button
                type="button"
                className="kt-foto__zmaz"
                onClick={() => onZmena(fotky.filter((_, k) => k !== i))}
                aria-label="Odstrániť fotku"
                title="Odstrániť fotku"
              >
                ×
              </button>
            </div>
          </li>
        ))}

        {nahravane.map((n) => (
          <li key={n.id} className={`kt-foto__kus kt-foto__kus--nahrava${n.chyba ? " is-chyba" : ""}`}>
            <span className="kt-foto__stav">
              {n.chyba ? (
                <>
                  <b>Nepodarilo sa</b>
                  {n.chyba}
                  <button type="button" onClick={() => setNahravane((x) => x.filter((y) => y.id !== n.id))}>
                    Zavrieť
                  </button>
                </>
              ) : (
                <>
                  <i className="kt-toc" aria-hidden />
                  Nahrávam…
                </>
              )}
            </span>
          </li>
        ))}

        <li
          className={`kt-foto__zona${nadZonou ? " is-nad" : ""}`}
          onDragOver={(e) => {
            if (tahana !== null) return;
            e.preventDefault();
            setNadZonou(true);
          }}
          onDragLeave={() => setNadZonou(false)}
          onDrop={pustenie}
        >
          <button type="button" onClick={() => vstup.current?.click()}>
            <span aria-hidden>+</span>
            Pridať fotky
            <small>alebo ich sem pretiahnite</small>
          </button>
          <input
            ref={vstup}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => {
              if (e.target.files) void nahraj(e.target.files);
              e.target.value = "";
            }}
          />
        </li>
      </ul>
    </div>
  );
}
