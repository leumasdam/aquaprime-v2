"""
Otočky všetkých skriniek z katalógu: kalibrácia farby podľa fotiek + render.

Farba dekoru sa nenastavuje odhadom. Pre každý dekor sa najprv urobia dva
skúšobné rendre s rôznym ziskom, z nich sa vypočíta odozva scény
(lineárne: render = k · zisk + prostredie) a dopočíta sa zisk, pri ktorom
má plocha dvierok presne tú farbu, akú má na klientovej fotke. Až potom
sa renderuje celá otočka.

  python scripts/otocky3d.py --zoznam            # čo sa bude renderovať
  python scripts/otocky3d.py --iba premium-3-black-matt
  python scripts/otocky3d.py                     # všetko
"""
import argparse
import json
import os
import re
import subprocess
import sys

import numpy as np
from PIL import Image

KOREN = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BLENDER = r"C:\Program Files\Blender Foundation\Blender 5.2\blender.exe"
SKRIPT = os.path.join(KOREN, "scripts", "skrinka3d.py")
VYSTUP = r"C:\Users\samue\Downloads\aquaprime-skrinky-export\otocky-3d"
DOCASNE = os.path.join(os.environ.get("TEMP", "/tmp"), "aq-otocky")
SNIMOK = 25
# reprezentatívny rozmer pre daný počet dvierok (Š × H × V v cm)
ROZMER = {2: "100x40x80", 3: "150x50x80", 4: "200x50x70"}


def katalog():
    s = open(os.path.join(KOREN, "app", "products.ts"), encoding="utf-8").read()
    m = "export const PRODUCTS: Product[] = "
    a = s.index(m) + len(m)
    b = s.index("\n];", a)
    return json.loads(s[a:b + 2])


def dvierka_podla_sirky(w):
    return 2 if w < 120 else 3 if w < 200 else 4


def kombinacie():
    """rad × počet dvierok × dekor, ktoré majú na webe fotky."""
    von = {}
    for p in katalog():
        for d in p["decors"]:
            if d.get("chyba") or not d["images"]:
                continue
            k = (p["tier"], dvierka_podla_sirky(p["w"]), d["id"])
            z = von.setdefault(k, {"nazov": d["name"], "swatch": d["swatch"], "fotky": []})
            z["fotky"].extend(d["images"])
    return von


def farba_z_fotky(fotky, swatch):
    """Cieľová farba dvierok: priemer plochy dvierok na klientovej fotke.

    Plocha dvierok sa nájde zhlukovaním farieb objektu — vyberie sa zhluk
    najbližší k vzorke dekoru, takže dvojfarebné dekory nezoberú korpus.
    """
    ciel = vzorka_farba(swatch[0])
    najlepsie, dist = None, 1e9
    for f in fotky[:4]:
        cesta = os.path.join(KOREN, "public", f.lstrip("/"))
        if not os.path.exists(cesta):
            continue
        a = np.asarray(Image.open(cesta).convert("RGB")).astype(float)
        maska = a.min(axis=2) < 236
        if maska.sum() < 5000:
            continue
        px = a[maska]
        # hrubé zhlukovanie na 5 odtieňov (k-means, pár iterácií stačí)
        idx = np.linspace(0, len(px) - 1, 5).astype(int)
        stredy = px[idx]
        for _ in range(8):
            d = ((px[:, None, :] - stredy[None]) ** 2).sum(axis=2)
            kam = d.argmin(axis=1)
            for i in range(5):
                if (kam == i).any():
                    stredy[i] = px[kam == i].mean(axis=0)
        for i in range(5):
            if (kam == i).sum() < len(px) * 0.05:
                continue
            r = float(np.sqrt(((stredy[i] - ciel) ** 2).sum()))
            if r < dist:
                dist, najlepsie = r, stredy[i]
    return najlepsie if najlepsie is not None else ciel


def vzorka_farba(swatch):
    if swatch.startswith("#"):
        h = swatch.lstrip("#")
        return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], dtype=float)
    cesta = os.path.join(KOREN, "public", swatch.lstrip("/"))
    return np.asarray(Image.open(cesta).convert("RGB")).reshape(-1, 3).mean(axis=0)


def render(rad, dv, dekor, swatch, vystup, snimok, zisk_d=(1, 1, 1), zisk_k=(1, 1, 1)):
    subprocess.run(
        [
            BLENDER, "--background", "--python", SKRIPT, "--",
            "--rad", rad, "--dvierka", str(dv), "--dekor", dekor,
            "--swatch", json.dumps(swatch), "--rozmer", ROZMER[dv],
            "--snimok", str(snimok), "--vystup", vystup,
            "--zisk-dvierka", ",".join(f"{v:.4f}" for v in zisk_d),
            "--zisk-korpus", ",".join(f"{v:.4f}" for v in zisk_k),
        ],
        check=True, capture_output=True,
    )


