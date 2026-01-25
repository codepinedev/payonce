import { NextRequest, NextResponse } from "next/server";
import {
  validateAdminToken,
  setAdminCookie,
  clearAdminCookie,
} from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      );
    }

    if (!validateAdminToken(token)) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    const response = NextResponse.json(
      { success: true, message: "Authenticated successfully" },
      { status: 200 }
    );

    setAdminCookie(response);

    return response;
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: "An error occurred during authentication" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Create response
    const response = NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 }
    );

    clearAdminCookie(response);

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "An error occurred during logout" },
      { status: 500 }
    );
  }
}
