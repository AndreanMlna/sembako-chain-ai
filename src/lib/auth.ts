import bcrypt from "bcryptjs";
import { NextAuthOptions, DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { UserRole } from "@/types";
import prisma from "@/lib/prisma";

// ==========================================
// 1. MODULE AUGMENTATION (Sinkron dengan next-auth.ts)
// ==========================================
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      nama: string;
      email: string;
      role: UserRole;
      avatar?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role: UserRole;
    nama: string;
    avatar?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    nama: string;
    avatar?: string;
    email?: string;
  }
}

// ==========================================
// 2. NEXTAUTH CONFIGURATION
// ==========================================
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 hari
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        });

        if (!user || !user.isActive) return null;

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) return null;

        return {
          id: user.id,
          name: user.nama,
          nama: user.nama,
          email: user.email,
          role: user.role as unknown as UserRole,
          avatar: user.avatar ?? undefined,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.nama = user.nama;
        token.avatar = user.avatar;
        token.email = user.email ?? undefined;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.nama = token.nama;
        session.user.email = token.email || session.user.email || "";
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url === baseUrl || url === `${baseUrl}/login`) return baseUrl;
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      try {
        if (new URL(url).origin === baseUrl) return url;
      } catch {
        return baseUrl;
      }
      return baseUrl;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
};

// ==========================================
// 3. HELPER FUNCTIONS (Logika Asli Anda)
// ==========================================

export interface SessionUser {
  id: string;
  nama: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return userRole === requiredRole;
}

export function hasAnyRole(
    userRole: UserRole,
    requiredRoles: UserRole[]
): boolean {
  return requiredRoles.includes(userRole);
}

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