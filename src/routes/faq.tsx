import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SectionWrapper, Eyebrow, DisplayTitle } from "@/components/layout/SectionWrapper";
import { GoldHairline } from "@/components/heraldry/GoldHairline";
import { Plus, Minus } from "lucide-react";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Eniolaoluwa & Tiwalade" },
      { name: "description", content: "Dress code, children, parking, and other gentle matters." },
      { property: "og:title", content: "Frequently Asked" },
      { property: "og:description", content: "Dress code, children, parking, and other gentle matters." },
    ],
  }),
  component: Faq,
});

const FAQS = [
  {
    q: "What is the dress code?",
    a: "Black tie and traditional. Floor-length gowns, agbada, gele, dinner jackets. The house palette is ivory, emerald, oxblood, and gold — but please wear what makes you feel beautiful.",
  },
  {
    q: "May I bring my children?",
    a: "We have chosen an adults-only celebration, with the warm exception of those named on your invitation. A list of trusted babysitters will be sent on request.",
  },
  {
    q: "What time should I arrive?",
    a: "Doors open at 10:00 for the engagement; the white wedding begins promptly at 16:00. We recommend arriving thirty minutes before each ceremony.",
  },
  {
    q: "Will there be parking?",
    a: "Yes — valet from 09:00 at the venue. A complimentary shuttle will run between The Wheatbaker, Eko Hotel, and the chapel from 09:30.",
  },
  {
    q: "Can I take photographs during the ceremony?",
    a: "We kindly ask that phones and cameras be kept away during both ceremonies. A full gallery will be shared with all guests within four weeks.",
  },
  {
    q: "Is there a gift registry?",
    a: "Your presence is gift enough. For those who have asked, please see our Blessings page — small contributions toward our first home.",
  },
  {
    q: "Dietary requirements?",
    a: "Standard, vegetarian, kosher, and halal options are available. Please note your preference on the RSVP form.",
  },
  {
    q: "How do I get in touch?",
    a: "Our chief bridesmaid Folasade can be reached at folasade@etomotosho.com for all matters of the day.",
  },
];

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <SectionWrapper ground="ivory">
      <div className="text-center">
        <Eyebrow>Section XIII</Eyebrow>
        <DisplayTitle className="mt-4">Frequently Asked</DisplayTitle>
        <GoldHairline withCipher wide />
      </div>

      <div className="mt-14 max-w-3xl mx-auto divide-y divide-gold/25 border-y border-gold/25">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={i}>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-6 py-6 text-left group"
              >
                <span className="font-display text-xl sm:text-2xl text-emerald-ink group-hover:text-emerald-deep">
                  {f.q}
                </span>
                <span className="text-gold shrink-0">
                  {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                </span>
              </button>
              <div
                className={`grid transition-[grid-template-rows] duration-500 ease-out ${
                  isOpen ? "grid-rows-[1fr] pb-7" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="font-display italic text-charcoal/80 text-lg leading-relaxed pr-10">
                    {f.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
