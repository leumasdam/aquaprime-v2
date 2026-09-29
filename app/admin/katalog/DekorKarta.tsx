"use client";

import { useState } from "react";
import type { Decor } from "../../products";
import Swatch from "../../Swatch";
import type { Chyba } from "../../katalog/kontrola";
import Fotky from "./Fotky";
import Vzorka from "./Vzorka";

const ODKIAL: { id: NonNullable<Decor["illuFrom"]>; popis: string }[] = [
  { id: "rozmer", popis: "z iného rozmeru toho istého radu" },
  { id: "rad", popis: "z iného radu (Premium / Štandard / Basic)" },
  { id: "dvierka", popis: "zo skrinky s iným počtom dvierok" },
  { id: "schema", popis: "schéma namiesto fotky" },
];

/**
 * Zmena poradia alebo mazanie fotiek nesmie rozhodiť štítok „ilustračné".
 * Pri niektorých dekoroch patrí len vybraným fotkám (illuIdx drží ich
 * poradové čísla). Čísla si preto prepočítame podľa samotných fotiek —
 * štítok ide s fotkou, nie s pozíciou.
 */
function prepocitajIllu(dekor: Decor, nove: string[]): number[] | undefined {
  if (!dekor.illuIdx) return undefined;
  const oznacene = new Set(dekor.illuIdx.map((i) => dekor.images[i]).filter(Boolean));
  const idx = nove.flatMap((src, i) => (oznacene.has(src) ? [i] : []));
  return idx.length ? idx : undefined;
}

