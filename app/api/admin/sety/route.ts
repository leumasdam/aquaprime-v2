// Editor setov — čítanie a všetky zmeny. Chráni ho admin brána v proxy.ts.

import { SETY, type Set } from "../../../sety";
import { chybySetov, normalizujSet } from "../../../katalog/polozky";
import { vytvorHandlery } from "../_lib/kolekcia";

export const dynamic = "force-dynamic";

export const { GET, POST } = vytvorHandlery<Set>({
  kolekcia: "sety",
  seed: SETY,
  nazovVeci: "set",
  id: (s) => s.id,
  meno: (s) => s.nazov,
  normalizuj: normalizujSet,
  chyby: chybySetov,
});
