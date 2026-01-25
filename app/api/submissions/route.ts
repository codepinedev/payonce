import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import type { SubmissionInsert } from "@/types/submission";

export async function POST(request: Request) {
  try {
    const body: SubmissionInsert = await request.json();

    if (!body.name || !body.url || !body.category || !body.platform) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    try {
      new URL(body.url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    // Insert submission into Supabase
    const { data, error } = await supabaseAdmin
      .from("submissions")
      .insert({
        name: body.name,
        url: body.url,
        category: body.category,
        platform: body.platform,
        price: body.price || 0,
        email: body.email || null,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to submit tool" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
