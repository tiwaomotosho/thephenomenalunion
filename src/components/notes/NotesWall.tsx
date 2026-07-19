import { useEffect, useState } from "react";
import { listNotes, submitNote, MESSAGE_MAX, NAME_MAX, type Note } from "@/lib/mockApi";
import { GoldHairline } from "@/components/heraldry/GoldHairline";
import { Cipher } from "@/components/heraldry/Cipher";

/** How long the success accent stays before it dissolves (matches the CSS). */
const ACCENT_MS = 4200;

export function NotesWall() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  // Initial read of the wall.
  useEffect(() => {
    let alive = true;
    listNotes()
      .then((list) => {
        if (!alive) return;
        setNotes(list);
        setLoadError(false);
      })
      .catch(() => alive && setLoadError(true))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  // The accent announces itself, then dissolves.
  useEffect(() => {
    if (!sent) return;
    const t = setTimeout(() => setSent(false), ACCENT_MS);
    return () => clearTimeout(t);
  }, [sent]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting || !message.trim()) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      await submitNote({ name, message });

      // The note is saved. Clear the form and celebrate before refreshing.
      setName("");
      setMessage("");
      setSent(true);

      // Re-read the wall so the guest sees their own note land.
      try {
        setNotes(await listNotes());
        setLoadError(false);
      } catch {
        // The note is safely saved; only the refresh failed.
      }
    } catch {
      setSubmitError("Your note could not be sent. Please try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  }

  const remaining = MESSAGE_MAX - message.length;

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="card-royal max-w-2xl mx-auto p-8 sm:p-10 bg-paper-grain"
      >
        <p className="eyebrow !text-left">Leave a note</p>
        <h3 className="font-display text-3xl mt-2 text-emerald-ink">
          A blessing for the table
        </h3>
        <p className="mt-2 text-sm font-display italic text-charcoal/70">
          Your note appears on the wall straight away, for every guest to read.
        </p>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={NAME_MAX}
          placeholder="Your name"
          className="mt-5 w-full border border-gold/40 bg-white px-4 py-3 text-sm focus:border-gold focus:outline-none"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, MESSAGE_MAX))}
          rows={4}
          maxLength={MESSAGE_MAX}
          placeholder="A wish, a memory, a prayer…"
          required
          className="mt-3 w-full border border-gold/40 bg-white px-4 py-3 text-sm focus:border-gold focus:outline-none resize-none"
        />
        <p
          className={`mt-1.5 text-right font-ceremonial text-[0.55rem] tracking-[0.25em] ${
            remaining <= 40 ? "text-oxblood/80" : "text-charcoal/40"
          }`}
        >
          {remaining} left
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={submitting || !message.trim()}
            className="btn-royal"
          >
            {submitting ? "Sending…" : "Send blessing"}
          </button>
        </div>

        {submitError && (
          <p className="mt-4 font-display italic text-sm text-oxblood animate-royal-fade">
            {submitError}
          </p>
        )}

        {sent && (
          <div
            role="status"
            className="mt-6 flex flex-col items-center gap-2 border border-gold/40 bg-ivory px-6 py-5 text-center animate-royal-accent"
          >
            <Cipher size={30} />
            <p className="font-script text-2xl text-gold">Your blessing is on the wall</p>
            <p className="font-ceremonial text-[0.55rem] tracking-[0.3em] uppercase text-charcoal/50">
              Received with thanks
            </p>
          </div>
        )}
      </form>

      <GoldHairline withCipher wide />

      {loading ? (
        <p className="py-10 text-center font-display italic text-charcoal/60">
          Gathering the notes…
        </p>
      ) : loadError ? (
        <p className="py-10 text-center font-display italic text-charcoal/70">
          The notes wall could not be reached just now. Please refresh in a moment.
        </p>
      ) : notes.length === 0 ? (
        <p className="py-10 text-center font-display italic text-charcoal/60">
          The wall is waiting for its first blessing. Yours could be the one.
        </p>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {notes.map((n) => (
            <article key={n.id} className="break-inside-avoid card-royal p-7 bg-ivory">
              <p className="font-display italic text-base leading-relaxed text-emerald-ink">
                “{n.message}”
              </p>
              <div className="mt-4 flex items-center gap-3">
                <span className="h-px w-6 bg-gold" />
                <span className="font-ceremonial text-[0.65rem] tracking-[0.3em] text-gold">
                  {n.name}
                </span>
                {n.fromGift && (
                  <span className="ml-auto font-ceremonial text-[0.55rem] tracking-[0.3em] text-emerald-deep/60">
                    ❖ blessed a gift
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
