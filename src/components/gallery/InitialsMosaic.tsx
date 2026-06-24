import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { img } from "@/content/images";

/**
 * The couple's initials, built from photographs.
 *
 * Each filled cell of the letter bitmaps below becomes a photo tile. On entering
 * the viewport the tiles fly in from scattered positions and lock into the shape
 * of an "E" and a "T". Scatter offsets are derived deterministically from the
 * tile index so server and client render identically (no hydration mismatch).
 */
const LETTER_E = ["XXXX", "X...", "X...", "XXX.", "X...", "X...", "XXXX"];
const LETTER_T = ["XXXXX", "..X..", "..X..", "..X..", "..X..", "..X..", "..X.."];

// Deterministic pseudo-random in [0, 1) from an integer seed.
function rand(n: number): number {
  const x = Math.sin(n * 999.73) * 43758.5453;
  return x - Math.floor(x);
}

function Letter({
  bitmap,
  cols,
  startIndex,
  formed,
  reduced,
}: {
  bitmap: string[];
  cols: number;
  startIndex: number;
  formed: boolean;
  reduced: boolean;
}) {
  let local = 0;
  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${cols}, var(--cell))`,
        gridAutoRows: "var(--cell)",
        gap: "var(--gap)",
      }}
    >
      {bitmap.flatMap((row, r) =>
        row.split("").map((ch, c) => {
          if (ch !== "X") return <span key={`${r}-${c}`} aria-hidden />;
          const i = startIndex + local++;
          const dx = (rand(i * 2 + 1) - 0.5) * 220;
          const dy = (rand(i * 2 + 7) - 0.5) * 180;
          const rot = (rand(i * 3 + 4) - 0.5) * 90;
          const style: CSSProperties = {
            backgroundImage: `url(${img(galleryFor(i))})`,
            transitionDelay: reduced ? "0ms" : `${i * 32}ms`,
            transform: formed
              ? "none"
              : `translate(${dx}px, ${dy}px) rotate(${rot}deg) scale(0.35)`,
            opacity: formed ? 1 : 0,
          };
          return <span key={`${r}-${c}`} className="mosaic-tile" style={style} />;
        }),
      )}
    </div>
  );
}

let GALLERY_POOL: string[] = [];
function galleryFor(i: number): string {
  return GALLERY_POOL.length ? GALLERY_POOL[i % GALLERY_POOL.length] : "";
}

export function InitialsMosaic({ images }: { images: string[] }) {
  GALLERY_POOL = images;
  const ref = useRef<HTMLDivElement>(null);
  const [formed, setFormed] = useState(false);
  const [reduced, setReduced] = useState(false);

  const eCount = useMemo(
    () => LETTER_E.join("").split("").filter((ch) => ch === "X").length,
    [],
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setReduced(true);
      setFormed(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setFormed(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="flex items-start justify-center gap-[var(--cell)] select-none"
      style={
        {
          "--cell": "clamp(26px, 7.4vw, 56px)",
          "--gap": "4px",
        } as CSSProperties
      }
      aria-label="The initials E and T, formed from wedding photographs"
      role="img"
    >
      <Letter bitmap={LETTER_E} cols={4} startIndex={0} formed={formed} reduced={reduced} />
      <Letter bitmap={LETTER_T} cols={5} startIndex={eCount} formed={formed} reduced={reduced} />
    </div>
  );
}
