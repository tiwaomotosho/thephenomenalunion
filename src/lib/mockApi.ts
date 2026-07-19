/**
 * Notes wall data access.
 *
 * With VITE_APPS_SCRIPT_URL set, this talks to the shared Google Apps Script
 * web app (scripts/apps-script/Code.gs): GET ?action=list to read the wall,
 * POST { action: "add" } to leave a note.
 *
 * With no URL set, it falls back to a self-contained DEMO mode backed by the
 * visitor's own localStorage and the seeded notes, so the page can be explored
 * without a backend. That fallback is only for the unconfigured case — once a
 * URL exists, network failures surface as errors rather than silently writing
 * to local storage and pretending to have succeeded.
 */

import seal from "@/assets/seal.png";
import { NOTES_SEED } from "@/data/seed";
import { appsScriptUrl, backendEnabled, postToBackend } from "@/config/backend";

const LATENCY = () => 300 + Math.random() * 400;
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const isBrowser = typeof window !== "undefined";
const read = <T,>(key: string, fallback: T): T => {
  if (!isBrowser) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};
const write = (key: string, value: unknown) => {
  if (!isBrowser) return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const SEAL_SRC = seal;

// ─────────── Notes Wall ───────────
export interface Note {
  id: string;
  name: string;
  message: string;
  approved: boolean;
  createdAt: number;
  fromGift?: boolean;
}
type StoredNote = Note;

const NOTES_KEY = "et2026.notes.v1";

/** Match the caps enforced by the Apps Script. */
export const NAME_MAX = 80;
export const MESSAGE_MAX = 500;

function ensureSeeded() {
  if (!isBrowser) return;
  const existing = read<StoredNote[]>(NOTES_KEY, []);
  if (existing.length === 0) write(NOTES_KEY, NOTES_SEED);
}

const byNewest = (a: Note, b: Note) => b.createdAt - a.createdAt;

/** Read the wall. Throws if a configured backend is unreachable. */
export async function listNotes(): Promise<Note[]> {
  if (backendEnabled) {
    const res = await fetch(`${appsScriptUrl}?action=list`);
    if (!res.ok) throw new Error(`Notes request failed (${res.status})`);
    const data = (await res.json()) as { ok?: boolean; notes?: Note[]; error?: string };
    if (data.ok === false) throw new Error(data.error || "Notes request failed");
    // The script already filters and sorts; re-apply defensively.
    return (data.notes ?? []).filter((n) => n.approved).sort(byNewest);
  }

  await sleep(LATENCY());
  ensureSeeded();
  const all = read<StoredNote[]>(NOTES_KEY, NOTES_SEED);
  return all.filter((n) => n.approved).sort(byNewest);
}

/**
 * Leave a note. Notes publish immediately, so the caller should re-run
 * `listNotes()` afterwards to show the wall including this one.
 * Throws if a configured backend rejects or is unreachable.
 */
export async function submitNote(input: {
  name: string;
  message: string;
}): Promise<{ ok: true; pending: boolean }> {
  const name = input.name.trim().slice(0, NAME_MAX) || "Anonymous";
  const message = input.message.trim().slice(0, MESSAGE_MAX);

  if (backendEnabled) {
    const res = await postToBackend({ action: "add", name, message });
    if (!res.ok) throw new Error(`Could not save your note (${res.status})`);
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
    if (data.ok === false) throw new Error(data.error || "Could not save your note");
    return { ok: true, pending: false };
  }

  await sleep(LATENCY() + 200);
  ensureSeeded();
  const all = read<StoredNote[]>(NOTES_KEY, NOTES_SEED);
  all.push({
    id: `note-${Date.now()}`,
    name,
    message,
    approved: true, // publish instantly; retract from the sheet if needed
    createdAt: Date.now(),
  });
  write(NOTES_KEY, all);
  return { ok: true, pending: false };
}
