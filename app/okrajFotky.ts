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
 * farbu okraja fotky: biely packshot ostane na bielom, tmavý LED záber na
 * tmavom, bez pruhov inej farby po stranách (15. 11. 2026).
 */
type Okraj = { poloha: string; farba?: string };
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
  return { poloha, farba: farbaOkraja(d) };
}

/** priemerná farba krajného pásu fotky (všetky štyri strany) */
function farbaOkraja(d: Uint8ClampedArray): string {
  let r = 0, g = 0, b = 0, n = 0;
  for (let y = 0; y < VELKOST; y++) {
    for (let x = 0; x < VELKOST; x++) {
      if (x > 1 && x < VELKOST - 2 && y > 1 && y < VELKOST - 2) continue;
      const i = (y * VELKOST + x) * 4;
      r += d[i]; g += d[i + 1]; b += d[i + 2]; n++;
    }
  }
  return `rgb(${Math.round(r / n)}, ${Math.round(g / n)}, ${Math.round(b / n)})`;
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
  return { objectPosition: okraj.poloha, backgroundColor: okraj.farba };
}
