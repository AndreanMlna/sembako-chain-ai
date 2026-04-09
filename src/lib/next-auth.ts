import { type NextAuthOptions, type DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { UserRole } from "@/types";

// ==========================================
// 1. MODULE AUGMENTATION (Sinkron dengan auth.ts)
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

  interface User {
    id: string;
    nama: string;
    email: string;
    role: UserRole;
    avatar?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    nama: string;
    role: UserRole;
    avatar?: string;
    email?: string;
  }
}

export const authOptions: NextAuthOptions = {
  // ... providers (sama seperti kode Anda sebelumnya)
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email dan password wajib diisi");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) throw new Error("Email atau password salah");
        if (!user.isActive) throw new Error("Akun Anda telah dinonaktifkan");

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) throw new Error("Email atau password salah");

        return {
          id: user.id,
          nama: user.nama,
          email: user.email,
          role: user.role as UserRole,
          avatar: user.avatar ?? undefined,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.nama = user.nama;
        token.role = user.role;
        token.avatar = user.avatar;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        nama: token.nama,
        email: token.email ?? "",
        role: token.role,
        avatar: token.avatar,
      };
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
  pages: { signIn: "/login", error: "/login" },
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  secret: process.env.NEXTAUTH_SECRET,
};