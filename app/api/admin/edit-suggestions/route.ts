import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "pending";

    const { data, error } = await supabaseAdmin
      .from("tool_edit_suggestions")
      .select(
        `
        *,
        tool:tools (
          id,
          name,
          slug,
          description,
          full_description,
          url,
          price,
          category,
          platform,
          logo_url
        )
      `
      )
      .eq("status", status)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching suggestions:", error);
      return NextResponse.json(
        { error: "Failed to fetch suggestions" },
        { status: 500 }
      );
    }

    return NextResponse.json({ suggestions: data || [] }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
