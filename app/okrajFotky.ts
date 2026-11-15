"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { jeNahrataFotka } from "./products";

/**
 * Kam fotku v paneli usadiť. Fotky od klienta bývajú orezané tesne pri
 * okraji (detail pántu, bok skrinky) — keď taká fotka stojí v strede bieleho
 * panelu, rez trčí uprostred. Prečítame krajné stĺpce obrázka: ak je obsah
 * až po pravý okraj a ľavý je biely, fotka sadne k pravej hrane (a naopak).
 * Výsledok sa pre každú adresu počíta raz.
 *
 * Z tých istých pixelov sa zistí aj farba okraja fotky. Nahratá fotka sa
 * nikdy neoreže (contain), takže okolo nej ostane voľná plocha. Tá dostane
 * farby krajných stĺpcov fotky po celej výške: biely packshot ostane na
 * bielom, tmavý LED záber plynulo pokračuje do strán aj s podlahou a stenou,
 * bez pruhov inej farby (15. 11. 2026).
 */
type Okraj = { poloha: string; farba?: string; pozadie?: string };
const pamat = new Map<string, Okraj>();
const VELKOST = 48;

/* „Obsah" je len výrazne tmavší pixel (rám, drevo, sklo). Jemný tieň či
   vineta pri okraji renderu má jas 170–232 a fotku posúvať nesmie — inak
   by sa celé rady skriniek lepili na ľavú hranu. */
const JAS_OBSAHU = 160;

function jeSvetly(d: Uint8ClampedArray, i: number): boolean {
  return d[i] >= JAS_OBSAHU && d[i + 1] >= JAS_OBSAHU && d[i + 2] >= JAS_OBSAHU;
}

async function zisti(src: string): Promise<Okraj> {
  const img = new Image();
  img.decoding = "async";
  img.src = src;
  await img.decode();
  const platno = document.createElement("canvas");
  platno.width = VELKOST;
  platno.height = VELKOST;
  const ctx = platno.getContext("2d", { willReadFrequently: true });
  if (!ctx) return { poloha: "center" };
  ctx.drawImage(img, 0, 0, VELKOST, VELKOST);
  const d = ctx.getImageData(0, 0, VELKOST, VELKOST).data;
  let lavy = 0;
  let pravy = 0;
  /* krajné dva stĺpce — stačí, keď obsah siaha k okraju aspoň na časti výšky
     (detail pántu má pri hrane len nohu rámu) */
  for (let y = 0; y < VELKOST; y++) {
    if (!jeSvetly(d, (y * VELKOST) * 4) || !jeSvetly(d, (y * VELKOST + 1) * 4)) lavy++;
    if (!jeSvetly(d, (y * VELKOST + VELKOST - 1) * 4) || !jeSvetly(d, (y * VELKOST + VELKOST - 2) * 4)) pravy++;
  }
  /* stačí úzky pás obsahu pri hrane (vrchná doska vybiehajúca z fotky) */
  const prah = VELKOST * 0.05;
  const poloha =
    pravy > prah && lavy <= prah ? "right center" : lavy > prah && pravy <= prah ? "left center" : "center";
  return { poloha, ...pozadieOkraja(d) };
}

const PASY = 8;

/** priemerná farba obdĺžnika vo vzorke */
function priemer(d: Uint8ClampedArray, x0: number, x1: number, y0: number, y1: number): string {
  let r = 0, g = 0, b = 0, n = 0;
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const i = (y * VELKOST + x) * 4;
      r += d[i]; g += d[i + 1]; b += d[i + 2]; n++;
    }
  }
  return `rgb(${Math.round(r / n)}, ${Math.round(g / n)}, ${Math.round(b / n)})`;
}

/**
 * Voľná plocha býva vľavo a vpravo od fotky. Každá polovica dostane
 * zvislý prechod farieb krajného stĺpca fotky v ôsmich pásoch, takže
 * fotka do strán plynulo pokračuje. Pri ploche nad a pod fotkou ostanú
 * aspoň farby jej rohov. „farba" je jednofarebná záloha.
 */
function pozadieOkraja(d: Uint8ClampedArray): { farba: string; pozadie: string } {
  const vyska = VELKOST / PASY;
  const stlpec = (x0: number, x1: number) =>
    Array.from({ length: PASY }, (_, k) => {
      const kde = (((k + 0.5) / PASY) * 100).toFixed(1);
      return `${priemer(d, x0, x1, Math.round(k * vyska), Math.round((k + 1) * vyska))} ${kde}%`;
    }).join(", ");
  const lavy = `linear-gradient(${stlpec(0, 2)})`;
  const pravy = `linear-gradient(${stlpec(VELKOST - 2, VELKOST)})`;
  return { farba: priemer(d, 0, VELKOST, 0, 2), pozadie: `${lavy}, ${pravy}` };
}

const STRED: Okraj = { poloha: "center" };

/**
 * Štýl pre fotku: object-position a farba voľnej plochy okolo nej.
 * Kým sa nezistí, alebo pri renderoch z kódu, je fotka v strede bez farby.
 */
export function useOkrajFotky(src: string | undefined): CSSProperties {
  const [okraj, setOkraj] = useState<Okraj>(() => (src && pamat.get(src)) || STRED);
  useEffect(() => {
    if (!src || !jeNahrataFotka(src)) {
      setOkraj(STRED);
      return;
    }
    const z = pamat.get(src);
    if (z) {
      setOkraj(z);
      return;
    }
    let zije = true;
    zisti(src)
      .catch(() => STRED)
      .then((o) => {
        pamat.set(src, o);
        if (zije) setOkraj(o);
      });
    return () => {
      zije = false;
    };
  }, [src]);
  return {
    objectPosition: okraj.poloha,
    backgroundColor: okraj.farba,
    backgroundImage: okraj.pozadie,
    ...(okraj.pozadie && {
      backgroundPosition: "left, right",
      backgroundSize: "50% 100%",
      backgroundRepeat: "no-repeat",
    }),
  };
}
