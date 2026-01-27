"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import type { PriceChangeType } from "@/types/pricing-flag";

interface FlagPricingButtonProps {
  toolId: string;
  toolName: string;
  currentPrice: number;
}

const PRICE_TYPES: { value: PriceChangeType; label: string }[] = [
  { value: "higher", label: "Price increased" },
  { value: "lower", label: "Price decreased" },
  { value: "subscription", label: "Now subscription-based" },
  { value: "discontinued", label: "Tool discontinued" },
  { value: "unknown", label: "Price changed (not sure how)" },
];

export function FlagPricingButton({
  toolId,
  toolName,
  currentPrice,
}: FlagPricingButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    price_type: "" as PriceChangeType | "",
    reported_price: "",
    source_url: "",
    comment: "",
    email: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/pricing-flags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool_id: toolId,
          price_type: formData.price_type || undefined,
          reported_price: formData.reported_price
            ? parseFloat(formData.reported_price)
            : undefined,
          source_url: formData.source_url || undefined,
          comment: formData.comment || undefined,
          email: formData.email || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit");
      }

      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit report"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setSubmitted(false);
      setError("");
      setFormData({
        price_type: "",
        reported_price: "",
        source_url: "",
        comment: "",
        email: "",
      });
    }, 200);
  };

  const showPriceInput =
    formData.price_type &&
    !["subscription", "discontinued", "unknown"].includes(formData.price_type);

  return (
    <>
      <Button
        disabled
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="gap-2 text-muted-foreground hover:text-foreground"
      >
        <HugeiconsIcon icon={AlertCircleIcon} size={14} />
        Flag Pricing Change (Coming Soon)
      </Button>

      <AlertDialog open={isOpen} onOpenChange={handleClose}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Report Pricing Change</AlertDialogTitle>
            <AlertDialogDescription>
              Help us keep {toolName} pricing accurate. Currently listed at{" "}
              <strong>
                {currentPrice === 0 ? "Free" : `$${currentPrice}`}
              </strong>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>

          {submitted ? (
            <div className="py-8 text-center">
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                size={48}
                className="mx-auto text-green-500 mb-4"
              />
              <p className="font-medium">Thank you for reporting!</p>
              <p className="text-sm text-muted-foreground mt-2">
                We will verify and update the pricing.
              </p>
              <Button onClick={handleClose} className="mt-4">
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>What changed?</Label>
                <Select
                  value={formData.price_type}
                  onValueChange={(v) =>
                    setFormData({
                      ...formData,
                      price_type: v as PriceChangeType,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select change type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRICE_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {showPriceInput && (
                <div className="space-y-2">
                  <Label htmlFor="reported_price">New Price ($)</Label>
                  <Input
                    id="reported_price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.reported_price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        reported_price: e.target.value,
                      })
                    }
                    placeholder="Enter the new price"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="source_url">
                  Where did you see this? (optional)
                </Label>
                <Input
                  id="source_url"
                  type="url"
                  value={formData.source_url}
                  onChange={(e) =>
                    setFormData({ ...formData, source_url: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="comment">Additional details (optional)</Label>
                <Textarea
                  id="comment"
                  value={formData.comment}
                  onChange={(e) =>
                    setFormData({ ...formData, comment: e.target.value })
                  }
                  placeholder="Any other information..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email (optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="For follow-up"
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <AlertDialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Report"}
                </Button>
              </AlertDialogFooter>
            </form>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
