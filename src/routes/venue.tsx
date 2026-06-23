import { createFileRoute } from "@tanstack/react-router";
import { SectionWrapper, Eyebrow, DisplayTitle } from "@/components/layout/SectionWrapper";
import { GoldHairline } from "@/components/heraldry/GoldHairline";
import { MapPin, Phone, Car } from "lucide-react";

export const Route = createFileRoute("/venue")({
  head: () => ({
    meta: [
      { title: "Venue & Travel — Eniolaoluwa & Tiwalade" },
      { name: "description", content: "Where the wedding will take place, how to arrive, and where to stay in Lagos." },
      { property: "og:title", content: "Venue & Travel — 27 August 2026" },
      { property: "og:description", content: "Where to be, how to arrive, and where to lay your head." },
    ],
  }),
  component: Venue,
});

const HOTELS = [
  { name: "The Wheatbaker", neighbourhood: "Ikoyi", note: "Walking distance from the ceremony. Group rate code: ETOMO26." },
  { name: "Eko Hotel & Suites", neighbourhood: "Victoria Island", note: "A short drive over the bridge. Concierge shuttle on the day." },
  { name: "The George Hotel", neighbourhood: "Ikoyi", note: "Boutique stay, intimate courtyard, twelve rooms held under the cipher." },
];

function Venue() {
  return (
    <>
      <SectionWrapper ground="ivory">
        <div className="text-center">
          <Eyebrow>Section VII</Eyebrow>
          <DisplayTitle className="mt-4">The Venue</DisplayTitle>
          <GoldHairline withCipher wide />
        </div>

        <div className="grid md:grid-cols-2 gap-10 mt-14 max-w-5xl mx-auto">
          <div className="card-royal p-10">
            <p className="eyebrow !text-left">Ceremony & Reception</p>
            <h3 className="font-display text-3xl mt-3 text-emerald-ink">Chapel of St. Saviour</h3>
            <p className="font-script text-2xl text-gold mt-1">& The Grand Ballroom</p>
            <p className="mt-5 font-display italic text-charcoal/80 leading-relaxed">
              A nineteenth-century stone chapel set within a private garden,
              connected by a cloister to the ballroom — the same roof from
              vows to last dance.
            </p>

            <dl className="mt-7 space-y-4 text-sm">
              <Row icon={<MapPin size={16} />} label="12 Cathedral Lane, Ikoyi, Lagos" />
              <Row icon={<Phone size={16} />} label="+234 (0) 808 555 0142" />
              <Row icon={<Car size={16} />} label="Valet parking from 09:00" />
            </dl>

            <a
              href="https://maps.google.com"
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
              <p className="mt-3 eyebrow !text-emerald-ink">Chapel of St. Saviour</p>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mt-12 max-w-5xl mx-auto">
          <div className="bg-paper p-7 border-l-2 border-gold">
            <p className="eyebrow !text-left">Dress code</p>
            <p className="font-display text-xl mt-2 text-emerald-ink">Black tie & traditional</p>
            <p className="mt-2 font-display italic text-charcoal/70">
              Floor-length, agbada, gele, dinner jacket. Ivory, emerald, oxblood, gold — the house palette.
            </p>
          </div>
          <div className="bg-paper p-7 border-l-2 border-gold">
            <p className="eyebrow !text-left">Children</p>
            <p className="font-display text-xl mt-2 text-emerald-ink">An adults-only celebration</p>
            <p className="mt-2 font-display italic text-charcoal/70">
              With the warm exception of those listed on your invitation.
            </p>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper ground="paper" id="travel">
        <div className="text-center">
          <Eyebrow>Section VIII</Eyebrow>
          <DisplayTitle className="mt-4">Travel & Stay</DisplayTitle>
          <GoldHairline withCipher wide />
          <p className="font-display italic text-lg max-w-xl mx-auto text-charcoal/80">
            Rooms have been held at the following residences under the cipher.
            Mention the code at booking for the family rate.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-14">
          {HOTELS.map((h) => (
            <div key={h.name} className="card-royal p-7 bg-ivory">
              <p className="eyebrow !text-left">{h.neighbourhood}</p>
              <h3 className="font-display text-2xl mt-2 text-emerald-ink">{h.name}</h3>
              <p className="mt-3 font-display italic text-charcoal/80 leading-relaxed">{h.note}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>
    </>
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
