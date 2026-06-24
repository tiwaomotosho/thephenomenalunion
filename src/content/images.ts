/**
 * Image resolver for the content JSON files.
 *
 * The *.json content files reference images by key (e.g. "gallery-1") so that
 * non-technical edits stay in plain JSON. This map turns those keys into the
 * hashed asset URLs Vite produces at build time.
 *
 * Gallery photos are picked up automatically via import.meta.glob — drop a
 * `gallery-N.jpg` in src/assets and it becomes available as key "gallery-N"
 * with no code change. Named portraits stay explicit below.
 */
import bride from "@/assets/bride.jpg";
import groom from "@/assets/groom.jpg";
import heroBg from "@/assets/hero-bg.jpg";

const galleryModules = import.meta.glob<string>("../assets/gallery-*.jpg", {
  eager: true,
  import: "default",
});

const IMAGES: Record<string, string> = {
  bride,
  groom,
  "hero-bg": heroBg,
};

for (const [path, url] of Object.entries(galleryModules)) {
  const match = path.match(/gallery-(\d+)\.jpg$/);
  if (match) IMAGES[`gallery-${match[1]}`] = url;
}

/** Resolve a content image key to its built asset URL. */
export function img(key: string): string {
  return IMAGES[key] ?? "";
}

/** All gallery photo keys, ordered numerically (gallery-1, gallery-2, …). */
export const galleryKeys: string[] = Object.keys(IMAGES)
  .filter((k) => k.startsWith("gallery-"))
  .sort((a, b) => Number(a.split("-")[1]) - Number(b.split("-")[1]));
