import { createFileRoute, Link } from "@tanstack/react-router";
import { Crest } from "@/components/heraldry/Crest";
import { Cipher } from "@/components/heraldry/Cipher";
import { GoldHairline } from "@/components/heraldry/GoldHairline";
import { SectionWrapper, Eyebrow, DisplayTitle } from "@/components/layout/SectionWrapper";
import { Countdown } from "@/components/Countdown";
import heroBg from "@/assets/hero-bg.jpg";
import brideImg from "@/assets/bride.jpg";
import groomImg from "@/assets/groom.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Eniolaoluwa & Tiwalade — 27 August 2026" },
      { name: "description", content: "By royal appointment — the wedding of Eniolaoluwa & Tiwalade. A love written in Lagos." },
      { property: "og:title", content: "Eniolaoluwa & Tiwalade — 27 August 2026" },
      { property: "og:description", content: "A love written in Lagos. By royal appointment." },
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
        <img src={heroBg} alt="" className="h-full w-full object-cover" />
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
          The House of Omotosho · By Royal Appointment
        </p>

        <h1
          className="mt-6 font-display text-ivory leading-[0.95] animate-royal-rise"
          style={{ animationDelay: "500ms" }}
        >
          <span className="block text-5xl sm:text-6xl md:text-8xl">Eniolaoluwa</span>
          <span className="block font-script text-gold text-6xl sm:text-7xl md:text-8xl my-3 sm:my-5">
            &amp;
          </span>
          <span className="block text-5xl sm:text-6xl md:text-8xl">Tiwalade</span>
        </h1>

        <div className="my-12 flex items-center justify-center gap-5 animate-royal-rise" style={{ animationDelay: "700ms" }}>
          <span className="gold-hairline !m-0 !w-24" aria-hidden />
          <span className="font-ceremonial text-[0.7rem] tracking-[0.4em] text-gold-soft whitespace-nowrap">
            XXVII · VIII · MMXXVI
          </span>
          <span className="gold-hairline !m-0 !w-24" aria-hidden />
        </div>

        <div className="animate-royal-rise" style={{ animationDelay: "900ms" }}>
          <Countdown light />
        </div>

        <div className="mt-14 flex flex-wrap justify-center gap-4 animate-royal-rise" style={{ animationDelay: "1100ms" }}>
          <Link to="/rsvp" className="btn-royal !bg-gold !text-emerald-ink !border-gold hover:!bg-gold-soft">
            Respond
          </Link>
          <Link to="/schedule" className="btn-royal-ghost !text-ivory !border-gold-soft hover:!bg-gold/20 hover:!text-ivory">
            Order of the day
          </Link>
        </div>

        <p className="mt-16 font-script text-2xl text-gold-soft/90 animate-royal-fade" style={{ animationDelay: "1300ms" }}>
          A love written in Lagos
        </p>
      </div>
    </section>
  );
}

function NoteFromUs() {
  return (
    <SectionWrapper id="note" ground="paper">
      <div className="text-center max-w-2xl mx-auto">
        <Eyebrow>A note from us</Eyebrow>
        <DisplayTitle className="mt-4">
          Dearly beloved,
        </DisplayTitle>
        <GoldHairline withCipher wide />
        <div className="font-display text-xl sm:text-2xl leading-[1.7] text-emerald-ink text-balance space-y-6 italic">
          <p>
            What began as a quiet coincidence — a chance meeting at a friend’s
            Sunday lunch in Ikoyi — has, by some uncommon grace, become the
            life we now build together.
          </p>
          <p>
            On the twenty-seventh of August, two thousand and twenty-six, we
            will say to one another what we have already promised in private.
            We would consider it the deepest honour to have you with us.
          </p>
        </div>
        <p className="font-script text-5xl text-gold mt-10">Eni &amp; Tiwa</p>
        <p className="mt-6 eyebrow">Amor Vincit Omnia</p>
      </div>
    </SectionWrapper>
  );
}

const STORY = [
  {
    date: "March 2019",
    title: "A Sunday lunch in Ikoyi",
    body: "Eni arrived late, in a yellow dress. Tiwa abandoned his conversation mid-sentence. The friend who introduced us has never let us forget it.",
  },
  {
    date: "August 2020",
    title: "The lockdown letters",
    body: "Two cities apart, we wrote properly — by paper, by post — for ninety-two days. The handwriting got softer.",
  },
  {
    date: "December 2022",
    title: "Christmas in Abeokuta",
    body: "Eni met the Omotoshos. Mama said little; she watched a great deal. By Boxing Day she had named the future grandchildren.",
  },
  {
    date: "April 2025",
    title: "The proposal",
    body: "On the balcony at Cap Manuel, just after the call to prayer. He had practised the speech for weeks. He said three words.",
  },
  {
    date: "August 2026",
    title: "The wedding day",
    body: "And now — at last — you. With us. In white. Singing.",
  },
];

