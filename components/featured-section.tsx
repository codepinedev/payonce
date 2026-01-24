import Link from "next/link";
import { ToolCard } from "@/components/tool-card";
import type { Tool } from "@/types/tool";

interface FeaturedSectionProps {
  tools: Tool[];
}

export function FeaturedSection({ tools }: FeaturedSectionProps) {
  return (
    <section>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
      <div className="mt-4 text-center">
        <Link
          href="/tools"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          View all tools →
        </Link>
      </div>
    </section>
  );
}
