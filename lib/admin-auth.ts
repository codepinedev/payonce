import { NextRequest, NextResponse } from "next/server";

const ADMIN_COOKIE_NAME = "admin_token";

/**
 * Validates if the provided token matches the admin secret
 */
export function validateAdminToken(token: string): boolean {
  const adminSecret = process.env.ADMIN_SECRET;

  if (!adminSecret) {
    console.error("ADMIN_SECRET environment variable is not set");
    return false;
  }

  return token === adminSecret;
}

/**
 * Sets the admin authentication cookie
 */
export function setAdminCookie(response: NextResponse): void {
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: "authenticated",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

/**
 * Clears the admin authentication cookie
 */
export function clearAdminCookie(response: NextResponse): void {
  response.cookies.delete(ADMIN_COOKIE_NAME);
}

/**
 * Checks if the request has a valid admin cookie
 */
export function hasAdminCookie(request: NextRequest): boolean {
  return request.cookies.has(ADMIN_COOKIE_NAME);
}

/**
 * Gets the admin cookie name (useful for client-side checks)
 */
export function getAdminCookieName(): string {
  return ADMIN_COOKIE_NAME;
}
