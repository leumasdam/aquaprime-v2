import Subpage from "../Subpage";

export const metadata = {
  title: "O nás | AQUAPRIME",
  description:
    "Značka a výroba AQUAPRIME. Prečo rám a nosnosť, výroba na Slovensku, proces a hodnoty.",
};

export default function Page() {
  return (
    <Subpage
      accent="var(--cyan)"
      eyebrow="O NÁS"
      title="Značka postavená na ráme, nosnosti a pokoji."
      lead="Jadrom AQUAPRIME sú bezpečné skrinky pod ťažké akváriá. Veríme, že akvárium má byť emóciou v interiéri — a istotou, nie obavou z váhy."
      main={{
        label: "VÝROBA",
        title: "Prečo staviame okolo oceľového rámu a nosnosti.",
        body: "Stovky litrov vody sú extrémna statická záťaž. Preto je u nás rám a vyrovnanie základ, nie doplnok. Vyrábame na Slovensku, s dôrazom na detail a dlhú životnosť.",
        points: [
          { t: "Prečo rám a nosnosť", b: "Bezpečnosť je prvé rozhodnutie, nie posledné." },
          { t: "Výroba na Slovensku", b: "Kontrola kvality a krátka cesta k vám." },
          { t: "Proces a hodnoty", b: "Poradenstvo, presnosť a čistý dizajn." },
          { t: "Pokoj pri váhe", b: "Certifikované nožičky a statická rezerva." },
        ],
        ctaLabel: "OZVITE SA NÁM",
        caHref: "/kontakt",
      }}
      cardsTitle="Ako pracujeme"
      cards={[
        {
          tag: "01",
          title: "Konzultácia",
          body: "Pochopíme priestor, zámer a objem ešte pred návrhom.",
        },
        {
          tag: "02",
          title: "Návrh a rám",
          body: "Dimenzujeme rám, povrch a techniku ako jeden celok.",
        },
        {
          tag: "03",
          title: "Výroba a montáž",
          body: "Precízne spracovanie, doručenie a osadenie na mieste.",
        },
      ]}
      cta={{
        title: "Poďme spolu navrhnúť vaše riešenie.",
        body: "Sme tu pre náročné projekty aj prvé akvárium do obývačky.",
        href: "/dopyt",
        label: "DOPYT NA MIERU",
      }}
    />
  );
}
