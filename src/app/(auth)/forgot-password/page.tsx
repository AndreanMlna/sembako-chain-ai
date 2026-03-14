"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, MailCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulasi logic reset
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
    }, 1500);
  };

  return (
      <div className="rounded-2xl border border-border bg-card p-8 shadow-xl shadow-primary/5">
        {isSubmitted ? (
            <div className="text-center py-4">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MailCheck className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Email Terkirim</h2>
              <p className="mt-3 text-sm text-foreground/50 leading-relaxed">
                Link reset password telah dikirim ke <strong className="text-foreground">{email}</strong>.
              </p>
              <Link href="/login" className="mt-8 inline-flex items-center gap-2 font-bold text-primary hover:underline">
                <ArrowLeft className="h-4 w-4" />
                Kembali ke Login
              </Link>
            </div>
        ) : (
            <>
              <h2 className="mb-2 text-center text-2xl font-bold text-foreground">Lupa Password</h2>
              <p className="mb-8 text-center text-sm text-foreground/50">
                Kami akan mengirimkan instruksi ke email Anda.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <Input id="email" label="Email Terdaftar" type="email" placeholder="nama@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <Button type="submit" className="w-full font-bold py-6" isLoading={isLoading}>
                  Kirim Link Reset
                </Button>
              </form>

              <Link href="/login" className="mt-8 flex items-center justify-center gap-2 text-sm font-semibold text-foreground/40 hover:text-primary transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Kembali ke login
              </Link>
            </>
        )}
      </div>
  );
}