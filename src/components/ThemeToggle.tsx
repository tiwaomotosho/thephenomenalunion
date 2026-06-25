import { useEffect, useState } from "react";

/**
 * Switches between the two colour schemes and remembers the choice.
 * Garden (Green & Pink) is the default; Royal (Emerald & Gold) is opt-in.
 * An inline script in the document head applies the saved choice before paint,
 * so there is no flash on load.
 */
const KEY = "tpu.theme";
type Theme = "garden" | "royal";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("garden");

  useEffect(() => {
    setTheme(document.documentElement.getAttribute("data-theme") === "royal" ? "royal" : "garden");
  }, []);

  const toggle = () => {
    const next: Theme = theme === "garden" ? "royal" : "garden";
    if (next === "royal") document.documentElement.setAttribute("data-theme", "royal");
    else document.documentElement.removeAttribute("data-theme");
    try {
      window.localStorage.setItem(KEY, next);
    } catch {
      /* ignore */
    }
    setTheme(next);
  };

  const dots = theme === "garden" ? ["#f4c2c2", "#3f5f48"] : ["#e6c98a", "#0b3b2e"];
  const other = theme === "garden" ? "Royal" : "Garden";

  return (
    <button
      type="button"
      onClick={toggle}
      title={`Switch to the ${other} palette`}
      aria-label={`Switch to the ${other} colour palette`}
      className={`inline-flex items-center ${className}`}
    >
      <span className="flex items-center">
        <span
          className="h-3.5 w-3.5 rounded-full ring-1 ring-black/15"
          style={{ background: dots[0] }}
        />
        <span
          className="h-3.5 w-3.5 -ml-1.5 rounded-full ring-1 ring-black/15"
          style={{ background: dots[1] }}
        />
      </span>
    </button>
  );
}
