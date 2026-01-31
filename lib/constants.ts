/** Five stability pillars: key and label (single source of truth for admin survey and public form). */
export const PILLARS = [
  { key: "Security", label: "Security" },
  { key: "FX & Economy", label: "FX & Economy" },
  { key: "Investor Confidence", label: "Investor Confidence" },
  { key: "Governance", label: "Governance" },
  { key: "Social Stability", label: "Social Stability" },
] as const;

export const PILLAR_KEYS = PILLARS.map((p) => p.key);

export const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
  "FCT",
] as const;

export const MOODS = [
  "Calm",
  "Hopeful",
  "Tired",
  "Tense",
  "Optimistic",
  "Uncertain",
] as const;

export const SPOTLIGHT_TAGS = [
  "Security",
  "Economy",
  "Governance",
  "Social Stability",
  "Cost of Living",
  "Jobs",
  "Infrastructure",
  "Education",
  "Healthcare",
  "Business",
  "Energy",
  "Transport",
] as const;

