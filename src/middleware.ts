import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

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

export default async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip middleware for API routes and static files
    if (
        pathname.startsWith("/api") ||
        pathname.startsWith("/_next") ||
        pathname === "/favicon.ico"
    ) {
        return NextResponse.next();
    }

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

    // Protected route + no token → redirect to login
    if (isProtectedRoute && !token) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Logged in + visiting public route → redirect to dashboard
    if (isPublicRoute && token) {
        const role = token.role as string;
        const dashboardPath = roleRouteMap[role] || "/petani";
        return NextResponse.redirect(new URL(dashboardPath, request.url));
    }

    // Role-based access: user with role A can't access role B's dashboard
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
         * - _next static files
         */
        "/((?!api|_next/static|_next/image|favicon.ico|images).*)",
    ],
};
