import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { generateSlug, ensureUniqueSlug } from "@/lib/slug";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids, action } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "IDs array is required" },
        { status: 400 }
      );
    }

    if (!action || !["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Action must be 'approve' or 'reject'" },
        { status: 400 }
      );
    }

    let successCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    if (action === "approve") {
      // Process each submission for approval
      for (const id of ids) {
        try {
          // Get the submission
          const { data: submission, error: fetchError } = await supabaseAdmin
            .from("submissions")
            .select("*")
            .eq("id", id)
            .single();

          if (fetchError || !submission || submission.status !== "pending") {
            failedCount++;
            errors.push(`Submission ${id}: not found or not pending`);
            continue;
          }

          const baseSlug = generateSlug(submission.name);
          const uniqueSlug = await ensureUniqueSlug(baseSlug);

          const { error: toolError } = await supabaseAdmin
            .from("tools")
            .insert({
              id: crypto.randomUUID(),
              slug: uniqueSlug,
              name: submission.name,
              description: submission.name,
              category: submission.category,
              price: submission.price,
              platform: submission.platform,
              url: submission.url,
              featured: false,
              created_at: new Date().toISOString(),
              verified_at: new Date().toISOString(),
            });

          if (toolError) {
            failedCount++;
            errors.push(`Submission ${id}: failed to create tool`);
            continue;
          }

          // Update submission status
          await supabaseAdmin
            .from("submissions")
            .update({ status: "approved" })
            .eq("id", id);

          successCount++;
        } catch (err) {
          failedCount++;
          errors.push(`Submission ${id}: ${err instanceof Error ? err.message : "unknown error"}`);
        }
      }
    } else if (action === "reject") {
      // Bulk reject submissions
      const { error: updateError } = await supabaseAdmin
        .from("submissions")
        .update({ status: "rejected" })
        .in("id", ids)
        .eq("status", "pending");

      if (updateError) {
        return NextResponse.json(
          { error: "Failed to reject submissions" },
          { status: 500 }
        );
      }

      successCount = ids.length;
    }

    return NextResponse.json(
      {
        success: true,
        successCount,
        failedCount,
        errors: errors.length > 0 ? errors : undefined,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing bulk action:", error);
    return NextResponse.json(
      { error: "An error occurred while processing bulk action" },
      { status: 500 }
    );
  }
}
