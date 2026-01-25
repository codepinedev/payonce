import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { checkSlugUnique } from "@/lib/slug";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      description,
      fullDescription,
      category,
      platform,
      price,
      url,
      logoUrl,
      featured,
      editorsPick,
      verifiedOneTime,
    } = body;

    // Validate required fields
    if (!name || !slug || !description || !category || !platform || price === undefined || !url) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    const isUnique = await checkSlugUnique(slug);
    if (!isUnique) {
      return NextResponse.json(
        { error: "Slug already exists. Please use a different slug." },
        { status: 400 }
      );
    }

    // Create the tool
    const { data: tool, error: insertError } = await supabaseAdmin
      .from("tools")
      .insert({
        id: crypto.randomUUID(),
        slug,
        name,
        description,
        full_description: fullDescription || null,
        category,
        price,
        platform,
        url,
        logo_url: logoUrl || null,
        featured: featured || false,
        editors_pick: editorsPick || false,
        verified_one_time: verifiedOneTime || false,
        created_at: new Date().toISOString(),
        verified_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error creating tool:", insertError);
      return NextResponse.json(
        { error: "Failed to create tool" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Tool created successfully", tool },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating tool:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the tool" },
      { status: 500 }
    );
  }
}