function OurStory() {
  return (
    <SectionWrapper id="story" ground="ivory">
      <div className="text-center">
        <Eyebrow>Our story</Eyebrow>
        <DisplayTitle className="mt-4">How we arrived here</DisplayTitle>
        <GoldHairline withCipher wide />
      </div>

      <div className="relative max-w-3xl mx-auto mt-16">
        <div className="absolute left-4 sm:left-1/2 sm:-translate-x-1/2 top-0 bottom-0 w-px bg-gold/40" aria-hidden />
        <ol className="space-y-16">
          {STORY.map((s, i) => {
            const right = i % 2 === 1;
            return (
              <li key={s.date} className="relative sm:grid sm:grid-cols-2 sm:gap-12">
                <div className="absolute left-4 sm:left-1/2 sm:-translate-x-1/2 top-2 grid h-3 w-3 place-items-center">
                  <span className="block h-2 w-2 rotate-45 bg-gold" />
                </div>
                <div className={`pl-12 sm:pl-0 ${right ? "sm:col-start-2" : "sm:text-right sm:pr-12"}`}>
                  <p className="eyebrow !text-left sm:!text-inherit">{s.date}</p>
                  <h3 className="font-display text-2xl mt-2 text-emerald-ink">{s.title}</h3>
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
        <Eyebrow>Meet the couple</Eyebrow>
        <DisplayTitle className="mt-4">Two houses, one home</DisplayTitle>
        <GoldHairline withCipher wide />
      </div>

      <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto mt-14">
        <CoupleCard
          img={brideImg}
          eyebrow="The Bride"
          name="Eniolaoluwa Adérónké"
          house="of the House of Bámidélé"
          body="An architect by day, a baker by Sunday, and a slow reader of long Russian novels. She finds Tiwa funnier than he is, which is the founding kindness of their union."
        />
        <CoupleCard
          img={groomImg}
          eyebrow="The Groom"
          name="Tiwalade Olúwáṣèyí"
          house="of the House of Omotosho"
          body="A surgeon, a tennis player, a fierce competitor over board games. He has been carrying the ring around in his coat pocket for six months — for luck, he says."
        />
      </div>
    </SectionWrapper>
  );
}

function CoupleCard({
  img,
  eyebrow,
  name,
  house,
  body,
}: {
  img: string;
  eyebrow: string;
  name: string;
  house: string;
  body: string;
}) {
  return (
    <article className="text-center group">
      <div className="relative aspect-[3/4] overflow-hidden border border-gold/40 bg-ivory">
        <img
          src={img}
          alt={name}
          loading="lazy"
          className="h-full w-full object-cover grayscale-[60%] group-hover:grayscale-0 transition-all duration-700"
        />
      </div>
      <p className="eyebrow mt-6">{eyebrow}</p>
      <h3 className="font-display text-3xl mt-2 text-emerald-ink">{name}</h3>
      <p className="font-script text-2xl text-gold mt-1">{house}</p>
      <p className="mt-4 max-w-sm mx-auto font-display italic text-charcoal/80 leading-relaxed">
        {body}
      </p>
    </article>
  );
}

const PARTY = [
  { role: "Chief Bridesmaid", name: "Folasade Adékúnlé" },
  { role: "Bridesmaid", name: "Olamide Bámidélé" },
  { role: "Bridesmaid", name: "Chiamaka Eze" },
  { role: "Bridesmaid", name: "Halima Yusuf" },
  { role: "Best Man", name: "Dr. Babátúndé Omotosho" },
  { role: "Groomsman", name: "Femi Adégbúyì" },
  { role: "Groomsman", name: "Chinedu Okafor" },
  { role: "Groomsman", name: "Ibrahim Sani" },
];

function BridalParty() {
  return (
    <SectionWrapper id="party" ground="ivory">
      <div className="text-center">
        <Eyebrow>The Court of Honour</Eyebrow>
        <DisplayTitle className="mt-4">Our bridal party</DisplayTitle>
        <GoldHairline withCipher wide />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-14">
        {PARTY.map((p) => (
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
  { to: "/schedule", eyebrow: "VI", title: "Order of the Day", body: "Ceremony, reception, and the after-party — the full procession." },
  { to: "/venue", eyebrow: "VII", title: "The Venue & Travel", body: "Where to be, how to arrive, and where to lay your head." },
  { to: "/gallery", eyebrow: "IX", title: "Gallery — #TiwaSaidYes", body: "Quiet evidence of the years that brought us here." },
  { to: "/registry", eyebrow: "X", title: "Blessings & Registry", body: "Small contributions toward the first home we will share." },
  { to: "/notes", eyebrow: "XI", title: "Notes Wall", body: "Leave a blessing for the table; read those of others." },
  { to: "/faq", eyebrow: "XIII", title: "Frequently Asked", body: "Dress code, children, parking, and other gentle matters." },
] as const;

function PreviewLinks() {
  return (
    <SectionWrapper id="more" ground="emerald">
      <div className="text-center">
        <Eyebrow>Continue your visit</Eyebrow>
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
