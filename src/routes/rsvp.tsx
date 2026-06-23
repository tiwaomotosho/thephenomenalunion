import { createFileRoute } from "@tanstack/react-router";
import { SectionWrapper, Eyebrow, DisplayTitle } from "@/components/layout/SectionWrapper";
import { GoldHairline } from "@/components/heraldry/GoldHairline";
import { RsvpForm } from "@/components/rsvp/RsvpForm";

export const Route = createFileRoute("/rsvp")({
  head: () => ({
    meta: [
      { title: "RSVP — Eniolaoluwa & Tiwalade" },
      { name: "description", content: "Kindly respond by the first of August, 2026." },
      { property: "og:title", content: "RSVP — Eniolaoluwa & Tiwalade" },
      { property: "og:description", content: "Kindly respond by the first of August, 2026." },
    ],
  }),
  component: RsvpPage,
});

function RsvpPage() {
  return (
    <SectionWrapper ground="paper">
      <div className="text-center">
        <Eyebrow>Section XII</Eyebrow>
        <DisplayTitle className="mt-4">Kindly respond</DisplayTitle>
        <GoldHairline withCipher wide />
        <p className="font-display italic text-lg max-w-xl mx-auto text-charcoal/80">
          By the first of August, two thousand and twenty-six.
        </p>
      </div>

      <div className="mt-14 max-w-2xl mx-auto">
        <RsvpForm />
      </div>
    </SectionWrapper>
  );
}
