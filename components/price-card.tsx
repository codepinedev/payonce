import { Button } from "@/components/ui/button";

interface PriceCardProps {
  price: number;
  url: string;
}

export function PriceCard({ price, url }: PriceCardProps) {
  return (
    <div className="flex items-center justify-between border border-border p-4">
      <div>
        <p className="text-2xl font-bold">
          {price === 0 ? "Free" : `$${price}`}
        </p>
        <p className="text-xs text-muted-foreground">
          {price === 0 ? "Free forever" : "One-time"}
        </p>
      </div>
      <Button asChild>
        <a href={url} target="_blank" rel="noopener noreferrer">
          Visit site →
        </a>
      </Button>
    </div>
  );
}
