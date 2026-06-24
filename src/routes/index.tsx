import { createFileRoute, Link } from "@tanstack/react-router";
import { Crest } from "@/components/heraldry/Crest";
import { Cipher } from "@/components/heraldry/Cipher";
import { GoldHairline } from "@/components/heraldry/GoldHairline";
import { SectionWrapper, Eyebrow, DisplayTitle } from "@/components/layout/SectionWrapper";
import { Countdown } from "@/components/Countdown";
import { img } from "@/content/images";
import site from "@/content/site.json";
import story from "@/content/story.json";
import couple from "@/content/couple.json";
import party from "@/content/party.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${site.bride.first} & ${site.groom.first} · ${site.date.display}` },
      { name: "description", content: `${site.appointment}. The wedding of ${site.bride.first} & ${site.groom.first}. ${site.tagline}.` },
      { property: "og:title", content: `${site.bride.first} & ${site.groom.first} · ${site.date.display}` },
      { property: "og:description", content: `${site.tagline}. ${site.appointment}.` },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <NoteFromUs />
      <OurStory />
      <MeetTheCouple />
      <BridalParty />
      <PreviewLinks />
    </>
  );
}

function Hero() {
  return (
    <section className="relative -mt-[72px] min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={img("hero-bg")} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-emerald-ink/65" />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-ink/40 via-transparent to-emerald-ink/60" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-32 text-center text-ivory animate-royal-fade">
        <div className="flex justify-center animate-royal-rise" style={{ animationDelay: "100ms" }}>
          <Crest size={180} />
        </div>

        <p
          className="eyebrow mt-8 !text-gold-soft animate-royal-rise"
          style={{ animationDelay: "300ms" }}
        >
          {site.theme} · {site.appointment}
        </p>

        <h1
          className="mt-6 font-display text-ivory leading-[0.95] animate-royal-rise"
          style={{ animationDelay: "500ms" }}
        >
          <span className="block text-5xl sm:text-6xl md:text-8xl">{site.bride.first}</span>
          <span className="block font-script text-gold text-6xl sm:text-7xl md:text-8xl my-3 sm:my-5">
            &amp;
          </span>
          <span className="block text-5xl sm:text-6xl md:text-8xl">{site.groom.first}</span>
        </h1>

        <div className="my-12 flex items-center justify-center gap-5 animate-royal-rise" style={{ animationDelay: "700ms" }}>
          <span className="gold-hairline !m-0 !w-24" aria-hidden />
          <span className="font-ceremonial text-[0.7rem] tracking-[0.4em] text-gold-soft whitespace-nowrap">
            {site.date.display}
          </span>
          <span className="gold-hairline !m-0 !w-24" aria-hidden />
        </div>

        <div className="animate-royal-rise" style={{ animationDelay: "900ms" }}>
          <Countdown light />
        </div>

        <div className="mt-14 flex flex-wrap justify-center gap-4 animate-royal-rise" style={{ animationDelay: "1100ms" }}>
          <Link to="/registry" className="btn-royal !bg-gold !text-emerald-ink !border-gold hover:!bg-gold-soft">
            Bless Us
          </Link>
          <Link to="/schedule" className="btn-royal-ghost !text-ivory !border-gold-soft hover:!bg-gold/20 hover:!text-ivory">
            Order of the day
          </Link>
        </div>

        <p className="mt-16 font-script text-2xl text-gold-soft/90 animate-royal-fade" style={{ animationDelay: "1300ms" }}>
          {site.tagline}
        </p>
      </div>
    </section>
  );
}

