// Editor akvárií — čítanie a všetky zmeny. Chráni ho admin brána v proxy.ts.

import { AQUARIUMS, type Aquarium } from "../../../aquariums";
import { chybyAkvarii, normalizujAkvarium } from "../../../katalog/polozky";
import { vytvorHandlery } from "../_lib/kolekcia";

export const dynamic = "force-dynamic";

export const { GET, POST } = vytvorHandlery<Aquarium>({
  kolekcia: "akvaria",
  seed: AQUARIUMS,
  nazovVeci: "akvárium",
  id: (a) => a.slug,
  meno: (a) => a.name,
  normalizuj: normalizujAkvarium,
  chyby: chybyAkvarii,
});
