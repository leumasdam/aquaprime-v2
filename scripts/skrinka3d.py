"""
Parametrická skrinka v Blenderi + 360° otočka.

Spúšťa sa Blenderom bez okna, zvyčajne cez scripts/otocky3d.py:
  blender --background --python scripts/skrinka3d.py -- --rad premium \
      --dvierka 3 --dekor black-matt --swatch '["#17181a"]' --vystup out/

Model kopíruje stavbu skutočnej skrinky z klientových fotiek: oceľový rám
z profilu 30 × 30 mm je priznaný aj spredu ako zvislé stĺpiky medzi dvierkami,
dvierka sú medzi ne zapustené, vrchná doska presahuje a skrinka stojí na
skrutkovacích nožičkách s tanierikom.

Dekor sa berie z textúr vyrezaných z klientových fotiek
(public/img/dekory3d, pripraví scripts/textury3d.py); keď textúra chýba,
použije sa vzorka dekoru z katalógu. Farbu doťahuje kalibračný zisk, ktorý
počíta scripts/otocky3d.py, takže render sedí na farbu z fotky.
"""
import argparse
import json
import math
import os
import sys

import bpy

KOREN = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ---- rozmery (metre; katalóg je v cm) -------------------------------------
PROFIL = 0.030          # oceľový profil 30 × 30 mm
DOSKA = 0.025           # hrúbka vrchnej dosky
PRESAH = 0.008          # presah dosky cez korpus
NOZICKA = 0.040         # výška nožičky aj s tanierikom
SKARA = 0.004           # škára medzi dvierkami a rámom
ZAPUST = 0.003          # o koľko sú dvierka zapustené za líce rámu
PLAT = 0.018            # hrúbka opláštenia a dvierok


def vycisti():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def hex_na_rgb(h):
    h = h.lstrip("#")
    r, g, b = (int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))
    f = lambda c: c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    return (f(r), f(g), f(b), 1.0)


def material(nazov, swatch, textura=None, drsnost=0.55, zisk=(1.0, 1.0, 1.0)):
    """Zisk je kalibrácia na fotku: render sa ním dotiahne na farbu z katalógu."""
    m = bpy.data.materials.new(nazov)
    m.use_nodes = True
    bsdf = m.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Roughness"].default_value = drsnost
    if "Specular IOR Level" in bsdf.inputs:
        bsdf.inputs["Specular IOR Level"].default_value = 0.3
    nasob = m.node_tree.nodes.new("ShaderNodeMixRGB")
    nasob.blend_type = "MULTIPLY"
    nasob.inputs["Fac"].default_value = 1.0
    nasob.inputs["Color2"].default_value = (*zisk, 1.0)
    m.node_tree.links.new(nasob.outputs["Color"], bsdf.inputs["Base Color"])

    # hex vo vzorke znamená jednofarebný lak — tomu textúra netreba,
    # inak by sa naň natiahol výrez z fotky aj s odleskami
    zdroj = None if swatch.startswith("#") else (textura if textura and os.path.exists(textura) else None)
    if zdroj is None and not swatch.startswith("#"):
        c = os.path.join(KOREN, "public", swatch.lstrip("/"))
        zdroj = c if os.path.exists(c) else None
    if zdroj:
        tex = m.node_tree.nodes.new("ShaderNodeTexImage")
        tex.image = bpy.data.images.load(zdroj)
        tex.extension = "EXTEND"
        m.node_tree.links.new(tex.outputs["Color"], nasob.inputs["Color1"])
    else:
        nasob.inputs["Color1"].default_value = hex_na_rgb(swatch if swatch.startswith("#") else "#888888")
    return m


def kvader(stred, rozmer, mat, faza=0.0015):
    bpy.ops.mesh.primitive_cube_add(size=1, location=stred)
    o = bpy.context.active_object
    o.scale = tuple(rozmer)
    bpy.ops.object.transform_apply(scale=True)
    if faza:
        mo = o.modifiers.new("faza", "BEVEL")
        mo.width = faza
        mo.segments = 2
    o.data.materials.append(mat)
    return o


def valec(stred, polomer, vyska, mat):
    bpy.ops.mesh.primitive_cylinder_add(radius=polomer, depth=vyska, location=stred, vertices=24)
    o = bpy.context.active_object
    bpy.ops.object.shade_smooth()
    o.data.materials.append(mat)
    return o


