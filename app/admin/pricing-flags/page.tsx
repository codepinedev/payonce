"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import type { PricingFlagWithTool } from "@/types/pricing-flag";

const PRICE_TYPE_LABELS: Record<string, string> = {
  higher: "Price Increased",
  lower: "Price Decreased",
  subscription: "Now Subscription",
  discontinued: "Discontinued",
  unknown: "Unknown Change",
};

export default function PricingFlagsPage() {
  const [flags, setFlags] = useState<PricingFlagWithTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [verifyPrices, setVerifyPrices] = useState<Record<string, string>>({});

  const fetchFlags = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/pricing-flags?status=pending");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch pricing flags");
      }

      setFlags(data.flags || []);
      // Initialize verify prices with reported prices
      const initialPrices: Record<string, string> = {};
      data.flags?.forEach((flag: PricingFlagWithTool) => {
        if (flag.reported_price !== null && flag.reported_price !== undefined) {
          initialPrices[flag.id!] = String(flag.reported_price);
        }
      });
      setVerifyPrices(initialPrices);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlags();
  }, []);

  const handleVerify = async (id: string) => {
    const newPrice = verifyPrices[id];
    if (!newPrice || isNaN(parseFloat(newPrice))) {
      alert("Please enter a valid price to verify");
      return;
    }

    setProcessingId(id);
    try {
      const response = await fetch(`/api/admin/pricing-flags/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify",
          new_price: parseFloat(newPrice),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to verify");
      }

      setFlags(flags.filter((f) => f.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDismiss = async (id: string) => {
    setProcessingId(id);
    try {
      const response = await fetch(`/api/admin/pricing-flags/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "dismiss" }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to dismiss");
      }

      setFlags(flags.filter((f) => f.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Dismiss failed");
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading pricing flags...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <Button onClick={fetchFlags} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Pricing Flags</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {flags.length} flag{flags.length !== 1 ? "s" : ""} awaiting review
          </p>
        </div>
        <Button onClick={fetchFlags} variant="outline">
          Refresh
        </Button>
      </div>

      {flags.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/30">
          <p className="text-muted-foreground">No pending pricing flags</p>
        </div>
      ) : (
        <div className="space-y-4">
          {flags.map((flag) => (
            <div
              key={flag.id}
              className="border rounded-lg p-4 bg-card space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/tools/${flag.tool?.slug}`}
                      className="font-semibold hover:underline"
                      target="_blank"
                    >
                      {flag.tool?.name || "Unknown Tool"}
                    </Link>
                    <Badge variant="destructive">Pricing Flag</Badge>
                    {flag.price_type && (
                      <Badge variant="outline">
                        {PRICE_TYPE_LABELS[flag.price_type] || flag.price_type}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Reported {formatDate(flag.created_at)}
                    {flag.email && ` by ${flag.email}`}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded p-3">
                  <p className="text-xs text-muted-foreground">
                    Listed Price (at report time)
                  </p>
                  <p className="text-lg font-semibold">
                    {flag.current_price === 0
                      ? "Free"
                      : `$${flag.current_price}`}
                  </p>
                </div>
                <div className="bg-amber-500/10 rounded p-3">
                  <p className="text-xs text-muted-foreground">Reported Price</p>
                  <p className="text-lg font-semibold text-amber-700 dark:text-amber-400">
                    {flag.reported_price !== null &&
                    flag.reported_price !== undefined
                      ? flag.reported_price === 0
                        ? "Free"
                        : `$${flag.reported_price}`
                      : "Not specified"}
                  </p>
                </div>
              </div>

              {flag.source_url && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Source: </span>
                  <a
                    href={flag.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {flag.source_url}
                  </a>
                </div>
              )}

              {flag.comment && (
                <div className="bg-muted/50 rounded p-3">
                  <p className="text-xs text-muted-foreground mb-1">Comment:</p>
                  <p className="text-sm">{flag.comment}</p>
                </div>
              )}

              <div className="flex items-end gap-3 pt-2 border-t">
                <div className="flex-1 max-w-[200px]">
                  <Label htmlFor={`price-${flag.id}`} className="text-xs">
                    Verified New Price ($)
                  </Label>
                  <Input
                    id={`price-${flag.id}`}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Enter verified price"
                    value={verifyPrices[flag.id!] || ""}
                    onChange={(e) =>
                      setVerifyPrices({
                        ...verifyPrices,
                        [flag.id!]: e.target.value,
                      })
                    }
                  />
                </div>
                <Button
                  size="sm"
                  onClick={() => handleVerify(flag.id!)}
                  disabled={processingId === flag.id}
                >
                  {processingId === flag.id ? "..." : "Verify & Update"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDismiss(flag.id!)}
                  disabled={processingId === flag.id}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
