export type PriceChangeType = "higher" | "lower" | "subscription" | "discontinued" | "unknown";

export interface PricingFlag {
  id?: string;
  tool_id: string;
  current_price: number;
  reported_price?: number | null;
  price_type?: PriceChangeType;
  source_url?: string;
  comment?: string;
  email?: string;
  status: "pending" | "verified" | "dismissed";
  admin_notes?: string;
  reviewed_at?: string;
  created_at?: string;
}

export type PricingFlagInsert = Omit<
  PricingFlag,
  "id" | "status" | "admin_notes" | "reviewed_at" | "created_at" | "current_price"
>;

export interface PricingFlagWithTool extends PricingFlag {
  tool: {
    id: string;
    name: string;
    slug: string;
    url: string;
    price: number;
  };
}
