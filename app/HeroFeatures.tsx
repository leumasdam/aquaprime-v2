const HF: Record<string, React.ReactNode> = {
  mira: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M3.5 16.5 16.5 3.5 20.5 7.5 7.5 20.5z" />
      <path d="m7 11 1.7 1.7M10.5 7.5l1.7 1.7M13.5 10.5l1.5 1.5M9.5 13.8l1.5 1.5" />
    </svg>
  ),
  material: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M6 3h12l4 6-10 12L2 9z" />
      <path d="M2 9h20M9 3 6 9l6 12M15 3l3 6-6 12" />
    </svg>
  ),
  presnost: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="3.4" />
      <path d="M12 1v3.4M12 19.6V23M1 12h3.4M19.6 12H23" />
    </svg>
  ),
  hodnota: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M12 2 4 5v6c0 5 3.4 8.2 8 9.8 4.6-1.6 8-4.8 8-9.8V5z" />
      <path d="m8.5 11.8 2.4 2.4 4.6-5" />
    </svg>
  ),
  slovensko: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M12 2 4 5v6c0 5 3.4 8.2 8 9.8 4.6-1.6 8-4.8 8-9.8V5z" />
      <path d="M12 6.4v9.4" />
      <path d="M9.2 9.3h5.6" />
      <path d="M8 12.4h8" />
    </svg>
  ),
};



/* Poradie ikon zodpovedá poradiu položiek v slovníku (app/preklady.ts). */
const IKONY = ["mira", "material", "presnost", "hodnota", "slovensko"];

export default function HeroFeatures({ polozky }: { polozky: [string, string][] }) {
  const loop = [...polozky, ...polozky];
  return (
    <div className="hero__bar-inner">
      <div className="hero__bar-track">
        {loop.map(([titul, popis], i) => (
          <div
            className="hfeat"
            key={`${titul}-${i}`}
            aria-hidden={i >= polozky.length ? "true" : undefined}
          >
            <span className="hfeat__ring">{HF[IKONY[i % polozky.length]]}</span>
            <span className="hfeat__txt">
              <span className="hfeat__t">{titul}</span>
              <span className="hfeat__s">{popis}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
