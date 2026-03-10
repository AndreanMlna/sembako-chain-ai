"use client";

import { Camera } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";

export default function ProfilPage() {
  return (
    <div>
      <PageHeader title="Profil" description="Kelola informasi akun Anda" />

      <div className="mx-auto max-w-2xl space-y-6">
        {/* Avatar */}
        <Card>
          <CardContent className="flex items-center gap-6">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-2xl font-bold text-green-700">
                U
              </div>
              <button className="absolute -bottom-1 -right-1 rounded-full bg-green-600 p-1.5 text-white hover:bg-green-700">
                <Camera className="h-3 w-3" />
              </button>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Nama User</h3>
              <p className="text-sm text-gray-500">Petani / Agent</p>
            </div>
          </CardContent>
        </Card>

        {/* Personal Info */}
        <Card>
          <CardContent>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Informasi Pribadi
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Nama Lengkap" placeholder="Nama lengkap" />
              <Input label="Email" type="email" placeholder="Email" />
              <Input label="Telepon" type="tel" placeholder="08xxxxxxxxxx" />
              <Input label="Alamat" placeholder="Alamat lengkap" />
            </div>
            <Button className="mt-4">Simpan Perubahan</Button>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardContent>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Ubah Password
            </h3>
            <div className="space-y-4">
              <Input label="Password Lama" type="password" />
              <Input label="Password Baru" type="password" />
              <Input label="Konfirmasi Password Baru" type="password" />
            </div>
            <Button className="mt-4" variant="outline">
              Ubah Password
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
