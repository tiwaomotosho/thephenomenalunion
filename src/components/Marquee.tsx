import { useEffect, useRef, type ReactNode } from "react";

/**
 * A slow, auto-scrolling horizontal row (right to left), like a sponsor wall.
 * Guests can also grab and drag, swipe, or trackpad-scroll it to any point; the
 * auto-scroll pauses while they interact and resumes shortly after. The items
 * are rendered twice so the loop is seamless. Under prefers-reduced-motion it
 * does not auto-scroll but stays manually scrollable.
 */
export function Marquee<T>({
  items,
  renderItem,
  getKey,
  speed = 0.4,
}: {
  items: T[];
  renderItem: (item: T) => ReactNode;
  getKey: (item: T, index: number) => string;
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let paused = false;
    let resumeTimer: number | undefined;
    // Keep the position as a float; reading scrollLeft back each frame rounds
    // the sub-pixel step away, so the row would never actually move.
    let pos = el.scrollLeft;

    const half = () => el.scrollWidth / 2;
    const tick = () => {
      if (!paused) {
        pos += speed;
        if (pos >= half()) pos -= half();
        el.scrollLeft = pos;
      }
      raf = requestAnimationFrame(tick);
    };

    const pause = () => {
      paused = true;
      window.clearTimeout(resumeTimer);
    };
    const resumeSoon = (delay = 1500) => {
      window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        pos = el.scrollLeft; // pick up wherever the guest left it
        paused = false;
      }, delay);
    };

    const onEnter = () => pause();
    const onLeave = () => {
      if (!down) resumeSoon(200);
    };
    const onWheel = () => {
      pause();
      resumeSoon();
    };
    const onTouchStart = () => pause();
    const onTouchEnd = () => resumeSoon();

    // grab-and-drag to scroll (pointer / mouse)
    let down = false;
    let startX = 0;
    let startLeft = 0;
    const onDown = (e: PointerEvent) => {
      down = true;
      pause();
      startX = e.clientX;
      startLeft = el.scrollLeft;
      el.classList.add("is-grabbing");
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      let next = startLeft - (e.clientX - startX);
      const h = half();
      if (next >= h) next -= h;
      if (next < 0) next += h;
      el.scrollLeft = next;
      pos = next;
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      el.classList.remove("is-grabbing");
      resumeSoon(1200);
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("wheel", onWheel, { passive: true });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd);
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    if (!reduce) raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resumeTimer);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [items.length, speed]);

  return (
    <div ref={ref} className="marquee" role="list">
      <div className="marquee-track">
        {items.map((item, i) => (
          <div key={getKey(item, i)} role="listitem" className="marquee-item">
            {renderItem(item)}
          </div>
        ))}
        {items.map((item, i) => (
          <div key={`dup-${getKey(item, i)}`} aria-hidden className="marquee-item">
            {renderItem(item)}
          </div>
        ))}
      </div>
    </div>
  );
}
