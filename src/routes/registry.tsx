import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SectionWrapper, Eyebrow, DisplayTitle } from "@/components/layout/SectionWrapper";
import { GoldHairline } from "@/components/heraldry/GoldHairline";
import { GiftCard } from "@/components/registry/GiftCard";
import { getRegistry, type RegistryItem, type RegistryCategory } from "@/lib/mockApi";
import site from "@/content/site.json";

const TABS: ("All" | RegistryCategory | "Sealed")[] = [
  "All",
  "Kitchen",
  "Laundry",
  "Living Room",
  "Bedroom",
  "Sealed",
];

export const Route = createFileRoute("/registry")({
  head: () => ({
    meta: [
      { title: `Blessings & Registry · ${site.bride.first} & ${site.groom.first}` },
      { name: "description", content: `Contribute toward the first home of ${site.bride.first} & ${site.groom.first}. A blessing, not a transaction.` },
      { property: "og:title", content: "Blessings & Registry" },
      { property: "og:description", content: "A blessing for the first home. The gift persists beyond the day." },
    ],
  }),
  component: Registry,
});

function Registry() {
  const [items, setItems] = useState<RegistryItem[]>([]);
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  const [loading, setLoading] = useState(true);

  const refresh = () => {
    getRegistry().then((res) => { setItems(res); setLoading(false); });
  };

  useEffect(() => { refresh(); }, []);

  const filtered = items
    .filter((it) => {
      if (tab === "All") return true;
      if (tab === "Sealed") return it.raised >= it.goal;
      return it.category === tab;
    })
    .sort((a, b) => {
      const aSealed = a.raised >= a.goal;
      const bSealed = b.raised >= b.goal;
      if (aSealed !== bSealed) return aSealed ? 1 : -1;
      return 0;
    });

  const totalRaised = items.reduce((s, it) => s + it.raised, 0);
  const totalGoal = items.reduce((s, it) => s + it.goal, 0);

  return (
    <SectionWrapper ground="emerald">
      <div className="text-center">
        <Eyebrow className="!text-gold-soft">Section X</Eyebrow>
        <DisplayTitle inverse className="mt-4">Blessings &amp; Registry</DisplayTitle>
        <GoldHairline withCipher wide />
        <p className="font-display italic text-lg max-w-xl mx-auto text-ivory/80">
          Your presence is the greatest gift. For those who have asked: small
          contributions toward the first home we will build together.
        </p>

        {!loading && (
          <div className="mt-10 inline-flex items-baseline gap-4 px-8 py-5 border border-gold/40 bg-emerald-deep/40">
            <span className="font-display text-3xl text-gold">
              {Math.round((totalRaised / totalGoal) * 100)}%
            </span>
            <span className="eyebrow !text-gold-soft">fulfilled across all gifts</span>
          </div>
        )}
      </div>

      <div className="mt-12 flex flex-wrap justify-center gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 font-ceremonial text-[0.65rem] tracking-[0.3em] border transition-colors ${
              tab === t
                ? "border-gold bg-gold/20 text-gold-soft"
                : "border-gold/30 text-ivory/70 hover:border-gold/60 hover:text-ivory"
            }`}
          >
            {t === "Sealed" ? "❖ Sealed" : t}
          </button>
        ))}
      </div>

      <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-emerald-deep/40 border border-gold/20 animate-pulse" />
            ))
          : filtered.map((it) => <GiftCard key={it.id} item={it} onChanged={refresh} />)}
      </div>

      {!loading && filtered.length === 0 && (
        <p className="mt-12 text-center font-display italic text-ivory/70">
          Every gift in this category has been blessed. ❖
        </p>
      )}
    </SectionWrapper>
  );
}
