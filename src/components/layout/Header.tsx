import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Cipher } from "@/components/heraldry/Cipher";
import { Menu, X } from "lucide-react";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/schedule", label: "Order of the Day" },
  { to: "/venue", label: "Venue & Stay" },
  { to: "/gallery", label: "Gallery" },
  { to: "/registry", label: "Blessings" },
  { to: "/notes", label: "Notes" },
  { to: "/faq", label: "FAQ" },
] as const;

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

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled ? "bg-ivory/85 backdrop-blur-md border-b border-gold/30" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link to="/" className="group flex items-center gap-3" aria-label="Home">
          <Cipher size={26} className="opacity-90 group-hover:opacity-100 transition-opacity" />
          <span className="font-ceremonial text-[0.65rem] tracking-[0.32em] text-emerald-deep">
            E &nbsp;·&nbsp; T
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {NAV.map((n) => {
            const active = pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`font-ceremonial text-[0.65rem] tracking-[0.28em] transition-colors ${
                  active ? "text-gold" : "text-emerald-ink hover:text-gold"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
          <Link to="/rsvp" className="btn-royal !py-2 !px-5 !text-[0.62rem]">
            RSVP
          </Link>
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden text-emerald-deep p-2"
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
                className="font-ceremonial text-xs tracking-[0.28em] text-emerald-ink hover:text-gold"
              >
                {n.label}
              </Link>
            ))}
            <Link to="/rsvp" className="btn-royal mt-2 self-start">
              RSVP
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
