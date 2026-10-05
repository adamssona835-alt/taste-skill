import { section } from "@/lib/paths";

// All content lives here, separate from presentation.
// Ardesia is a fictional studio: names, figures and quotes are sample content.

export const site = {
  name: "Ardesia",
  legalName: "Ardesia Studio di Architettura",
  url: "https://ardesia.studio",
  description:
    "Ardesia is an architecture and interiors studio in Genoa, designing houses, restorations and retreats around material, climate and light.",
  email: "studio@ardesia.studio",
  phone: "+39 010 247 1938",
  phoneHref: "tel:+390102471938",
  address: ["Salita Santa Caterina 9", "16123 Genova", "Italia"],
  cta: "Begin a project",
};

export const nav = [
  { label: "Studio", href: section("studio") },
  { label: "Services", href: section("services") },
  { label: "Work", href: section("work") },
];

export type Project = {
  slug: string;
  name: string;
  category: string;
  location: string;
  year: string;
  summary: string;
  body: string[];
  services: string[];
  image: string;
  imageAlt: string;
  detail: string;
  detailAlt: string;
};

export const featured: Project = {
  slug: "casa-lavagna",
  name: "Casa Lavagna",
  category: "Private house",
  location: "Moneglia, Liguria",
  year: "2025",
  summary:
    "A family house set into a terraced hillside, clad in oak that will grey with the sea air, behind a long wall of blackened timber.",
  body: [
    "The site was a run of abandoned olive terraces above the coast road. We kept every retaining wall and placed the house where the old terraces were widest, so the building reads as one more step in the hill.",
    "Inside, a double-height stair hall pulls morning light from the east and lets it fall through the house. Joinery, lighting and the garden were drawn by the same team, at the same time.",
  ],
  services: ["Architecture", "Interiors", "Landscape"],
  image: "casa-lavagna-day",
  imageAlt: "A two-storey house with an oak-clad ground floor and a long black timber wall, under a pale sky.",
  detail: "casa-lavagna-dusk",
  detailAlt: "The same house at dusk, the stair hall glowing behind tall timber fins.",
};

export const projects: Project[] = [
  {
    slug: "torre-punta-chiappa",
    name: "Torre di Punta Chiappa",
    category: "Restoration",
    location: "Camogli, Liguria",
    year: "2024",
    summary:
      "A 1960s coastal watch post rebuilt as a two-room retreat. The original concrete stays exposed, repaired by hand.",
    body: [
      "The tower had been empty for thirty years. Rather than clad it, we cut back the failed render, repaired the concrete with matched aggregate and left the marks of the original formwork visible.",
      "The lookout room became a bedroom with a single window to the horizon. Everything new is in oak and lime, and can be removed without damaging what was there.",
    ],
    services: ["Restoration", "Interiors"],
    image: "torre",
    imageAlt: "A concrete lookout tower on a dark beach, its cantilevered room silhouetted against a dawn sky.",
    detail: "concrete",
    detailAlt: "Board-marked concrete wall with tie holes in a regular grid.",
  },
  {
    slug: "casa-bianca",
    name: "Casa Bianca",
    category: "New build",
    location: "Pantelleria, Sicily",
    year: "2023",
    summary:
      "Thick lime walls and small, deep openings keep the house cool through August without mechanical cooling.",
    body: [
      "On Pantelleria the wind is constant and the summer is long. The house is built the way the island has always built: heavy walls, few windows, and rooms arranged around shade.",
      "The volumes step with the ground. Each one has its own roof terrace, connected by external stairs that are used more than the corridors inside.",
    ],
    services: ["Architecture", "Landscape"],
    image: "casa-bianca",
    imageAlt: "White cubic volumes of a lime-rendered house beside a stone path and a pine tree.",
    detail: "plaster-stair",
    detailAlt: "A stair carved into a rough plaster wall, its profile stepping down in soft shadow.",
  },
  {
    slug: "appartamento-castelletto",
    name: "Appartamento Castelletto",
    category: "Interiors",
    location: "Genoa",
    year: "2025",
    summary:
      "A nineteenth-century apartment returned to its original plan, with new joinery set into the thickness of the walls.",
    body: [
      "Four decades of partitions had cut the apartment into eleven rooms. We removed them, found the original enfilade, and restored the proportions the building was designed with.",
      "Storage, the kitchen and a reading bed are built into the depth of the old walls, so the rooms themselves stay empty.",
    ],
    services: ["Interiors", "Objects"],
    image: "interior-niche",
    imageAlt: "A bed set into an oak-lined niche, with a sheer curtain softening the window light.",
    detail: "threshold",
    detailAlt: "A doorway in a concrete wall opening onto a white corridor of repeated frames.",
  },
  {
    slug: "casa-nera",
    name: "Casa Nera",
    category: "Private house",
    location: "Santo Stefano d'Aveto",
    year: "2022",
    summary:
      "A mountain house in charred larch, built low against the winter wind, with one long window facing the valley.",
    body: [
      "At 1,000 metres the brief was warmth and quiet. The house sits low in a fold of the slope, its north side almost closed, its south side open to the valley.",
      "The larch cladding was charred on site, an old technique that protects the wood for decades without paint or maintenance.",
    ],
    services: ["Architecture", "Interiors"],
    image: "casa-nera",
    imageAlt: "A dark timber house at dusk with tall lit windows, set behind a lawn under pines.",
    detail: "workshop",
    detailAlt: "A joinery workshop lit by a single warm lamp, tools and timber on the bench.",
  },
];

