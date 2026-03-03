export const FILTERS = [
  "All",
  "Keto-Friendly",
  "No Seed Oils",
  "Plant-Based",
  "Organic",
  "Nut-Milk Coffee",
  "Cold Plunge",
  "Pilates",
  "Adaptogens",
  "Zone 2",
  "Sauna",
  "Red Light",
  "Gluten-Free",
  "Carnivore",
  "High-Protein",
];

export const CATEGORIES = [
  "All",
  "Nutrition",
  "Fitness",
  "Mental Wellness",
  "Supplements",
  "Lifestyle",
  "Recovery",
  "Biohacking",
];

export const SPOT_TYPES = [
  "All",
  "Restaurant",
  "Caf\u00e9",
  "Juice Bar",
  "Gym",
  "Wellness Center",
  "Fitness Studio",
  "Health Store",
];

export const HEALTH_FILTER_GROUPS = [
  {
    label: "Dietary",
    filters: [
      { id: "plant-based", name: "Vegan / Plant-Based" },
      { id: "gluten-free", name: "Gluten-Free" },
      { id: "keto-friendly", name: "Keto" },
      { id: "organic", name: "Organic" },
      { id: "no-seed-oils", name: "No Seed Oils" },
      { id: "carnivore", name: "Carnivore" },
      { id: "high-protein", name: "High Protein" },
    ],
  },
  {
    label: "Fitness",
    filters: [
      { id: "pilates", name: "Pilates" },
      { id: "reformer", name: "Reformer" },
      { id: "barre", name: "Barre" },
      { id: "hiit", name: "HIIT" },
      { id: "crossfit", name: "CrossFit" },
      { id: "zone-2-cardio", name: "Zone 2" },
      { id: "strength", name: "Strength" },
    ],
  },
  {
    label: "Wellness",
    filters: [
      { id: "cold-plunge", name: "Cold Plunge" },
      { id: "sauna", name: "Sauna" },
      { id: "red-light", name: "Red Light" },
      { id: "recovery", name: "Recovery" },
      { id: "adaptogens", name: "Adaptogens" },
      { id: "supplements", name: "Supplements" },
      { id: "biohacking", name: "Biohacking" },
    ],
  },
];

export const ITINERARY_PREFS = [
  { id: "keto", label: "Keto Eating", emoji: "\ud83e\udd69" },
  { id: "pilates", label: "Pilates / Barre", emoji: "\ud83e\uddd8" },
  { id: "cold-plunge", label: "Cold Plunge", emoji: "\ud83e\uddf2" },
  { id: "supplements", label: "Supplement Shop", emoji: "\ud83d\udc8a" },
  { id: "plant-based", label: "Plant-Based Meals", emoji: "\ud83e\udd57" },
  { id: "red-light", label: "Red Light Therapy", emoji: "\ud83d\udd34" },
  { id: "nut-milk-coffee", label: "Specialty Coffee", emoji: "\u2615" },
  { id: "zone-2", label: "Zone 2 Cardio", emoji: "\ud83c\udfc3" },
  { id: "sauna", label: "Sauna", emoji: "\ud83d\udd25" },
  { id: "organic", label: "Organic Grocery", emoji: "\ud83d\uded2" },
];
