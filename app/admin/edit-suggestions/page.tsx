"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import type { EditSuggestionWithTool } from "@/types/edit-suggestion";

export default function EditSuggestionsPage() {
  const [suggestions, setSuggestions] = useState<EditSuggestionWithTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/edit-suggestions?status=pending");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch suggestions");
      }

      setSuggestions(data.suggestions || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    setProcessingId(id);
    try {
      const response = await fetch(`/api/admin/edit-suggestions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || `Failed to ${action}`);
      }

      setSuggestions(suggestions.filter((s) => s.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Action failed");
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

  const renderChange = (
    label: string,
    current: string | number | undefined | null,
    suggested: string | number | undefined | null
  ) => {
    if (suggested === null || suggested === undefined) return null;
    return (
      <div className="text-sm">
        <span className="font-medium text-muted-foreground">{label}:</span>{" "}
        <span className="line-through text-red-500/70">{current || "N/A"}</span>{" "}
        <span className="text-green-600">&rarr; {suggested}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading edit suggestions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <Button onClick={fetchSuggestions} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Edit Suggestions</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {suggestions.length} suggestion{suggestions.length !== 1 ? "s" : ""}{" "}
            awaiting review
          </p>
        </div>
        <Button onClick={fetchSuggestions} variant="outline">
          Refresh
        </Button>
      </div>

      {suggestions.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/30">
          <p className="text-muted-foreground">No pending edit suggestions</p>
        </div>
      ) : (
        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="border rounded-lg p-4 bg-card space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/tools/${suggestion.tool?.slug}`}
                      className="font-semibold hover:underline"
                      target="_blank"
                    >
                      {suggestion.tool?.name || "Unknown Tool"}
                    </Link>
                    <Badge variant="outline">Edit Suggestion</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Submitted {formatDate(suggestion.created_at)}
                    {suggestion.email && ` by ${suggestion.email}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleAction(suggestion.id!, "approve")}
                    disabled={processingId === suggestion.id}
                  >
                    {processingId === suggestion.id ? "..." : "Approve"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAction(suggestion.id!, "reject")}
                    disabled={processingId === suggestion.id}
                  >
                    Reject
                  </Button>
                </div>
              </div>

              <div className="bg-muted/50 rounded p-3 space-y-1">
                <p className="text-sm font-medium mb-2">Suggested Changes:</p>
                {renderChange("Name", suggestion.tool?.name, suggestion.suggested_name)}
                {renderChange("Description", suggestion.tool?.description, suggestion.suggested_description)}
                {renderChange("URL", suggestion.tool?.url, suggestion.suggested_url)}
                {renderChange(
                  "Price",
                  suggestion.tool?.price !== undefined ? `$${suggestion.tool.price}` : undefined,
                  suggestion.suggested_price !== null && suggestion.suggested_price !== undefined
                    ? `$${suggestion.suggested_price}`
                    : undefined
                )}
                {renderChange("Category", suggestion.tool?.category, suggestion.suggested_category)}
                {renderChange("Platform", suggestion.tool?.platform, suggestion.suggested_platform)}
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 rounded p-3">
                <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                  Reason:
                </p>
                <p className="text-sm mt-1">{suggestion.reason}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
