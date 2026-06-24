import { useEffect, useRef, useState } from "react";

/**
 * Opening splash: on an ivory stage a royal castle builds itself from the
 * ground up, then the couple's monogram rises into view behind its towers,
 * before the curtain winds up to reveal the site.
 *
 * Shown at most once every SHOW_EVERY_MS via localStorage so it never nags a
 * returning guest, and skipped entirely under prefers-reduced-motion.
 */
const STORAGE_KEY = "tpu.splash.v1";
const SHOW_EVERY_MS = 1000 * 60 * 60 * 12; // twice a day at most
const BUILD_MS = 3600;

type Phase = "building" | "winding";

export function Splash() {
  const [show, setShow] = useState(false);
  const [phase, setPhase] = useState<Phase>("building");
  const windTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let last = 0;
    try {
      last = Number(window.localStorage.getItem(STORAGE_KEY)) || 0;
    } catch {
      last = 0;
    }
    if (Date.now() - last < SHOW_EVERY_MS) return;

    setShow(true);
    document.body.style.overflow = "hidden";
    windTimer.current = window.setTimeout(() => setPhase("winding"), BUILD_MS);
    return () => {
      window.clearTimeout(windTimer.current);
      document.body.style.overflow = "";
    };
  }, []);

  function onOverlayTransitionEnd() {
    if (phase === "winding") {
      try {
        window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
      } catch {
        /* ignore */
      }
      document.body.style.overflow = "";
      setShow(false);
    }
  }

  if (!show) return null;

  return (
    <div
      className={`splash-overlay${phase === "winding" ? " splash-up" : ""}`}
      onTransitionEnd={onOverlayTransitionEnd}
      aria-hidden
    >
      <style>{CSS}</style>

      <div className="splash-scene">
        <span className="splash-monogram">E&nbsp;&amp;&nbsp;T</span>
        <Castle />
        <span className="splash-motto">The Phenomenal Union</span>
      </div>
    </div>
  );
}

/** A heraldic castle: keep, two flanking towers, gatehouse, pennants. */
function Castle() {
  return (
    <svg
      className="splash-castle"
      viewBox="0 0 300 210"
      width="300"
      height="210"
      role="img"
      aria-label="A royal castle"
    >
      <g stroke="#c9a961" strokeWidth="2" strokeLinejoin="round">
        {/* left tower */}
        <rect x="62" y="104" width="40" height="82" fill="#0b3b2e" />
        <path d="M62 104 v-12 h9 v8 h9 v-8 h9 v8 h9 v-8 h4 v12" fill="#0b3b2e" />
        {/* right tower */}
        <rect x="198" y="104" width="40" height="82" fill="#0b3b2e" />
        <path d="M198 104 v-12 h9 v8 h9 v-8 h9 v8 h9 v-8 h4 v12" fill="#0b3b2e" />
        {/* central keep */}
        <rect x="112" y="74" width="76" height="112" fill="#0b3b2e" />
        <path d="M112 74 v-14 h11 v9 h10 v-9 h11 v9 h11 v-9 h11 v9 h11 v-9 h0 v14" fill="#0b3b2e" />
        {/* gatehouse arch */}
        <path
          d="M134 186 v-26 a16 16 0 0 1 32 0 v26 Z"
          fill="#06241b"
          stroke="#c9a961"
          strokeWidth="2"
        />
        {/* lit windows */}
        <rect x="146" y="96" width="8" height="16" rx="4" fill="#e6c98a" stroke="none" />
        <rect x="77" y="124" width="6" height="13" rx="3" fill="#e6c98a" stroke="none" />
        <rect x="213" y="124" width="6" height="13" rx="3" fill="#e6c98a" stroke="none" />
        {/* pennants */}
        <line x1="150" y1="60" x2="150" y2="40" stroke="#8c6e2f" strokeWidth="2" />
        <path d="M150 41 l16 5 l-16 5 Z" fill="#c9a961" stroke="none" />
        <line x1="82" y1="92" x2="82" y2="78" stroke="#8c6e2f" strokeWidth="2" />
        <path d="M82 79 l11 4 l-11 4 Z" fill="#c9a961" stroke="none" />
        <line x1="218" y1="92" x2="218" y2="78" stroke="#8c6e2f" strokeWidth="2" />
        <path d="M218 79 l11 4 l-11 4 Z" fill="#c9a961" stroke="none" />
      </g>
      {/* ground line */}
      <line x1="40" y1="186" x2="260" y2="186" stroke="#c9a961" strokeWidth="2" />
    </svg>
  );
}

const CSS = `
.splash-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: radial-gradient(120% 80% at 50% 0%, #fffdf7 0%, #fbf7ee 45%, #f4eedc 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transform: translateY(0);
  transition: transform 0.95s cubic-bezier(0.7, 0, 0.2, 1);
  will-change: transform;
}
.splash-up { transform: translateY(-100%); }

.splash-scene {
  position: relative;
  width: 300px;
  max-width: 84vw;
  display: flex;
  align-items: center;
  justify-content: center;
}
.splash-castle {
  position: relative;
  z-index: 2;
  width: 100%;
  height: auto;
  filter: drop-shadow(0 14px 16px rgba(11, 59, 46, 0.16));
  /* built from the ground up */
  clip-path: inset(100% 0 0 0);
  animation: splashBuild 2.1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.splash-monogram {
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 50%;
  transform: translate(-50%, 20px);
  font-family: "Pinyon Script", cursive;
  font-size: clamp(5rem, 22vw, 11rem);
  line-height: 1;
  color: #c9a961;
  opacity: 0;
  white-space: nowrap;
  animation: splashEmerge 1.4s cubic-bezier(0.16, 1, 0.3, 1) 1.5s forwards;
}
.splash-motto {
  position: absolute;
  z-index: 3;
  bottom: -3.5rem;
  left: 50%;
  transform: translateX(-50%);
  font-family: "Cinzel", serif;
  text-transform: uppercase;
  letter-spacing: 0.34em;
  font-size: 0.7rem;
  color: #7a5f28;
  white-space: nowrap;
  opacity: 0;
  animation: splashFade 1s ease 2.4s forwards;
}

@keyframes splashBuild {
  from { clip-path: inset(100% 0 0 0); }
  to   { clip-path: inset(0% 0 0 0); }
}
@keyframes splashEmerge {
  from { opacity: 0; transform: translate(-50%, 28px); }
  to   { opacity: 1; transform: translate(-50%, -86%); }
}
@keyframes splashFade {
  from { opacity: 0; }
  to   { opacity: 1; }
}
`;
