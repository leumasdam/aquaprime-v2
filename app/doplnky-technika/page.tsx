import Subpage from "../Subpage";

export const metadata = {
  title: "Doplnky & technika | AQUAPRIME",
  description:
    "Osvetlenie, filtrácia a príslušenstvo pre hotové riešenia. Samostatná kategória, nie podkategória skriniek.",
};

export default function Page() {
  return (
    <Subpage
      accent="var(--cyan)"
      eyebrow="DOPLNKY & TECHNIKA"
      title="Technika a príslušenstvo pre hotové riešenia."
      lead="Osvetlenie, filtrácia a príslušenstvo majú vlastnú kategóriu. Nepatria do nádrží — majú vlastnú cestu, kompatibilitu a odporúčané balíky."
      main={{
        label: "TECHNIKA",
        title: "Vyladená technika, ktorá sadne k vašej zostave.",
        body: "Vyberáme komponenty, ktoré spolu fungujú — tichý chod, správny výkon a kompatibilita so skrinkou aj nádržou. Žiadne miešanie nesúrodých dielov.",
        points: [
          { t: "Svetlá", b: "Spektrum a výkon podľa osadenia a hĺbky." },
          { t: "Filtrácia", b: "Prietok a objem média dimenzovaný na litráž." },
          { t: "Doplnky", b: "Ohrev, prúdenie, dávkovanie a automatizácia." },
          { t: "Kompatibilita", b: "Všetko ladené k skrinke aj k zostave." },
        ],
        ctaLabel: "KONZULTÁCIA",
        caHref: "/dopyt",
      }}
      cardsTitle="Odporúčané balíky"
      cards={[
        {
          tag: "ŠTART",
          title: "Základná zostava",
          body: "Svetlo, filtrácia a ohrev pre spoľahlivý a tichý chod.",
        },
        {
          tag: "PRÉMIUM",
          title: "Vyladený set",
          body: "Výkonnejšia technika, prúdenie a presnejšia regulácia.",
        },
        {
          tag: "SMART",
          title: "Automatizácia",
          body: "Dávkovanie, senzory a riadenie pre pokoj a stabilitu.",
        },
      ]}
      cta={{
        title: "Poradíme techniku, ktorá k sebe sadne.",
        body: "Napíšte typ nádrže a osadenie — navrhneme kompatibilný balík.",
        href: "/dopyt",
        label: "CHCEM PORADIŤ",
      }}
    />
  );
}
