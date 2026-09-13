import Subpage from "../Subpage";
import { odkaz, type Jazyk } from "../jazyk";
import type { Slovnik } from "../preklady";

export default function ONasObsah({ t, jazyk }: { t: Slovnik; jazyk: Jazyk }) {
  const o = t.onas;
  const l = (h: string) => odkaz(h, jazyk);
  return (
    <Subpage
      accent="var(--cyan)"
      crumb={o.drobcek}
      jazyk={jazyk}
      title={o.titul}
      lead={o.lead}
      main={{
        label: o.blokLabel,
        title: o.blokTitul,
        body: o.blokText,
        points: o.body.map(([t2, b]) => ({ t: t2, b })),
        ctaLabel: o.blokCta,
        caHref: l("/kontakt"),
      }}
      cardsTitle={o.postupTitul}
      cards={o.postup.map(([title, body], i) => ({
        tag: `0${i + 1}`,
        title,
        body,
      }))}
      cta={{
        title: o.ctaTitul,
        body: o.ctaText,
        href: l("/dopyt"),
        label: o.ctaTlacidlo,
      }}
    />
  );
}