function NoteFromUs() {
  return (
    <SectionWrapper id="note" ground="paper">
      <div className="text-center max-w-2xl mx-auto">
        <Eyebrow>{site.note.eyebrow}</Eyebrow>
        <DisplayTitle className="mt-4">{site.note.title}</DisplayTitle>
        <GoldHairline withCipher wide />
        <div className="font-display text-xl sm:text-2xl leading-[1.7] text-emerald-ink text-balance space-y-6 italic">
          {site.note.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <p className="font-script text-5xl text-gold mt-10">{site.signature}</p>
        <p className="mt-6 eyebrow">{site.motto}</p>
      </div>
    </SectionWrapper>
  );
}

function OurStory() {
  return (
    <SectionWrapper id="story" ground="ivory">
      <div className="text-center">
        <Eyebrow>{story.eyebrow}</Eyebrow>
        <DisplayTitle className="mt-4">{story.title}</DisplayTitle>
        <GoldHairline withCipher wide />
      </div>

      <div className="relative max-w-3xl mx-auto mt-16">
        <div className="absolute left-4 sm:left-1/2 sm:-translate-x-1/2 top-0 bottom-0 w-px bg-gold/40" aria-hidden />
        <ol className="space-y-16">
          {story.chapters.map((s, i) => {
            const right = i % 2 === 1;
            return (
              <li key={s.title} className="relative sm:grid sm:grid-cols-2 sm:gap-12">
                <div className="absolute left-4 sm:left-1/2 sm:-translate-x-1/2 top-2 grid h-3 w-3 place-items-center">
                  <span className="block h-2 w-2 rotate-45 bg-gold" />
                </div>
                <div className={`pl-12 sm:pl-0 ${right ? "sm:col-start-2" : "sm:text-right sm:pr-12"}`}>
                  <h3 className="font-display text-2xl text-emerald-ink">{s.title}</h3>
                  <p className="mt-2 font-display italic text-charcoal/80 leading-relaxed">
                    {s.body}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </SectionWrapper>
  );
}

function MeetTheCouple() {
  return (
    <SectionWrapper id="couple" ground="paper">
      <div className="text-center">
        <Eyebrow>{couple.eyebrow}</Eyebrow>
        <DisplayTitle className="mt-4">{couple.title}</DisplayTitle>
        <GoldHairline withCipher wide />
      </div>

      <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto mt-14">
        <CoupleCard person={couple.bride} />
        <CoupleCard person={couple.groom} />
      </div>
    </SectionWrapper>
  );
}

function CoupleCard({
  person,
}: {
  person: { eyebrow: string; name: string; house: string; image: string; body: string };
}) {
  return (
    <article className="text-center group">
      <div className="relative aspect-[3/4] overflow-hidden border border-gold/40 bg-ivory">
        <img
          src={img(person.image)}
          alt={person.name}
          loading="lazy"
          className="h-full w-full object-cover grayscale-[60%] group-hover:grayscale-0 transition-all duration-700"
        />
      </div>
      <p className="eyebrow mt-6">{person.eyebrow}</p>
      <h3 className="font-display text-3xl mt-2 text-emerald-ink">{person.name}</h3>
      <p className="font-script text-2xl text-gold mt-1">{person.house}</p>
      <p className="mt-4 max-w-sm mx-auto font-display italic text-charcoal/80 leading-relaxed">
        {person.body}
      </p>
    </article>
  );
}

function BridalParty() {
  return (
    <SectionWrapper id="party" ground="ivory">
      <div className="text-center">
        <Eyebrow>{party.eyebrow}</Eyebrow>
        <DisplayTitle className="mt-4">{party.title}</DisplayTitle>
        <GoldHairline withCipher wide />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-14">
        {party.members.map((p) => (
          <div key={p.name} className="text-center">
            <div className="grid place-items-center h-20 w-20 mx-auto rounded-full bg-paper border border-gold/40">
              <Cipher size={32} />
            </div>
            <p className="eyebrow mt-5 !text-[0.6rem]">{p.role}</p>
            <p className="font-display text-lg mt-2 text-emerald-ink">{p.name}</p>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}

const PREVIEWS = [
  { to: "/schedule", eyebrow: "VI", title: "Order of the Day", body: "One garden, from the first hymn to the last dance." },
  { to: "/venue", eyebrow: "VII", title: "The Venue", body: "A garden wedding at Redemption Camp, and how to find us." },
  { to: "/gallery", eyebrow: "IX", title: "Gallery · #EniSaidYes", body: "Quiet evidence of the years that brought us here." },
  { to: "/registry", eyebrow: "X", title: "Blessings & Registry", body: "Small contributions toward the first home we will share." },
  { to: "/notes", eyebrow: "XI", title: "Notes Wall", body: "Leave a blessing for the table, and read those of others." },
  { to: "/faq", eyebrow: "XIII", title: "Frequently Asked", body: "Dress code, children, parking, and other gentle matters." },
] as const;

function PreviewLinks() {
  return (
    <SectionWrapper id="more" ground="emerald">
      <div className="text-center">
        <Eyebrow className="!text-gold-soft">Continue your visit</Eyebrow>
        <DisplayTitle inverse className="mt-4">The rest of the proceedings</DisplayTitle>
        <GoldHairline withCipher wide />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {PREVIEWS.map((p) => (
          <Link
            key={p.to}
            to={p.to}
            className="group block p-8 border border-gold/30 hover:border-gold transition-colors bg-emerald-deep/40"
          >
            <p className="eyebrow !text-gold-soft !text-left">Section · {p.eyebrow}</p>
            <h3 className="font-display text-2xl mt-3 text-ivory">{p.title}</h3>
            <p className="mt-3 font-display italic text-ivory/70">{p.body}</p>
            <span className="mt-6 inline-flex items-center gap-2 font-ceremonial text-[0.65rem] tracking-[0.3em] text-gold group-hover:text-gold-soft">
              Enter →
            </span>
          </Link>
        ))}
      </div>
    </SectionWrapper>
  );
}
