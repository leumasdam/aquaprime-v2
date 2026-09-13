import Subpage from "../Subpage";
import { odkaz, type Jazyk } from "../jazyk";
import type { Slovnik } from "../preklady";

export default function DoplnkyObsah({ t, jazyk }: { t: Slovnik; jazyk: Jazyk }) {
  const d = t.doplnky;
  return (
    <Subpage
      accent="var(--cyan)"
      jazyk={jazyk}
      crumb={d.drobcek}
      title={d.titul}
      lead={d.lead}
      main={{
        label: d.hlavnyLabel,
        title: d.hlavnyTitul,
        body: d.hlavnyText,
        points: d.body.map(([bod, popis]) => ({ t: bod, b: popis })),
        ctaLabel: d.hlavnyCta,
        caHref: odkaz("/dopyt", jazyk),
      }}
      cardsTitle={d.kartyTitul}
      cards={d.karty.map(([tag, titul, text]) => ({ tag, title: titul, body: text }))}
      cta={{
        title: d.ctaTitul,
        body: d.ctaText,
        href: odkaz("/dopyt", jazyk),
        label: d.ctaLabel,
      }}
    />
  );
}
