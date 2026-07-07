import type { CSSProperties } from "react";

const fill = (v: string): CSSProperties =>
  v.startsWith("#")
    ? { background: v }
    : {
        backgroundImage: `url(${v})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };

/** Vizuálny swatch dekoru — plná farba/textúra, pri kombinácii diagonálne delený. */
export default function Swatch({
  swatch,
  className,
}: {
  swatch: string[];
  className?: string;
}) {
  return (
    <span className={`swatch${className ? ` ${className}` : ""}`} aria-hidden>
      {swatch.length === 1 ? (
        <span className="swatch__lay" style={fill(swatch[0])} />
      ) : (
        <>
          <span
            className="swatch__lay swatch__lay--a"
            style={fill(swatch[0])}
          />
          <span
            className="swatch__lay swatch__lay--b"
            style={fill(swatch[1])}
          />
        </>
      )}
    </span>
  );
}
