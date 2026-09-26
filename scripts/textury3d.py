"""
Textúry dekorov pre 3D otočky — vyrezané priamo z klientových fotiek.

Vzorky dekorov na webe majú 160 × 160 px, po roztiahnutí na dvierka z nich
je rozmazaná vlnovka. Skutočnú kresbu dreva má klientova fotka, tak sa
textúra berie z nej: nájde sa najčelnejší záber dekoru (pri pohľade spredu
je skrinka najširšia voči výške), z neho sa vyreže plocha jedných dvierok
a plocha korpusu. Výrez je plochý kus jednej plochy, takže perspektíva ho
skresľuje len zanedbateľne.

Výstup: public/img/dekory3d/<dekor>-dvierka.png a -korpus.png
"""
import json
import os

import numpy as np
from PIL import Image

KOREN = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VYSTUP = os.path.join(KOREN, "public", "img", "dekory3d")


def katalog():
    s = open(os.path.join(KOREN, "app", "products.ts"), encoding="utf-8").read()
    m = "export const PRODUCTS: Product[] = "
    a = s.index(m) + len(m)
    b = s.index("\n];", a)
    return json.loads(s[a:b + 2])


def obrys(a):
    """Rámček objektu na bielom pozadí."""
    maska = a.min(axis=2) < 236
    ys, xs = np.where(maska)
    if len(xs) < 1000:
        return None
    return xs.min(), ys.min(), xs.max(), ys.max()


def bez_skar(im, ramcek, y_od, y_do):
    """Najširší pás plochy bez zvislej škáry medzi dvierkami.

    Škára je tmavý stĺpec oproti okoliu. Nájdeme ich všetky a vrátime
    najširší úsek medzi nimi — to je čistá plocha jedných dvierok.
    """
    x0, y0, x1, y1 = ramcek
    W, H = x1 - x0, y1 - y0
    pas = np.asarray(
        im.crop((int(x0 + 0.06 * W), int(y0 + y_od * H), int(x0 + 0.94 * W), int(y0 + y_do * H))).convert("L")
    ).astype(float)
    stlpce = pas.mean(axis=0)
    # vyhladenie, aby kresba dreva nerobila falošné škáry
    jadro = np.ones(5) / 5
    hladke = np.convolve(stlpce, jadro, mode="same")
    prah = np.percentile(hladke, 45) - 0.5 * hladke.std()
    tmave = hladke < prah
    hranice = [0]
    for i in range(1, len(tmave)):
        if tmave[i] and not tmave[i - 1]:
            hranice.append(i)
    hranice.append(len(tmave))
    najlepsi, sirka = (0, len(tmave)), 0
    for a, b in zip(hranice, hranice[1:]):
        # od každej škáry trochu odsadiť, nech v textúre neostane tmavý okraj
        a2, b2 = a + int(0.04 * len(tmave)), b - int(0.02 * len(tmave))
        if b2 - a2 > sirka:
            sirka, najlepsi = b2 - a2, (a2, b2)
    a, b = najlepsi
    return 0.06 + 0.88 * a / len(tmave), 0.06 + 0.88 * b / len(tmave)


def najcelnejsia(fotky):
    """Najčelnejší záber = najväčší pomer šírky k výške objektu."""
    najlepsia, skore = None, -1
    for f in fotky:
        cesta = os.path.join(KOREN, "public", f.lstrip("/"))
        if not os.path.exists(cesta):
            continue
        im = Image.open(cesta).convert("RGB")
        a = np.asarray(im)
        r = obrys(a)
        if not r:
            continue
        x0, y0, x1, y1 = r
        pomer = (x1 - x0) / max(1, y1 - y0)
        if pomer > skore:
            skore, najlepsia = pomer, (im, r)
    return najlepsia


def vyrez(im, ramcek, x_od, x_do, y_od, y_do, sirka=512, vyska=768):
    x0, y0, x1, y1 = ramcek
    W, H = x1 - x0, y1 - y0
    box = (
        int(x0 + x_od * W), int(y0 + y_od * H),
        int(x0 + x_do * W), int(y0 + y_do * H),
    )
    return im.crop(box).resize((sirka, vyska), Image.LANCZOS)


def sedive(im, tolerancia=18):
    """Je výrez jednofarebný (čierny lak), alebo má kresbu dreva?"""
    a = np.asarray(im).astype(float)
    return float(a.std(axis=(0, 1)).mean()) < tolerancia


def main():
    os.makedirs(VYSTUP, exist_ok=True)
    dekory = {}
    for p in katalog():
        dvierka = 2 if p["w"] < 120 else 3 if p["w"] < 200 else 4
        for d in p["decors"]:
            if d.get("chyba") or not d["images"]:
                continue
            if p["tier"] == "basic":
                continue
            z = dekory.setdefault(d["id"], {"nazov": d["name"], "fotky": [], "dv": dvierka})
            z["fotky"].extend(d["images"])
            z["dv"] = min(z["dv"], dvierka)

    hotovo = 0
    for did, z in sorted(dekory.items()):
        v = najcelnejsia(z["fotky"])
        if not v:
            print(f"  preskakujem {did} — žiadna použiteľná fotka")
            continue
        im, ram = v
        n = z["dv"]
        # stredné dvierka: vodorovne stred i-tych dvierok, zvisle medzi
        # vrchnou doskou a nožičkami
        xa, xb = bez_skar(im, ram, 0.18, 0.84)
        dvi = vyrez(im, ram, xa, xb, 0.18, 0.84)
        dvi.save(os.path.join(VYSTUP, f"{did}-dvierka.png"))
        # korpus: pás vrchnej dosky (má ten istý dekor ako boky)
        kor = vyrez(im, ram, 0.3, 0.7, 0.012, 0.075, 512, 128)
        kor.save(os.path.join(VYSTUP, f"{did}-korpus.png"))
        hotovo += 1
        print(f"  {did}: dvierka {'jednofarebné' if sedive(dvi) else 'kresba'}")
    print(f"hotovo {hotovo} dekorov → {VYSTUP}")


if __name__ == "__main__":
    main()
