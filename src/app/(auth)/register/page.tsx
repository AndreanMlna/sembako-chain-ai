"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/lib/validators";
import { UserRole } from "@/types";
import { ROLE_LABELS } from "@/constants";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
// Impor sub-komponen Select untuk pola komposisi
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/Select";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, control, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: undefined, // Pastikan initial value sinkron dengan Select
    }
  });

  const roleOptions = Object.entries(ROLE_LABELS)
      .filter(([key]) => key !== UserRole.REGULATOR)
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
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setError("Terjadi kesalahan jaringan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="rounded-2xl border border-border bg-card p-8 shadow-xl shadow-primary/5">
        <h2 className="mb-6 text-center text-2xl font-bold text-foreground tracking-tight">
          Buat Akun Baru
        </h2>

        {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-sm font-medium text-red-500">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
        )}

        {success && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-primary/10 p-3 text-sm font-medium text-primary">
              <CheckCircle2 className="h-4 w-4" />
              Registrasi berhasil! Mengalihkan...
            </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input id="nama" label="Nama Lengkap" placeholder="Nama Anda" error={errors.nama?.message} {...register("nama")} />
            <Input id="telepon" label="Telepon" type="tel" placeholder="08xxx" error={errors.telepon?.message} {...register("telepon")} />
          </div>

          <Input id="email" label="Email" type="email" placeholder="nama@email.com" error={errors.email?.message} {...register("email")} />

          {/* Perbaikan Fitur Daftar Sebagai */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Daftar Sebagai</label>
            <Controller
                name="role"
                control={control}
                render={({ field }) => (
                    <Select
                        value={field.value}
                        onValueChange={field.onChange}
                    >
                      <SelectTrigger className={errors.role ? "border-red-500" : ""}>
                        <SelectValue placeholder="Pilih peran">
                          {roleOptions.find(opt => opt.value === field.value)?.label}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                )}
            />
            {errors.role && (
                <p className="text-xs font-medium text-red-500">{errors.role.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input id="password" label="Password" type="password" placeholder="••••••••" error={errors.password?.message} {...register("password")} />
            <Input id="konfirmasiPassword" label="Konfirmasi" type="password" placeholder="••••••••" error={errors.konfirmasiPassword?.message} {...register("konfirmasiPassword")} />
          </div>

          <Button type="submit" className="w-full font-bold py-6 mt-4" isLoading={isLoading}>
            Daftar Sekarang
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-foreground/50">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-bold text-primary hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>
  );
}