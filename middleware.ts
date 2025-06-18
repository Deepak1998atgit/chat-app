import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }
  const token = req.cookies.get("authToken")?.value;
  if (token) {
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("Authorization", `Bearer ${token}`);
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }
  return NextResponse.redirect(new URL("/", req.url));
}
export const config = {
  matcher: ["/api/:path*", "/chat"]
};
