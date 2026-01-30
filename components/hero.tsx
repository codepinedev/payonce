import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/categories";

interface HeroProps {
  toolCount: number;
}

export function Hero({ toolCount }: HeroProps) {
  const categoryCount = CATEGORIES.length;
  return (
    <section className="relative py-10 text-center">
      {/* Subtle radial gradient background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-muted/50 via-transparent to-transparent" />

      <h1 className="text-2xl font-bold sm:text-3xl">
        Mac apps you buy once and own forever.
      </h1>
      <p className="mt-2 text-muted-foreground">
        Curated macOS apps with no subscriptions.
      </p>
      <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground/80">
        Every app here offers a genuine one-time purchase — verified manually.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Button className={"font-semibold"}>
          <Link href="/tools">Browse tools</Link>
        </Button>
        <Button variant="outline">
          <Link href="/submit">Submit</Link>
        </Button>
      </div>

      {/* Stats strip */}
      <div className="mx-auto mt-8 inline-flex items-center gap-6 rounded-full border border-border/60 bg-muted/30 px-6 py-2 text-sm">
        <span className="font-medium">{toolCount} <span className="text-muted-foreground">apps</span></span>
        <span className="h-4 w-px bg-border" />
        <span className="font-medium">{categoryCount} <span className="text-muted-foreground">categories</span></span>
        <span className="h-4 w-px bg-border" />
        <span className="font-medium">100% <span className="text-muted-foreground">one-time</span></span>
      </div>

      <p className="mt-4 text-xs text-muted-foreground/60 italic">
        If it sneaks in a subscription later, we remove it.
      </p>
    </section>
  );
}
