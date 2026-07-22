/**
 * Page & section visibility — the single switchboard for the whole site.
 *
 * Edit `src/content/pages.json` to turn any standalone page (or the optional
 * home sections) on or off. A page set to `"visible": false` disappears
 * everywhere at once: the header nav, the mobile menu, the footer, the home
 * preview cards, and any call-to-action that points at it. Its route also
 * redirects to home, so a hidden page is unreachable — as if it never existed.
 *
 * Section numbering is derived from what is visible, in site order, so hiding a
 * page automatically renumbers everything below it (no stale "Section IX").
 */
import data from "./pages.json";

export type PageId = "schedule" | "venue" | "gallery" | "registry" | "notes" | "faq";
export type PagePath = "/schedule" | "/venue" | "/gallery" | "/registry" | "/notes" | "/faq";

export interface PageDef {
  id: PageId;
  to: PagePath;
  /** Short label for the header / footer nav. */
  navLabel: string;
  /** Longer title for the home preview card. */
  cardTitle: string;
  /** One-line description on the home preview card. */
  blurb: string;
  visible: boolean;
}

export interface HomeSections {
  story: boolean;
  couple: boolean;
  party: boolean;
  /** "Friends of the House" — an addendum under the Court of Honour (§V), not
   *  a numbered section of its own, so it is intentionally left out of the
   *  page-numbering count below. */
  friends: boolean;
}

const PAGES = data.pages as PageDef[];

export const homeSections = data.homeSections as HomeSections;

/** Standalone pages, in site order, that are switched on. */
export const visiblePages: PageDef[] = PAGES.filter((p) => p.visible);

export function isPageVisible(id: PageId): boolean {
  const p = PAGES.find((x) => x.id === id);
  return p ? p.visible : false;
}

// The home page carries the first sections. Hero (I) and Note (II) are always
// present; Story, Couple, and Party are optional. Standalone pages are numbered
// after them, so toggling any section renumbers everything below it.
const homeSectionCount =
  2 +
  (homeSections.story ? 1 : 0) +
  (homeSections.couple ? 1 : 0) +
  (homeSections.party ? 1 : 0);

const ROMAN = [
  "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X",
  "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX",
];

export function toRoman(n: number): string {
  return ROMAN[n - 1] ?? String(n);
}

/** The roman-numeral section number for a page, reflecting current visibility. */
export function pageNumeral(id: PageId): string {
  const idx = visiblePages.findIndex((p) => p.id === id);
  if (idx < 0) return "";
  return toRoman(homeSectionCount + idx + 1);
}
