export const CATEGORIES = [
  "Development",
  "Design",
  "Productivity",
  "Writing",
  "Screenshot",
  "File Management",
  "System Utilities",
  "Audio & Video",
  "Security",
  "Finance",
] as const;

export type Category = (typeof CATEGORIES)[number];
