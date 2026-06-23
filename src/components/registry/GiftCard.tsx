import { useState } from "react";
import { contribute, type RegistryItem } from "@/lib/mockApi";
import { Seal } from "@/components/heraldry/Seal";
import { X } from "lucide-react";

const NGN = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });

export function GiftCard({
  item,
  onChanged,
}: {
  item: RegistryItem;
  onChanged: () => void;
}) {
  const [open, setOpen] = useState(false);
  const sealed = item.raised >= item.goal;
  const pct = Math.min(100, Math.round((item.raised / item.goal) * 100));

  return (
    <article className="card-royal relative flex flex-col overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden bg-paper">
        <img
          src={item.image}
          alt=""
          loading="lazy"
          className={`h-full w-full object-cover transition-all duration-700 ${sealed ? "grayscale-[60%]" : "group-hover:scale-[1.03]"}`}
        />
        {sealed && (
          <div className="absolute inset-0 grid place-items-center bg-ivory/40 backdrop-blur-[1px] animate-royal-fade">
            <div className="animate-seal-press">
              <Seal size={130} />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-7">
        <p className="eyebrow !text-left">{item.category}</p>
        <h3 className="font-display text-2xl mt-2 text-emerald-ink">{item.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-charcoal/80 font-display italic">
          {item.description}
        </p>

        <div className="mt-6">
          <div className="flex items-baseline justify-between text-xs font-ceremonial tracking-[0.2em] text-emerald-deep">
            <span>{NGN.format(item.raised)}</span>
            <span className="text-gold">of {NGN.format(item.goal)}</span>
          </div>
          <div className="mt-2 h-px w-full bg-gold/25 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#b8862f] via-[#e6c36a] to-[#b8862f] transition-[width] duration-700"
              style={{ width: `${pct}%`, height: "1px" }}
            />
          </div>
          <div className="mt-1 text-[0.6rem] font-ceremonial tracking-[0.3em] text-charcoal/60">
            {pct}% fulfilled
          </div>
        </div>

        <button
          onClick={() => setOpen(true)}
          disabled={sealed}
          className={sealed ? "btn-royal-ghost mt-6 opacity-60 cursor-not-allowed" : "btn-royal mt-6"}
        >
          {sealed ? "Sealed with thanks" : "Bless this gift"}
        </button>
      </div>

      {open && (
        <ContributeModal item={item} onClose={() => setOpen(false)} onDone={onChanged} />
      )}
    </article>
  );
}

function ContributeModal({
  item,
  onClose,
  onDone,
}: {
  item: RegistryItem;
  onClose: () => void;
  onDone: () => void;
}) {
  const [amount, setAmount] = useState<number>(20_000);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [step, setStep] = useState<"form" | "processing" | "done">("form");
  const [sealed, setSealed] = useState(false);

  const remaining = Math.max(0, item.goal - item.raised);

  async function handlePay() {
    setStep("processing");
    const res = await contribute(item.id, amount, { name: name || "A loving guest", note });
    setSealed(res.sealed);
    setStep("done");
    onDone();
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-emerald-ink/70 backdrop-blur-sm p-4 animate-royal-fade"
      onClick={onClose}
    >
      <div
        className="relative max-w-md w-full bg-ivory border border-gold/40 shadow-2xl animate-royal-rise"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 p-2 text-emerald-ink/70 hover:text-emerald-ink"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {step === "form" && (
          <div className="p-8">
            <p className="eyebrow !text-left">Bless this gift</p>
            <h3 className="font-display text-3xl mt-2 text-emerald-ink">{item.name}</h3>
            <p className="mt-2 text-sm text-charcoal/70 font-display italic">
              {NGN.format(remaining)} remaining to fulfilment.
            </p>

            <label className="block mt-7">
              <span className="eyebrow !text-left">Amount (NGN)</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {[10_000, 25_000, 50_000, 100_000].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setAmount(v)}
                    className={`px-3 py-2 font-ceremonial text-[0.65rem] tracking-[0.25em] border ${
                      amount === v
                        ? "border-gold bg-gold/20 text-emerald-ink"
                        : "border-gold/40 text-emerald-ink/70 hover:border-gold"
                    }`}
                  >
                    {NGN.format(v).replace("NGN", "₦")}
                  </button>
                ))}
              </div>
              <input
                type="number"
                min={1000}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="mt-3 w-full border border-gold/40 bg-white px-4 py-3 font-display text-lg text-emerald-ink focus:border-gold focus:outline-none"
              />
            </label>

            <label className="block mt-5">
              <span className="eyebrow !text-left">Your name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="So we may thank you properly"
                className="mt-2 w-full border border-gold/40 bg-white px-4 py-3 text-sm focus:border-gold focus:outline-none"
              />
            </label>

            <label className="block mt-5">
              <span className="eyebrow !text-left">A note (optional)</span>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="A blessing, a memory, a wish."
                className="mt-2 w-full border border-gold/40 bg-white px-4 py-3 text-sm focus:border-gold focus:outline-none resize-none"
              />
            </label>

            <button onClick={handlePay} disabled={amount < 1000} className="btn-royal mt-7 w-full">
              Pay with Paystack
            </button>
            <p className="mt-3 text-center text-[0.6rem] font-ceremonial tracking-[0.3em] text-charcoal/60">
              Demo · No real charge will be made
            </p>
          </div>
        )}

        {step === "processing" && (
          <div className="p-14 text-center">
            <div className="mx-auto h-10 w-10 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
            <p className="mt-5 eyebrow">Sealing your blessing</p>
          </div>
        )}

        {step === "done" && (
          <div className="p-10 text-center">
            <div className="animate-seal-press flex justify-center">
              <Seal size={140} />
            </div>
            <h3 className="font-display text-3xl mt-6 text-emerald-ink">Thank you.</h3>
            <p className="mt-3 font-display italic text-charcoal/70 max-w-xs mx-auto">
              {sealed
                ? "This blessing has been fulfilled in full. Your name will live in our new home."
                : "Your contribution carries this gift closer to home. We are deeply grateful."}
            </p>
            <button onClick={onClose} className="btn-royal-ghost mt-8">
              Return
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
