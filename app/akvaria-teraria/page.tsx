import Subpage from "../Subpage";

export const metadata = {
  title: "Akváriá & teráriá na mieru | AQUAPRIME",
  description:
    "Nádrže na mieru pre akvaristiku aj teraristiku. Rozmer, objem, typ skla a bezpečnosť — jedna spoločná vetva.",
};

export default function Page() {
  return (
    <Subpage
      accent="var(--cyan)"
      eyebrow="AKVÁRIÁ & TERÁRIÁ"
      title="Nádrže na mieru pre akvaristiku aj teraristiku."
      lead="Jedna spoločná vetva, rozlíšenie až vo filtroch a obsahu stránky. Spoločný proces, jasné parametre a priama cesta ku konfigurácii a dopytu."
      main={{
        label: "NA MIERU",
        title: "Akvárium alebo terárium — jeden premyslený proces.",
        body: "Začnete účelom a rozmerom, my doplníme správne sklo, lepenie a bezpečnostné rezervy. Nádrž aj skrinka sú navrhnuté ako jeden celok, nie ako dva nesúvisiace nákupy.",
        points: [
          { t: "Prepínač akvárium / terárium", b: "Spoločná stránka, obsah sa mení podľa zámeru." },
          { t: "Rozmer, objem, nosnosť", b: "Parametre, ktoré rozhodujú o ráme a skrinke." },
          { t: "Typ skla a bezpečnosť", b: "Hrúbka, lepenie a rezervy podľa litráže." },
          { t: "Účel a osadenie", b: "Sladkovodné, morské, paludárium či terárium." },
        ],
        ctaLabel: "ZAČAŤ DOPYT",
        caHref: "/dopyt",
      }}
      cardsTitle="Čo pre vás riešime"
      cards={[
        {
          tag: "AKVÁRIUM",
          title: "Akváriá na mieru",
          body: "Sladkovodné aj morské nádrže s presnými rozmermi pre váš priestor a techniku.",
        },
        {
          tag: "TERÁRIUM",
          title: "Teráriá na mieru",
          body: "Suché aj vlhké teráriá s vetraním, prístupom a osvetlením podľa druhu.",
        },
        {
          tag: "SKLO",
          title: "Technické sklo",
          body: "Optiwhite, hrúbky a lepenie dimenzované na objem a dlhú životnosť.",
        },
      ]}
      cta={{
        title: "Navrhneme nádrž aj skrinku ako jeden celok.",
        body: "Pošlite účel, rozmery a štýl — pripravíme riešenie na mieru.",
        href: "/dopyt",
        label: "DOPYT NA MIERU",
      }}
    />
  );
}
