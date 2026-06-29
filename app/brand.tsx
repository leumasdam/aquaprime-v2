// Brand prvky AQUAPRIME — logo mark (A + vlna) a hodnotové ikony do hero.
// Čisté SVG, server-safe (žiadny client JS).

export function AquaMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 56 46"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M11 32 L28 9 L45 32"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 37.5 C16.5 33 22 41.5 28 37.5 C34 33.5 39.5 42 45 37.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={`logo${className ? " " + className : ""}`}>
      <span className="logo__box" aria-hidden="true">
        A
      </span>
      <span className="logo__type">
        <span className="logo__word">AQUAPRIME</span>
        <span className="logo__tag">LUXURY AQUARIUM CABINETS</span>
      </span>
    </span>
  );
}

const HEX = "M40 24 L32 37.9 L16 37.9 L8 24 L16 10.1 L32 10.1 Z";

export function IconPokoj({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d={HEX} stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M15 24 C18 20.4 21 27.6 24 24 C27 20.4 30 27.6 33 24"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconRemeslo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d={HEX} stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M17.5 30.5 L24 17 L30.5 30.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 33 C20 31 22 34.6 24 33 C26 31.4 28 35 30 33"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconEstetika({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path
        d="M13.5 34.5 L24 10 L34.5 34.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 37 C17.6 34.6 20.6 38.4 24 37 C27.4 35.6 30.4 39.4 33 37"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
