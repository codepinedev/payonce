"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES } from "@/lib/categories";
import { PLATFORMS } from "@/lib/platforms";
import { SuccessState } from "@/components/success-state";

export function SubmitForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [platform, setPlatform] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setLoading(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <SuccessState
        onReset={() => {
          setSubmitted(false);
          setCategory("");
          setPlatform("");
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Tool name</Label>
        <Input id="name" name="name" required className="mt-1" />
      </div>

      <div>
        <Label htmlFor="url">Website URL</Label>
        <Input
          id="url"
          name="url"
          type="url"
          placeholder="https://"
          required
          className="mt-1"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Category</Label>
          <Select value={category} onValueChange={(v) => v && setCategory(v)} required>
            <SelectTrigger className="mt-1 w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Platform</Label>
          <Select value={platform} onValueChange={(v) => v && setPlatform(v)} required>
            <SelectTrigger className="mt-1 w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {PLATFORMS.map((plat) => (
                <SelectItem key={plat} value={plat}>
                  {plat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="price">Price (USD)</Label>
        <Input
          id="price"
          name="price"
          type="number"
          min={0}
          placeholder="0"
          required
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="email">Your email (optional)</Label>
        <Input id="email" name="email" type="email" className="mt-1" />
        <p className="mt-1 text-xs text-muted-foreground">
          Only used to notify if listed
        </p>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "..." : "Submit"}
      </Button>
    </form>
  );
}
