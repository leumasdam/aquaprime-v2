/** Záväzné delenie skrinky: pod 120 cm dve polia, od 120 cm tri, od 200 cm štyri. */
export function dvierkaPreSirku(width: number): 2 | 3 | 4 {
  if (width < 120) return 2;
  return width < 200 ? 3 : 4;
}
/** Materiály odčítané z fotiek; názvy kombinácií nemajú jednotné poradie. */
export function cabinetSurfaces(decor: { id: string; swatch: string[] }) {
  const bodyFirst = decor.id === "dub-spanielsky-black-matt" || decor.id === "artisan-antracit";
  return {
    doors: bodyFirst ? (decor.swatch[1] ?? decor.swatch[0]) : decor.swatch[0],
    body: bodyFirst ? decor.swatch[0] : (decor.swatch[1] ?? decor.swatch[0]),
  };
}
