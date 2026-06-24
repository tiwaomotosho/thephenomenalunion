import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { SectionWrapper, Eyebrow, DisplayTitle } from "@/components/layout/SectionWrapper";
import { GoldHairline } from "@/components/heraldry/GoldHairline";
import { InitialsMosaic } from "@/components/gallery/InitialsMosaic";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { img } from "@/content/images";
import site from "@/content/site.json";
import gallery from "@/content/gallery.json";

const IMAGES = gallery.images.map((g) => ({ src: img(g.image), caption: g.caption }));
const MOSAIC_KEYS = gallery.images.map((g) => g.image);

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: `Gallery ${site.hashtag} — ${site.bride.first} & ${site.groom.first}` },
      { name: "description", content: "Frames from our forever — the moments before the moment." },
      { property: "og:title", content: `Gallery ${site.hashtag}` },
      { property: "og:description", content: "Frames from our forever — the moments before the moment." },
      { property: "og:image", content: img(gallery.images[0].image) },
    ],
  }),
  component: Gallery,
});

function Gallery() {
  const [open, setOpen] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Progressive enhancement: arm the reveal only once JS runs, then trip each
  // frame as it enters the viewport. No-JS visitors see every photo immediately.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    grid.classList.add("motion");
    const frames = Array.from(grid.querySelectorAll<HTMLElement>(".reveal-frame"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    frames.forEach((f) => io.observe(f));
    return () => io.disconnect();
  }, []);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (dir: number) => setOpen((o) => (o === null ? o : (o + dir + IMAGES.length) % IMAGES.length)),
    [],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, step]);

  return (
    <SectionWrapper ground="ivory">
      <div className="text-center">
        <Eyebrow>{gallery.eyebrow}</Eyebrow>
        <DisplayTitle className="mt-4">{site.hashtag}</DisplayTitle>
        <GoldHairline withCipher wide />
        <p className="font-display italic text-lg max-w-xl mx-auto text-charcoal/80">
          Frames from our forever — the moments before the moment.
          Share your own with the cipher on the day.
        </p>
      </div>

      {/* Showpiece: photographs assembling into the couple's initials. */}
      <div className="mt-16 mb-4 flex justify-center overflow-hidden py-6">
        <InitialsMosaic images={MOSAIC_KEYS} />
      </div>

      <p className="text-center eyebrow !text-gold-deep mb-14">Eni &amp; Tiwa · in frames</p>

      {/* Flowing editorial wall. */}
      <div ref={gridRef} className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
        {IMAGES.map((image, i) => (
          <button
            key={i}
            onClick={() => setOpen(i)}
            className="reveal-frame block w-full break-inside-avoid overflow-hidden border border-gold/30 group cursor-zoom-in"
          >
            <img
              src={image.src}
              alt={image.caption}
              loading="lazy"
              className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.04]"
            />
          </button>
        ))}
      </div>

      {open !== null && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-emerald-ink/92 backdrop-blur-sm p-4 animate-royal-fade"
          onClick={close}
        >
          <button
            onClick={close}
            className="absolute top-4 right-4 text-ivory/80 hover:text-ivory p-2"
            aria-label="Close"
          >
            <X size={28} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); step(-1); }}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 text-ivory/70 hover:text-gold p-2"
            aria-label="Previous"
          >
            <ChevronLeft size={36} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); step(1); }}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 text-ivory/70 hover:text-gold p-2"
            aria-label="Next"
          >
            <ChevronRight size={36} />
          </button>
          <figure onClick={(e) => e.stopPropagation()} className="max-w-5xl max-h-[88vh]">
            <img
              src={IMAGES[open].src}
              alt={IMAGES[open].caption}
              className="max-h-[80vh] w-auto mx-auto object-contain border border-gold/40"
            />
            <figcaption className="mt-4 text-center font-script text-2xl text-gold">
              {IMAGES[open].caption}
              <span className="block mt-1 font-ceremonial text-[0.6rem] tracking-[0.3em] text-ivory/50">
                {open + 1} / {IMAGES.length}
              </span>
            </figcaption>
          </figure>
        </div>
      )}
    </SectionWrapper>
  );
}
