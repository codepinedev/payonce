import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendContributionThankYou } from "@/lib/email";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action, admin_notes } = body;

    if (!action || !["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Valid action is required (approve or reject)" },
        { status: 400 }
      );
    }

    // Fetch the suggestion
    const { data: suggestion, error: fetchError } = await supabaseAdmin
      .from("tool_edit_suggestions")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !suggestion) {
      return NextResponse.json(
        { error: "Suggestion not found" },
        { status: 404 }
      );
    }

    if (suggestion.status !== "pending") {
      return NextResponse.json(
        { error: "Suggestion already processed" },
        { status: 400 }
      );
    }

    if (action === "approve") {
      // Build update object with only the suggested changes
      const updateData: Record<string, unknown> = {};

      if (suggestion.suggested_name)
        updateData.name = suggestion.suggested_name;
      if (suggestion.suggested_description)
        updateData.description = suggestion.suggested_description;
      if (suggestion.suggested_full_description)
        updateData.full_description = suggestion.suggested_full_description;
      if (suggestion.suggested_url) updateData.url = suggestion.suggested_url;
      if (suggestion.suggested_price !== null)
        updateData.price = suggestion.suggested_price;
      if (suggestion.suggested_category)
        updateData.category = suggestion.suggested_category;
      if (suggestion.suggested_platform)
        updateData.platform = suggestion.suggested_platform;
      if (suggestion.suggested_logo_url)
        updateData.logo_url = suggestion.suggested_logo_url;

      // Update verified_at timestamp
      updateData.verified_at = new Date().toISOString();

      // Apply changes to tool
      const { error: toolUpdateError } = await supabaseAdmin
        .from("tools")
        .update(updateData)
        .eq("id", suggestion.tool_id);

      if (toolUpdateError) {
        console.error("Error updating tool:", toolUpdateError);
        return NextResponse.json(
          { error: "Failed to apply changes" },
          { status: 500 }
        );
      }
    }

    // Update suggestion status
    const { error: updateError } = await supabaseAdmin
      .from("tool_edit_suggestions")
      .update({
        status: action === "approve" ? "approved" : "rejected",
        admin_notes: admin_notes || null,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      console.error("Error updating suggestion:", updateError);
      return NextResponse.json(
        { error: "Failed to update suggestion status" },
        { status: 500 }
      );
    }

    // Send thank you email on approval
    if (action === "approve" && suggestion.email) {
      const { data: tool } = await supabaseAdmin
        .from("tools")
        .select("name, slug")
        .eq("id", suggestion.tool_id)
        .single();

      if (tool) {
        const emailResult = await sendContributionThankYou(suggestion.email, {
          toolName: tool.name,
          toolSlug: tool.slug,
          contributionType: "edit",
        });

        if (emailResult.success) {
          console.log(`Thank you email sent to ${suggestion.email}`);
        } else {
          console.warn(`Failed to send thank you email: ${emailResult.error}`);
        }
      }
    }

    return NextResponse.json(
      { success: true, message: `Suggestion ${action}d successfully` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
