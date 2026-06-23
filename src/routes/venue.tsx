import { createFileRoute } from "@tanstack/react-router";
import { SectionWrapper, Eyebrow, DisplayTitle } from "@/components/layout/SectionWrapper";
import { GoldHairline } from "@/components/heraldry/GoldHairline";
import { MapPin, Phone, Car } from "lucide-react";
import site from "@/content/site.json";
import venue from "@/content/venue.json";

export const Route = createFileRoute("/venue")({
  head: () => ({
    meta: [
      { title: `Venue — ${site.bride.first} & ${site.groom.first}` },
      { name: "description", content: "Where the wedding will take place and how to arrive in Lagos." },
      { property: "og:title", content: `Venue — ${site.date.display}` },
      { property: "og:description", content: "Where to be and how to arrive on the day." },
    ],
  }),
  component: Venue,
});

function Venue() {
  return (
    <SectionWrapper ground="ivory">
      <div className="text-center">
        <Eyebrow>{venue.eyebrow}</Eyebrow>
        <DisplayTitle className="mt-4">{venue.title}</DisplayTitle>
        <GoldHairline withCipher wide />
      </div>

      <div className="grid md:grid-cols-2 gap-10 mt-14 max-w-5xl mx-auto">
        <div className="card-royal p-10">
          <p className="eyebrow !text-left">Ceremony & Reception</p>
          <h3 className="font-display text-3xl mt-3 text-emerald-ink">{venue.name}</h3>
          <p className="font-script text-2xl text-gold mt-1">{venue.subname}</p>
          <p className="mt-5 font-display italic text-charcoal/80 leading-relaxed">
            {venue.blurb}
          </p>

          <dl className="mt-7 space-y-4 text-sm">
            <Row icon={<MapPin size={16} />} label={venue.address} />
            <Row icon={<Phone size={16} />} label={venue.phone} />
            <Row icon={<Car size={16} />} label={venue.parking} />
          </dl>

          <a
            href={venue.mapUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-royal-ghost mt-8"
          >
            Open in maps
          </a>
        </div>

        <div className="relative aspect-square overflow-hidden bg-paper border border-gold/40">
          {/* Map placeholder */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(201,169,97,0.25),transparent_45%),radial-gradient(circle_at_70%_70%,rgba(11,59,46,0.25),transparent_55%)]" />
          <svg className="absolute inset-0 h-full w-full text-gold/40" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            <path d="M0 60 Q 30 50 50 65 T 100 55" fill="none" stroke="currentColor" strokeWidth="0.3" />
            <path d="M20 0 L 30 100" fill="none" stroke="currentColor" strokeWidth="0.2" />
            <path d="M75 0 L 60 100" fill="none" stroke="currentColor" strokeWidth="0.2" />
          </svg>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="h-3 w-3 rounded-full bg-oxblood ring-4 ring-oxblood/30 animate-pulse" />
            <p className="mt-3 eyebrow !text-emerald-ink">{venue.name}</p>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mt-12 max-w-5xl mx-auto">
        <div className="bg-paper p-7 border-l-2 border-gold">
          <p className="eyebrow !text-left">Dress code</p>
          <p className="font-display text-xl mt-2 text-emerald-ink">{venue.dressCode.title}</p>
          <p className="mt-2 font-display italic text-charcoal/70">
            {venue.dressCode.body}
          </p>
        </div>
        <div className="bg-paper p-7 border-l-2 border-gold">
          <p className="eyebrow !text-left">Children</p>
          <p className="font-display text-xl mt-2 text-emerald-ink">{venue.children.title}</p>
          <p className="mt-2 font-display italic text-charcoal/70">
            {venue.children.body}
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}

function Row({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3 text-emerald-ink">
      <span className="text-gold">{icon}</span>
      <span className="font-display">{label}</span>
    </div>
  );
}
