// Zdieľaná navigácia. Popisky sú kľúče do slovníka (app/preklady.ts),
// odkazy sa v anglickej verzii prefixujú cez odkaz() z app/jazyk.ts.
export const NAV = [
  { kluc: "skrinky", href: "/skrinky" },
  { kluc: "akvaria", href: "/akvaria" },
  { kluc: "sety", href: "/sety" },
  { kluc: "konstrukcia", href: "/technologia" },
  { kluc: "realizacie", href: "/realizacie" },
  { kluc: "kontakt", href: "/kontakt" },
] as const;
