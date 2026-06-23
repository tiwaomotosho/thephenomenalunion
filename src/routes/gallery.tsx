import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SectionWrapper, Eyebrow, DisplayTitle } from "@/components/layout/SectionWrapper";
import { GoldHairline } from "@/components/heraldry/GoldHairline";
import { X } from "lucide-react";

import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import g6 from "@/assets/gallery-6.jpg";
import g7 from "@/assets/gallery-7.jpg";
import g8 from "@/assets/gallery-8.jpg";

const IMAGES = [
  { src: g2, caption: "Lagos, golden hour" },
  { src: g1, caption: "Two hands, one promise" },
  { src: g6, caption: "Down the cloister" },
  { src: g4, caption: "The bouquet" },
  { src: g7, caption: "The traditional" },
  { src: g5, caption: "The ballroom set" },
  { src: g3, caption: "Letters, ninety-two days" },
  { src: g8, caption: "The cake" },
];

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery #TiwaSaidYes — Eniolaoluwa & Tiwalade" },
      { name: "description", content: "Quiet evidence of the years that brought us here." },
      { property: "og:title", content: "Gallery #TiwaSaidYes" },
      { property: "og:description", content: "Quiet evidence of the years that brought us here." },
      { property: "og:image", content: g2 },
    ],
  }),
  component: Gallery,
});

function Gallery() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <SectionWrapper ground="ivory">
      <div className="text-center">
        <Eyebrow>Join the story</Eyebrow>
        <DisplayTitle className="mt-4">#TiwaSaidYes</DisplayTitle>
        <GoldHairline withCipher wide />
        <p className="font-display italic text-lg max-w-xl mx-auto text-charcoal/80">
          A small archive of the moments before the moment.
          Share your own with the cipher on the day.
        </p>
      </div>

      <div className="mt-14 columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
        {IMAGES.map((img, i) => (
          <button
            key={i}
            onClick={() => setOpen(i)}
            className="block w-full break-inside-avoid overflow-hidden border border-gold/40 group cursor-zoom-in"
          >
            <img
              src={img.src}
              alt={img.caption}
              loading="lazy"
              className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.03]"
            />
          </button>
        ))}
      </div>

      {open !== null && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-emerald-ink/90 backdrop-blur-sm p-4 animate-royal-fade"
          onClick={() => setOpen(null)}
        >
          <button
            onClick={() => setOpen(null)}
            className="absolute top-4 right-4 text-ivory/80 hover:text-ivory p-2"
            aria-label="Close"
          >
            <X size={28} />
          </button>
          <figure onClick={(e) => e.stopPropagation()} className="max-w-5xl max-h-[88vh]">
            <img
              src={IMAGES[open].src}
              alt={IMAGES[open].caption}
              className="max-h-[80vh] w-auto mx-auto object-contain border border-gold/40"
            />
            <figcaption className="mt-4 text-center font-script text-2xl text-gold">
              {IMAGES[open].caption}
            </figcaption>
          </figure>
        </div>
      )}
    </SectionWrapper>
  );
}
