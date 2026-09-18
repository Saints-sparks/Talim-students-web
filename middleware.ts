import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("access_token")?.value;
  // T4.6: `/register` used to be whitelisted here, but no such route exists —
  // students are created by their school, never self-registered.
  const isPublicPath = path === "/" || path === "/signin" || path === "/forgot-password";

  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (token && path === "/") {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/signin",
    "/dashboard/:path*",
    "/messages/:path*",
    "/profile/:path*",
    "/onboarding/:path*",
    "/onboarding",
  ],
};
