import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "./ui/button";

import Link from "next/link";
import { NewTwitterIcon } from "@hugeicons/core-free-icons";
export function Header() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex h-12 max-w-4xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="h-3 w-3 rounded-full bg-primary" />
          PayOnce
        </Link>
        <nav className="flex gap-4 text-sm items-center">
          <Link target="_blank" href="https://x.com/codepinedev" title="Dev Account">
            <HugeiconsIcon icon={NewTwitterIcon} size="16"/>
          </Link>
          <Link
            href="/tools"
            className="text-muted-foreground hover:text-foreground"
          >
            <Button variant={"outline"}>
              Browse
            </Button>

          </Link>
          <Link
            href="/submit"
            className="text-muted-foreground hover:text-foreground"
          >
            <Button>
              Submit
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
