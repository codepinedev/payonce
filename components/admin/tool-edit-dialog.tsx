"use client";

import { useState, useEffect } from "react";
import { Tool } from "@/types/tool";
import { Category } from "@/lib/categories";
import { Platform } from "@/lib/platforms";
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
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { CATEGORIES } from "@/lib/categories";
import { PLATFORMS } from "@/lib/platforms";

interface ToolEditDialogProps {
  tool: Tool | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: Partial<Tool>) => Promise<void>;
}

export function ToolEditDialog({
  tool,
  isOpen,
  onClose,
  onSave,
}: ToolEditDialogProps) {
  const [formData, setFormData] = useState<{
    name: string;
    slug: string;
    description: string;
    fullDescription: string;
    category: Category | "";
    platform: Platform | "";
    price: number;
    url: string;
    logoUrl: string;
    featured: boolean;
    editorsPick: boolean;
    verifiedOneTime: boolean;
    communityRecommended: boolean;
  }>({
    name: "",
    slug: "",
    description: "",
    fullDescription: "",
    category: "",
    platform: "",
    price: 0,
    url: "",
    logoUrl: "",
    featured: false,
    editorsPick: false,
    verifiedOneTime: false,
    communityRecommended: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (tool) {
      setFormData({
        name: tool.name,
        slug: tool.slug,
        description: tool.description,
        fullDescription: tool.fullDescription || "",
        category: tool.category,
        platform: tool.platform,
        price: tool.price,
        url: tool.url,
        logoUrl: tool.logoUrl || "",
        featured: tool.featured,
        editorsPick: tool.editorsPick || false,
        verifiedOneTime: tool.verifiedOneTime || false,
        communityRecommended: tool.communityRecommended || false,
      });
      setError("");
    }
  }, [tool]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tool) return;

    setLoading(true);
    setError("");

    try {
      // Create properly typed data object
      const updateData: Partial<Tool> = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        fullDescription: formData.fullDescription || undefined,
        category: formData.category as Category,
        platform: formData.platform as Platform,
        price: formData.price,
        url: formData.url,
        logoUrl: formData.logoUrl || undefined,
        featured: formData.featured,
        editorsPick: formData.editorsPick,
        verifiedOneTime: formData.verifiedOneTime,
        communityRecommended: formData.communityRecommended,
      };

      await onSave(tool.id, updateData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update tool");
    } finally {
      setLoading(false);
    }
  };

  if (!tool) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="min-w-4xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Tool</AlertDialogTitle>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Tool Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-slug">Slug</Label>
              <Input
                id="edit-slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-url">Website URL</Label>
            <Input
              id="edit-url"
              type="url"
              value={formData.url}
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-logoUrl">Logo URL</Label>
            <Input
              id="edit-logoUrl"
              type="url"
              value={formData.logoUrl}
              onChange={(e) =>
                setFormData({ ...formData, logoUrl: e.target.value })
              }
              placeholder="Optional"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Short Description</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={2}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-fullDescription">Full Description</Label>
            <Textarea
              id="edit-fullDescription"
              value={formData.fullDescription}
              onChange={(e) =>
                setFormData({ ...formData, fullDescription: e.target.value })
              }
              rows={4}
              placeholder="Optional"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value ?? "" })
                }
              >
                <SelectTrigger id="edit-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-platform">Platform</Label>
              <Select
                value={formData.platform}
                onValueChange={(value) =>
                  setFormData({ ...formData, platform: value ?? "" })
                }
              >
                <SelectTrigger id="edit-platform">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map((platform) => (
                    <SelectItem key={platform} value={platform}>
                      {platform}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-price">Price (USD)</Label>
              <Input
                id="edit-price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-border">
            <Label>Special Flags</Label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                  className="rounded"
                />
                <span className="text-sm">Featured</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.editorsPick}
                  onChange={(e) =>
                    setFormData({ ...formData, editorsPick: e.target.checked })
                  }
                  className="rounded"
                />
                <span className="text-sm">Editor&apos;s Pick</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.verifiedOneTime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      verifiedOneTime: e.target.checked,
                    })
                  }
                  className="rounded"
                />
                <span className="text-sm">Verified One-Time</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.communityRecommended}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      communityRecommended: e.target.checked,
                    })
                  }
                  className="rounded"
                />
                <span className="text-sm">Community Suggested</span>
              </label>
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <AlertDialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
