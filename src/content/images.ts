/**
 * Image resolver for the content JSON files.
 *
 * The *.json content files reference images by key (e.g. "gallery-1") so that
 * non-technical edits stay in plain JSON. This map turns those keys into the
 * hashed asset URLs Vite produces at build time.
 *
 * Gallery photos — and bridal-party portraits — are picked up automatically via
 * import.meta.glob: drop a `gallery-N.jpg` or `party-bride-N.jpg` /
 * `party-groom-N.jpg` in src/assets and it becomes available under that key with
 * no code change. Named portraits stay explicit below.
 */
import bride from "@/assets/bride.jpg";
import groom from "@/assets/groom.jpg";
import heroBg from "@/assets/hero-bg.jpg";

const globModules = import.meta.glob<string>(
  ["../assets/gallery-*.jpg", "../assets/party-*.jpg"],
  { eager: true, import: "default" },
);

const IMAGES: Record<string, string> = {
  bride,
  groom,
  "hero-bg": heroBg,
};

for (const [path, url] of Object.entries(globModules)) {
  const match = path.match(/((?:gallery|party-bride|party-groom)-\d+)\.jpg$/);
  if (match) IMAGES[match[1]] = url;
}

/**
 * Resolve a content image key to its built asset URL. Bridal-party portraits
 * that have not been supplied yet fall back to the couple's own portraits, so
 * the layout is never broken — drop the real `party-bride-N.jpg` /
 * `party-groom-N.jpg` files in src/assets to replace them.
 */
export function img(key: string): string {
  if (IMAGES[key]) return IMAGES[key];
  if (key.startsWith("party-groom")) return groom;
  if (key.startsWith("party-bride")) return bride;
  return "";
}

/** All gallery photo keys, ordered numerically (gallery-1, gallery-2, …). */
export const galleryKeys: string[] = Object.keys(IMAGES)
  .filter((k) => k.startsWith("gallery-"))
  .sort((a, b) => Number(a.split("-")[1]) - Number(b.split("-")[1]));
