"""
Zjednotenie produktových fotiek na jednu mierku.

Klientove fotky majú rôzne plátna aj rôzne okraje, takže na kartách aj
v galérii vyzerá jedna skrinka väčšia a druhá menšia. Skript každú fotku
oreže na samotný objekt (všetko, čo nie je biele pozadie), preškáluje ho
na rovnakú výšku a položí na jednotné plátno so spoločnou spodnou hranou.
Skrinky tak stoja v jednej rovine a majú rovnakú výšku bez ohľadu na to,
ako boli nafotené.

Fotky na tmavom pozadí (scény, vizualizácie) nechá tak — tie nemajú
biely okraj, ktorý by sa dal orezať.

Použitie:
  python scripts/zjednot-fotky.py                 # prepíše public/img/products
  python scripts/zjednot-fotky.py --nahlad a.webp b.webp   # len ukážka do scratch/
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image

PLATNO = (1400, 1120)          # spoločné plátno 5 : 4
VYSKA_OBJEKTU = 0.76           # objekt zaberá 76 % výšky plátna
MAX_SIRKA = 0.88               # ale nikdy viac než 88 % šírky
SPODOK = 0.90                  # spodná hrana objektu na 90 % výšky (10 % pod ním)
PRAH_BIELEJ = 236              # pixel je pozadie, keď má všetky kanály nad prahom
MIN_BIELY_OKRAJ = 0.55         # okraj fotky musí byť prevažne biely, inak je to scéna

ZDROJ = Path(__file__).resolve().parent.parent / "public" / "img" / "products"


def zjednot(cesta: Path) -> Image.Image | None:
    im = Image.open(cesta).convert("RGB")
    a = np.asarray(im)
    pozadie = a.min(axis=2) >= PRAH_BIELEJ
    # o pozadí rozhoduje okraj fotky, nie jej stred — veľký tmavý objekt
    # na bielej je stále fotka na bielej, scéna má tmavé aj okraje
    r = max(2, round(min(im.size) * 0.02))
    okraj = np.concatenate([pozadie[:r].ravel(), pozadie[-r:].ravel(), pozadie[:, :r].ravel(), pozadie[:, -r:].ravel()])
    if okraj.mean() < MIN_BIELY_OKRAJ:
        return None
    ys, xs = np.where(~pozadie)
    if len(xs) == 0:
        return None
    x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    objekt = im.crop((x0, y0, x1, y1))
    ow, oh = objekt.size
    W, H = PLATNO
    mierka = min(VYSKA_OBJEKTU * H / oh, MAX_SIRKA * W / ow)
    nw, nh = max(1, round(ow * mierka)), max(1, round(oh * mierka))
    objekt = objekt.resize((nw, nh), Image.LANCZOS)
    platno = Image.new("RGB", PLATNO, (255, 255, 255))
    x = (W - nw) // 2
    y = round(SPODOK * H) - nh
    platno.paste(objekt, (x, y))
    return platno


def main() -> None:
    args = sys.argv[1:]
    nahlad = "--nahlad" in args
    if nahlad:
        args.remove("--nahlad")
        subory = [ZDROJ / a for a in args]
        vystup = Path(args and args[0]).parent if False else None
    else:
        subory = sorted(ZDROJ.glob("*.webp"))
    hotovo = necham = 0
    for f in subory:
        vysl = zjednot(f)
        if vysl is None:
            necham += 1
            print(f"  nechávam (tmavé pozadie): {f.name}")
            continue
        if nahlad:
            ciel = Path.cwd() / "scratch-nahlad"
            ciel.mkdir(exist_ok=True)
            vysl.save(ciel / f.name, quality=86)
        else:
            vysl.save(f, quality=86)
        hotovo += 1
    print(f"zjednotených {hotovo}, ponechaných {necham}")


if __name__ == "__main__":
    main()
