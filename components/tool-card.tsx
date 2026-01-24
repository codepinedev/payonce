import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AppleIcon,
  WindowsNewIcon,
  GlobalIcon,
  CommandLineIcon,
  SmartPhone01Icon,
  ComputerIcon,
} from "@hugeicons/core-free-icons";
import type { Tool } from "@/types/tool";

const platformIcons: Record<string, typeof AppleIcon> = {
  macOS: AppleIcon,
  Windows: WindowsNewIcon,
  Web: GlobalIcon,
  Linux: CommandLineIcon,
  iOS: SmartPhone01Icon,
  Android: SmartPhone01Icon,
  "Cross-platform": ComputerIcon,
};

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const PlatformIcon = platformIcons[tool.platform] || GlobalIcon;

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group flex gap-3 border border-border p-4 hover:border-foreground/20"
    >
      {/* Tool logo placeholder - replace with actual images */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-lg font-semibold text-muted-foreground">
        {tool.name.charAt(0)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate font-medium group-hover:text-primary">
            {tool.name}
          </h3>
          <span className="shrink-0 font-bold">
            {tool.price === 0 ? "Free" : `$${tool.price}`}
          </span>
        </div>
        <p className="line-clamp-1 text-sm text-muted-foreground">
          {tool.description}
        </p>
        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <HugeiconsIcon icon={PlatformIcon} size={12} />
          <span>{tool.platform}</span>
        </div>
      </div>
    </Link>
  );
}
