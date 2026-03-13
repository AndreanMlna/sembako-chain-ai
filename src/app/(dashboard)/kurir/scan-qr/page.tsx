"use client";

import { QrCode, Camera, History, CheckCircle2, Info } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export default function ScanQRPage() {
  // Dummy riwayat scan singkat
  const scanHistory = [
    { id: "DEL-9920", time: "10:30 WIB", status: "Berhasil" },
    { id: "DEL-9918", time: "Kemarin", status: "Berhasil" },
  ];

  return (
      <div className="space-y-6 animate-in">
        <PageHeader
            title="Scan QR Bukti Kirim"
            description="Arahkan kamera ke QR code paket untuk konfirmasi serah terima"
        />

        <div className="mx-auto max-w-md space-y-6">
          {/* SCANNER VIEWPORT */}
          <Card className="border-primary/20 bg-card overflow-hidden shadow-xl shadow-primary/5">
            <CardContent className="p-8 text-center">
              {/* Viewfinder Mockup */}
              <div className="relative mx-auto mb-6 flex h-64 w-64 items-center justify-center rounded-3xl border-2 border-dashed border-primary/30 bg-primary/5 group">
                {/* Corner Ornaments */}
                <div className="absolute -top-1 -left-1 h-8 w-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
                <div className="absolute -top-1 -right-1 h-8 w-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
                <div className="absolute -bottom-1 -left-1 h-8 w-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
                <div className="absolute -bottom-1 -right-1 h-8 w-8 border-b-4 border-r-4 border-primary rounded-br-xl" />

                {/* Scanning Animation Line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-primary/50 shadow-[0_0_15px_rgba(34,197,94,0.5)] animate-scan-line" />

                <QrCode className="h-20 w-20 text-primary/20 group-hover:text-primary/40 transition-colors" />
              </div>

              <div className="space-y-4">
                <p className="text-sm font-medium text-foreground/60 leading-relaxed px-4">
                  Posisikan QR Code di dalam kotak untuk verifikasi otomatis oleh AI.
                </p>
                <Button className="w-full py-6 font-black text-base shadow-lg shadow-primary/20 active:scale-95 transition-all">
                  <Camera className="mr-2 h-5 w-5" />
                  MULAI SCANNER
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* RECENT SCAN HISTORY */}
          <Card className="border-border bg-card/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <History className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground">Riwayat Scan</h3>
              </div>

              {scanHistory.length > 0 ? (
                  <div className="space-y-3">
                    {scanHistory.map((item) => (
                        <div key={item.id} className="flex items-center justify-between rounded-xl bg-foreground/5 p-3 border border-border/50">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                              <CheckCircle2 className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-xs font-black text-foreground uppercase">{item.id}</p>
                              <p className="text-[10px] text-foreground/40 font-bold uppercase">{item.time}</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-md uppercase">
                      {item.status}
                    </span>
                        </div>
                    ))}
                  </div>
              ) : (
                  <p className="text-center py-4 text-sm text-foreground/30 italic">Belum ada riwayat scan.</p>
              )}
            </CardContent>
          </Card>

          {/* AI Tip */}
          <div className="flex gap-3 rounded-xl bg-primary/5 p-4 border border-primary/10">
            <Info className="h-5 w-5 text-primary shrink-0" />
            <p className="text-xs text-foreground/60 leading-relaxed font-medium">
              Sistem AI kami akan mendeteksi lokasi dan waktu secara otomatis untuk validasi pengiriman yang sah.
            </p>
          </div>
        </div>
      </div>
  );
}