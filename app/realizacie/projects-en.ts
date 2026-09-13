import type { Project } from "./projects";

/**
 * Anglické znenie popisov záberov. Slovenské originály v `projects.ts` sú
 * zdrojom pravdy — tu ich len zrkadlíme pre /en podľa `id` projektu.
 * Kategórie prekladá slovník (`realizacie.kategorie`).
 */
type TextEN = { title: string; detail: string; alt: string; review: string };

const TEXTY_EN: Record<string, TextEN> = {
  "dubovy-interier": {
    title: "Aquarium and cabinet in an oak decor",
    detail: "Oak decor / planted aquarium",
    alt: "A planted aquarium on a cabinet in an oak decor in a light interior",
    review: "A set in a wood decor with a planted aquarium.",
  },
  antracit: {
    title: "Anthracite cabinet with an open tank",
    detail: "Anthracite / open tank",
    alt: "An open aquarium with angelfish, roots and stones on an anthracite cabinet",
    review: "A dark cabinet finish under an open aquarium.",
  },
  "biela-kocka": {
    title: "A white set in a smaller space",
    detail: "White set / compact format",
    alt: "A compact aquarium with a stone composition on a tall white cabinet",
    review: "A compact set with a white cabinet.",
  },
  "dub-detail": {
    title: "Detail of a cabinet in an oak decor",
    detail: "Oak decor / detail of the set",
    alt: "Detail of a densely planted aquarium on a two-door cabinet in an oak decor",
    review: "A close look at the surface and the front of the cabinet.",
  },
  "biela-hotova": {
    title: "A white set after the aquarium was planted",
    detail: "White set / after planting",
    alt: "A planted aquarium with roots and light sand on a white cabinet by a yellow wall",
    review: "The aquarium after the substrate and decorations were added.",
  },
  "biela-montaz": {
    title: "A white set with a pendant light",
    detail: "White cabinet / pendant light",
    alt: "An empty open tank on a white three-door cabinet with a pendant light",
    review: "The tank and cabinet before filling and planting.",
  },
  "biela-pred": {
    title: "A white set before planting",
    detail: "White set / before planting",
    alt: "An empty aquarium with a white hood and cabinet next to a television",
    review: "A look at the installed cabinet and the empty tank.",
  },
  konstrukcia: {
    title: "A steel frame with an oak decor",
    detail: "Steel structure / oak decor",
    alt: "A tall black metal structure with shelves and a lower cabinet in an oak decor",
    review: "An open build with shelves and a closed lower section.",
  },
};

/** Projekt s textami v danom jazyku; neznáme id ostáva po slovensky. */
export function projektEN(p: Project): Project {
  const t = TEXTY_EN[p.id];
  return t ? { ...p, ...t } : p;
}
