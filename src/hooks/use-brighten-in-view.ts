import { useEffect, useRef } from "react";

/**
 * Returns a ref to attach to a `.portrait-photo` element. On touch / no-hover
 * devices it adds the `is-inview` class once the element scrolls into view, so
 * the portrait colours in — the mobile stand-in for the desktop hover
 * "brighten". On pointer devices it does nothing, since `:hover` handles it.
 */
export function useBrightenInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;

    // Pointer devices reveal on hover; leave them to CSS.
    if (window.matchMedia("(hover: hover)").matches) return;

    if (!("IntersectionObserver" in window)) {
      el.classList.add("is-inview");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("is-inview");
            io.unobserve(el);
          }
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return ref;
}
