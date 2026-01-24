export const PLATFORMS = [
  "Web",
  "macOS",
  "Windows",
  "Linux",
  "iOS",
  "Android",
  "Cross-platform",
] as const;

export type Platform = (typeof PLATFORMS)[number];
