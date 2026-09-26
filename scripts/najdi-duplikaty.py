"""
Hľadá vizuálne rovnaké fotky v produktových galériách.

Klientove archívy prišli po častiach a niektoré zábery sú v nich viackrát pod
iným názvom. Na detaile skrinky sú potom vedľa seba dve-tri rovnaké miniatúry.

Porovnáva sa silueta objektu (maska toho, čo nie je biele pozadie) a obsah
v nej. Rovnaký záber uložený dvakrát má siluetu takmer zhodnú, kým tá istá
skrinka z iného uhla nie — inak by skript zmazal legitímne pohľady.

  python scripts/najdi-duplikaty.py            # len vypíše
  python scripts/najdi-duplikaty.py --zapis    # odstráni duplikáty z products.ts
"""
import json
import re
import sys
from pathlib import Path

import numpy as np
from PIL import Image

KOREN = Path(__file__).resolve().parent.parent
MARKER = "export const PRODUCTS: Product[] = "
PRAH_SILUETA = 0.78   # prekryv siluet, nad ktorým ide o ten istý záber
PRAH_ROZDIEL = 26.0   # a zároveň sa nesmie líšiť obsah v nej

# Dvojice, ktoré meranie označí za zhodné, ale zhodné nie sú. Pri štvordverovej
# skrinke robí jedny pootvorené dvierka v siluete taký malý rozdiel, že ho
# prahy nezachytia — overené okom na kontaktnom hárku.
VYNIMKY = {
    ("premium-200x50x70-mouse-grey-03.webp", "premium-200x50x70-mouse-grey-01.webp"),
}


def nacitaj():
    s = (KOREN / "app" / "products.ts").read_text(encoding="utf-8")
    a = s.index(MARKER) + len(MARKER)
    b = s.index("\n];", a)
    return s, a, b, json.loads(s[a:b + 2])


def odtlacok(cesta: Path):
    a = np.asarray(Image.open(cesta).convert("RGB").resize((160, 160), Image.LANCZOS), dtype=float)
    return a, a.min(axis=2) < 236


def zhodne(x, y) -> bool:
    (A, ma), (B, mb) = x, y
    zjednotenie = ma | mb
    if not zjednotenie.any():
        return False
    if (ma & mb).sum() / zjednotenie.sum() < PRAH_SILUETA:
        return False
    return float(np.abs(A - B)[zjednotenie].mean()) < PRAH_ROZDIEL


def main() -> None:
    zapis = "--zapis" in sys.argv
    s, a, b, produkty = nacitaj()

    odtlacky: dict[str, object] = {}
    def z(cesta: str):
        if cesta not in odtlacky:
            p = KOREN / "public" / cesta.lstrip("/")
            odtlacky[cesta] = odtlacok(p) if p.exists() else None
        return odtlacky[cesta]

    zmenene = 0
    hlasene: set[tuple[str, str]] = set()
    for produkt in produkty:
        for dekor in produkt["decors"]:
            nechat, vyhodene = [], []
            for obr in dekor["images"]:
                o = z(obr)
                dvojnik = None
                if o is not None:
                    for iny in nechat:
                        p = z(iny)
                        dvojica = (obr.split("/")[-1], iny.split("/")[-1])
                        if dvojica in VYNIMKY or dvojica[::-1] in VYNIMKY:
                            continue
                        if p is not None and zhodne(o, p):
                            dvojnik = iny
                            break
                if dvojnik:
                    vyhodene.append((obr, dvojnik))
                else:
                    nechat.append(obr)
            if vyhodene:
                for obr, dvojnik in vyhodene:
                    kluc = (obr.split("/")[-1], dvojnik.split("/")[-1])
                    if kluc not in hlasene:
                        hlasene.add(kluc)
                        print(f"  {kluc[0]}  =  {kluc[1]}")
                dekor["images"] = nechat
                if dekor.get("cover") in [x for x, _ in vyhodene]:
                    dekor["cover"] = nechat[0]
                zmenene += len(vyhodene)

    # cover produktu mohol ukazovať na vyhodenú fotku
    for produkt in produkty:
        vsetky = {i for d in produkt["decors"] for i in d["images"]}
        if produkt.get("cover") and produkt["cover"] not in vsetky and vsetky:
            prve = next((d["images"][0] for d in produkt["decors"] if d["images"]), None)
            if prve:
                produkt["cover"] = prve

    print(f"\nduplicitných odkazov: {zmenene}")
    if zapis and zmenene:
        novy = s[:a] + json.dumps(produkty, ensure_ascii=False, indent=2) + ";\n"
        zvysok = s[b + 2:]
        zvysok = re.sub(r"^;\s*\n", "", zvysok)
        (KOREN / "app" / "products.ts").write_text(novy + zvysok, encoding="utf-8", newline="\n")
        print("products.ts prepísaný")


if __name__ == "__main__":
    main()
