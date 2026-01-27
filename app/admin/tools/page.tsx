"use client";

import { useState, useEffect } from "react";
import { Tool } from "@/types/tool";
import { ToolsTable } from "@/components/admin/tools-table";
import { ToolEditDialog } from "@/components/admin/tool-edit-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ManageToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchTools = async () => {
    try {
      const response = await fetch("/api/admin/tools/all");
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to fetch tools");
        return;
      }

      // Map database fields to camelCase
      const mappedTools = data.tools.map((tool: any) => ({
        id: tool.id,
        slug: tool.slug,
        name: tool.name,
        description: tool.description,
        fullDescription: tool.full_description,
        category: tool.category,
        price: tool.price,
        platform: tool.platform,
        url: tool.url,
        logoUrl: tool.logo_url,
        featured: tool.featured,
        editorsPick: tool.editors_pick,
        verifiedOneTime: tool.verified_one_time,
        createdAt: tool.created_at,
        verifiedAt: tool.verified_at,
      }));

      setTools(mappedTools);
      setFilteredTools(mappedTools);
    } catch (err) {
      setError("An error occurred while fetching tools");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredTools(tools);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = tools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(query) ||
        tool.slug.toLowerCase().includes(query) ||
        tool.category.toLowerCase().includes(query) ||
        tool.platform.toLowerCase().includes(query)
    );
    setFilteredTools(filtered);
  }, [searchQuery, tools]);

  const handleEdit = (tool: Tool) => {
    setEditingTool(tool);
  };

  const handleSaveEdit = async (id: string, data: Partial<Tool>) => {
    const response = await fetch(`/api/admin/tools/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to update tool");
    }

    // Update local state
    setTools(
      tools.map((t) =>
        t.id === id ? { ...t, ...data } : t
      )
    );
  };

  const handleDelete = async (id: string) => {
    const response = await fetch(`/api/admin/tools/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to delete tool");
    }

    // Remove from local state
    setTools(tools.filter((t) => t.id !== id));
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading tools...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <Button onClick={fetchTools} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Manage Tools</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {tools.length} tool{tools.length !== 1 ? "s" : ""} in directory
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
          <Button onClick={fetchTools} variant="outline">
            Refresh
          </Button>
        </div>
      </div>

      {filteredTools.length === 0 && searchQuery ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No tools found matching &quot;{searchQuery}&quot;
          </p>
        </div>
      ) : (
        <ToolsTable
          tools={filteredTools}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <ToolEditDialog
        tool={editingTool}
        isOpen={!!editingTool}
        onClose={() => setEditingTool(null)}
        onSave={handleSaveEdit}
      />
    </div>
  );
}
