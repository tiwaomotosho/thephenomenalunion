import { useEffect, useState } from "react";
import { listNotes, submitNote, type Note } from "@/lib/mockApi";
import { GoldHairline } from "@/components/heraldry/GoldHairline";

export function NotesWall() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    listNotes().then(setNotes);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitting(true);
    await submitNote({ name, message });
    setSubmitting(false);
    setSent(true);
    setName("");
    setMessage("");
    setTimeout(() => setSent(false), 4500);
  }

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
          Notes are reviewed before they appear on the wall.
        </p>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="mt-5 w-full border border-gold/40 bg-white px-4 py-3 text-sm focus:border-gold focus:outline-none"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder="A wish, a memory, a prayer…"
          required
          className="mt-3 w-full border border-gold/40 bg-white px-4 py-3 text-sm focus:border-gold focus:outline-none resize-none"
        />

        <div className="mt-5 flex items-center justify-between gap-4">
          <button type="submit" disabled={submitting} className="btn-royal">
            {submitting ? "Sending…" : "Send blessing"}
          </button>
          {sent && (
            <p className="text-xs font-ceremonial tracking-[0.25em] text-emerald-deep animate-royal-fade">
              ❖ Received with thanks — pending approval
            </p>
          )}
        </div>
      </form>

      <GoldHairline withCipher wide />

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
    </div>
  );
}
