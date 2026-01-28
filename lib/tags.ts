import type { Tool } from "@/types/tool";

export const TAGS = [
  "Community Recommended",
  "Featured",
  "Editor's Pick",
  "Verified One Time"
] as const;

export type TAG = (typeof TAGS)[number];

export const TAG_PROPERTY_MAP: Record<
  TAG,
  keyof Pick<Tool, "communityRecommended" | "featured" | "editorsPick" | "verifiedOneTime">
> = {
  "Community Recommended": "communityRecommended",
  Featured: "featured",
  "Editor's Pick": "editorsPick",
  "Verified One Time": "verifiedOneTime",
};
