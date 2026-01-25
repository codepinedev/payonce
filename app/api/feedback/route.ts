import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import type { FeedbackInsert } from "@/types/feedback";

export async function POST(request: Request) {
  try {
    const body: FeedbackInsert = await request.json();

    if (!body.tool_id || typeof body.useful !== "boolean") {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("feedback")
      .insert({
        tool_id: body.tool_id,
        useful: body.useful,
        comment: body.comment || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to submit feedback" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error("Feedback error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const toolId = searchParams.get("tool_id");

    if (!toolId) {
      return NextResponse.json(
        { error: "tool_id is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("feedback")
      .select("useful")
      .eq("tool_id", toolId);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch feedback" },
        { status: 500 }
      );
    }

    const stats = {
      total: data.length,
      useful: data.filter((f) => f.useful).length,
      notUseful: data.filter((f) => !f.useful).length,
    };

    return NextResponse.json({ success: true, stats }, { status: 200 });
  } catch (error) {
    console.error("Feedback error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
