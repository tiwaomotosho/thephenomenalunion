import { Link } from "@tanstack/react-router";
import { Crest } from "@/components/heraldry/Crest";

export function Footer() {
  return (
    <footer className="bg-emerald-ink-grain text-ivory">
      <div className="mx-auto max-w-6xl px-6 py-20 text-center">
        <div className="flex justify-center">
          <Crest size={120} />
        </div>
        <p className="eyebrow mt-6 !text-gold-soft">Amor Vincit Omnia</p>
        <h3 className="font-display mt-3 text-3xl sm:text-4xl text-ivory">
          Eniolaoluwa <span className="font-script text-gold text-4xl sm:text-5xl mx-2">&amp;</span> Tiwalade
        </h3>
        <p className="mt-3 font-ceremonial text-[0.7rem] tracking-[0.32em] text-gold-soft">
          XXVII · VIII · MMXXVI
        </p>

        <div className="gold-hairline-wide my-10 opacity-70" />

        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-[0.7rem] font-ceremonial tracking-[0.28em] text-ivory/70">
          <Link to="/" className="hover:text-gold">Home</Link>
          <Link to="/schedule" className="hover:text-gold">Order of the Day</Link>
          <Link to="/venue" className="hover:text-gold">Venue</Link>
          <Link to="/gallery" className="hover:text-gold">Gallery</Link>
          <Link to="/registry" className="hover:text-gold">Blessings</Link>
          <Link to="/notes" className="hover:text-gold">Notes</Link>
          <Link to="/rsvp" className="hover:text-gold">RSVP</Link>
          <Link to="/faq" className="hover:text-gold">FAQ</Link>
        </nav>

        <p className="mt-10 text-xs text-ivory/40 font-display italic">
          By Royal Appointment · A Love Written in Lagos
        </p>
      </div>
    </footer>
  );
}
