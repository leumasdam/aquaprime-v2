"use client";

import { useEffect, useState } from "react";

/** Dev-only: živý ukazovateľ rozlíšenia viewportu v rohu obrazovky. */
export default function DevViewport() {
  const [size, setSize] = useState<string | null>(null);

  useEffect(() => {
    const update = () =>
      setSize(`${window.innerWidth} × ${window.innerHeight}`);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (!size) return null;

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        right: 10,
        bottom: 10,
        zIndex: 9999,
        padding: "4px 10px",
        borderRadius: 4,
        background: "rgba(0, 0, 0, 0.75)",
        border: "1px solid rgba(71, 199, 232, 0.5)",
        color: "#47c7e8",
        font: "600 12px/1.4 Consolas, monospace",
        letterSpacing: "0.06em",
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      {size}
    </div>
  );
}
