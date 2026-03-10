"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // TODO: Implement forgot password logic
      console.log("Forgot password:", email);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-xl border bg-white p-8 shadow-sm">
      {isSubmitted ? (
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Email Terkirim
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Kami telah mengirim link reset password ke <strong>{email}</strong>.
            Silakan cek inbox Anda.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex items-center gap-2 text-sm text-green-600 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke halaman login
          </Link>
        </div>
      ) : (
        <>
          <h2 className="mb-2 text-center text-xl font-semibold text-gray-900">
            Lupa Password
          </h2>
          <p className="mb-6 text-center text-sm text-gray-500">
            Masukkan email Anda untuk menerima link reset password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Kirim Link Reset
            </Button>
          </form>

          <Link
            href="/login"
            className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke login
          </Link>
        </>
      )}
    </div>
  );
}
