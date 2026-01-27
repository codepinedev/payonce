import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import type { EditSuggestionInsert } from "@/types/edit-suggestion";

export async function POST(request: Request) {
  try {
    const body: EditSuggestionInsert = await request.json();

    // Validation
    if (!body.tool_id || !body.reason) {
      return NextResponse.json(
        { error: "Tool ID and reason are required" },
        { status: 400 }
      );
    }

    // Check at least one field is being suggested
    const hasChanges = [
      body.suggested_name,
      body.suggested_description,
      body.suggested_full_description,
      body.suggested_url,
      body.suggested_price,
      body.suggested_category,
      body.suggested_platform,
      body.suggested_logo_url,
    ].some((v) => v !== undefined && v !== null && v !== "");

    if (!hasChanges) {
      return NextResponse.json(
        { error: "At least one change must be suggested" },
        { status: 400 }
      );
    }

    // Validate URL if provided
    if (body.suggested_url) {
      try {
        new URL(body.suggested_url);
      } catch {
        return NextResponse.json(
          { error: "Invalid URL format" },
          { status: 400 }
        );
      }
    }

    // Verify tool exists
    const { data: tool, error: toolError } = await supabaseAdmin
      .from("tools")
      .select("id")
      .eq("id", body.tool_id)
      .single();

    if (toolError || !tool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 });
    }

    // Insert suggestion
    const { data, error } = await supabaseAdmin
      .from("tool_edit_suggestions")
      .insert({
        tool_id: body.tool_id,
        suggested_name: body.suggested_name || null,
        suggested_description: body.suggested_description || null,
        suggested_full_description: body.suggested_full_description || null,
        suggested_url: body.suggested_url || null,
        suggested_price: body.suggested_price ?? null,
        suggested_category: body.suggested_category || null,
        suggested_platform: body.suggested_platform || null,
        suggested_logo_url: body.suggested_logo_url || null,
        reason: body.reason,
        email: body.email || null,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to submit suggestion" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error("Edit suggestion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
