"use client";

import { useEffect, useState } from "react";
import { jeNahrataFotka } from "./products";

/**
 * Kam fotku v paneli usadiť. Fotky od klienta bývajú orezané tesne pri
 * okraji (detail pántu, bok skrinky) — keď taká fotka stojí v strede bieleho
 * panelu, rez trčí uprostred. Prečítame krajné stĺpce obrázka: ak je obsah
 * až po pravý okraj a ľavý je biely, fotka sadne k pravej hrane (a naopak).
 * Výsledok sa pre každú adresu počíta raz.
 */
const pamat = new Map<string, string>();
const VELKOST = 48;

/* „Obsah" je len výrazne tmavší pixel (rám, drevo, sklo). Jemný tieň či
   vineta pri okraji renderu má jas 170–232 a fotku posúvať nesmie — inak
   by sa celé rady skriniek lepili na ľavú hranu. */
const JAS_OBSAHU = 160;

function jeSvetly(d: Uint8ClampedArray, i: number): boolean {
  return d[i] >= JAS_OBSAHU && d[i + 1] >= JAS_OBSAHU && d[i + 2] >= JAS_OBSAHU;
}

async function zisti(src: string): Promise<string> {
  const img = new Image();
  img.decoding = "async";
  img.src = src;
  await img.decode();
  const platno = document.createElement("canvas");
  platno.width = VELKOST;
  platno.height = VELKOST;
  const ctx = platno.getContext("2d", { willReadFrequently: true });
  if (!ctx) return "center";
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
  if (pravy > prah && lavy <= prah) return "right center";
  if (lavy > prah && pravy <= prah) return "left center";
  return "center";
}

/** object-position pre fotku; „center", kým sa nezistí alebo pri renderoch z kódu */
export function useOkrajFotky(src: string | undefined): string {
  const [poloha, setPoloha] = useState<string>(() => (src && pamat.get(src)) || "center");
  useEffect(() => {
    if (!src || !jeNahrataFotka(src)) {
      setPoloha("center");
      return;
    }
    const z = pamat.get(src);
    if (z) {
      setPoloha(z);
      return;
    }
    let zije = true;
    zisti(src)
      .catch(() => "center")
      .then((p) => {
        pamat.set(src, p);
        if (zije) setPoloha(p);
      });
    return () => {
      zije = false;
    };
  }, [src]);
  return poloha;
}
