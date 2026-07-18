import { Link, useRouterState } from "@tanstack/react-router";
import { Crest } from "@/components/heraldry/Crest";
import site from "@/content/site.json";
import { visiblePages } from "@/content/pages";

export function Footer() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const homeScroll = () => {
    if (pathname === "/" && typeof window !== "undefined")
      window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-emerald-ink-grain text-ivory">
      <div className="mx-auto max-w-6xl px-6 py-20 text-center">
        <div className="flex justify-center">
          <Crest size={120} />
        </div>
        <p className="eyebrow mt-6 !text-gold-soft">{site.motto}</p>
        <h3 className="font-display mt-3 text-3xl sm:text-4xl text-ivory">
          {site.bride.first} <span className="font-script text-gold text-4xl sm:text-5xl mx-2">&amp;</span> {site.groom.first}
        </h3>
        <p className="mt-3 font-ceremonial text-[0.7rem] tracking-[0.32em] text-gold-soft">
          {site.date.display}
        </p>

        <div className="gold-hairline-wide my-10 opacity-70" />

        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-[0.7rem] font-ceremonial tracking-[0.28em] text-ivory/70">
          <Link to="/" onClick={homeScroll} className="hover:text-gold">Home</Link>
          {visiblePages.map((p) => (
            <Link key={p.to} to={p.to} className="hover:text-gold">{p.navLabel}</Link>
          ))}
        </nav>

        <p className="mt-10 text-xs text-ivory/40 font-display italic">
          {site.appointment} · {site.tagline}
        </p>
      </div>
    </footer>
  );
}
