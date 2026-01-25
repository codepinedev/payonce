import { Button } from "./ui/button";

import Link from "next/link";
export function Header() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex h-12 max-w-4xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="h-3 w-3 rounded-full bg-primary" />
          PayOnce
        </Link>
        <nav className="flex gap-4 text-sm">
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
