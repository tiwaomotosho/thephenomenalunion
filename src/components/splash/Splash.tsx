import { useEffect, useRef, useState } from "react";

/**
 * Opening splash: a bride and groom waltz across an ivory stage, exchanging
 * places with each dance step, then the curtain winds up to reveal the site.
 *
 * Shown at most once every SHOW_EVERY_MS via localStorage so it never nags a
 * returning guest, and skipped entirely under prefers-reduced-motion.
 */
const STORAGE_KEY = "tpu.splash.v1";
const SHOW_EVERY_MS = 1000 * 60 * 60 * 12; // twice a day at most
const WALK_MS = 4600;

type Phase = "walking" | "winding";

export function Splash() {
  const [show, setShow] = useState(false);
  const [phase, setPhase] = useState<Phase>("walking");
  const windTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    let last = 0;
    try {
      last = Number(window.localStorage.getItem(STORAGE_KEY)) || 0;
    } catch {
      last = 0;
    }
    if (Date.now() - last < SHOW_EVERY_MS) return;

    setShow(true);
    document.body.style.overflow = "hidden";

    // Safety net in case the animationend event is missed.
    windTimer.current = window.setTimeout(() => setPhase("winding"), WALK_MS);
    return () => {
      window.clearTimeout(windTimer.current);
      document.body.style.overflow = "";
    };
  }, []);

  function onPairAnimationEnd(e: React.AnimationEvent) {
    if (e.animationName === "splashStroll") {
      window.clearTimeout(windTimer.current);
      setPhase("winding");
    }
  }

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

      {/* faint cipher watermark + house words, like a programme cover */}
      <div className="splash-words">
        <span className="splash-amp">E&nbsp;&amp;&nbsp;T</span>
        <span className="splash-motto">The Phenomenal Union</span>
      </div>

      <div className="splash-stage">
        <div className="splash-pair" onAnimationEnd={onPairAnimationEnd}>
          <div className="splash-bob">
            <Couple />
          </div>
          <div className="splash-shadow" />
        </div>
      </div>
    </div>
  );
}

/** Stylised English-wedding couple — groom in tails & top hat, bride in gown. */
function Couple() {
  return (
    <svg
      className="splash-couple"
      viewBox="0 0 260 220"
      width="260"
      height="220"
      fill="none"
      role="img"
      aria-label="A bride and groom dancing"
    >
      {/* ── Groom ── */}
      <g className="splash-groom" stroke="#06241b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        {/* top hat */}
        <rect x="58" y="20" width="26" height="22" rx="2" fill="#06241b" />
        <line x1="50" y1="42" x2="92" y2="42" />
        {/* head */}
        <circle cx="71" cy="54" r="11" fill="#fbf7ee" />
        {/* tailcoat body */}
        <path d="M71 65 L71 120" />
        <path d="M71 70 C 56 78 52 104 54 124 L62 120 L71 96 L80 120 L88 124 C 90 104 86 78 71 70 Z" fill="#0b3b2e" />
        {/* bow tie */}
        <path d="M66 68 L76 68 L71 72 Z" fill="#6b1f2a" stroke="none" />
        {/* legs */}
        <line x1="64" y1="120" x2="60" y2="160" />
        <line x1="78" y1="120" x2="84" y2="162" />
        {/* arm to the bride */}
        <path d="M84 92 C 104 96 116 102 126 110" />
      </g>

      {/* ── Bride ── */}
      <g className="splash-bride" stroke="#06241b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        {/* veil */}
        <path d="M150 46 C 176 50 184 92 176 138 L160 132 C 168 96 160 64 150 56 Z" fill="#fbf7ee" stroke="#c9a961" strokeWidth="1.5" />
        {/* hair / head */}
        <circle cx="150" cy="56" r="11" fill="#fbf7ee" />
        <path d="M139 54 C 142 44 158 44 161 54" stroke="#06241b" />
        {/* gown */}
        <path d="M150 66 C 138 74 130 120 122 164 L150 156 L178 164 C 170 120 162 74 150 66 Z" fill="#fbf7ee" stroke="#c9a961" strokeWidth="1.5" />
        {/* sash */}
        <path d="M141 86 C 150 92 154 92 161 86" stroke="#c9a961" strokeWidth="2" />
        {/* arm to the groom */}
        <path d="M137 92 C 120 98 112 104 126 110" />
        {/* bouquet */}
        <circle cx="126" cy="111" r="6" fill="#c9a961" stroke="none" />
        <circle cx="121" cy="108" r="3.5" fill="#e6c98a" stroke="none" />
        <circle cx="131" cy="108" r="3.5" fill="#e6c98a" stroke="none" />
        {/* pointe legs */}
        <line x1="146" y1="156" x2="142" y2="186" />
        <line x1="156" y1="156" x2="160" y2="184" />
      </g>
    </svg>
  );
}

const CSS = `
.splash-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background:
    radial-gradient(120% 80% at 50% 0%, #fffdf7 0%, #fbf7ee 45%, #f4eedc 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transform: translateY(0);
  transition: transform 0.95s cubic-bezier(0.7, 0, 0.2, 1);
  will-change: transform;
}
.splash-up { transform: translateY(-100%); }

.splash-words {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  pointer-events: none;
  opacity: 0;
  animation: splashWords 4.6s ease-in-out forwards;
}
.splash-amp {
  font-family: "Pinyon Script", cursive;
  font-size: clamp(4rem, 18vw, 9rem);
  color: #c9a961;
  line-height: 1;
}
.splash-motto {
  font-family: "Cinzel", serif;
  text-transform: uppercase;
  letter-spacing: 0.34em;
  font-size: 0.72rem;
  color: #7a5f28;
  margin-top: 1rem;
}

.splash-stage {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 18vh;
  height: 220px;
}
.splash-pair {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 260px;
  animation: splashStroll ${WALK_MS}ms cubic-bezier(0.45, 0, 0.55, 1) forwards;
  will-change: transform;
}
.splash-bob { animation: splashBob 0.95s ease-in-out infinite; }
.splash-couple { display: block; filter: drop-shadow(0 8px 10px rgba(11, 59, 46, 0.12)); }

.splash-groom { transform-origin: 71px 160px; animation: splashDanceA 1.9s ease-in-out infinite; }
.splash-bride { transform-origin: 150px 185px; animation: splashDanceB 1.9s ease-in-out infinite; }

.splash-shadow {
  position: absolute;
  bottom: 24px;
  left: 40px;
  width: 180px;
  height: 14px;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(11, 59, 46, 0.18), transparent 70%);
  animation: splashBob 0.95s ease-in-out infinite reverse;
}

@keyframes splashStroll {
  from { transform: translateX(-30vw); }
  to   { transform: translateX(118vw); }
}
@keyframes splashBob {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-11px); }
}
@keyframes splashDanceA {
  0%, 100% { transform: translateX(0) rotate(-4deg); }
  50%      { transform: translateX(26px) rotate(4deg); }
}
@keyframes splashDanceB {
  0%, 100% { transform: translateX(0) rotate(4deg); }
  50%      { transform: translateX(-26px) rotate(-4deg); }
}
@keyframes splashWords {
  0%   { opacity: 0; }
  20%  { opacity: 1; }
  80%  { opacity: 1; }
  100% { opacity: 0; }
}
`;
