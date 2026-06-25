/**
 * Mock backend for the Royal Wedding site.
 *
 * Simulates the future Google Apps Script endpoint with realistic latency
 * and localStorage persistence. Swap this file for real `fetch` calls once
 * the backend (§XII–XIV of the manual) is wired.
 */

import seal from "@/assets/seal.png";
import { NOTES_SEED } from "@/data/seed";

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

// When set (see docs/integrations.md), the Notes wall reads/writes a Google
// Apps Script web app instead of local storage. Left empty, it stays local.
const NOTES_ENDPOINT = (import.meta.env.VITE_NOTES_ENDPOINT ?? "") as string;

function ensureSeeded() {
  if (!isBrowser) return;
  const existing = read<StoredNote[]>(NOTES_KEY, []);
  if (existing.length === 0) write(NOTES_KEY, NOTES_SEED);
}

export async function listNotes(): Promise<Note[]> {
  if (NOTES_ENDPOINT) {
    try {
      const res = await fetch(`${NOTES_ENDPOINT}?action=list`);
      const data = (await res.json()) as { notes?: Note[] };
      return (data.notes ?? [])
        .filter((n) => n.approved)
        .sort((a, b) => b.createdAt - a.createdAt);
    } catch {
      /* fall back to local storage below */
    }
  }
  await sleep(LATENCY());
  ensureSeeded();
  const all = read<StoredNote[]>(NOTES_KEY, NOTES_SEED);
  return all.filter((n) => n.approved).sort((a, b) => b.createdAt - a.createdAt);
}

export async function submitNote(input: { name: string; message: string }): Promise<{ ok: true; pending: boolean }> {
  if (NOTES_ENDPOINT) {
    try {
      // text/plain keeps this a "simple" request, so the browser skips the
      // CORS preflight that Apps Script web apps do not answer.
      await fetch(NOTES_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action: "add",
          name: input.name.trim() || "Anonymous",
          message: input.message.trim(),
        }),
      });
      return { ok: true, pending: true };
    } catch {
      /* fall back to local storage below */
    }
  }
  await sleep(LATENCY() + 200);
  ensureSeeded();
  const all = read<StoredNote[]>(NOTES_KEY, NOTES_SEED);
  all.push({
    id: `note-${Date.now()}`,
    name: input.name.trim() || "Anonymous",
    message: input.message.trim(),
    approved: false,
    createdAt: Date.now(),
  });
  write(NOTES_KEY, all);
  return { ok: true, pending: true };
}
