import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { SectionWrapper, Eyebrow, DisplayTitle } from "@/components/layout/SectionWrapper";
import { GoldHairline } from "@/components/heraldry/GoldHairline";
import { GalleryEditorial } from "@/components/gallery/GalleryEditorial";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { img } from "@/content/images";
import site from "@/content/site.json";
import gallery from "@/content/gallery.json";

const IMAGES = gallery.images.map((g) => ({ src: img(g.image), caption: g.caption }));

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: `Gallery ${site.hashtag} · ${site.bride.first} & ${site.groom.first}` },
      { name: "description", content: "Frames from our forever, the quiet moments before the moment." },
      { property: "og:title", content: `Gallery ${site.hashtag}` },
      { property: "og:description", content: "Frames from our forever, the quiet moments before the moment." },
      { property: "og:image", content: img(gallery.images[0].image) },
    ],
  }),
  component: Gallery,
});

function Gallery() {
  const [open, setOpen] = useState<number | null>(null);

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
    <SectionWrapper ground="ivory" className="portrait-wall">
      <div className="text-center">
        <Eyebrow>{gallery.eyebrow}</Eyebrow>
        <DisplayTitle className="mt-4">{site.hashtag}</DisplayTitle>
        <GoldHairline withCipher wide />
        <p className="font-display italic text-lg max-w-xl mx-auto text-charcoal/80">
          A portrait hall of our forever, hung frame by frame.
          Tap any picture to open it, or use the arrow keys to wander the gallery.
        </p>
      </div>

      {/* The portrait hall: gilt-framed pictures hung on a plaster wall. */}
      <div className="mt-16 sm:mt-24">
        <GalleryEditorial images={IMAGES} onOpen={setOpen} />
      </div>

      {open !== null && (
        <div
          data-lenis-prevent
          className="fixed inset-0 z-50 grid place-items-center bg-emerald-deep/45 backdrop-blur-2xl p-4 animate-royal-fade"
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
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 text-ivory/80 hover:text-ivory p-2"
            aria-label="Previous"
          >
            <ChevronLeft size={36} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); step(1); }}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 text-ivory/80 hover:text-ivory p-2"
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
            <figcaption className="mt-4 text-center font-script text-2xl text-ivory">
              {IMAGES[open].caption}
              <span className="block mt-1 font-ceremonial text-[0.6rem] tracking-[0.3em] text-ivory/60">
                {open + 1} / {IMAGES.length}
              </span>
            </figcaption>
          </figure>
        </div>
      )}
    </SectionWrapper>
  );
}
