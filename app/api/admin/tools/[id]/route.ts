import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { checkSlugUnique } from "@/lib/slug";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Get current tool to check if slug is changing
    const { data: currentTool, error: fetchError } = await supabaseAdmin
      .from("tools")
      .select("slug")
      .eq("id", id)
      .single();

    if (fetchError || !currentTool) {
      return NextResponse.json(
        { error: "Tool not found" },
        { status: 404 }
      );
    }

    // If slug is changing, check uniqueness
    if (body.slug && body.slug !== currentTool.slug) {
      const isUnique = await checkSlugUnique(body.slug);
      if (!isUnique) {
        return NextResponse.json(
          { error: "Slug already exists. Please use a different slug." },
          { status: 400 }
        );
      }
    }

    // Update the tool
    const { data: tool, error: updateError } = await supabaseAdmin
      .from("tools")
      .update({
        slug: body.slug,
        name: body.name,
        description: body.description,
        full_description: body.fullDescription || null,
        category: body.category,
        price: body.price,
        platform: body.platform,
        url: body.url,
        logo_url: body.logoUrl || null,
        featured: body.featured || false,
        editors_pick: body.editorsPick || false,
        verified_one_time: body.verifiedOneTime || false,
        community_recommended: body.communityRecommended || false,
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating tool:", updateError);
      return NextResponse.json(
        { error: "Failed to update tool" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Tool updated successfully", tool },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating tool:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the tool" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { error: deleteError } = await supabaseAdmin
      .from("tools")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Error deleting tool:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete tool" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Tool deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting tool:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the tool" },
      { status: 500 }
    );
  }
}
