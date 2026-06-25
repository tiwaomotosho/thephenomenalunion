import { useEffect, useRef, useState } from "react";
import { splashConfig } from "@/config/splash";

/**
 * Opening splash: on an ivory stage a royal castle builds itself from the
 * ground up while two horses gallop in, one from each side. The couple's
 * monogram then rises behind the towers, everything lingers, and the curtain
 * winds up to reveal the site.
 *
 * Timing lives in src/config/splash.ts. A static pre-paint cover (added by an
 * inline script in the document head) prevents any flash of the site before
 * this React overlay takes over. Skipped under prefers-reduced-motion.
 */
const STORAGE_KEY = "tpu.splash.v1";

type Phase = "showing" | "winding";

export function Splash() {
  const [show, setShow] = useState(false);
  const [phase, setPhase] = useState<Phase>("showing");
  const windTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const html = document.documentElement;
    const clearCover = () => html.classList.remove("splash-pending");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      clearCover();
      return;
    }
    let last = 0;
    try {
      last = Number(window.localStorage.getItem(STORAGE_KEY)) || 0;
    } catch {
      last = 0;
    }
    if (Date.now() - last < splashConfig.showEveryMs) {
      clearCover();
      return;
    }

    setShow(true);
    document.body.style.overflow = "hidden";
    windTimer.current = window.setTimeout(() => setPhase("winding"), splashConfig.durationMs);
    return () => {
      window.clearTimeout(windTimer.current);
      document.body.style.overflow = "";
    };
  }, []);

  // Once the React overlay is on screen, drop the static pre-paint cover.
  useEffect(() => {
    if (show) document.documentElement.classList.remove("splash-pending");
  }, [show]);

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

      <div className="splash-stage">
        <div className="splash-centre">
          <div className="splash-castle-wrap">
            <span className="splash-monogram">E&nbsp;&amp;&nbsp;T</span>
            <Castle />
          </div>
          <span className="splash-motto">The Phenomenal Union</span>
        </div>
      </div>
    </div>
  );
}

/** A heraldic castle: keep, two flanking towers, gatehouse, pennants. */
function Castle() {
  return (
    <svg className="splash-castle" viewBox="0 0 300 210" role="img" aria-label="A royal castle">
      <g stroke="#c9a961" strokeWidth="2" strokeLinejoin="round">
        <rect x="62" y="104" width="40" height="82" className="ct-stone" />
        <path d="M62 104 v-12 h9 v8 h9 v-8 h9 v8 h9 v-8 h4 v12" className="ct-stone" />
        <rect x="198" y="104" width="40" height="82" className="ct-stone" />
        <path d="M198 104 v-12 h9 v8 h9 v-8 h9 v8 h9 v-8 h4 v12" className="ct-stone" />
        <rect x="112" y="74" width="76" height="112" className="ct-stone" />
        <path d="M112 74 v-14 h11 v9 h10 v-9 h11 v9 h11 v-9 h11 v9 h11 v-9 h0 v14" className="ct-stone" />
        <path d="M134 186 v-26 a16 16 0 0 1 32 0 v26 Z" className="ct-gate" stroke="#c9a961" strokeWidth="2" />
        <rect x="146" y="96" width="8" height="16" rx="4" fill="#e6c98a" stroke="none" />
        <rect x="77" y="124" width="6" height="13" rx="3" fill="#e6c98a" stroke="none" />
        <rect x="213" y="124" width="6" height="13" rx="3" fill="#e6c98a" stroke="none" />
        <line x1="150" y1="60" x2="150" y2="40" stroke="#8c6e2f" strokeWidth="2" />
        <path d="M150 41 l16 5 l-16 5 Z" fill="#c9a961" stroke="none" />
        <line x1="82" y1="92" x2="82" y2="78" stroke="#8c6e2f" strokeWidth="2" />
        <path d="M82 79 l11 4 l-11 4 Z" fill="#c9a961" stroke="none" />
        <line x1="218" y1="92" x2="218" y2="78" stroke="#8c6e2f" strokeWidth="2" />
        <path d="M218 79 l11 4 l-11 4 Z" fill="#c9a961" stroke="none" />
      </g>
    </svg>
  );
}

const CSS = `
.splash-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: radial-gradient(125% 85% at 50% 0%, var(--ivory) 0%, var(--ivory) 45%, var(--paper) 100%);
  overflow: hidden;
  transform: translateY(0);
  transition: transform 1s cubic-bezier(0.7, 0, 0.2, 1);
  will-change: transform;
}
.splash-up { transform: translateY(-100%); }

/* castle stone follows the active colour scheme; the gold trim stays gold */
.splash-castle .ct-stone { fill: var(--emerald-deep); }
.splash-castle .ct-gate { fill: var(--emerald-ink); }

.splash-stage { position: absolute; inset: 0; }

.splash-centre {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: clamp(320px, 84vw, 430px);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.splash-castle-wrap {
  position: relative;
  width: 100%;
}
.splash-castle {
  position: relative;
  z-index: 2;
  display: block;
  width: 100%;
  height: auto;
  filter: drop-shadow(0 14px 16px rgba(11, 59, 46, 0.16));
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
  font-size: clamp(6rem, 26vw, 13rem);
  line-height: 1;
  color: #c9a961;
  opacity: 0;
  white-space: nowrap;
  animation: splashEmerge 1.4s cubic-bezier(0.16, 1, 0.3, 1) 1.5s forwards;
}

.splash-motto {
  margin-top: clamp(1.25rem, 3.5vh, 2.25rem);
  font-family: "Cinzel", serif;
  text-transform: uppercase;
  letter-spacing: 0.34em;
  font-size: clamp(0.7rem, 1.4vw, 0.95rem);
  color: #7a5f28;
  text-align: center;
  white-space: nowrap;
  opacity: 0;
  animation: splashFade 1s ease 2.3s forwards;
}

@keyframes splashBuild {
  from { clip-path: inset(100% 0 0 0); }
  to   { clip-path: inset(0% 0 0 0); }
}
@keyframes splashEmerge {
  from { opacity: 0; transform: translate(-50%, 24px); }
  to   { opacity: 1; transform: translate(-50%, -60%); }
}
@keyframes splashFade {
  from { opacity: 0; }
  to   { opacity: 1; }
}
`;
