// src/proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Proxy untuk proteksi route berdasarkan role
 */

const protectedRoutes = [
  "/petani",
  "/mitra-toko",
  "/kurir",
  "/pembeli",
  "/regulator",
  "/profil",
  "/notifikasi",
];

const publicRoutes = ["/login", "/register", "/forgot-password"];

const roleRouteMap: Record<string, string> = {
  PETANI: "/petani",
  MITRA_TOKO: "/mitra-toko",
  KURIR: "/kurir",
  PEMBELI: "/pembeli",
  REGULATOR: "/regulator",
};

// PERBAIKAN: Ubah nama fungsi dari middleware() menjadi proxy()
export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(route)
  );

  const isPublicRoute = publicRoutes.some((route) =>
      pathname.startsWith(route)
  );

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // If protected route and no token, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If logged in and visiting public routes, redirect to dashboard
  if (isPublicRoute && token) {
    const role = token.role as string;
    const dashboardPath = roleRouteMap[role] || "/petani";
    return NextResponse.redirect(new URL(dashboardPath, request.url));
  }

  // Check role-based access to dashboard routes
  if (isProtectedRoute && token) {
    const role = token.role as string;
    const allowedPath = roleRouteMap[role];

    const isSharedRoute =
        pathname.startsWith("/profil") || pathname.startsWith("/notifikasi");

    if (!isSharedRoute && allowedPath && !pathname.startsWith(allowedPath)) {
      return NextResponse.redirect(new URL(allowedPath, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next (Next.js internals)
     * - static files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images).*)",
  ],
};