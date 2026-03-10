"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/lib/validators";
import { UserRole } from "@/types";
import { ROLE_LABELS } from "@/constants";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const roleOptions = Object.entries(ROLE_LABELS)
    .filter(([key]) => key !== UserRole.REGULATOR) // Regulator tidak bisa self-register
    .map(([value, label]) => ({ value, label }));

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Registrasi gagal");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setError("Terjadi kesalahan, silakan coba lagi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-xl border bg-white p-8 shadow-sm">
      <h2 className="mb-6 text-center text-xl font-semibold text-gray-900">
        Buat Akun Baru
      </h2>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-600">
          Registrasi berhasil! Mengalihkan ke halaman login...
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          id="nama"
          label="Nama Lengkap"
          placeholder="Masukkan nama lengkap"
          error={errors.nama?.message}
          {...register("nama")}
        />

        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="nama@email.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          id="telepon"
          label="Nomor Telepon"
          type="tel"
          placeholder="08xxxxxxxxxx"
          error={errors.telepon?.message}
          {...register("telepon")}
        />

        <Select
          id="role"
          label="Daftar Sebagai"
          options={roleOptions}
          placeholder="Pilih peran Anda"
          error={errors.role?.message}
          {...register("role")}
        />

        <Input
          id="password"
          label="Password"
          type="password"
          placeholder="Minimal 8 karakter"
          error={errors.password?.message}
          {...register("password")}
        />

        <Input
          id="konfirmasiPassword"
          label="Konfirmasi Password"
          type="password"
          placeholder="Ulangi password"
          error={errors.konfirmasiPassword?.message}
          {...register("konfirmasiPassword")}
        />

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Daftar
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Sudah punya akun?{" "}
        <Link href="/login" className="text-green-600 hover:underline">
          Masuk di sini
        </Link>
      </p>
    </div>
  );
}
