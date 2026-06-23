/**
 * Mock backend for the Royal Wedding site.
 *
 * Simulates the future Google Apps Script endpoint with realistic latency
 * and localStorage persistence. Swap this file for real `fetch` calls once
 * the backend (§XII–XIV of the manual) is wired.
 */

import seal from "@/assets/seal.png";
import { REGISTRY_SEED, NOTES_SEED } from "@/data/seed";

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

// ─────────── Registry ───────────
export type RegistryCategory = "Kitchen" | "Laundry" | "Living Room" | "Bedroom";
export interface RegistryItem {
  id: string;
  name: string;
  description: string;
  category: RegistryCategory;
  goal: number; // NGN
  raised: number;
  image: string;
}

const RG_KEY = "et2026.registry.v1";

export async function getRegistry(): Promise<RegistryItem[]> {
  await sleep(LATENCY());
  const overrides = read<Record<string, number>>(RG_KEY, {});
  return REGISTRY_SEED.map((it) => ({
    ...it,
    raised: Math.min(it.goal, (overrides[it.id] ?? 0) + it.raised),
  }));
}

export async function contribute(
  itemId: string,
  amount: number,
  donor: { name: string; note?: string },
): Promise<{ ok: true; sealed: boolean }> {
  await sleep(LATENCY() + 400);
  // record toward registry total
  const overrides = read<Record<string, number>>(RG_KEY, {});
  overrides[itemId] = (overrides[itemId] ?? 0) + amount;
  write(RG_KEY, overrides);
  // record as a guestbook note (auto-approved with seal)
  const notes = read<StoredNote[]>(NOTES_KEY, []);
  notes.push({
    id: `gift-${Date.now()}`,
    name: donor.name,
    message: donor.note?.trim() || "A blessing for your new home. ❖",
    approved: true,
    createdAt: Date.now(),
    fromGift: true,
  });
  write(NOTES_KEY, notes);

  const items = await getRegistry();
  const it = items.find((x) => x.id === itemId);
  return { ok: true, sealed: !!it && it.raised >= it.goal };
}

export const SEAL_SRC = seal;

// ─────────── RSVP ───────────
export interface RsvpInput {
  fullName: string;
  email: string;
  attending: "yes" | "no";
  partySize: number;
  meal: "standard" | "vegetarian" | "kosher" | "halal";
  song?: string;
  note?: string;
}

const RSVP_KEY = "et2026.rsvp.v1";

export async function submitRsvp(input: RsvpInput): Promise<{ ok: true; confirmationId: string }> {
  await sleep(LATENCY() + 300);
  const list = read<(RsvpInput & { id: string; at: number })[]>(RSVP_KEY, []);
  const id = `RSVP-${Date.now().toString(36).toUpperCase()}`;
  list.push({ ...input, id, at: Date.now() });
  write(RSVP_KEY, list);
  return { ok: true, confirmationId: id };
}

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

function ensureSeeded() {
  if (!isBrowser) return;
  const existing = read<StoredNote[]>(NOTES_KEY, []);
  if (existing.length === 0) write(NOTES_KEY, NOTES_SEED);
}

export async function listNotes(): Promise<Note[]> {
  await sleep(LATENCY());
  ensureSeeded();
  const all = read<StoredNote[]>(NOTES_KEY, NOTES_SEED);
  return all.filter((n) => n.approved).sort((a, b) => b.createdAt - a.createdAt);
}

export async function submitNote(input: { name: string; message: string }): Promise<{ ok: true; pending: boolean }> {
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
