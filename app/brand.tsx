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

/**
 * Oficiálna značka AQUAPRIME — „A" s rybou a vlnou (klientove SVG).
 * Kreslí sa cez currentColor, takže sa dá zafarbiť podľa kontextu.
 */
export function AquaFishMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 409.33 393.77"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M52.71,263.25l19.43-40c-19.55-9.75-42.7-11.05-61.84-1.53,20.64,9.05,30.52,23.91,42.41,41.53Z" />
      <path d="M372.65,320.48c-17.3-17.36-38.18-23.96-61.41-22.43-14.46,4.52-29.08,8.63-43.29,15.12-19.69,7.49-40.17,8.17-60.37,2.97-12.77-1.76-24.7-1.12-33.66,8.94,14.51,12.26,26.88,23.7,41.52,33.98,30.41,19.57,65.18,18.13,93.7-.59,34.05-17.35,65.57-14.62,96.14,10.37-4.46-20.65-18.81-35.99-32.62-48.36Z" />
      <path d="M270.04,281.67l-15.59-17.62c-31.61-38.64-79.35-57.1-129.16-48.04,12.44-17.86,30.53-25.3,49.86-31l47.35-89.41c12.95,16.52,17.93,35.4,30.09,51.84l67.53,134.55c23.64,1.88,43.27,11.36,62.19,25.29,10.78,6.26,14.74,19.78,27.02,25.68-2.32-13.48-12.4-22-15.78-34.34l-82.17-167.07-10.85-21.44-46.43-92.87c-2.35-7.32-5.99-14.11-13.23-17.23-15.2.94-29.19-.56-44.5,1.52l-37.59,73.71-83.84,165.52-37.2,74.88c-13.58,25.29-26.48,49.88-37.75,77.18,19.32,3.3,35.84-2.04,50.79-14.34,23.73-18.19,46.87-35.58,73.86-48.86,26.48-14.06,54.24-22.87,83.87-26.24,22.61-1.72,41.86-9.61,61.52-21.72ZM205.93,262.51c0-4.74,3.84-8.59,8.59-8.59s8.59,3.84,8.59,8.59-3.84,8.59-8.59,8.59-8.59-3.84-8.59-8.59Z" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={`logo${className ? " " + className : ""}`}>
      <AquaFishMark className="logo__mark" />
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
