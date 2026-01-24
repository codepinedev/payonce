import type { Category } from "@/lib/categories";
import type { Platform } from "@/lib/platforms";

export interface Tool {
  id: string;
  slug: string;
  name: string;
  description: string;
  fullDescription?: string;
  category: Category;
  price: number;
  platform: Platform;
  url: string;
  logoUrl?: string;
  featured: boolean;
  createdAt: string;
  verifiedAt: string;
}
