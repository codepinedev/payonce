"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES } from "@/lib/categories";
import { trackEvent } from "@/lib/analytics";

interface CategoryFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  function handleChange(v: string) {
    if (v && v !== "all") {
      trackEvent("filter_used", { category: v });
    }
    onChange(v);
  }

  return (
    <Select value={value} onValueChange={(v) => v && handleChange(v)}>
      <SelectTrigger className="w-45">
        <SelectValue placeholder="All categories" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All categories</SelectItem>
        <SelectSeparator />
        {CATEGORIES.map((category) => (
          <SelectItem key={category} value={category}>
            {category}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
