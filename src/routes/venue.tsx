import { createFileRoute } from "@tanstack/react-router";
import { SectionWrapper, Eyebrow, DisplayTitle } from "@/components/layout/SectionWrapper";
import { GoldHairline } from "@/components/heraldry/GoldHairline";
import { MapPin, Phone, Clock } from "lucide-react";
import site from "@/content/site.json";
import venue from "@/content/venue.json";

export const Route = createFileRoute("/venue")({
  head: () => ({
    meta: [
      { title: `Venue · ${site.bride.first} & ${site.groom.first}` },
      { name: "description", content: "A garden wedding at Redemption Camp. Where to be and how to arrive on the day." },
      { property: "og:title", content: `Venue · ${site.date.display}` },
      { property: "og:description", content: "A garden wedding at Redemption Camp." },
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

      <div className="grid md:grid-cols-2 gap-10 mt-14 max-w-5xl mx-auto items-stretch">
        <div className="card-royal p-10 flex flex-col">
          <p className="eyebrow !text-left">Garden Ceremony &amp; Reception</p>
          <h3 className="font-display text-3xl mt-3 text-emerald-ink">{venue.name}</h3>
          <p className="font-script text-2xl text-gold mt-1">{venue.subname}</p>
          <p className="mt-5 font-display italic text-charcoal/80 leading-relaxed">
            {venue.blurb}
          </p>

          <dl className="mt-7 space-y-4 text-sm">
            <Row icon={<MapPin size={16} />} label={venue.address} />
            <Row icon={<Clock size={16} />} label={venue.openLine} />
            <Row icon={<Phone size={16} />} label={venue.phone} />
          </dl>

          <a
            href={venue.mapsLink}
            target="_blank"
            rel="noreferrer"
            className="btn-royal-ghost mt-8 self-start"
          >
            Open in maps
          </a>
        </div>

        <div className="relative overflow-hidden border border-gold/40 bg-paper min-h-[320px]">
          {/* graceful backdrop, covered by the map once its tiles load */}
          <div className="absolute inset-0 grid place-items-center text-center px-6">
            <div>
              <MapPin size={28} className="mx-auto text-oxblood" />
              <p className="mt-3 eyebrow !text-emerald-ink">{venue.name}</p>
              <p className="mt-1 font-display italic text-charcoal/60 text-sm">{venue.address}</p>
            </div>
          </div>
          <iframe
            title="Map to Redemption Camp"
            src={venue.mapEmbed}
            className="absolute inset-0 h-full w-full"
            style={{ border: 0, filter: "saturate(0.92) contrast(0.96)" }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
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
