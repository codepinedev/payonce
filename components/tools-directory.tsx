"use client";

import { useState, useMemo } from "react";
import { ToolCard } from "@/components/tool-card";
import { SearchInput } from "@/components/search-input";
import { CategoryFilter } from "@/components/category-filter";
import { searchTools, filterToolsByCategory } from "@/lib/tools";
import type { Tool } from "@/types/tool";

interface ToolsDirectoryProps {
  initialTools: Tool[];
}

export function ToolsDirectory({ initialTools }: ToolsDirectoryProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filteredTools = useMemo(() => {
    let tools = initialTools;
    if (category !== "all") {
      tools = filterToolsByCategory(tools, category);
    }
    if (search.trim()) {
      tools = searchTools(tools, search);
    }
    return tools;
  }, [initialTools, search, category]);

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <SearchInput value={search} onChange={setSearch} />
        </div>
        <CategoryFilter value={category} onChange={setCategory} />
      </div>

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
