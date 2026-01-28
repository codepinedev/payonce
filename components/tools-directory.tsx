"use client";

import { useState, useMemo } from "react";
import { ToolCard } from "@/components/tool-card";
import { SearchInput } from "@/components/search-input";
import { CategoryFilter } from "@/components/category-filter";
import { searchTools, filterToolsByCategory, filterToolsByTag } from "@/lib/tools";
import type { Tool } from "@/types/tool";
import type { TAG } from "@/lib/tags";
import { TagFilter } from "./tag-filter";

interface ToolsDirectoryProps {
  initialTools: Tool[];
}

export function ToolsDirectory({ initialTools }: ToolsDirectoryProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [tags, setTags] = useState<TAG[]>([]);

  const handleTagChange = (event: "add" | "remove", value: TAG) => {
    if (event === "add") {
      setTags((prev) => [...prev, value]);
    } else {
      setTags((prev) => prev.filter((t) => t !== value));
    }
  };

  const filteredTools = useMemo(() => {
    let tools = initialTools;

    if (category !== "all") {
      tools = filterToolsByCategory(tools, category);
    }

    if (tags.length > 0) {
      tools = filterToolsByTag(tools, tags);
    }

    if (search.trim()) {
      tools = searchTools(tools, search);
    }
    return tools;
  }, [initialTools, search, category, tags]);

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setTags([]);
  };

  return (
    <div className="flex gap-4 flex-col">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <SearchInput value={search} onChange={setSearch} />
        </div>
        <CategoryFilter value={category} onChange={setCategory} />
      </div>

      <TagFilter selectedTags={tags} onChange={handleTagChange} />

      {filteredTools.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-sm text-muted-foreground">
          No tools found.{" "}
          <button onClick={clearFilters} className="underline hover:text-foreground">
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
