import { useState } from "react";
import { submitRsvp, type RsvpInput } from "@/lib/mockApi";
import { Seal } from "@/components/heraldry/Seal";

const MEALS: { value: RsvpInput["meal"]; label: string }[] = [
  { value: "standard", label: "Standard" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "kosher", label: "Kosher" },
  { value: "halal", label: "Halal" },
];

export function RsvpForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<RsvpInput>({
    fullName: "",
    email: "",
    attending: "yes",
    partySize: 1,
    meal: "standard",
    song: "",
    note: "",
  });
  const [done, setDone] = useState<{ id: string } | null>(null);
  const [busy, setBusy] = useState(false);

  function set<K extends keyof RsvpInput>(k: K, v: RsvpInput[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleSubmit() {
    setBusy(true);
    const res = await submitRsvp(form);
    setBusy(false);
    setDone({ id: res.confirmationId });
  }

  if (done) {
    return (
      <div className="text-center py-10">
        <div className="animate-seal-press flex justify-center">
          <Seal size={180} />
        </div>
        <p className="eyebrow mt-8">Confirmation</p>
        <h3 className="font-display text-4xl mt-3 text-emerald-ink">Thank you, {form.fullName.split(" ")[0]}.</h3>
        <p className="mt-4 max-w-md mx-auto font-display italic text-charcoal/70">
          {form.attending === "yes"
            ? "Your seat is held. A formal note will follow by post and email."
            : "We are sorry you cannot be with us — your blessing reaches us all the same."}
        </p>
        <p className="mt-6 font-ceremonial text-[0.65rem] tracking-[0.3em] text-gold">
          Reference · {done.id}
        </p>
      </div>
    );
  }

  const steps = ["Your name", "Your party", "The details", "Confirm"];

  return (
    <div>
      <div className="flex justify-center gap-3 mb-10">
        {steps.map((label, i) => (
          <div
            key={label}
            className={`flex items-center gap-3 ${i === step ? "" : "opacity-50"}`}
          >
            <span
              className={`grid h-8 w-8 place-items-center rounded-full border font-ceremonial text-[0.6rem] tracking-widest ${
                i <= step ? "border-gold bg-gold/15 text-emerald-ink" : "border-gold/30 text-charcoal/50"
              }`}
            >
              {i + 1}
            </span>
            {i < steps.length - 1 && <span className="hidden sm:block h-px w-8 bg-gold/30" />}
          </div>
        ))}
      </div>

      <div className="card-royal p-8 sm:p-12 bg-ivory min-h-[360px]">
        {step === 0 && (
          <div className="animate-royal-fade">
            <p className="eyebrow !text-left">Step one</p>
            <h3 className="font-display text-3xl mt-2 text-emerald-ink">Who shall we expect?</h3>
            <label className="block mt-7">
              <span className="eyebrow !text-left">Full name (as on your invitation)</span>
              <input
                value={form.fullName}
                onChange={(e) => set("fullName", e.target.value)}
                className="mt-2 w-full border border-gold/40 bg-white px-4 py-3 text-base focus:border-gold focus:outline-none"
                autoFocus
              />
            </label>
            <label className="block mt-5">
              <span className="eyebrow !text-left">Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className="mt-2 w-full border border-gold/40 bg-white px-4 py-3 text-base focus:border-gold focus:outline-none"
              />
            </label>
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setStep(1)}
                disabled={!form.fullName || !form.email}
                className="btn-royal"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="animate-royal-fade">
            <p className="eyebrow !text-left">Step two</p>
            <h3 className="font-display text-3xl mt-2 text-emerald-ink">Will you be with us?</h3>

            <div className="mt-7 grid grid-cols-2 gap-3">
              {(["yes", "no"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => set("attending", v)}
                  className={`p-5 border text-left ${
                    form.attending === v
                      ? "border-gold bg-gold/15"
                      : "border-gold/30 hover:border-gold/60"
                  }`}
                >
                  <p className="font-ceremonial text-[0.65rem] tracking-[0.3em] text-gold">
                    {v === "yes" ? "Joyfully" : "With regret"}
                  </p>
                  <p className="font-display text-xl mt-1 text-emerald-ink">
                    {v === "yes" ? "Yes, I will attend" : "No, I cannot"}
                  </p>
                </button>
              ))}
            </div>

            {form.attending === "yes" && (
              <label className="block mt-6">
                <span className="eyebrow !text-left">Party size</span>
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={form.partySize}
                  onChange={(e) => set("partySize", Number(e.target.value))}
                  className="mt-2 w-32 border border-gold/40 bg-white px-4 py-3 text-base focus:border-gold focus:outline-none"
                />
              </label>
            )}

            <div className="mt-8 flex justify-between">
              <button onClick={() => setStep(0)} className="btn-royal-ghost">Back</button>
              <button onClick={() => setStep(2)} className="btn-royal">Continue</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-royal-fade">
            <p className="eyebrow !text-left">Step three</p>
            <h3 className="font-display text-3xl mt-2 text-emerald-ink">A few small details.</h3>

            {form.attending === "yes" && (
              <>
                <fieldset className="mt-7">
                  <legend className="eyebrow !text-left">Meal preference</legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {MEALS.map((m) => (
                      <button
                        key={m.value}
                        type="button"
                        onClick={() => set("meal", m.value)}
                        className={`px-4 py-2 font-ceremonial text-[0.65rem] tracking-[0.28em] border ${
                          form.meal === m.value
                            ? "border-gold bg-gold/20 text-emerald-ink"
                            : "border-gold/40 text-emerald-ink/70 hover:border-gold"
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <label className="block mt-6">
                  <span className="eyebrow !text-left">A song to keep us on the floor</span>
                  <input
                    value={form.song}
                    onChange={(e) => set("song", e.target.value)}
                    placeholder="e.g. Burna Boy — Last Last"
                    className="mt-2 w-full border border-gold/40 bg-white px-4 py-3 text-base focus:border-gold focus:outline-none"
                  />
                </label>
              </>
            )}

            <label className="block mt-6">
              <span className="eyebrow !text-left">A note to the couple</span>
              <textarea
                rows={3}
                value={form.note}
                onChange={(e) => set("note", e.target.value)}
                className="mt-2 w-full border border-gold/40 bg-white px-4 py-3 text-base focus:border-gold focus:outline-none resize-none"
              />
            </label>

            <div className="mt-8 flex justify-between">
              <button onClick={() => setStep(1)} className="btn-royal-ghost">Back</button>
              <button onClick={() => setStep(3)} className="btn-royal">Review</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-royal-fade">
            <p className="eyebrow !text-left">Step four</p>
            <h3 className="font-display text-3xl mt-2 text-emerald-ink">By your leave.</h3>

            <dl className="mt-7 divide-y divide-gold/20 border-y border-gold/20">
              {[
                ["Name", form.fullName],
                ["Email", form.email],
                ["Attending", form.attending === "yes" ? `Yes — party of ${form.partySize}` : "With regret"],
                ...(form.attending === "yes" ? [["Meal", MEALS.find((m) => m.value === form.meal)!.label]] : []),
                ...(form.song ? [["Song request", form.song]] : []),
                ...(form.note ? [["Note", form.note]] : []),
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[140px_1fr] gap-4 py-3">
                  <dt className="font-ceremonial text-[0.6rem] tracking-[0.3em] text-gold">{k}</dt>
                  <dd className="font-display text-base text-emerald-ink">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex justify-between">
              <button onClick={() => setStep(2)} className="btn-royal-ghost">Back</button>
              <button onClick={handleSubmit} disabled={busy} className="btn-royal">
                {busy ? "Sending…" : "Send my RSVP"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
