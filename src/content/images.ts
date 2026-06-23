/**
 * Image resolver for the content JSON files.
 *
 * The *.json content files reference images by key (e.g. "gallery-1") so that
 * non-technical edits stay in plain JSON. This map turns those keys into the
 * hashed asset URLs Vite produces at build time. To add a photo: drop it in
 * src/assets, import it here, and add it to the map.
 */
import bride from "@/assets/bride.jpg";
import groom from "@/assets/groom.jpg";
import heroBg from "@/assets/hero-bg.jpg";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import g6 from "@/assets/gallery-6.jpg";
import g7 from "@/assets/gallery-7.jpg";
import g8 from "@/assets/gallery-8.jpg";

const IMAGES: Record<string, string> = {
  bride,
  groom,
  "hero-bg": heroBg,
  "gallery-1": g1,
  "gallery-2": g2,
  "gallery-3": g3,
  "gallery-4": g4,
  "gallery-5": g5,
  "gallery-6": g6,
  "gallery-7": g7,
  "gallery-8": g8,
};

/** Resolve a content image key to its built asset URL. */
export function img(key: string): string {
  return IMAGES[key] ?? "";
}
