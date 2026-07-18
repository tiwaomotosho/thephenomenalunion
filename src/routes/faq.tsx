import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { SectionWrapper, Eyebrow, DisplayTitle } from "@/components/layout/SectionWrapper";
import { GoldHairline } from "@/components/heraldry/GoldHairline";
import { Plus, Minus } from "lucide-react";
import { isPageVisible, pageNumeral } from "@/content/pages";
import site from "@/content/site.json";
import faq from "@/content/faq.json";

export const Route = createFileRoute("/faq")({
  beforeLoad: () => {
    if (!isPageVisible("faq")) throw redirect({ to: "/" });
  },
  head: () => ({
    meta: [
      { title: `FAQ · ${site.bride.first} & ${site.groom.first}` },
      { name: "description", content: "Dress code, children, parking, and other gentle matters." },
      { property: "og:title", content: "Frequently Asked" },
      { property: "og:description", content: "Dress code, children, parking, and other gentle matters." },
    ],
  }),
  component: Faq,
});

const FAQS = faq.items;

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <SectionWrapper ground="ivory">
      <div className="text-center">
        <Eyebrow>Section {pageNumeral("faq")}</Eyebrow>
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
