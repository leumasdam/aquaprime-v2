import Subpage from "../Subpage";

export const metadata = {
  title: "Realizácie | AQUAPRIME",
  description:
    "Skutočné priestory ako dôkaz kvality. Hotové interiéry s akváriom a skrinkou na mieru.",
};

export default function Page() {
  return (
    <Subpage
      accent="var(--cyan)"
      eyebrow="REALIZÁCIE"
      title="Skutočné priestory ako dôkaz kvality."
      lead="Hotové interiéry, fotky a dôvera. Pozrite si naše realizácie v reálnych priestoroch — každý projekt je jedinečný a navrhnutý na mieru."
      main={{
        label: "PORTFÓLIO",
        title: "Akvárium ako súčasť interiéru, nie ako technika v rohu.",
        body: "Filtrujte podľa typu priestoru a inšpirujte sa riešeniami, ktoré spojili nádrž, skrinku a techniku do jedného pokojného celku.",
        points: [
          { t: "Filtre podľa priestoru", b: "Byty, domy a komerčné interiéry." },
          { t: "Featured case study", b: "Detailný príbeh vybranej realizácie." },
          { t: "Galéria projektov", b: "Reálne fotky z dokončených priestorov." },
          { t: "Podobné riešenie", b: "Páči sa? Navrhneme variant pre vás." },
        ],
        ctaLabel: "CHCEM PODOBNÉ",
        caHref: "/dopyt",
      }}
      cardsTitle="Typy priestorov"
      cards={[
        {
          tag: "DOMOV",
          title: "Byty a domy",
          body: "Obývačky a pracovne, kde sa akvárium stalo ústredným prvkom.",
        },
        {
          tag: "BIZNIS",
          title: "Komerčné priestory",
          body: "Recepcie, wellness a ordinácie s pokojom a prestížou.",
        },
        {
          tag: "NA MIERU",
          title: "Atypické projekty",
          body: "Veľké objemy a netradičné riešenia s oceľovým rámom.",
        },
      ]}
      cta={{
        title: "Chcete podobné riešenie u seba?",
        body: "Pošlite priestor a predstavu — navrhneme realizáciu na mieru.",
        href: "/dopyt",
        label: "DOPYT NA MIERU",
      }}
    />
  );
}
