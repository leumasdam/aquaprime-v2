# Záloha úprav z vizuálneho editora (tools/editor.html)

Stav zo 7. 9. 2026, 20:15 — hero layouty pre 7 breakpointov.

- `overrides-2026-09-07.css` — presne to, čo editor vygeneroval.
- `overrides-2026-09-07.json` — tie isté úpravy v dátovom formáte editora.
  Ak treba v editore pokračovať od tohto stavu, skopíruj ho do
  `public/css/overrides.json` — ale POZOR: tie isté hodnoty sú už prepísané
  do `app/globals.css` (sekcia „HERO — layouty naladené vo vizuálnom
  editore"), takže v náhľade editora by sa posuny aplikovali dvakrát.
  Správny postup je editovať od aktuálneho (prázdneho) stavu.
