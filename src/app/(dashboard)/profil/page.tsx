"use client";

import { Camera, UserCircle, ShieldCheck, Mail, Phone, MapPin } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";

export default function ProfilPage() {
  return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <PageHeader title="Profil Saya" description="Kelola informasi akun dan keamanan Anda" />

        <div className="mx-auto max-w-2xl space-y-6">
          {/* Header Profil */}
          <Card className="border-primary/10">
            <CardContent className="flex flex-col items-center gap-6 p-8 sm:flex-row sm:text-left text-center">
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-3xl font-bold text-primary ring-4 ring-background">
                  W
                </div>
                <button className="absolute -bottom-1 -right-1 rounded-full bg-primary p-2 text-white shadow-lg hover:scale-110 transition-transform">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-foreground">Wafa Bila Syaefurokhman</h3>
                <p className="text-sm font-medium text-primary">Petani / ML Engineer • ID: S-2026</p>
              </div>
            </CardContent>
          </Card>

          {/* Informasi Pribadi */}
          <Card>
            <CardContent className="p-6">
              <div className="mb-6 flex items-center gap-2 border-b border-border pb-3">
                <UserCircle className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground">Informasi Pribadi</h3>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Input label="Nama Lengkap" defaultValue="Wafa Bila Syaefurokhman" />
                <Input label="Email" type="email" defaultValue="wafa@example.com" />
                <Input label="Telepon" type="tel" defaultValue="081234567890" />
                <Input label="Alamat" defaultValue="Tegal, Indonesia" />
              </div>
              <div className="mt-8 flex justify-end">
                <Button>Simpan Perubahan</Button>
              </div>
            </CardContent>
          </Card>

          {/* Keamanan */}
          <Card>
            <CardContent className="p-6">
              <div className="mb-6 flex items-center gap-2 border-b border-border pb-3">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground">Keamanan Akun</h3>
              </div>
              <div className="space-y-5">
                <Input label="Password Lama" type="password" placeholder="••••••••" />
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Input label="Password Baru" type="password" placeholder="Minimal 8 karakter" />
                  <Input label="Konfirmasi Password" type="password" />
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <Button variant="outline">Perbarui Password</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  );
}