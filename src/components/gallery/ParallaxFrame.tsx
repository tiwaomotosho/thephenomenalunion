import { useId, useRef, type CSSProperties } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/**
 * A single framed portrait in the Royal Portrait Hall.
 *
 * The picture hangs on the emerald wall in a thin gilt frame with an ivory mat.
 * On entering view it is "hung": the photo wipes in (clip-path) and un-blurs
 * while scaling down, and the gilt frame draws its own border in around it.
 * Once hung, the photo drifts at a different speed than the page (parallax).
 * Falls back to a static framed picture under prefers-reduced-motion.
 */
export function ParallaxFrame({
  src,
  caption,
  aspectRatio,
  style,
  className = "",
  onClick,
}: {
  src: string;
  caption: string;
  aspectRatio: string;
  style?: CSSProperties;
  className?: string;
  onClick?: () => void;
}) {
  const scope = useRef<HTMLElement>(null);
  const photo = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);
  const gilt = useRef<SVGRectElement>(null);
  const giltId = useId().replace(/:/g, "");

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.registerPlugin(ScrollTrigger);
      const trigger = scope.current;

      gsap.fromTo(
        photo.current,
        { clipPath: "inset(100% 0 0 0)" },
        {
          clipPath: "inset(0% 0 0 0)",
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: { trigger, start: "top 85%", once: true },
        },
      );
      gsap.fromTo(
        img.current,
        { scale: 1.2, filter: "blur(8px)" },
        {
          scale: 1.04,
          filter: "blur(0px)",
          duration: 1.3,
          ease: "power4.out",
          scrollTrigger: { trigger, start: "top 85%", once: true },
        },
      );
      // gilt frame draws itself in
      gsap.fromTo(
        gilt.current,
        { strokeDashoffset: 100 },
        {
          strokeDashoffset: 0,
          duration: 0.9,
          ease: "power2.out",
          delay: 0.15,
          scrollTrigger: { trigger, start: "top 85%", once: true },
        },
      );
      // parallax drift
      gsap.fromTo(
        img.current,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: "none",
          scrollTrigger: { trigger, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    },
    { scope },
  );

  return (
    <figure ref={scope} className={`ed-slot ${className}`} style={style}>
      <button type="button" onClick={onClick} className="rph-frame" aria-label={`View photo: ${caption}`}>
        <div className="rph-mat">
          <div className="rph-photo" ref={photo} style={{ aspectRatio }}>
            <img ref={img} src={src} alt={caption} loading="lazy" />
          </div>
        </div>
        <svg className="rph-gilt" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          <defs>
            <linearGradient id={`gilt-${giltId}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#b8923f" />
              <stop offset="40%" stopColor="#e6c98a" />
              <stop offset="62%" stopColor="#c9a961" />
              <stop offset="100%" stopColor="#8c6e2f" />
            </linearGradient>
          </defs>
          <rect
            ref={gilt}
            x="0.6"
            y="0.6"
            width="98.8"
            height="98.8"
            pathLength={100}
            stroke={`url(#gilt-${giltId})`}
          />
        </svg>
      </button>
      <figcaption className="ed-cap">{caption}</figcaption>
    </figure>
  );
}
