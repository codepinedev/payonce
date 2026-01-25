import { NextRequest, NextResponse } from "next/server";
import { hasAdminCookie } from "./lib/admin-auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith("/admin")) {
    // Allow access to login page
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    // Check for admin cookie
    if (!hasAdminCookie(request)) {
      // Redirect to login if not authenticated
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect /api/admin routes
  if (pathname.startsWith("/api/admin")) {
    // Allow auth endpoint
    if (pathname === "/api/admin/auth") {
      return NextResponse.next();
    }

    // Check for admin cookie
    if (!hasAdminCookie(request)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
