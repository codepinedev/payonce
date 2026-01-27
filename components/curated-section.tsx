import { HugeiconsIcon } from "@hugeicons/react";
import {
  FilterIcon,
  CheckmarkCircle01Icon,
  TickDouble01Icon,
} from "@hugeicons/core-free-icons";

const highlights = [
  {
    icon: FilterIcon,
    text: "Curated, not scraped",
  },
  {
    icon: CheckmarkCircle01Icon,
    text: "If pricing is unclear, it doesn't get listed",
  },
  {
    icon: TickDouble01Icon,
    text: "Small list, high confidence",
  },
];

export function CuratedSection() {
  return (
    <section className="mt-12 mb-8">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 py-6 border-y border-border/50">
        {highlights.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2 text-muted-foreground"
          >
            <HugeiconsIcon
              icon={item.icon}
              size={16}
              className="text-foreground/60"
            />
            <span className="text-sm">{item.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
