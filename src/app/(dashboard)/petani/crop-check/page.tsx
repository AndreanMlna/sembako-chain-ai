"use client";

import { Camera, Upload, ShieldCheck, Zap, History } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export default function CropCheckPage() {
  // TODO: Implement camera capture and AI crop check logic

  return (
      <div className="space-y-8 animate-in pb-20">
        <PageHeader
            title="AI Crop Check"
            description="Diagnosa kesehatan tanaman menggunakan kamera AI secara real-time"
        />

        <div className="mx-auto max-w-2xl">
          {/* Main Upload/Camera Section */}
          <div className="group relative overflow-hidden rounded-[2rem] border-2 border-dashed border-border bg-card p-12 text-center transition-all hover:border-primary/50 shadow-xl">
            {/* Efek Glow Background */}
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl group-hover:bg-primary/20 transition-all" />

            <div className="relative z-10">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
                <Camera className="h-12 w-12" />
              </div>

              <h3 className="text-2xl font-bold text-foreground">
                Deteksi Penyakit Tanaman
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-foreground/60">
                Ambil foto daun atau bagian tanaman yang sakit.
                Sistem AI akan menganalisis gejala dan memberikan rekomendasi penanganan instan.
              </p>

              <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                <Button className="gap-2 px-8 py-6 rounded-xl font-bold text-base shadow-lg shadow-primary/20">
                  <Camera className="h-5 w-5" />
                  Buka Kamera
                </Button>
                <Button variant="outline" className="gap-2 px-8 py-6 rounded-xl font-bold text-base border-border hover:bg-foreground/5">
                  <Upload className="h-5 w-5" />
                  Upload Foto
                </Button>
              </div>
            </div>
          </div>

          {/* Feature Info */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-2xl bg-primary/5 p-5 border border-primary/10">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold text-foreground/80 tracking-tight uppercase">Akurasi deteksi hingga 98%</span>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-primary/5 p-5 border border-primary/10">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Zap className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold text-foreground/80 tracking-tight uppercase">Diagnosis kurang dari 5 detik</span>
            </div>
          </div>

          {/* Recent History Placeholder */}
          <div className="mt-16">
            <div className="mb-6 flex items-center justify-between">
              <h4 className="flex items-center gap-2 font-black text-foreground uppercase tracking-widest text-xs">
                <History className="h-4 w-4 text-primary" /> Riwayat Diagnosa
              </h4>
              <Button variant="ghost" size="sm" className="text-primary text-xs font-bold uppercase tracking-tighter">Lihat Semua</Button>
            </div>

            <Card className="rounded-3xl border border-dashed border-border bg-card/50">
              <CardContent className="flex items-center justify-center py-16">
                <div className="text-center">
                  <p className="text-sm italic text-foreground/30 font-medium">Belum ada riwayat pengecekan tanaman.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  );
}