import Subpage from "../Subpage";

export const metadata = {
  title: "Materiály a povrchy | AQUAPRIME",
  description:
    "Povrchy, dekory, hrany, kovanie a údržba. Materiály, ktoré pomáhajú rozhodnúť pred dopytom.",
};

export default function Page() {
  return (
    <Subpage
      accent="var(--cyan)"
      eyebrow="MATERIÁLY"
      title="Povrchy a remeslo, ktoré rozhodujú o dojme."
      lead="Dekory, textúry, hrany, kovanie a údržba. Materiály pomáhajú rozhodnúť ešte pred dopytom — aby skrinka zapadla do interiéru, nie do katalógu."
      main={{
        label: "POVRCHY",
        title: "Vyberáme len materiály, ktoré vydržia aj zostarnú pekne.",
        body: "Odolné voči vlhkosti, stabilné v čase a príjemné na dotyk. Každý povrch má svoj charakter — od matnej čiernej štruktúry po teplé drevo a kov.",
        points: [
          { t: "Vzorky materiálov", b: "Čierna štruktúra, drevo, kov a akcenty." },
          { t: "Porovnanie odolnosti", b: "Voči vlhkosti, oderu a UV." },
          { t: "Hrany a kovanie", b: "Detail, ktorý rozhoduje o prémiovom dojme." },
          { t: "Údržba a odporúčania", b: "Ako povrch udržať dlhé roky ako nový." },
        ],
        ctaLabel: "VYBRAŤ POVRCH",
        caHref: "/dopyt",
      }}
      cardsTitle="Skupiny povrchov"
      cards={[
        {
          tag: "MATNÁ",
          title: "Čierna štruktúra",
          body: "Hĺbková matná čierna, ktorá nezrkadlí a pôsobí prémiovo.",
        },
        {
          tag: "TEPLO",
          title: "Drevo a dýhy",
          body: "Prírodné textúry, ktoré zjemnia techniku v interiéri.",
        },
        {
          tag: "DETAIL",
          title: "Kov a akcenty",
          body: "Kovové hrany a líniové akcenty pre výnimočné kusy.",
        },
      ]}
      cta={{
        title: "Pošleme vzorkovník a pomôžeme vybrať.",
        body: "Povedzte štýl interiéru — odporučíme povrch, hranu aj kovanie.",
        href: "/dopyt",
        label: "CHCEM VZORKY",
      }}
    />
  );
}
