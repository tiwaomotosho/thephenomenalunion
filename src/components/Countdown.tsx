import { useEffect, useState } from "react";

const TARGET = new Date("2026-08-27T00:00:00+01:00").getTime();

function diff() {
  const ms = Math.max(0, TARGET - Date.now());
  const d = Math.floor(ms / 86_400_000);
  const h = Math.floor((ms % 86_400_000) / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  return { d, h, m, s };
}

export function Countdown({ light = false }: { light?: boolean }) {
  const [t, setT] = useState(diff);
  useEffect(() => {
    const id = setInterval(() => setT(diff()), 1000);
    return () => clearInterval(id);
  }, []);

  const colour = light ? "text-ivory" : "text-emerald-ink";
  const subColour = light ? "text-gold-soft" : "text-gold";

  const cells = [
    { label: "Days", value: t.d },
    { label: "Hours", value: t.h },
    { label: "Minutes", value: t.m },
    { label: "Seconds", value: t.s },
  ];

  return (
    <div className="flex items-stretch justify-center gap-6 sm:gap-10">
      {cells.map((c, i) => (
        <div key={c.label} className="flex items-center gap-6 sm:gap-10">
          <div className="text-center">
            <div className={`font-display text-3xl sm:text-5xl ${colour} tabular-nums`}>
              {String(c.value).padStart(2, "0")}
            </div>
            <div className={`mt-2 font-ceremonial text-[0.6rem] tracking-[0.3em] ${subColour}`}>
              {c.label}
            </div>
          </div>
          {i < cells.length - 1 && (
            <span className={`font-display text-2xl sm:text-4xl ${subColour} self-center`}>·</span>
          )}
        </div>
      ))}
    </div>
  );
}
