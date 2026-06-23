import { useEffect, useState } from "react";
import { Cipher } from "@/components/heraldry/Cipher";

export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 800);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-30 grid h-14 w-14 place-items-center rounded-full border border-gold/60 bg-ivory/90 backdrop-blur-sm shadow-xl hover:bg-paper transition-colors"
    >
      <Cipher size={22} />
    </button>
  );
}
