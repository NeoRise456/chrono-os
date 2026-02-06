import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const protectedRoutes = ["/habits", "/todos", "/schedule", "/goals", "/settings", "/profile"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtected) {
    const sessionCookie = getSessionCookie(request);

    if (!sessionCookie) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/habits/:path*", "/todos/:path*", "/schedule/:path*", "/goals/:path*", "/settings/:path*", "/profile/:path*"],
};
