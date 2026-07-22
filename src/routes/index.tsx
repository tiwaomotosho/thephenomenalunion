import { Fragment } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Crest } from "@/components/heraldry/Crest";
import { GoldHairline } from "@/components/heraldry/GoldHairline";
import { SectionWrapper, Eyebrow, DisplayTitle } from "@/components/layout/SectionWrapper";
import { Countdown } from "@/components/Countdown";
import { useBrightenInView } from "@/hooks/use-brighten-in-view";
import { img } from "@/content/images";
import { visiblePages, homeSections, isPageVisible, pageNumeral, toRoman } from "@/content/pages";
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
      {homeSections.story && <OurStory />}
      {homeSections.couple && <MeetTheCouple />}
      {homeSections.party && <BridalParty />}
      {homeSections.friends && <FriendsOfTheHouse />}
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
          {isPageVisible("registry") && (
            <Link to="/registry" className="btn-royal !bg-gold !text-emerald-ink !border-gold hover:!bg-gold-soft">
              Bless Us
            </Link>
          )}
          {isPageVisible("schedule") && (
            <Link to="/schedule" className="btn-royal-ghost !text-ivory !border-gold-soft hover:!bg-gold/20 hover:!text-ivory">
              Order of the day
            </Link>
          )}
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

      <ol className="relative mx-auto mt-16 max-w-4xl sm:mt-20">
        {/* The rail: hard left on mobile, down the centre on desktop. */}
        <span
          className="absolute top-1 bottom-1 left-[7px] w-px bg-gold/35 sm:left-1/2 sm:-translate-x-1/2"
          aria-hidden
        />
        {story.chapters.map((s, i) => {
          // Even chapters sit left, odd chapters right. Columns are placed
          // explicitly so the alternation can never slip.
          const right = i % 2 === 1;
          return (
            <li
              key={i}
              className="relative mb-14 last:mb-0 sm:mb-20 sm:grid sm:grid-cols-2 sm:gap-x-16"
            >
              {/* node on the rail */}
              <span
                className="absolute left-0 top-1.5 grid h-4 w-4 place-items-center sm:left-1/2 sm:-translate-x-1/2"
                aria-hidden
              >
                <span className="block h-2.5 w-2.5 rotate-45 bg-gold ring-4 ring-ivory" />
              </span>
              <div
                className={
                  right
                    ? "pl-10 sm:col-start-2 sm:pl-16 sm:text-left"
                    : "pl-10 sm:col-start-1 sm:row-start-1 sm:pr-16 sm:pl-0 sm:text-right"
                }
              >
                <p className="eyebrow mb-2 !text-[0.58rem]">Chapter {toRoman(i + 1)}</p>
                <h3 className="font-display text-2xl leading-snug text-emerald-ink sm:text-3xl">
                  {s.title}
                </h3>
                <p className="mt-3 font-display text-lg italic leading-relaxed text-charcoal/85 sm:text-xl">
                  {s.body}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
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

      <div className="mx-auto mt-16 max-w-5xl space-y-16 sm:space-y-24">
        <CouplePerson person={couple.bride} />
        <CouplePerson person={couple.groom} flip />
      </div>
    </SectionWrapper>
  );
}

/**
 * One half of the couple: a portrait beside a longer bio. On desktop the two
 * mirror each other (bride's portrait leads on the left, the groom's on the
 * right); on mobile each stacks portrait-over-text.
 */
function CouplePerson({
  person,
  flip = false,
}: {
  person: { eyebrow: string; name: string; house: string; image: string; body: string };
  flip?: boolean;
}) {
  const imgRef = useBrightenInView<HTMLImageElement>();
  return (
    <article className="group grid items-center gap-8 md:grid-cols-2 md:gap-12">
      <div
        className={`relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden border border-gold/40 bg-ivory md:max-w-none ${
          flip ? "md:order-2" : ""
        }`}
      >
        <img
          ref={imgRef}
          src={img(person.image)}
          alt={person.name}
          loading="lazy"
          className="portrait-photo h-full w-full object-cover"
        />
      </div>
      <div className={`text-center md:text-left ${flip ? "md:order-1" : ""}`}>
        <p className="eyebrow">{person.eyebrow}</p>
        <h3 className="mt-2 font-display text-3xl text-emerald-ink sm:text-4xl">{person.name}</h3>
        <p className="mt-1 font-script text-2xl text-gold sm:text-3xl">{person.house}</p>
        <p className="mt-5 font-display text-lg italic leading-relaxed text-charcoal/85 sm:text-xl">
          {person.body}
        </p>
      </div>
    </article>
  );
}

type PartyMember = { role: string; name: string; image: string };

function BridalParty() {
  const pairs = party.bride.map((b, i) => ({ b, g: party.groom[i] as PartyMember | undefined }));
  return (
    <SectionWrapper id="party" ground="ivory">
      <div className="text-center">
        <Eyebrow>{party.eyebrow}</Eyebrow>
        <DisplayTitle className="mt-4">{party.title}</DisplayTitle>
        <GoldHairline withCipher wide />
        <p className="hidden md:block font-ceremonial text-[0.6rem] tracking-[0.3em] text-charcoal/40">
          {party.note}
        </p>
      </div>

      {/* Tablet / desktop: portraits paired in order — bridesmaid left, groomsman right */}
      <div className="hidden md:block max-w-4xl mx-auto mt-14">
        <div className="grid grid-cols-2 gap-x-10 lg:gap-x-16">
          <p className="text-center font-script text-2xl text-gold">{party.brideLabel}</p>
          <p className="text-center font-script text-2xl text-gold">{party.groomLabel}</p>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-x-10 lg:gap-x-16 gap-y-12">
          {pairs.map(({ b, g }, i) => (
            <Fragment key={i}>
              <PartyPortrait member={b} />
              {g ? <PartyPortrait member={g} /> : <span aria-hidden />}
            </Fragment>
          ))}
        </div>
      </div>

      {/* Mobile: bridesmaids lined up, then groomsmen */}
      <div className="md:hidden mt-12 space-y-14">
        <div>
          <p className="mb-6 text-center font-script text-2xl text-gold">{party.brideLabel}</p>
          <div className="space-y-10">
            {party.bride.map((b) => (
              <PartyPortrait key={b.name} member={b} />
            ))}
          </div>
        </div>
        <div>
          <p className="mb-6 text-center font-script text-2xl text-gold">{party.groomLabel}</p>
          <div className="space-y-10">
            {party.groom.map((g) => (
              <PartyPortrait key={g.name} member={g} />
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

/** A single bridal-party portrait — smaller than the couple's, secondary focus. */
function PartyPortrait({ member }: { member: PartyMember }) {
  const imgRef = useBrightenInView<HTMLImageElement>();
  return (
    <figure className="group text-center">
      <div className="relative mx-auto aspect-[3/4] max-w-[16rem] overflow-hidden border border-gold/40 bg-ivory">
        <img
          ref={imgRef}
          src={img(member.image)}
          alt={member.name}
          loading="lazy"
          className="portrait-photo h-full w-full object-cover"
        />
      </div>
      <figcaption>
        <p className="eyebrow mt-4 !text-[0.58rem]">{member.role}</p>
        <p className="mt-1.5 font-display text-xl text-emerald-ink">{member.name}</p>
      </figcaption>
    </figure>
  );
}

/**
 * Friends of the House — the wider circle who make up the day. A flat grid of
 * portraits with names only (no roles), sitting just below the Court of Honour.
 */
function FriendsOfTheHouse() {
  if (!party.friends || party.friends.length === 0) return null;
  return (
    <SectionWrapper id="friends" ground="paper">
      <div className="text-center">
        <Eyebrow>{party.friendsEyebrow}</Eyebrow>
        <DisplayTitle className="mt-4">{party.friendsTitle}</DisplayTitle>
        <GoldHairline withCipher wide />
      </div>

      <div className="mx-auto mt-14 grid max-w-5xl grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
        {party.friends.map((f) => (
          <FriendPortrait key={f.name} friend={f} />
        ))}
      </div>
    </SectionWrapper>
  );
}

/** A single friend portrait — like a party portrait, but with a name and no role. */
function FriendPortrait({ friend }: { friend: { name: string; image: string } }) {
  const imgRef = useBrightenInView<HTMLImageElement>();
  return (
    <figure className="group text-center">
      <div className="relative mx-auto aspect-[3/4] max-w-[14rem] overflow-hidden border border-gold/40 bg-ivory">
        <img
          ref={imgRef}
          src={img(friend.image)}
          alt={friend.name}
          loading="lazy"
          className="portrait-photo h-full w-full object-cover"
        />
      </div>
      <figcaption>
        <p className="mt-3 font-display text-lg text-emerald-ink">{friend.name}</p>
      </figcaption>
    </figure>
  );
}

function PreviewLinks() {
  // Nothing to preview if every standalone page is switched off.
  if (visiblePages.length === 0) return null;
  return (
    <SectionWrapper id="more" ground="emerald">
      <div className="text-center">
        <Eyebrow className="!text-gold-soft">Continue your visit</Eyebrow>
        <DisplayTitle inverse className="mt-4">The rest of the proceedings</DisplayTitle>
        <GoldHairline withCipher wide />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {visiblePages.map((p) => (
          <Link
            key={p.to}
            to={p.to}
            className="group block p-8 border border-gold/30 hover:border-gold transition-colors bg-emerald-deep/40"
          >
            <p className="eyebrow !text-gold-soft !text-left">Section · {pageNumeral(p.id)}</p>
            <h3 className="font-display text-2xl mt-3 text-ivory">{p.cardTitle}</h3>
            <p className="mt-3 font-display italic text-ivory/70">{p.blurb}</p>
            <span className="mt-6 inline-flex items-center gap-2 font-ceremonial text-[0.65rem] tracking-[0.3em] text-gold group-hover:text-gold-soft">
              Enter →
            </span>
          </Link>
        ))}
      </div>
    </SectionWrapper>
  );
}
