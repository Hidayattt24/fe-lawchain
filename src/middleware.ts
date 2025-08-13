import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Allow all requests to proceed normally
  // The splash screen logic is handled on the client side
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - logo.svg (logo file)
     * - logo-1.svg (logo file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|logo.svg|logo-1.svg).*)",
  ],
};
