import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserRole } from "@/types";

type SessionUser = {
    id: string;
    nama: string;
    email: string;
    role: UserRole;
};

/**
 * Check authentication only — user must be logged in.
 */
export async function requireAuth(): Promise<
    | { authorized: true; userId: string; user: SessionUser }
    | { authorized: false; response: NextResponse }
> {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return {
            authorized: false,
            response: NextResponse.json(
                { success: false, message: "Unauthorized — silakan login" },
                { status: 401 }
            ),
        };
    }
    return {
        authorized: true,
        userId: session.user.id,
        user: {
            id: session.user.id,
            nama: session.user.nama,
            email: session.user.email,
            role: session.user.role,
        },
    };
}

/**
 * Check authentication AND role.
 */
export async function requireRole(
    allowedRoles: UserRole | UserRole[]
): Promise<
    | { authorized: true; userId: string; user: SessionUser }
    | { authorized: false; response: NextResponse }
> {
    const result = await requireAuth();
    if (!result.authorized) return result;

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    if (!roles.includes(result.user.role)) {
        return {
            authorized: false,
            response: NextResponse.json(
                { success: false, message: "Forbidden — role tidak diizinkan" },
                { status: 403 }
            ),
        };
    }

    return result;
}