def zmeraj(cesta):
    """Priemerná farba plochy dvierok na čelnom zábere."""
    a = np.asarray(Image.open(cesta).convert("RGBA"))
    al = a[..., 3] > 200
    ys, xs = np.where(al)
    y0, y1, x0, x1 = ys.min(), ys.max(), xs.min(), xs.max()
    pas = a[int(y0 + 0.45 * (y1 - y0)):int(y0 + 0.75 * (y1 - y0)),
            int(x0 + 0.15 * (x1 - x0)):int(x0 + 0.85 * (x1 - x0)), :3]
    return pas.reshape(-1, 3).mean(axis=0)


def lin(v):
    return (np.clip(v, 0, 255) / 255.0) ** 2.2


def kalibruj(rad, dv, dekor, swatch, ciel_rgb):
    """Dva skúšobné rendre → odozva scény → zisk, pri ktorom render sedí na fotku."""
    kal = os.path.join(DOCASNE, "kal")
    merania = []
    for g in (1.0, 0.4):
        render(rad, dv, dekor, swatch, kal, 1, (g, g, g), (g, g, g))
        merania.append((g, lin(zmeraj(os.path.join(kal, "00.png")))))
    (g1, m1), (g2, m2) = merania
    k = (m1 - m2) / (g1 - g2)
    amb = m1 - k * g1
    with np.errstate(divide="ignore", invalid="ignore"):
        zisk = (lin(ciel_rgb) - amb) / k
    return np.clip(np.nan_to_num(zisk, nan=1.0), 0.02, 4.0)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--zoznam", action="store_true")
    ap.add_argument("--iba", default=None, help="napr. premium-3-black-matt")
    ap.add_argument("--snimok", type=int, default=SNIMOK)
    a = ap.parse_args()

    komb = kombinacie()
    kluce = sorted(komb, key=lambda k: (k[0], k[1], k[2]))
    if a.iba:
        kluce = [k for k in kluce if f"{k[0]}-{k[1]}-{k[2]}" == a.iba]
        if not kluce:
            sys.exit(f"nenašiel som {a.iba}")
    if a.zoznam:
        for k in kluce:
            print(f"{k[0]}-{k[1]}-{k[2]}  {komb[k]['nazov']}")
        print(len(kluce), "kombinácií")
        return

    os.makedirs(VYSTUP, exist_ok=True)
    zaznam = {}
    for i, k in enumerate(kluce, 1):
        rad, dv, dekor = k
        z = komb[k]
        meno = f"{rad.upper()}-{dv}dv-{dekor}"
        ciel_rgb = farba_z_fotky(z["fotky"], z["swatch"])
        zisk = kalibruj(rad, dv, dekor, z["swatch"], ciel_rgb)
        snimky = os.path.join(DOCASNE, meno)
        render(rad, dv, dekor, z["swatch"], snimky, a.snimok, zisk, zisk)
        kontrola = zmeraj(os.path.join(snimky, "00.png"))
        gif(snimky, os.path.join(VYSTUP, meno + ".gif"), a.snimok)
        zaznam[meno] = {
            "dekor": z["nazov"],
            "ciel": [round(float(v)) for v in ciel_rgb],
            "render": [round(float(v)) for v in kontrola],
            "zisk": [round(float(v), 3) for v in zisk],
        }
        print(f"[{i}/{len(kluce)}] {meno}  cieľ {zaznam[meno]['ciel']} → render {zaznam[meno]['render']}")
    with open(os.path.join(VYSTUP, "kalibracia.json"), "w", encoding="utf-8") as f:
        json.dump(zaznam, f, ensure_ascii=False, indent=1)
    print(f"hotovo → {VYSTUP}")


def gif(zdroj, ciel, snimok):
    ramy = []
    for i in range(snimok):
        im = Image.open(os.path.join(zdroj, f"{i:02d}.png")).convert("RGBA")
        bg = Image.new("RGB", im.size, "white")
        bg.paste(im, (0, 0), im)
        bg.thumbnail((760, 760))
        ramy.append(bg)
    ramy[0].save(ciel, save_all=True, append_images=ramy[1:], duration=90, loop=0, optimize=True)


if __name__ == "__main__":
    main()
