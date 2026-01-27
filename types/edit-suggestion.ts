import type { Category } from "@/lib/categories";
import type { Platform } from "@/lib/platforms";

export interface EditSuggestion {
  id?: string;
  tool_id: string;
  suggested_name?: string | null;
  suggested_description?: string | null;
  suggested_full_description?: string | null;
  suggested_url?: string | null;
  suggested_price?: number | null;
  suggested_category?: Category | null;
  suggested_platform?: Platform | null;
  suggested_logo_url?: string | null;
  reason: string;
  email?: string;
  status: "pending" | "approved" | "rejected";
  admin_notes?: string;
  reviewed_at?: string;
  created_at?: string;
}

export type EditSuggestionInsert = Omit<
  EditSuggestion,
  "id" | "status" | "admin_notes" | "reviewed_at" | "created_at"
>;

export interface EditSuggestionWithTool extends EditSuggestion {
  tool: {
    id: string;
    name: string;
    slug: string;
    description: string;
    full_description?: string;
    url: string;
    price: number;
    category: Category;
    platform: Platform;
    logo_url?: string;
  };
}
