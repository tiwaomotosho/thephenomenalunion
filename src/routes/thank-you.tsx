import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionWrapper, Eyebrow } from "@/components/layout/SectionWrapper";
import { GoldHairline } from "@/components/heraldry/GoldHairline";
import { Seal } from "@/components/heraldry/Seal";
import site from "@/content/site.json";

export const Route = createFileRoute("/thank-you")({
  head: () => ({
    meta: [
      { title: `Thank you — ${site.bride.first} & ${site.groom.first}` },
      { name: "description", content: "Sealed with thanks." },
      { property: "og:title", content: "Thank you" },
      { property: "og:description", content: "Sealed with thanks." },
    ],
  }),
  component: ThankYou,
});

function ThankYou() {
  return (
    <SectionWrapper ground="paper">
      <div className="text-center max-w-2xl mx-auto">
        <div className="flex justify-center animate-seal-press">
          <Seal size={200} />
        </div>
        <Eyebrow className="mt-10">Sealed with thanks</Eyebrow>
        <h1 className="font-display text-5xl sm:text-6xl mt-4 text-emerald-ink">
          From our table to yours.
        </h1>
        <GoldHairline withCipher wide />
        <p className="font-display italic text-xl text-charcoal/80 leading-relaxed">
          Your blessing has been received and recorded. We are quietly,
          deeply, grateful — and we look forward to thanking you in person on
          the twenty-seventh of August.
        </p>
        <p className="font-script text-5xl text-gold mt-10">{site.signature}</p>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Link to="/" className="btn-royal">Return home</Link>
          <Link to="/notes" className="btn-royal-ghost">Read the notes wall</Link>
        </div>
      </div>
    </SectionWrapper>
  );
}
