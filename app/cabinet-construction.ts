/** Záväzné delenie skrinky: pod 120 cm dve polia, od 120 cm tri. */
export function dvierkaPreSirku(width: number): 2 | 3 {
  return width < 120 ? 2 : 3;
}
/** Materiály odčítané z fotiek; názvy kombinácií nemajú jednotné poradie. */
export function cabinetSurfaces(decor: { id: string; swatch: string[] }) {
  const bodyFirst = decor.id === "dub-spanielsky-black-matt" || decor.id === "artisan-antracit";
  return {
    doors: bodyFirst ? (decor.swatch[1] ?? decor.swatch[0]) : decor.swatch[0],
    body: bodyFirst ? decor.swatch[0] : (decor.swatch[1] ?? decor.swatch[0]),
  };
}
