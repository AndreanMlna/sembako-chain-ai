import { UserRole } from "@/types";

/**
 * Auth configuration for NextAuth.js
 * TODO: Implement full NextAuth configuration with providers
 */

export interface SessionUser {
  id: string;
  nama: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

/**
 * Check if user has required role
 */
export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return userRole === requiredRole;
}

/**
 * Check if user has any of the required roles
 */
export function hasAnyRole(
  userRole: UserRole,
  requiredRoles: UserRole[]
): boolean {
  return requiredRoles.includes(userRole);
}

/**
 * Get the default redirect path based on user role
 */
export function getDefaultRedirect(role: UserRole): string {
  const routes: Record<UserRole, string> = {
    [UserRole.PETANI]: "/petani",
    [UserRole.MITRA_TOKO]: "/mitra-toko",
    [UserRole.KURIR]: "/kurir",
    [UserRole.PEMBELI]: "/pembeli",
    [UserRole.REGULATOR]: "/regulator",
  };
  return routes[role];
}
