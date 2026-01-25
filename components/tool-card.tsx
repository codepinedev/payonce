"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AppleIcon,
  WindowsNewIcon,
  GlobalIcon,
  CommandLineIcon,
  SmartPhone01Icon,
  ComputerIcon,
  Award01Icon,
  CheckmarkBadge01Icon,
} from "@hugeicons/core-free-icons";
import type { Tool } from "@/types/tool";
import Image from "next/image";
import { trackEvent } from "@/lib/analytics";

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

  function handleClick() {
    trackEvent("tool_click", {
      tool: tool.name,
      category: tool.category,
      price: tool.price,
    });
  }

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group flex gap-3 border border-border p-4 hover:border-foreground/20"
      onClick={handleClick}
    >
      <div className="relative shrink-0">
        <div className="flex h-12 w-12 items-center justify-center rounded bg-muted p-2 text-lg font-semibold text-muted-foreground border">
          {tool.url ? <Image src={`https://www.google.com/s2/favicons?sz=128&domain=${tool.url}`} className="w-full h-full" alt={tool.name} width={48} height={48} /> : <span>{tool.name.charAt(0)}</span>}
        </div>
        {tool.editorsPick && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-white shadow-sm" title="Editor's Pick">
            <HugeiconsIcon icon={Award01Icon} size={10} />
          </span>
        )}
        {tool.verifiedOneTime && (
          <span className="absolute -left-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-white shadow-sm" title="Verified One-Time Payment">
            <HugeiconsIcon icon={CheckmarkBadge01Icon} size={10} />
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate font-medium group-hover:text-primary">
            {tool.name}
          </h3>
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${tool.price === 0 ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-foreground/5 text-foreground"}`}>
            {tool.price === 0 ? "Free" : `$${tool.price}`}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p className="line-clamp-1 text-sm text-muted-foreground">
            {tool.description}
          </p>
          <span title={tool.platform} className="shrink-0 ml-2">
            <HugeiconsIcon icon={PlatformIcon} size={14} className="text-muted-foreground/60" />
          </span>
        </div>
      </div>
    </Link>
  );
}
