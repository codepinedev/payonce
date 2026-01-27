import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import type { PricingFlagInsert } from "@/types/pricing-flag";

export async function POST(request: Request) {
  try {
    const body: PricingFlagInsert = await request.json();

    // Validation
    if (!body.tool_id) {
      return NextResponse.json(
        { error: "Tool ID is required" },
        { status: 400 }
      );
    }

    // Verify tool exists and get current price
    const { data: tool, error: toolError } = await supabaseAdmin
      .from("tools")
      .select("id, price")
      .eq("id", body.tool_id)
      .single();

    if (toolError || !tool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 });
    }

    // Validate source URL if provided
    if (body.source_url) {
      try {
        new URL(body.source_url);
      } catch {
        return NextResponse.json(
          { error: "Invalid source URL format" },
          { status: 400 }
        );
      }
    }

    // Insert flag with current price snapshot
    const { data, error } = await supabaseAdmin
      .from("pricing_flags")
      .insert({
        tool_id: body.tool_id,
        current_price: tool.price,
        reported_price: body.reported_price ?? null,
        price_type: body.price_type || null,
        source_url: body.source_url || null,
        comment: body.comment || null,
        email: body.email || null,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to submit pricing flag" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error("Pricing flag error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
