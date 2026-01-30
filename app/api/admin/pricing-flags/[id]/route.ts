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
    const { action, new_price, admin_notes } = body;

    if (!action || !["verify", "dismiss"].includes(action)) {
      return NextResponse.json(
        { error: "Valid action is required (verify or dismiss)" },
        { status: 400 }
      );
    }

    // Fetch the flag
    const { data: flag, error: fetchError } = await supabaseAdmin
      .from("pricing_flags")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !flag) {
      return NextResponse.json(
        { error: "Pricing flag not found" },
        { status: 404 }
      );
    }

    if (flag.status !== "pending") {
      return NextResponse.json(
        { error: "Flag already processed" },
        { status: 400 }
      );
    }

    if (action === "verify") {
      // Admin must provide the new price when verifying
      if (new_price === undefined || new_price === null) {
        return NextResponse.json(
          { error: "New price is required when verifying" },
          { status: 400 }
        );
      }

      // Update the tool's price
      const { error: toolUpdateError } = await supabaseAdmin
        .from("tools")
        .update({
          price: new_price,
          verified_at: new Date().toISOString(),
        })
        .eq("id", flag.tool_id);

      if (toolUpdateError) {
        console.error("Error updating tool price:", toolUpdateError);
        return NextResponse.json(
          { error: "Failed to update price" },
          { status: 500 }
        );
      }
    }

    // Update flag status
    const { error: updateError } = await supabaseAdmin
      .from("pricing_flags")
      .update({
        status: action === "verify" ? "verified" : "dismissed",
        admin_notes: admin_notes || null,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      console.error("Error updating flag:", updateError);
      return NextResponse.json(
        { error: "Failed to update flag status" },
        { status: 500 }
      );
    }

    // Send thank you email on verification
    if (action === "verify" && flag.email) {
      const { data: tool } = await supabaseAdmin
        .from("tools")
        .select("name, slug")
        .eq("id", flag.tool_id)
        .single();

      if (tool) {
        const emailResult = await sendContributionThankYou(flag.email, {
          toolName: tool.name,
          toolSlug: tool.slug,
          contributionType: "pricing",
        });

        if (emailResult.success) {
          console.log(`Thank you email sent to ${flag.email}`);
        } else {
          console.warn(`Failed to send thank you email: ${emailResult.error}`);
        }
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: `Flag ${action === "verify" ? "verified" : "dismissed"} successfully`,
      },
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