export default function DekorKarta({
  dekor,
  poradie,
  pocet,
  chyby,
  otvorena: otvorenaNaZaciatku = false,
  onZmena,
  onPresun,
  onOdstran,
}: {
  dekor: Decor;
  poradie: number;
  pocet: number;
  chyby: Chyba[];
  /** rozbalená hneď po zobrazení — nový dekor, alebo keď má chybu */
  otvorena?: boolean;
  onZmena: (d: Decor) => void;
  onPresun: (smer: -1 | 1) => void;
  onOdstran: () => void;
}) {
  const zmen = (z: Partial<Decor>) => onZmena({ ...dekor, ...z });
  /* Skrinka má bežne desať dekorov po osem fotiek — rozbalené naraz by
     dali stránku dlhú ako rolka. Zbalený dekor ukáže vzorku, názov
     a pás náhľadov; rozbalí sa len ten, ktorý klient práve upravuje.
     Dekor s chybou sa rozbalí sám, nech je vidno, čo treba opraviť. */
  const [otvorenaVolba, setOtvorena] = useState(otvorenaNaZaciatku);
  const otvorena = otvorenaVolba || chyby.length > 0;
  const prvy = poradie === 0;
  const pocetFotiek = dekor.images.length;

  return (
    <article className={`kt-dekor${chyby.length ? " is-chyba" : ""}`}>
      <header className="kt-dekor__hlava">
        <span className="kt-dekor__cislo">{poradie + 1}</span>
        <span className="kt-dekor__vzorka">
          <Swatch swatch={dekor.swatch} />
        </span>
        <div className="kt-dekor__meno">
          {otvorena ? (
            <input
              className="kt-vstup kt-vstup--nazov"
              value={dekor.name}
              onChange={(e) => zmen({ name: e.target.value })}
              placeholder="Názov dekoru"
              aria-label="Názov dekoru"
            />
          ) : (
            <b className="kt-dekor__nazov">{dekor.name || "Bez názvu"}</b>
          )}
          <span className="ad-mono ad-muted">ID: {dekor.id}</span>
        </div>
        {!otvorena && dekor.images.length > 0 && (
          <span className="kt-dekor__nahlady" aria-hidden>
            {dekor.images.slice(0, 5).map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={`${src}-${i}`} src={src} alt="" loading="lazy" />
            ))}
            {dekor.images.length > 5 && <i>+{dekor.images.length - 5}</i>}
          </span>
        )}
        <span className={`ad-tag ${dekor.chyba ? "is-off" : pocetFotiek ? "is-a" : "is-off"}`}>
          {dekor.chyba ? "Čaká na fotky" : pocetFotiek ? `${pocetFotiek} fotiek` : "Bez fotky"}
        </span>
        <div className="kt-dekor__ovladace">
          <button type="button" onClick={() => onPresun(-1)} disabled={prvy} aria-label="Posunúť dekor vyššie">
            ↑
          </button>
          <button type="button" onClick={() => onPresun(1)} disabled={poradie === pocet - 1} aria-label="Posunúť dekor nižšie">
            ↓
          </button>
          <button type="button" className="kt-dekor__zmaz" onClick={onOdstran}>
            Odobrať
          </button>
          <button
            type="button"
            className="kt-dekor__rozbal"
            aria-expanded={otvorena}
            onClick={() => setOtvorena(!otvorena)}
          >
            {otvorena ? "Zbaliť" : "Upraviť"}
          </button>
        </div>
      </header>

      {otvorena && prvy && (
        <p className="kt-pozn">
          Prvý dekor je hlavný — jeho prvá fotka je titulná fotka skrinky v katalógu.
        </p>
      )}

      {otvorena && (
      <div className="kt-dekor__telo">
        <Vzorka id={dekor.id} hodnota={dekor.swatch} onZmena={(swatch) => zmen({ swatch })} />

        <label className="kt-prepinac">
          <input
            type="checkbox"
            checked={Boolean(dekor.chyba)}
            onChange={(e) => {
              const zapnut = e.target.checked;
              if (
                zapnut &&
                pocetFotiek &&
                !window.confirm(
                  `Dekor „${dekor.name}" má ${pocetFotiek} fotiek. Označením „čaká na fotky" sa z neho odstránia. Pokračovať?`,
                )
              )
                return;
              zmen(zapnut ? { chyba: true, images: [], led: undefined, illuIdx: undefined } : { chyba: undefined });
            }}
          />
          <span>
            <b>Čaká na fotky</b>
            <small>Dekor je v ponuke, ale ešte nie je nafotený. Na webe sa ukáže zošednutá vzorka a náhradný obrázok.</small>
          </span>
        </label>

        {!dekor.chyba && (
          <>
            <Fotky
              fotky={dekor.images}
              titulna={prvy}
              popis={`${dekor.name} — fotka`}
              onZmena={(images) => zmen({ images, illuIdx: prepocitajIllu(dekor, images) })}
            />

            <details className="kt-rozsirene">
              <summary>Ilustračné fotky</summary>
              <p className="ad-muted">
                Keď fotky nie sú z presne tejto skrinky, web pri nich ukáže štítok, aby zákazník vedel, že vidí
                podobný kus.
              </p>
              <label className="kt-prepinac">
                <input
                  type="checkbox"
                  checked={Boolean(dekor.inherited)}
                  onChange={(e) =>
                    zmen(
                      e.target.checked
                        ? { inherited: true, illuFrom: dekor.illuFrom ?? "rozmer" }
                        : { inherited: undefined, illuFrom: undefined, illuSize: undefined, illuDvierka: undefined, illuIdx: undefined },
                    )
                  }
                />
                <span>
                  <b>Fotky sú ilustračné</b>
                </span>
              </label>
              {dekor.inherited && (
                <div className="kt-riadok">
                  <label className="kt-pole">
                    <span>Odkiaľ sú fotky</span>
                    <select
                      className="kt-vstup"
                      value={dekor.illuFrom ?? "rozmer"}
                      onChange={(e) => zmen({ illuFrom: e.target.value as Decor["illuFrom"] })}
                    >
                      {ODKIAL.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.popis}
                        </option>
                      ))}
                    </select>
                  </label>
                  {dekor.illuFrom === "rozmer" && (
                    <label className="kt-pole">
                      <span>Rozmer na fotke</span>
                      <input
                        className="kt-vstup"
                        value={dekor.illuSize ?? ""}
                        placeholder="napr. 100 × 40 × 80 cm"
                        onChange={(e) => zmen({ illuSize: e.target.value || undefined })}
                      />
                    </label>
                  )}
                  {dekor.illuFrom === "dvierka" && (
                    <label className="kt-pole">
                      <span>Počet dvierok na fotke</span>
                      <input
                        className="kt-vstup"
                        type="number"
                        min={1}
                        max={6}
                        value={dekor.illuDvierka ?? ""}
                        onChange={(e) => zmen({ illuDvierka: Number(e.target.value) || undefined })}
                      />
                    </label>
                  )}
                </div>
              )}
              {dekor.illuIdx && (
                <p className="ad-muted">
                  Štítok „ilustračné" má len {dekor.illuIdx.length} z {pocetFotiek} fotiek (č.{" "}
                  {dekor.illuIdx.map((i) => i + 1).join(", ")}). Pri presúvaní fotiek ide štítok s fotkou.
                </p>
              )}
            </details>

            <details className="kt-rozsirene">
              <summary>
                LED vizualizácie
                {(dekor.led?.zlta?.length || dekor.led?.modra?.length) ? (
                  <span className="ad-tag is-b">
                    {(dekor.led?.zlta?.length ?? 0) + (dekor.led?.modra?.length ?? 0)} fotiek
                  </span>
                ) : null}
              </summary>
              <p className="ad-muted">
                Fotky skrinky so zapnutým podsvietením. Ukážu sa, keď si zákazník na webe zapne LED.
              </p>
              <h4 className="kt-podnadpis">Teplá biela</h4>
              <Fotky
                fotky={dekor.led?.zlta ?? []}
                popis={`${dekor.name} — LED teplá biela`}
                onZmena={(zlta) => zmen({ led: { ...dekor.led, zlta } })}
              />
              <h4 className="kt-podnadpis">Modrá</h4>
              <Fotky
                fotky={dekor.led?.modra ?? []}
                popis={`${dekor.name} — LED modrá`}
                onZmena={(modra) => zmen({ led: { ...dekor.led, modra } })}
              />
            </details>
          </>
        )}

        {chyby.length > 0 && (
          <ul className="kt-chyby">
            {chyby.map((c, i) => (
              <li key={i}>{c.sprava}</li>
            ))}
          </ul>
        )}
      </div>
      )}
    </article>
  );
}
