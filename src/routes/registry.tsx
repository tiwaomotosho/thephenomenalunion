import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SectionWrapper, Eyebrow, DisplayTitle } from "@/components/layout/SectionWrapper";
import { GoldHairline } from "@/components/heraldry/GoldHairline";
import { Seal } from "@/components/heraldry/Seal";
import { paymentsConfig } from "@/config/payments";
import { openPaystack } from "@/lib/paystack";
import site from "@/content/site.json";

export const Route = createFileRoute("/registry")({
  head: () => ({
    meta: [
      { title: `Blessings · ${site.bride.first} & ${site.groom.first}` },
      { name: "description", content: `A blessing toward the first home of ${site.bride.first} & ${site.groom.first}. A gift of the heart, not a transaction.` },
      { property: "og:title", content: "Blessings" },
      { property: "og:description", content: "A gift toward the couple's new home." },
    ],
  }),
  component: Registry,
});

const NGN = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });

type DemoStep = "idle" | "processing" | "success";

function Registry() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState<number>(paymentsConfig.presets[0]);
  const [custom, setCustom] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demoStep, setDemoStep] = useState<DemoStep>("idle");

  const effectiveAmount = custom ? Math.max(0, Math.round(Number(custom) || 0)) : amount;

  // Demo flow: simulate a checkout, then sail off to the thank-you page.
  useEffect(() => {
    if (demoStep === "processing") {
      const t = setTimeout(() => setDemoStep("success"), 1900);
      return () => clearTimeout(t);
    }
    if (demoStep === "success") {
      const t = setTimeout(() => navigate({ to: "/thank-you" }), 1400);
      return () => clearTimeout(t);
    }
  }, [demoStep, navigate]);

  async function bless(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.includes("@")) return setError("Please enter a valid email so a receipt can be sent.");
    if (effectiveAmount < 100) return setError("Please choose or enter an amount.");

    if (paymentsConfig.demoMode) {
      setDemoStep("processing");
      return;
    }

    try {
      setBusy(true);
      await openPaystack({
        email,
        name,
        amountNaira: effectiveAmount,
        onSuccess: () => navigate({ to: "/thank-you" }),
        onClose: () => setBusy(false),
      });
    } catch {
      setBusy(false);
      setError("We could not open the payment window. Please try again in a moment.");
    }
  }

  return (
    <SectionWrapper ground="emerald">
      <div className="text-center">
        <Eyebrow className="!text-gold-soft">Blessings</Eyebrow>
        <DisplayTitle inverse className="mt-4">A blessing for the couple</DisplayTitle>
        <GoldHairline withCipher wide />
        <p className="font-display italic text-lg max-w-xl mx-auto text-ivory/75">
          Your presence is the greatest gift of all. For those who wish to give,
          a blessing toward our first home is received with full hearts. There is
          no goal and no deadline, only love and gratitude.
        </p>
      </div>

      <div className="max-w-xl mx-auto mt-12">
        <div className="card-royal p-8 sm:p-10">
          <div className="flex justify-center">
            <Seal size={92} />
          </div>

          <form onSubmit={bless} className="mt-8 space-y-7">
            <div>
              <p className="eyebrow !text-left">Choose a blessing</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {paymentsConfig.presets.map((p) => {
                  const active = !custom && amount === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        setAmount(p);
                        setCustom("");
                      }}
                      className={`py-2.5 text-sm font-display border transition-colors ${
                        active
                          ? "bg-emerald-ink text-ivory border-emerald-ink"
                          : "bg-paper text-emerald-ink border-gold/40 hover:border-gold"
                      }`}
                    >
                      {NGN.format(p)}
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="font-display text-emerald-ink/60">₦</span>
                <input
                  inputMode="numeric"
                  value={custom}
                  onChange={(e) => setCustom(e.target.value.replace(/[^\d]/g, ""))}
                  placeholder="Or enter another amount"
                  className="flex-1 bg-transparent border-b border-gold/40 py-2 font-display text-emerald-ink focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="eyebrow !text-left">Your name</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full bg-transparent border-b border-gold/40 py-2 font-display text-emerald-ink focus:outline-none focus:border-gold"
                />
              </label>
              <label className="block">
                <span className="eyebrow !text-left">Email for receipt</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full bg-transparent border-b border-gold/40 py-2 font-display text-emerald-ink focus:outline-none focus:border-gold"
                />
              </label>
            </div>

            {error && <p className="text-sm text-oxblood font-display">{error}</p>}

            <button type="submit" disabled={busy} className="btn-royal w-full justify-center">
              {busy ? "Opening Paystack…" : `Bless the couple · ${NGN.format(effectiveAmount)}`}
            </button>

            <p className="text-center font-ceremonial text-[0.58rem] tracking-[0.25em] text-charcoal/45">
              {paymentsConfig.demoMode
                ? "Demonstration · no payment is taken"
                : "Secured by Paystack · Cards, bank transfer, and USSD"}
            </p>
          </form>
        </div>
      </div>

      {demoStep !== "idle" && (
        <DemoCheckout step={demoStep} amount={effectiveAmount} />
      )}
    </SectionWrapper>
  );
}

/** A simulated payment overlay so the giving flow can be experienced without a key. */
function DemoCheckout({ step, amount }: { step: DemoStep; amount: number }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-emerald-ink/70 backdrop-blur-md p-4 animate-royal-fade">
      <div className="w-full max-w-sm bg-ivory p-10 text-center border border-gold/40">
        <p className="eyebrow">Demonstration</p>
        {step === "processing" ? (
          <>
            <div className="mx-auto mt-6 h-12 w-12 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
            <p className="mt-6 font-display text-xl text-emerald-ink">
              Sending your blessing of {NGN.format(amount)}…
            </p>
            <p className="mt-2 font-display italic text-charcoal/60 text-sm">
              This is a preview. No card is charged.
            </p>
          </>
        ) : (
          <>
            <div className="mx-auto mt-6 grid h-14 w-14 place-items-center rounded-full bg-emerald-ink text-ivory text-2xl">
              ✓
            </div>
            <p className="mt-6 font-display text-2xl text-emerald-ink">Blessing received</p>
            <p className="mt-2 font-script text-3xl text-gold">Thank you</p>
          </>
        )}
      </div>
    </div>
  );
}
