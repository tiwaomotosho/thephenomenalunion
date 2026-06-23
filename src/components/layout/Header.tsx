import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Cipher } from "@/components/heraldry/Cipher";
import { Menu, X } from "lucide-react";
import site from "@/content/site.json";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/schedule", label: "Order of the Day" },
  { to: "/venue", label: "Venue" },
  { to: "/gallery", label: "Gallery" },
  { to: "/registry", label: "Blessings" },
  { to: "/notes", label: "Notes" },
  { to: "/faq", label: "FAQ" },
] as const;

/** Scroll to the very top — used when a link points at the page already shown. */
function scrollToTop() {
  if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
}

export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // The home hero is a dark image; while sitting over it (top of "/", not yet
  // scrolled) the bar is transparent, so links must be light to stay legible.
  const overHero = pathname === "/" && !scrolled;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled ? "bg-ivory/85 backdrop-blur-md border-b border-gold/30" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link
          to="/"
          onClick={() => pathname === "/" && scrollToTop()}
          className="group flex items-center gap-3"
          aria-label="Home"
        >
          <Cipher
            size={26}
            className={`transition-opacity ${overHero ? "text-ivory opacity-95" : "opacity-90 group-hover:opacity-100"}`}
          />
          <span
            className={`font-ceremonial text-[0.65rem] tracking-[0.32em] ${
              overHero ? "text-ivory" : "text-emerald-deep"
            }`}
          >
            {site.monogram}
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {NAV.map((n) => {
            const active = pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => active && scrollToTop()}
                className={`font-ceremonial text-[0.65rem] tracking-[0.28em] transition-colors ${
                  active
                    ? "text-gold"
                    : overHero
                      ? "text-ivory/90 hover:text-gold-soft"
                      : "text-emerald-ink hover:text-gold"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
          <Link to="/registry" className="btn-royal !py-2 !px-5 !text-[0.62rem]">
            Bless Us
          </Link>
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className={`lg:hidden p-2 ${overHero ? "text-ivory" : "text-emerald-deep"}`}
          aria-label="Menu"
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-ivory/95 backdrop-blur-md border-t border-gold/30">
          <nav className="mx-auto flex max-w-6xl flex-col px-6 py-6 gap-4">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => pathname === n.to && scrollToTop()}
                className="font-ceremonial text-xs tracking-[0.28em] text-emerald-ink hover:text-gold"
              >
                {n.label}
              </Link>
            ))}
            <Link to="/registry" className="btn-royal mt-2 self-start">
              Bless Us
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