def postav(rad, dvierka, W, D, H, mat_dvierka, mat_korpus, mat_ocel):
    """Stred pôdorysu je v počiatku, skrinka stojí na zemi (z = 0)."""
    telo_h = H - DOSKA - NOZICKA
    z0 = NOZICKA
    zs = z0 + telo_h / 2

    # skrutkovacie nožičky: tanierik + driek
    for sx in (-1, 1):
        for sy in (-1, 1):
            x, y = sx * (W / 2 - 0.055), sy * (D / 2 - 0.055)
            valec((x, y, 0.008), 0.020, 0.016, mat_ocel)
            valec((x, y, NOZICKA / 2 + 0.008), 0.008, NOZICKA, mat_ocel)

    # oceľový rám — rohové stĺpiky a obvodové priečky
    for sx in (-1, 1):
        for sy in (-1, 1):
            kvader((sx * (W / 2 - PROFIL / 2), sy * (D / 2 - PROFIL / 2), zs), (PROFIL, PROFIL, telo_h), mat_ocel)
    for z in (z0 + PROFIL / 2, z0 + telo_h - PROFIL / 2):
        for sy in (-1, 1):
            kvader((0, sy * (D / 2 - PROFIL / 2), z), (W - 2 * PROFIL, PROFIL, PROFIL), mat_ocel)
        for sx in (-1, 1):
            kvader((sx * (W / 2 - PROFIL / 2), 0, z), (PROFIL, D - 2 * PROFIL, PROFIL), mat_ocel)

    if rad == "basic":
        # BASIC je priznaný rám s doskou — bez opláštenia a bez dvierok
        for i in range(1, dvierka):
            x = -W / 2 + i * W / dvierka
            for sy in (-1, 1):
                kvader((x, sy * (D / 2 - PROFIL / 2), zs), (PROFIL, PROFIL, telo_h), mat_ocel)
        kvader((0, 0, H - DOSKA / 2), (W + 2 * PRESAH, D + 2 * PRESAH, DOSKA), mat_korpus)
        return

    # boky, chrbát a dno v korpusovom dekore
    for sx in (-1, 1):
        kvader((sx * (W / 2 - PLAT / 2), 0, zs), (PLAT, D - 2 * PROFIL, telo_h), mat_korpus)
    kvader((0, D / 2 - PLAT / 2, zs), (W - 2 * PROFIL, PLAT, telo_h), mat_korpus)
    kvader((0, 0, z0 + PROFIL + PLAT / 2), (W - 2 * PROFIL, D - 2 * PROFIL, PLAT), mat_korpus)

    # priznané zvislé stĺpiky rámu medzi dvierkami (na fotkách sú čierne)
    stlpiky = [-W / 2 + PROFIL / 2, W / 2 - PROFIL / 2]
    for i in range(1, dvierka):
        x = -W / 2 + i * W / dvierka
        kvader((x, -D / 2 + PROFIL / 2, zs), (PROFIL, PROFIL, telo_h), mat_ocel)
        stlpiky.append(x)
    stlpiky.sort()

    # dvierka zapustené medzi stĺpiky
    for a, b in zip(stlpiky, stlpiky[1:]):
        lavy = a + PROFIL / 2 + SKARA
        pravy = b - PROFIL / 2 - SKARA
        kvader(
            ((lavy + pravy) / 2, -D / 2 + ZAPUST + PLAT / 2, zs),
            (pravy - lavy, PLAT, telo_h - 2 * PROFIL - 2 * SKARA),
            mat_dvierka,
            faza=0.0012,
        )

    kvader((0, 0, H - DOSKA / 2), (W + 2 * PRESAH, D + 2 * PRESAH, DOSKA), mat_korpus)


