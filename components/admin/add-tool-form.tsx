"use client";

import { useState, useEffect } from "react";
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
import { CATEGORIES, Category } from "@/lib/categories";
import { PLATFORMS, Platform } from "@/lib/platforms";
import { generateSlug } from "@/lib/slug";

interface AddToolFormProps {
  onSuccess: () => void;
}

export function AddToolForm({ onSuccess }: AddToolFormProps) {
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
  const [slugTouched, setSlugTouched] = useState(false);

  // Auto-generate slug from name
  useEffect(() => {
    if (formData.name && !slugTouched) {
      const generatedSlug = generateSlug(formData.name);
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.name, slugTouched]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create tool");
        setLoading(false);
        return;
      }

      // Reset form
      setFormData({
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
      setSlugTouched(false);
      onSuccess();
    } catch (err) {
      setError("An error occurred while creating the tool");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Tool Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">
              Slug (URL-friendly) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => {
                setSlugTouched(true);
                setFormData({ ...formData, slug: e.target.value });
              }}
              placeholder="my-cool-tool"
              required
            />
            <p className="text-xs text-muted-foreground">
              Auto-generated from name. Edit if needed.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">
              Website URL <span className="text-red-500">*</span>
            </Label>
            <Input
              id="url"
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logoUrl">Logo URL (optional)</Label>
            <Input
              id="logoUrl"
              type="url"
              value={formData.logoUrl}
              onChange={(e) =>
                setFormData({ ...formData, logoUrl: e.target.value })
              }
              placeholder="https://example.com/logo.png"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">
              Category <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value ?? "" })
              }
              required
            >
              <SelectTrigger id="category">
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
            <Label htmlFor="platform">
              Platform <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.platform}
              onValueChange={(value) =>
                setFormData({ ...formData, platform: value ?? "" })
              }
              required
            >
              <SelectTrigger id="platform">
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
            <Label htmlFor="price">
              Price (USD) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="price"
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
            <p className="text-xs text-muted-foreground">Enter 0 for free tools</p>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">
              Short Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              placeholder="Brief description for listings"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullDescription">Full Description (optional)</Label>
            <Textarea
              id="fullDescription"
              value={formData.fullDescription}
              onChange={(e) =>
                setFormData({ ...formData, fullDescription: e.target.value })
              }
              rows={5}
              placeholder="Detailed description for tool page"
            />
          </div>

          <div className="space-y-3 pt-2">
            <Label>Special Flags</Label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                  className="rounded"
                />
                <span className="text-sm">Featured (show on homepage)</span>
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
                <span className="text-sm">Editor&apos;s Pick badge</span>
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
                <span className="text-sm">Verified One-Time Payment badge</span>
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
                <span className="text-sm">Community Suggested badge</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setFormData({
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
            setSlugTouched(false);
            setError("");
          }}
          disabled={loading}
        >
          Clear Form
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Creating Tool..." : "Create Tool"}
        </Button>
      </div>
    </form>
  );
}
