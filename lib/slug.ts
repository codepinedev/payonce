import { supabaseAdmin } from "./supabase";

/**
 * Generates a URL-safe slug from a string
 * Example: "My Cool Tool!" → "my-cool-tool"
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special chars
    .replace(/\s+/g, "-") // Spaces to hyphens
    .replace(/-+/g, "-") // Collapse multiple hyphens
    .replace(/^-|-$/g, ""); // Trim hyphens from edges
}

/**
 * Checks if a slug is unique in the tools table
 */
export async function checkSlugUnique(slug: string): Promise<boolean> {
  try {
    const { count, error } = await supabaseAdmin
      .from("tools")
      .select("*", { count: "exact", head: true })
      .eq("slug", slug);

    if (error) {
      console.error("Error checking slug uniqueness:", error);
      return false;
    }

    return count === 0;
  } catch (error) {
    console.error("Error checking slug uniqueness:", error);
    return false;
  }
}

/**
 * Ensures a slug is unique by adding a numeric suffix if needed
 * Example: "my-tool" → "my-tool-2" if "my-tool" exists
 */
export async function ensureUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let counter = 2;

  while (!(await checkSlugUnique(slug))) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}
