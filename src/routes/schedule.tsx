import { createFileRoute } from "@tanstack/react-router";
import { SectionWrapper, Eyebrow, DisplayTitle } from "@/components/layout/SectionWrapper";
import { GoldHairline } from "@/components/heraldry/GoldHairline";
import { Cipher } from "@/components/heraldry/Cipher";
import site from "@/content/site.json";
import schedule from "@/content/schedule.json";

export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [
      { title: `Order of the Day · ${site.bride.first} & ${site.groom.first}` },
      { name: "description", content: `The order of the day for ${site.date.display}. One garden, from the first hymn to the last dance.` },
      { property: "og:title", content: `Order of the Day · ${site.date.display}` },
      { property: "og:description", content: `The order of the day for the wedding of ${site.bride.first} & ${site.groom.first}.` },
    ],
  }),
  component: Schedule,
});

const DAY = schedule.items;

function Schedule() {
  return (
    <SectionWrapper ground="paper">
      <div className="text-center">
        <Eyebrow>Section VI</Eyebrow>
        <DisplayTitle className="mt-4">Order of the Day</DisplayTitle>
        <GoldHairline withCipher wide />
        <p className="font-display italic text-lg max-w-xl mx-auto text-charcoal/80">
          Thursday, {site.date.long}. One unhurried day in the garden,
          from the first hymn to the last dance.
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
