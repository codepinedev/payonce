import type { Tool } from "@/types/tool";
import toolsData from "@/data/tools.json";

const tools = toolsData as Tool[];

export async function getAllTools(): Promise<Tool[]> {
  return tools;
}

export async function getFeaturedTools(): Promise<Tool[]> {
  return tools.filter((tool) => tool.featured);
}

export async function getToolBySlug(slug: string): Promise<Tool | undefined> {
  return tools.find((tool) => tool.slug === slug);
}

export async function getToolsByCategory(category: string): Promise<Tool[]> {
  if (category === "all") return tools;
  return tools.filter((tool) => tool.category === category);
}

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
