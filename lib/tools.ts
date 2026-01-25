import type { Tool } from "@/types/tool";
import { supabaseAdmin } from "@/lib/supabase";

export async function getAllTools(): Promise<Tool[]> {
  const { data, error } = await supabaseAdmin
    .from("tools")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching tools:", error);
    return [];
  }

  return mapTools(data);
}

export async function getFeaturedTools(): Promise<Tool[]> {
  const { data, error } = await supabaseAdmin
    .from("tools")
    .select("*")
    .eq("featured", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching featured tools:", error);
    return [];
  }

  return mapTools(data);
}

export async function getToolBySlug(slug: string): Promise<Tool | undefined> {
  const { data, error } = await supabaseAdmin
    .from("tools")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching tool:", error);
    return undefined;
  }

  return mapTool(data);
}

export async function getToolsByCategory(category: string): Promise<Tool[]> {
  if (category === "all") return getAllTools();

  const { data, error } = await supabaseAdmin
    .from("tools")
    .select("*")
    .eq("category", category)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching tools by category:", error);
    return [];
  }

  return mapTools(data);
}

// Client-side filtering functions (for already fetched data)
export function searchTools(tools: Tool[], query: string): Tool[] {
  const lowerQuery = query.toLowerCase();
  return tools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(lowerQuery) ||
      tool.description.toLowerCase().includes(lowerQuery) ||
      tool.category.toLowerCase().includes(lowerQuery)
  );
}

export function filterToolsByCategory(tools: Tool[], category: string): Tool[] {
  if (category === "all") return tools;
  return tools.filter((tool) => tool.category === category);
}

export async function getToolCount(): Promise<number> {
  const { count, error } = await supabaseAdmin
    .from("tools")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("Error fetching tool count:", error);
    return 0;
  }

  return count || 0;
}

// Map database row to Tool type
function mapTool(row: Record<string, unknown>): Tool {
  return {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    description: row.description as string,
    fullDescription: row.full_description as string | undefined,
    category: row.category as Tool["category"],
    price: row.price as number,
    platform: row.platform as Tool["platform"],
    url: row.url as string,
    logoUrl: row.logo_url as string | undefined,
    featured: row.featured as boolean,
    editorsPick: row.editors_pick as boolean | undefined,
    verifiedOneTime: row.verified_one_time as boolean | undefined,
    createdAt: row.created_at as string,
    verifiedAt: row.verified_at as string,
  };
}

function mapTools(rows: Record<string, unknown>[]): Tool[] {
  return rows.map(mapTool);
}
