import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "pending";

    const { data, error } = await supabaseAdmin
      .from("pricing_flags")
      .select(
        `
        *,
        tool:tools (
          id,
          name,
          slug,
          url,
          price
        )
      `
      )
      .eq("status", status)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching pricing flags:", error);
      return NextResponse.json(
        { error: "Failed to fetch pricing flags" },
        { status: 500 }
      );
    }

    return NextResponse.json({ flags: data || [] }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
