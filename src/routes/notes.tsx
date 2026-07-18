import { createFileRoute, redirect } from "@tanstack/react-router";
import { SectionWrapper, Eyebrow, DisplayTitle } from "@/components/layout/SectionWrapper";
import { GoldHairline } from "@/components/heraldry/GoldHairline";
import { NotesWall } from "@/components/notes/NotesWall";
import { isPageVisible, pageNumeral } from "@/content/pages";
import site from "@/content/site.json";

export const Route = createFileRoute("/notes")({
  beforeLoad: () => {
    if (!isPageVisible("notes")) throw redirect({ to: "/" });
  },
  head: () => ({
    meta: [
      { title: `Notes Wall · ${site.bride.first} & ${site.groom.first}` },
      { name: "description", content: "Leave a blessing for the table, and read those of others." },
      { property: "og:title", content: "Notes Wall" },
      { property: "og:description", content: "A guestbook of blessings for the couple." },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  return (
    <SectionWrapper ground="ivory">
      <div className="text-center">
        <Eyebrow>Section {pageNumeral("notes")}</Eyebrow>
        <DisplayTitle className="mt-4">The Notes Wall</DisplayTitle>
        <GoldHairline withCipher wide />
        <p className="font-display italic text-lg max-w-xl mx-auto text-charcoal/80">
          A small open guestbook. Leave a memory, a prayer, or a wish,
          and we will read each one before the day.
        </p>
      </div>

      <div className="mt-16">
        <NotesWall />
      </div>
    </SectionWrapper>
  );
}
