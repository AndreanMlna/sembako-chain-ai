"use client";

import { Camera, Upload, ShieldCheck, Zap, History } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export default function CropCheckPage() {
  // TODO: Implement camera capture and AI crop check logic

  return (
      <div className="space-y-8">
        <PageHeader
            title="AI Crop Check"
            description="Diagnosa kesehatan tanaman menggunakan kamera AI secara real-time"
        />

        <div className="mx-auto max-w-2xl">
          {/* Main Upload/Camera Section */}
          <div className="group relative overflow-hidden rounded-2xl border-2 border-dashed border-border bg-card p-12 text-center transition-all hover:border-primary/50">
            {/* Efek Glow Background (Opsional buat kesan AI) */}
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/5 blur-3xl" />

            <div className="relative z-10">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                <Camera className="h-12 w-12" />
              </div>

              <h3 className="text-xl font-bold text-foreground">
                Deteksi Penyakit Tanaman
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-foreground/60">
                Ambil foto daun atau bagian tanaman yang sakit.
                Sistem AI akan menganalisis gejala dan memberikan rekomendasi penanganan instan.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button className="gap-2 px-8">
                  <Camera className="h-4 w-4" />
                  Buka Kamera
                </Button>
                <Button variant="outline" className="gap-2 px-8">
                  <Upload className="h-4 w-4" />
                  Upload Foto
                </Button>
              </div>
            </div>
          </div>

          {/* Feature Info */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl bg-blue-500/5 p-4 border border-blue-500/10">
              <ShieldCheck className="h-5 w-5 text-blue-500" />
              <span className="text-xs font-medium text-foreground/80">Akurasi deteksi hingga 98%</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-blue-500/5 p-4 border border-blue-500/10">
              <Zap className="h-5 w-5 text-blue-500" />
              <span className="text-xs font-medium text-foreground/80">Hasil diagnosis kurang dari 5 detik</span>
            </div>
          </div>

          {/* Recent History Placeholder */}
          <div className="mt-12">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="flex items-center gap-2 font-semibold text-foreground">
                <History className="h-4 w-4" /> Riwayat Diagnosa
              </h4>
              <Button variant="ghost" size="sm" className="text-blue-500 text-xs">Lihat Semua</Button>
            </div>

            <Card>
              <CardContent className="flex items-center justify-center py-10">
                <p className="text-sm italic text-foreground/40">Belum ada riwayat pengecekan tanaman.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  );
}