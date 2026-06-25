import notesContent from "@/content/notes.json";
import type { Note } from "@/lib/mockApi";

const DAY_MS = 1000 * 60 * 60 * 24;

export const NOTES_SEED: Note[] = notesContent.notes.map((n) => ({
  id: n.id,
  name: n.name,
  message: n.message,
  approved: true,
  createdAt: Date.now() - n.daysAgo * DAY_MS,
}));
