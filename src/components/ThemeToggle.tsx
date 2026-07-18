import { useEffect, useState } from "react";

/**
 * Cycles between the three colour schemes and remembers the choice.
 *   Royal  — Emerald & Gold (the original, the default)
 *   Blush  — Pink & Green (pink majority)
 *   Garden — Green & Pink (green majority)
 * An inline script in the document head applies the saved choice before paint,
 * so there is no flash on load. The two dots preview the current scheme.
 */
const KEY = "tpu.theme";
type Theme = "garden" | "blush" | "royal";

const ORDER: Theme[] = ["royal", "blush", "garden"];
const META: Record<Theme, { label: string; dots: [string, string] }> = {
  blush: { label: "Blush", dots: ["#a84a6a", "#7aa06a"] },
  garden: { label: "Garden", dots: ["#3f5f48", "#f4c2c2"] },
  royal: { label: "Royal", dots: ["#e6c98a", "#0b3b2e"] },
};

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("royal");

  useEffect(() => {
    const attr = document.documentElement.getAttribute("data-theme");
    setTheme(attr === "blush" || attr === "garden" ? attr : "royal");
  }, []);

  const cycle = () => {
    const next = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length];
    document.documentElement.setAttribute("data-theme", next);
    try {
      window.localStorage.setItem(KEY, next);
    } catch {
      /* ignore */
    }
    setTheme(next);
  };

  const nextLabel = META[ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length]].label;

  return (
    <button
      type="button"
      onClick={cycle}
      title={`Colour: ${META[theme].label}. Tap for ${nextLabel}.`}
      aria-label={`Colour scheme: ${META[theme].label}. Switch to ${nextLabel}.`}
      className={`inline-flex items-center ${className}`}
    >
      <span className="flex items-center">
        <span
          className="h-3.5 w-3.5 rounded-full ring-1 ring-black/15"
          style={{ background: META[theme].dots[0] }}
        />
        <span
          className="h-3.5 w-3.5 -ml-1.5 rounded-full ring-1 ring-black/15"
          style={{ background: META[theme].dots[1] }}
        />
      </span>
    </button>
  );
}
