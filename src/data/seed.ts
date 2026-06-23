import registryContent from "@/content/registry.json";
import notesContent from "@/content/notes.json";
import { img } from "@/content/images";
import type { RegistryItem, RegistryCategory, Note } from "@/lib/mockApi";

export const REGISTRY_SEED: RegistryItem[] = registryContent.items.map((it) => ({
  id: it.id,
  name: it.name,
  description: it.description,
  category: it.category as RegistryCategory,
  goal: it.goal,
  raised: it.raised,
  image: img(it.image),
}));

const DAY_MS = 1000 * 60 * 60 * 24;

export const NOTES_SEED: Note[] = notesContent.notes.map((n) => ({
  id: n.id,
  name: n.name,
  message: n.message,
  approved: true,
  createdAt: Date.now() - n.daysAgo * DAY_MS,
}));
