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
import { Edit02Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { CATEGORIES, type Category } from "@/lib/categories";
import { PLATFORMS, type Platform } from "@/lib/platforms";
import type { Tool } from "@/types/tool";

interface SuggestEditButtonProps {
  tool: Tool;
}

export function SuggestEditButton({ tool }: SuggestEditButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    suggested_name: "",
    suggested_description: "",
    suggested_url: "",
    suggested_price: "",
    suggested_category: "" as Category | "",
    suggested_platform: "" as Platform | "",
    reason: "",
    email: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/edit-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool_id: tool.id,
          suggested_name: formData.suggested_name || undefined,
          suggested_description: formData.suggested_description || undefined,
          suggested_url: formData.suggested_url || undefined,
          suggested_price: formData.suggested_price
            ? parseFloat(formData.suggested_price)
            : undefined,
          suggested_category: formData.suggested_category || undefined,
          suggested_platform: formData.suggested_platform || undefined,
          reason: formData.reason,
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
        err instanceof Error ? err.message : "Failed to submit suggestion"
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
        suggested_name: "",
        suggested_description: "",
        suggested_url: "",
        suggested_price: "",
        suggested_category: "",
        suggested_platform: "",
        reason: "",
        email: "",
      });
    }, 200);
  };

  return (
    <>
      <Button
      disabled
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="gap-2"
      >
        <HugeiconsIcon icon={Edit02Icon} size={14} />
        Suggest an Edit
      </Button>

      <AlertDialog open={isOpen} onOpenChange={handleClose}>
        <AlertDialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>Suggest an Edit for {tool.name}</AlertDialogTitle>
            <AlertDialogDescription>
              Fill in only the fields you want to change. Leave others blank.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {submitted ? (
            <div className="py-8 text-center">
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                size={48}
                className="mx-auto text-green-500 mb-4"
              />
              <p className="font-medium">Thank you for your suggestion!</p>
              <p className="text-sm text-muted-foreground mt-2">
                We will review your suggestion and update the listing if
                appropriate.
              </p>
              <Button onClick={handleClose} className="mt-4">
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="suggested_name">Name</Label>
                <Input
                  id="suggested_name"
                  value={formData.suggested_name}
                  onChange={(e) =>
                    setFormData({ ...formData, suggested_name: e.target.value })
                  }
                  placeholder={tool.name}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="suggested_description">Description</Label>
                <Textarea
                  id="suggested_description"
                  value={formData.suggested_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      suggested_description: e.target.value,
                    })
                  }
                  placeholder={tool.description}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="suggested_url">Website URL</Label>
                <Input
                  id="suggested_url"
                  type="url"
                  value={formData.suggested_url}
                  onChange={(e) =>
                    setFormData({ ...formData, suggested_url: e.target.value })
                  }
                  placeholder={tool.url}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="suggested_price">Price ($)</Label>
                  <Input
                    id="suggested_price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.suggested_price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        suggested_price: e.target.value,
                      })
                    }
                    placeholder={String(tool.price)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={formData.suggested_category}
                    onValueChange={(v) =>
                      setFormData({
                        ...formData,
                        suggested_category: (v as Category) || "",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={tool.category} />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Platform</Label>
                  <Select
                    value={formData.suggested_platform}
                    onValueChange={(v) =>
                      setFormData({
                        ...formData,
                        suggested_platform: (v as Platform) || "",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={tool.platform} />
                    </SelectTrigger>
                    <SelectContent>
                      {PLATFORMS.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">
                  Why are you suggesting this change? *
                </Label>
                <Textarea
                  id="reason"
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  placeholder="e.g., The price changed, the URL is incorrect, etc."
                  rows={2}
                  required
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
                  placeholder="For follow-up notifications"
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
                  {loading ? "Submitting..." : "Submit Suggestion"}
                </Button>
              </AlertDialogFooter>
            </form>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
