import Link from "next/link";
import { Button } from "@/components/ui/button";

interface SuccessStateProps {
  onReset: () => void;
}

export function SuccessState({ onReset }: SuccessStateProps) {
  return (
    <div className="py-8 text-center">
      <p className="font-medium">Submitted. We'll review it.</p>
      <div className="mt-4 flex justify-center gap-3">
        <Button onClick={onReset} variant="outline">
          Submit another
        </Button>
        <Button >
          <Link href="/tools">Browse tools</Link>
        </Button>
      </div>
    </div>
  );
}
