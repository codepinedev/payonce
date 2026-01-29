import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { generateSlug, ensureUniqueSlug } from "@/lib/slug";
import { sendApprovalNotification } from "@/lib/email";

export async function PATCH(
  request: NextRequest,
{ params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action, data } = body;

    if (!action) {
      return NextResponse.json(
        { error: "Action is required" },
        { status: 400 }
      );
    }

    const { data: submission, error: fetchError } = await supabaseAdmin
      .from("submissions")
      .select("*")
      .eq("id", id)
      .single();

      console.log(fetchError)

    if (fetchError || !submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    if (submission.status !== "pending") {
      return NextResponse.json(
        { error: "Submission is not pending" },
        { status: 400 }
      );
    }

    // Handle different actions
    if (action === "approve") {
      // Generate slug from name
      const baseSlug = generateSlug(submission.name);
      const uniqueSlug = await ensureUniqueSlug(baseSlug);

      // Create tool from submission
      const { data: tool, error: toolError } = await supabaseAdmin
        .from("tools")
        .insert({
          id: crypto.randomUUID(),
          slug: uniqueSlug,
          name: submission.name,
          description: submission.name, // Use name as placeholder description
          category: submission.category,
          price: submission.price,
          platform: submission.platform,
          url: submission.url,
          featured: false,
          community_recommended: true, // Mark as community suggested
          created_at: new Date().toISOString(),
          verified_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (toolError) {
        console.error("Error creating tool:", toolError);
        return NextResponse.json(
          { error: "Failed to create tool" },
          { status: 500 }
        );
      }

      // Update submission status to approved
      const { error: updateError } = await supabaseAdmin
        .from("submissions")
        .update({ status: "approved" })
        .eq("id", id);

      if (updateError) {
        console.error("Error updating submission:", updateError);
        // Tool was created but submission status update failed
        // Consider this a partial success
      }

      // Send approval notification email
      if (submission.email) {
        const emailResult = await sendApprovalNotification(submission.email, {
          toolName: submission.name,
          toolSlug: uniqueSlug,
        });

        if (emailResult.success) {
          console.log(`Approval email sent to ${submission.email}`);
        } else {
          console.warn(`Failed to send approval email: ${emailResult.error}`);
        }
      }

      return NextResponse.json(
        { success: true, message: "Submission approved", tool },
        { status: 200 }
      );
    } else if (action === "reject") {
      // Update submission status to rejected
      const { error: updateError } = await supabaseAdmin
        .from("submissions")
        .update({ status: "rejected" })
        .eq("id", id);

      if (updateError) {
        console.error("Error rejecting submission:", updateError);
        return NextResponse.json(
          { error: "Failed to reject submission" },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { success: true, message: "Submission rejected" },
        { status: 200 }
      );
    } else if (action === "update") {
      // Update submission data before approval
      if (!data) {
        return NextResponse.json(
          { error: "Data is required for update action" },
          { status: 400 }
        );
      }

      const { error: updateError } = await supabaseAdmin
        .from("submissions")
        .update({
          name: data.name,
          url: data.url,
          category: data.category,
          platform: data.platform,
          price: data.price,
        })
        .eq("id", id);

      if (updateError) {
        console.error("Error updating submission:", updateError);
        return NextResponse.json(
          { error: "Failed to update submission" },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { success: true, message: "Submission updated" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error processing submission:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the submission" },
      { status: 500 }
    );
  }
}
