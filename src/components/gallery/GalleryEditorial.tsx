import { Fragment, type CSSProperties } from "react";
import { ParallaxFrame } from "./ParallaxFrame";

type Slot = { start: number; span: number; ar: string; push?: number };

/**
 * Row templates on a 12-column grid. Every frame is a portrait (taller than
 * wide) — no landscape slots — but spans are deliberately unequal and some
 * frames are pushed down, so empty columns become negative space the way Exo Ape
 * never uses a tidy uniform grid. Templates cycle to consume every photo.
 */
const TEMPLATES: Slot[][] = [
  [
    { start: 1, span: 5, ar: "3 / 4" },
    { start: 7, span: 5, ar: "4 / 5", push: 120 },
  ],
  [
    { start: 2, span: 4, ar: "4 / 5" },
    { start: 7, span: 4, ar: "2 / 3", push: 150 },
  ],
  [
    { start: 1, span: 4, ar: "2 / 3", push: 60 },
    { start: 6, span: 3, ar: "3 / 4" },
    { start: 10, span: 3, ar: "4 / 5", push: 140 },
  ],
  [
    { start: 1, span: 5, ar: "4 / 5", push: 170 },
    { start: 7, span: 5, ar: "3 / 4" },
  ],
  [
    { start: 2, span: 4, ar: "3 / 4", push: 90 },
    { start: 7, span: 4, ar: "4 / 5" },
  ],
];

export function GalleryEditorial({
  images,
  onOpen,
}: {
  images: { src: string; caption: string }[];
  onOpen: (index: number) => void;
}) {
  const rows: { slot: Slot; index: number }[][] = [];
  let i = 0;
  let t = 0;
  while (i < images.length) {
    const template = TEMPLATES[t % TEMPLATES.length];
    const row: { slot: Slot; index: number }[] = [];
    for (const slot of template) {
      if (i >= images.length) break;
      row.push({ slot, index: i });
      i++;
    }
    rows.push(row);
    t++;
  }

  return (
    <div className="mt-4">
      {rows.map((row, r) => (
        <div key={r} className="editorial-row">
          {row.map(({ slot, index }) => (
            <Fragment key={index}>
              <ParallaxFrame
                src={images[index].src}
                caption={images[index].caption}
                aspectRatio={slot.ar}
                onClick={() => onOpen(index)}
                style={
                  {
                    gridColumn: `${slot.start} / span ${slot.span}`,
                    marginTop: slot.push ? `${slot.push}px` : undefined,
                  } as CSSProperties
                }
              />
            </Fragment>
          ))}
        </div>
      ))}
    </div>
  );
}
