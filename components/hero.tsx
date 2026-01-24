import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="py-12 text-center">
      <h1 className="text-2xl font-bold sm:text-3xl">
        Software you buy once and own forever.
      </h1>
      <p className="mt-2 text-muted-foreground">
        Curated tools with no subscriptions.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Button>
          <Link href="/tools">Browse tools</Link>
        </Button>
        <Button variant="outline">
          <Link href="/submit">Submit</Link>
        </Button>
      </div>
    </section>
  );
}
