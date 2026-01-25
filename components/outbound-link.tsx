"use client";

import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";

interface OutboundLinkProps {
  href: string;
  toolName: string;
}

export function OutboundLink({ href, toolName }: OutboundLinkProps) {
  function handleClick() {
    trackEvent("outbound_click", { tool: toolName, url: href });
  }

  return (
    <Button className="mt-6 w-full" size="lg" onClick={handleClick}>
      <a href={href} target="_blank" rel="noopener noreferrer">
        Visit website →
      </a>
    </Button>
  );
}
