"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
// 1. Tambahkan import getSession dari next-auth/react
import { signIn, getSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validators";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        // 2. Ambil sesi terbaru untuk mengecek role akun yang baru saja login
        const session = await getSession();

        // Asumsi data role tersimpan di session.user.role
        // Menggunakan "as any" untuk menghindari error TypeScript jika type Session belum di-extend
        const userRole = (session?.user as any)?.role;

        // 3. Tentukan rute redirect berdasarkan Role
        let redirectPath = "/"; // Default fallback
        if (userRole === "PETANI") redirectPath = "/petani";
        else if (userRole === "MITRA_TOKO") redirectPath = "/mitra-toko";
        else if (userRole === "KURIR") redirectPath = "/kurir";
        else if (userRole === "PEMBELI") redirectPath = "/pembeli";
        else if (userRole === "REGULATOR") redirectPath = "/regulator";

        // 4. Arahkan ke dashboard spesifik
        router.push(redirectPath);
        router.refresh();
      }
    } catch (err) {
      setError("Terjadi kesalahan, silakan coba lagi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="rounded-xl border bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-center text-xl font-semibold text-gray-900">
          Masuk ke Akun Anda
        </h2>

        {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
              id="email"
              label="Email"
              type="email"
              placeholder="nama@email.com"
              error={errors.email?.message}
              {...register("email")}
          />

          <Input
              id="password"
              label="Password"
              type="password"
              placeholder="Masukkan password"
              error={errors.password?.message}
              {...register("password")}
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="rounded" />
              Ingat saya
            </label>
            <Link
                href="/forgot-password"
                className="text-sm text-green-600 hover:underline"
            >
              Lupa password?
            </Link>
          </div>

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Masuk
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Belum punya akun?{" "}
          <Link href="/register" className="text-green-600 hover:underline">
            Daftar sekarang
          </Link>
        </p>
      </div>
  );
}