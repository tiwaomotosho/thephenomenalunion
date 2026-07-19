import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SectionWrapper, Eyebrow, DisplayTitle } from "@/components/layout/SectionWrapper";
import { GoldHairline } from "@/components/heraldry/GoldHairline";
import { Seal } from "@/components/heraldry/Seal";
import { paymentsConfig } from "@/config/payments";
import { sendReceipt } from "@/lib/receipt";
import { isPageVisible } from "@/content/pages";
import site from "@/content/site.json";

export const Route = createFileRoute("/registry")({
  beforeLoad: () => {
    if (!isPageVisible("registry")) throw redirect({ to: "/" });
  },
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

type Step = "details" | "pay";

function Registry() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("details");
  const [amount, setAmount] = useState<number>(paymentsConfig.presets[0]);
  const [custom, setCustom] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const effectiveAmount = custom ? Math.max(0, Math.round(Number(custom) || 0)) : amount;

  function toDetails(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return setError("Please enter your name so the couple know who to thank.");
    if (!email.includes("@")) return setError("Please enter a valid email so a receipt can be sent.");
    if (effectiveAmount < 100) return setError("Please choose or enter an amount.");
    setStep("pay");
  }

  async function confirmPayment() {
    setBusy(true);
    // Best-effort: fire the receipt/confirmation, then head to the thank-you
    // page regardless — the guest has already sent their transfer.
    await sendReceipt({ name, email, amountNaira: effectiveAmount });
    navigate({ to: "/thank-you" });
  }

  return (
    <SectionWrapper ground="ivory">
      <div className="text-center">
        <Eyebrow>Blessings</Eyebrow>
        <DisplayTitle className="mt-4">A blessing for the couple</DisplayTitle>
        <GoldHairline withCipher wide />
        <p className="font-display italic text-lg max-w-xl mx-auto text-charcoal/80">
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

          {step === "details" ? (
            <form onSubmit={toDetails} className="mt-8 space-y-7">
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

              <button type="submit" className="btn-royal w-full justify-center">
                Continue · {NGN.format(effectiveAmount)}
              </button>

              <p className="text-center font-ceremonial text-[0.58rem] tracking-[0.25em] text-charcoal/45">
                A gift of the heart · by bank transfer
              </p>
            </form>
          ) : (
            <PayStep
              amount={effectiveAmount}
              name={name}
              busy={busy}
              onBack={() => setStep("details")}
              onConfirm={confirmPayment}
            />
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}

/**
 * Step two: the couple's account details, shown boldly. The guest makes the
 * transfer in their own banking app, then presses "I have sent it" to confirm
 * — which fires the receipt and takes them to the thank-you page.
 */
function PayStep({
  amount,
  name,
  busy,
  onBack,
  onConfirm,
}: {
  amount: number;
  name: string;
  busy: boolean;
  onBack: () => void;
  onConfirm: () => void;
}) {
  const reference = name.trim()
    ? `${paymentsConfig.transactionDescription} — ${name.trim()}`
    : paymentsConfig.transactionDescription;

  return (
    <div className="mt-8">
      <p className="text-center font-display italic text-charcoal/70">
        Please send your blessing of
      </p>
      <p className="text-center font-display text-4xl text-emerald-ink mt-1">
        {NGN.format(amount)}
      </p>

      <div className="mt-7 border border-gold/40 bg-paper/70">
        <DetailRow label="Bank" value={paymentsConfig.bankName} />
        <DetailRow label="Account name" value={paymentsConfig.accountName} />
        <DetailRow label="Account number" value={paymentsConfig.accountNumber} mono />
        <DetailRow label="Use as reference" value={reference} last />
      </div>

      <p className="mt-4 text-center font-display italic text-sm text-charcoal/60">
        Once your transfer is on its way, press below. We will send a receipt to
        your email and thank you warmly.
      </p>

      <button
        type="button"
        onClick={onConfirm}
        disabled={busy}
        className="btn-royal w-full justify-center mt-6"
      >
        {busy ? "Confirming…" : "I have sent it · Confirm payment"}
      </button>

      <button
        type="button"
        onClick={onBack}
        disabled={busy}
        className="mt-3 w-full text-center font-ceremonial text-[0.6rem] tracking-[0.28em] uppercase text-charcoal/50 hover:text-emerald-ink transition-colors disabled:opacity-50"
      >
        ← Change amount or details
      </button>
    </div>
  );
}

function DetailRow({
  label,
  value,
  mono = false,
  last = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
  last?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-1 px-5 py-3.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4 ${last ? "" : "border-b border-gold/25"}`}>
      <span className="eyebrow !text-left !text-[0.58rem] shrink-0">{label}</span>
      <span
        className={`min-w-0 break-words text-left font-display font-medium text-emerald-ink sm:text-right ${
          mono ? "text-2xl tracking-[0.12em] tabular-nums" : "text-lg"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
