/**
 * Kaustika — mihotavé svetelné škvrny, aké robí slnko na dne akvária.
 *
 * Dve vrstvy tej istej bezšvovej dlaždice (public/img/kaustika.png) sa
 * pomaly posúvajú každá iným smerom a mierkou, takže sa vzor nikdy
 * neopakuje viditeľne. Krycia sila je nízka, vrstva má len dať pocit,
 * že scéna je pod hladinou. Na Safari a pri obmedzenom pohybe sa nekreslí.
 *
 * Vkladá sa hneď za pozadie sekcie (video, fotku), pred obsah.
 */
export default function Kaustika({ className }: { className?: string }) {
  return <div className={`kaustika${className ? " " + className : ""}`} aria-hidden="true" />;
}
