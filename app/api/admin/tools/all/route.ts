import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabaseAdmin
      .from("tools")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching tools:", error);
      return NextResponse.json(
        { error: "Failed to fetch tools" },
        { status: 500 }
      );
    }

    return NextResponse.json({ tools: data || [] }, { status: 200 });
  } catch (error) {
    console.error("Error fetching tools:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching tools" },
      { status: 500 }
    );
  }
}
