import { createFileRoute } from "@tanstack/react-router";
import { SectionWrapper, Eyebrow, DisplayTitle } from "@/components/layout/SectionWrapper";
import { GoldHairline } from "@/components/heraldry/GoldHairline";
import { NotesWall } from "@/components/notes/NotesWall";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Notes Wall — Eniolaoluwa & Tiwalade" },
      { name: "description", content: "Leave a blessing for the table; read those of others." },
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
        <Eyebrow>Section XI</Eyebrow>
        <DisplayTitle className="mt-4">The Notes Wall</DisplayTitle>
        <GoldHairline withCipher wide />
        <p className="font-display italic text-lg max-w-xl mx-auto text-charcoal/80">
          A small open guestbook. Leave a memory, a prayer, a wish — we will
          read each one before the day.
        </p>
      </div>

      <div className="mt-16">
        <NotesWall />
      </div>
    </SectionWrapper>
  );
}
