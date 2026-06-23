import { createFileRoute } from "@tanstack/react-router";
import { SectionWrapper, Eyebrow, DisplayTitle } from "@/components/layout/SectionWrapper";
import { GoldHairline } from "@/components/heraldry/GoldHairline";
import { Cipher } from "@/components/heraldry/Cipher";

export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [
      { title: "Order of the Day — Eniolaoluwa & Tiwalade" },
      { name: "description", content: "The full procession for 27 August 2026 — ceremony, reception, and after-party." },
      { property: "og:title", content: "Order of the Day — 27 August 2026" },
      { property: "og:description", content: "The full procession for the wedding of Eniolaoluwa & Tiwalade." },
    ],
  }),
  component: Schedule,
});

const DAY = [
  { time: "10:00", title: "Guests arrive · Welcome tea", place: "The Garden Court", note: "Light refreshments and string quartet" },
  { time: "11:30", title: "Engagement (Traditional)", place: "Yoruba ceremony · Main hall", note: "Aso-oke, family blessings, the cipher exchange" },
  { time: "14:00", title: "Lunch & Family photographs", place: "The Orangery", note: "Plated lunch · Aso-ebi gathering" },
  { time: "16:00", title: "White Wedding Ceremony", place: "Chapel of St. Saviour", note: "Processional, vows, exchange of rings" },
  { time: "17:30", title: "Cocktail Hour", place: "Cloister terrace", note: "Champagne, canapés, sundown jazz" },
  { time: "19:00", title: "Reception & Dinner", place: "The Grand Ballroom", note: "Four-course tasting menu · Toasts" },
  { time: "21:00", title: "First dance · Cake", place: "Ballroom floor", note: "Bring your dancing shoes" },
  { time: "22:00", title: "After-party", place: "The Cellar", note: "DJ Spinall ’til late — black tie optional" },
];

function Schedule() {
  return (
    <SectionWrapper ground="paper">
      <div className="text-center">
        <Eyebrow>Section VI</Eyebrow>
        <DisplayTitle className="mt-4">Order of the Day</DisplayTitle>
        <GoldHairline withCipher wide />
        <p className="font-display italic text-lg max-w-xl mx-auto text-charcoal/80">
          Thursday, the twenty-seventh of August, two thousand and twenty-six.
          A single, unhurried day from morning tea to last dance.
        </p>
      </div>

      <ol className="mt-16 max-w-3xl mx-auto space-y-2">
        {DAY.map((d, i) => (
          <li key={d.time} className="grid grid-cols-[80px_1fr] sm:grid-cols-[120px_1fr] gap-6 sm:gap-10 py-6 border-b border-gold/20 last:border-b-0">
            <div className="text-right">
              <p className="font-display text-3xl text-gold tabular-nums">{d.time}</p>
              <p className="eyebrow !text-[0.55rem] mt-1">{romanNumeral(i + 1)}</p>
            </div>
            <div>
              <h3 className="font-display text-2xl text-emerald-ink">{d.title}</h3>
              <p className="eyebrow !text-left mt-1 !text-gold/90">{d.place}</p>
              <p className="mt-2 font-display italic text-charcoal/70">{d.note}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-20 text-center">
        <Cipher size={36} className="mx-auto" />
        <p className="font-script text-3xl text-gold mt-4">All times are West Africa Time</p>
      </div>
    </SectionWrapper>
  );
}

function romanNumeral(n: number) {
  return ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII"][n - 1] ?? String(n);
}
