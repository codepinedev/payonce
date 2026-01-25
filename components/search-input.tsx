"use client";

import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { trackEvent } from "@/lib/analytics";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search tools...",
}: SearchInputProps) {
  const trackedRef = useRef(false);

  function handleBlur() {
    if (value.trim() && !trackedRef.current) {
      trackEvent("search_used", { query: value.trim() });
      trackedRef.current = true;
    }
  }

  function handleChange(newValue: string) {
    trackedRef.current = false;
    onChange(newValue);
  }

  return (
    <div className="relative">
      <svg
        className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <Input
        type="search"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={handleBlur}
        placeholder={placeholder}
        className="pl-9"
      />
    </div>
  );
}