def scena(W, D, H, priehladne=True):
    sc = bpy.context.scene
    sc.render.engine = "BLENDER_EEVEE"
    sc.render.film_transparent = priehladne
    sc.render.resolution_x = 1200
    sc.render.resolution_y = 1000
    sc.render.image_settings.file_format = "PNG"
    sc.render.image_settings.color_mode = "RGBA"
    # Standard, nie AgX: filmové podanie farby odfarbuje dekor, my chceme
    # na dvierkach presne ten odtieň, ktorý je na fotkách
    sc.view_settings.view_transform = "Standard"
    sc.view_settings.look = "None"
    for meno, hod in (("use_raytracing", True), ("use_shadows", True)):
        if hasattr(sc.eevee, meno):
            setattr(sc.eevee, meno, hod)

    ciel = bpy.data.objects.new("ciel", None)
    bpy.context.collection.objects.link(ciel)
    ciel.location = (0, 0, H * 0.46)

    # vzdialenosť tak, aby sa skrinka zmestila v každom uhle otočky
    SNIMAC, OHNISKO = 36.0, 90.0
    polomer = math.sqrt((W / 2) ** 2 + (D / 2) ** 2 + (H / 2) ** 2)
    snimac_v = SNIMAC * sc.render.resolution_y / sc.render.resolution_x
    vzdialenost = polomer / ((snimac_v / 2) / OHNISKO) * 1.10
    sklon = math.radians(16)

    bpy.ops.object.camera_add(
        location=(0, -vzdialenost * math.cos(sklon), ciel.location[2] + vzdialenost * math.sin(sklon))
    )
    kam = bpy.context.active_object
    kam.data.lens = OHNISKO
    kam.data.sensor_width = SNIMAC
    c = kam.constraints.new("TRACK_TO")
    c.target = ciel
    c.track_axis = "TRACK_NEGATIVE_Z"
    c.up_axis = "UP_Y"
    kam.parent = ciel
    sc.camera = kam

    # veľký mäkký kľúč zľava zhora, výplň sprava, obrys zozadu
    for meno, loc, energia, velkost in (
        ("kluc", (-W * 1.1, -D * 3.2, H * 2.4), 320, max(W, 1.2) * 1.6),
        ("vypln", (W * 1.6, -D * 2.0, H * 1.0), 110, max(W, 1.2) * 1.4),
        ("obrys", (W * 0.3, D * 3.0, H * 1.9), 130, max(W, 1.2)),
        ("zhora", (0, -D * 0.6, H * 3.0), 90, max(W, 1.2) * 1.2),
    ):
        bpy.ops.object.light_add(type="AREA", location=loc)
        sv = bpy.context.active_object
        sv.name = meno
        sv.data.energy = energia
        sv.data.size = velkost
        if hasattr(sv.data, "shadow_soft_size"):
            sv.data.shadow_soft_size = velkost * 0.5
        c = sv.constraints.new("TRACK_TO")
        c.target = ciel
        c.track_axis = "TRACK_NEGATIVE_Z"
        c.up_axis = "UP_Y"

    sv = bpy.data.worlds.new("svet")
    sv.use_nodes = True
    sv.node_tree.nodes["Background"].inputs["Color"].default_value = (1.0, 1.0, 1.0, 1)
    sv.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.05
    bpy.context.scene.world = sv
    return ciel


def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    ap = argparse.ArgumentParser()
    ap.add_argument("--rad", required=True)
    ap.add_argument("--dvierka", type=int, required=True)
    ap.add_argument("--dekor", required=True)
    ap.add_argument("--swatch", required=True, help='JSON pole, napr. ["/img/.../s.webp","#17181a"]')
    ap.add_argument("--rozmer", default="150x50x80", help="cm, Š × H × V")
    ap.add_argument("--snimok", type=int, default=25)
    ap.add_argument("--zisk-dvierka", default="1,1,1")
    ap.add_argument("--zisk-korpus", default="1,1,1")
    ap.add_argument("--vystup", required=True)
    a = ap.parse_args(argv)

    W, D, H = (int(v) / 100 for v in a.rozmer.split("x"))
    swatch = json.loads(a.swatch)
    zd = tuple(float(v) for v in a.zisk_dvierka.split(","))
    zk = tuple(float(v) for v in a.zisk_korpus.split(","))
    tex = os.path.join(KOREN, "public", "img", "dekory3d")

    vycisti()
    mat_dvierka = material("dvierka", swatch[0], os.path.join(tex, f"{a.dekor}-dvierka.png"), 0.5, zd)
    mat_korpus = material(
        "korpus", swatch[1] if len(swatch) > 1 else swatch[0],
        os.path.join(tex, f"{a.dekor}-korpus.png"), 0.55, zk,
    )
    mat_ocel = material("ocel", "#212529", None, 0.38)

    postav(a.rad, a.dvierka, W, D, H, mat_dvierka, mat_korpus, mat_ocel)
    ciel = scena(W, D, H)

    os.makedirs(a.vystup, exist_ok=True)
    for i in range(a.snimok):
        ciel.rotation_euler[2] = math.radians(360 * i / a.snimok)
        bpy.context.scene.render.filepath = os.path.join(a.vystup, f"{i:02d}.png")
        bpy.ops.render.render(write_still=True)
    print(f"hotovo: {a.snimok} snímok v {a.vystup}")


if __name__ == "__main__":
    main()
