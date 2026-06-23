import g1 from "@/assets/gallery-1.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import g8 from "@/assets/gallery-8.jpg";
import type { RegistryItem, Note } from "@/lib/mockApi";

export const REGISTRY_SEED: RegistryItem[] = [
  {
    id: "kettle",
    name: "The Morning Kettle",
    description: "For the first cup of tea in our new kitchen — quiet, gilded, ours.",
    category: "Kitchen",
    goal: 120_000,
    raised: 64_000,
    image: g8,
  },
  {
    id: "espresso",
    name: "Espresso Set",
    description: "Italian-made, brass-trimmed. The Saturday morning ritual.",
    category: "Kitchen",
    goal: 380_000,
    raised: 380_000,
    image: g5,
  },
  {
    id: "dinnerware",
    name: "Ivory Dinnerware",
    description: "Twelve settings of bone china with a hand-painted gilt rim.",
    category: "Kitchen",
    goal: 540_000,
    raised: 210_000,
    image: g4,
  },
  {
    id: "linens",
    name: "Linen Bedding",
    description: "Soft Portuguese linen for slow Sunday mornings.",
    category: "Bedroom",
    goal: 280_000,
    raised: 95_000,
    image: g1,
  },
  {
    id: "armchair",
    name: "The Reading Armchair",
    description: "Deep emerald velvet — the corner where evenings will go.",
    category: "Living Room",
    goal: 720_000,
    raised: 180_000,
    image: g5,
  },
  {
    id: "rug",
    name: "Persian Rug",
    description: "A hand-knotted runner to warm the hallway between us.",
    category: "Living Room",
    goal: 950_000,
    raised: 0,
    image: g4,
  },
  {
    id: "washer",
    name: "Front-Load Washer",
    description: "Quiet, efficient, blessedly boring. The grown-up gift.",
    category: "Laundry",
    goal: 1_100_000,
    raised: 460_000,
    image: g8,
  },
  {
    id: "iron",
    name: "Steam Press",
    description: "Crisp shirts on Sunday nights for the week ahead.",
    category: "Laundry",
    goal: 180_000,
    raised: 180_000,
    image: g1,
  },
];

export const NOTES_SEED: Note[] = [
  {
    id: "n-1",
    name: "Aunty Bukola",
    message:
      "From the day you brought him home, I knew. May your union be a roof in every storm and a window in every season. We love you both.",
    approved: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 6,
  },
  {
    id: "n-2",
    name: "Uche & Ada",
    message:
      "Twelve years of friendship and we’ve never seen Tiwa look at anyone the way he looks at you, Eni. Cheers to the easiest yes of his life.",
    approved: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 4,
  },
  {
    id: "n-3",
    name: "Pastor Ade",
    message:
      "Ẹ kú orí ire. May the Lord who began this good work in you both bring it to a glorious completion. Counting down the days.",
    approved: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
  {
    id: "n-4",
    name: "The London Cousins",
    message:
      "We are already practising our dance steps. Save us a slow song and a slice of cake.",
    approved: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 20,
  },
];