export const allProjects = [featured, ...projects];

export const services = [
  {
    name: "Architecture",
    text: "New houses and retreats, from the first site visit to the day we hand over the keys.",
    image: "stair-spiral",
    alt: "A white concrete stair folding down through a stairwell in soft daylight.",
  },
  {
    name: "Interiors",
    text: "Rooms, joinery and lighting, drawn with the building rather than added after it.",
    image: "interior-niche",
    alt: "A bed set into an oak-lined niche beside a curtained window.",
  },
  {
    name: "Restoration",
    text: "Listed and vernacular buildings, repaired with their own materials and methods.",
    image: "stone-house",
    alt: "A stone farmhouse with dark shutters beside a path of tall cypress trees.",
  },
  {
    name: "Landscape",
    text: "Terraces, dry-stone walls and gardens planted to live on very little water.",
    image: "rock-reflection",
    alt: "A dark rock island reflected in still, shallow water under a pale sky.",
  },
  {
    name: "Objects",
    text: "Tables, lamps and door furniture, made in small numbers with workshops in Liguria.",
    image: "workshop",
    alt: "A joinery workshop lit by a single warm lamp.",
  },
];

export const principles = [
  {
    title: "Material before form",
    text: "We choose what a building is made of before we decide what it looks like. Stone, lime and timber from within a day's drive.",
  },
  {
    title: "Light as structure",
    text: "Every room is drawn at three hours of the day. Windows are placed for the light they bring, not the elevation they make.",
  },
  {
    title: "Built to weather",
    text: "Nothing is designed to stay new. Our buildings are meant to look better in twenty years than on the day they open.",
  },
];

export const lightStudy = [
  {
    time: "07:10",
    title: "Morning",
    text: "Low, warm and raking. It finds texture in a stair or a wall that noon will flatten.",
    image: "stair-morning",
    alt: "Morning sun falling across a concrete stair and a pale wall.",
  },
  {
    time: "13:40",
    title: "Midday",
    text: "Hard and white from above. Terraces, roofs and courtyards are designed for this hour.",
    image: "terraces-noon",
    alt: "White roof terraces stepping down towards a bright blue sea.",
  },
  {
    time: "19:50",
    title: "Evening",
    text: "The house turns to face the horizon. Interiors should glow, never glare.",
    image: "deck-dusk",
    alt: "A timber deck and narrow pool beneath a red and violet evening sky.",
  },
];

export const stats = [
  { value: 41, suffix: "", label: "Buildings completed since the studio opened in 2009" },
  { value: 9, suffix: "", label: "Listed buildings restored, from farmhouses to a coastal tower" },
  { value: 7, suffix: "", label: "Architects, one model maker and one joiner, all in one room in Genoa" },
  { value: 80, suffix: "%", label: "Of our materials sourced within 200 km of the site" },
];

export const testimonials = [
  {
    project: "Casa Lavagna",
    quote:
      "They spent two days on the land before showing us a single line. The house they drew could not have been built anywhere else.",
    name: "Giulia Ferraris",
    role: "Client, Moneglia",
  },
  {
    project: "Torre di Punta Chiappa",
    quote:
      "The hardest part of the brief was making the tower feel lived in without making it look restored. They understood that on the first visit.",
    name: "Marco Benvenuti",
    role: "Client, Camogli",
  },
  {
    project: "Casa Nera",
    quote:
      "Every decision was explained, costed and kept. We finished two weeks early, in the mountains, in winter.",
    name: "Anouk de Vries",
    role: "Client, Val d'Aveto",
  },
];
