"use client";

import { trackEvent } from "@/lib/analytics";
import { TAGS, type TAG } from "@/lib/tags";
import { Toggle } from "./ui/toggle";
import { HugeiconsIcon } from "@hugeicons/react";
import { Award01Icon, CheckmarkBadge01Icon, StarsIcon, UserSearch02Icon } from "@hugeicons/core-free-icons";

interface TagFilterProps {
  selectedTags: TAG[];
  onChange: (event: "add" | "remove", value: TAG) => void;
}

export function TagFilter({ selectedTags, onChange }: TagFilterProps) {
  function handleChange(pressed: boolean, tag: TAG) {
    trackEvent("filter_used", { tag });
    onChange(pressed ? "add" : "remove", tag);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {TAGS.map((tag) => (
        <Toggle
          variant="outline"
          key={tag}
          aria-label={`Toggle ${tag}`}
          pressed={selectedTags.includes(tag)}
          onPressedChange={(pressed) => handleChange(pressed, tag)}
        >
          {tag === "Community Recommended" && (
            <HugeiconsIcon icon={UserSearch02Icon} size={10} />
          )}
          {tag === "Editor's Pick" && (
            <HugeiconsIcon icon={Award01Icon} size={10} />
          )}
          {tag === "Verified One Time" && (
            <HugeiconsIcon icon={CheckmarkBadge01Icon} size={10} />
          )}
          {tag === "Featured" && <HugeiconsIcon icon={StarsIcon} size={10} />}
          {tag}
        </Toggle>
      ))}
    </div>
  );
}
