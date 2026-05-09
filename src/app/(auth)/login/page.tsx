"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validators";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
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
        setError("Email atau password salah");
      } else {
        const session = await getSession();
        const userRole = (session?.user as { role?: string } | undefined)?.role;

        let redirectPath = "/";
        if (userRole === "PETANI") redirectPath = "/petani";
        else if (userRole === "MITRA_TOKO") redirectPath = "/mitra-toko";
        else if (userRole === "KURIR") redirectPath = "/kurir";
        else if (userRole === "PEMBELI") redirectPath = "/pembeli";
        else if (userRole === "REGULATOR") redirectPath = "/regulator";

        router.push(redirectPath);
        router.refresh();
      }
    } catch {
      setError("Terjadi kesalahan sistem");
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="rounded-2xl border border-border bg-card p-8 shadow-xl shadow-primary/5">
        <h2 className="mb-6 text-center text-2xl font-bold text-foreground tracking-tight">
          Masuk ke Akun
        </h2>

        {error && (
            <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-sm font-medium text-red-500">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
              id="email"
              label="Email"
              type="email"
              placeholder="nama@email.com"
              error={errors.email?.message}
              {...register("email")}
          />

          <div className="space-y-1">
            <Input
                id="password"
                label="Password"
                type="password"
                placeholder="Masukkan password"
                error={errors.password?.message}
                {...register("password")}
            />
            <div className="flex justify-end">
              <Link href="/forgot-password" title="Lupa password" className="text-xs font-bold text-primary hover:underline">
                Lupa password?
              </Link>
            </div>
          </div>

          <Button type="submit" className="w-full font-bold py-6 shadow-lg shadow-primary/20" isLoading={isLoading}>
            Masuk Sekarang
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-foreground/50">
          Belum punya akun?{" "}
          <Link href="/register" className="font-bold text-primary hover:underline">
            Daftar sekarang
          </Link>
        </p>
      </div>
  );
}