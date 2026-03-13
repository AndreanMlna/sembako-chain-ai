"use client";

import { Search, MapPin, Truck, CheckCircle2, Clock, Navigation, Phone, Box } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export default function TrackingPage() {
  // Dummy data status pengiriman
  const trackingSteps = [
    { status: "Selesai", desc: "Pesanan Diterima", time: "14 Mar, 10:30", active: false },
    { status: "Proses", desc: "Kurir Menuju Lokasi Anda", time: "Sedang Berjalan", active: true },
    { status: "Pending", desc: "Barang Diambil oleh Kurir", time: "14 Mar, 09:15", active: false },
    { status: "Pending", desc: "Pesanan Terkonfirmasi", time: "14 Mar, 08:45", active: false },
  ];

  return (
      <div className="space-y-6 animate-in">
        <PageHeader
            title="Tracking Pengiriman"
            description="Pantau posisi kurir dan estimasi waktu tiba pesanan Anda"
        />

        {/* SEARCH BAR */}
        <Card className="border-border bg-card/50">
          <CardContent className="p-4 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/30" />
              <Input
                  placeholder="Masukkan nomor pesanan (contoh: ORD-7721)..."
                  className="pl-10 bg-background border-border"
              />
            </div>
            <Button className="font-bold shadow-lg shadow-primary/20">
              LACAK SEKARANG
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* LEFT: REAL-TIME MAP MOCKUP */}
          <div className="lg:col-span-2">
            <Card className="h-[500px] border-border bg-card relative overflow-hidden group">
              <CardContent className="flex h-full items-center justify-center p-0">
                {/* Background Map Placeholder */}
                <div className="absolute inset-0 bg-foreground/5 opacity-40 dark:opacity-10" />

                {/* Pulsing Courier Marker */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-25" />
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-xl">
                      <Truck className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="mt-3 rounded-lg bg-background/90 backdrop-blur-md border border-border px-3 py-1.5 shadow-lg">
                    <p className="text-[10px] font-black text-primary uppercase">Kurir: Mas Bagus</p>
                  </div>
                </div>

                {/* Map UI Overlay */}
                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end pointer-events-none">
                  <div className="bg-background/90 backdrop-blur-md border border-border p-4 rounded-2xl shadow-xl pointer-events-auto">
                    <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-1">Estimasi Tiba</p>
                    <p className="text-xl font-black text-foreground">12 Menit Lagi</p>
                  </div>
                  <Button variant="outline" className="bg-background/90 backdrop-blur-md border-border pointer-events-auto shadow-lg">
                    <Navigation className="h-4 w-4 mr-2 text-primary" />
                    Perbesar Peta
                  </Button>
                </div>

                {/* Grid Lines Dekorasi */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
                     style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '50px 50px' }}
                />
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: TRACKING STATUS TIMELINE */}
          <div className="space-y-4">
            <Card className="border-border bg-card h-full">
              <CardContent className="p-6">
                <h3 className="mb-8 flex items-center gap-2 text-lg font-bold text-foreground">
                  <Box className="h-5 w-5 text-primary" />
                  Status Perjalanan
                </h3>

                {/* Timeline Items */}
                <div className="relative space-y-10 before:absolute before:left-[11px] before:top-2 before:h-[calc(100%-24px)] before:w-0.5 before:bg-border/50">
                  {trackingSteps.map((step, idx) => (
                      <div key={idx} className="relative flex items-start gap-6 pl-8">
                        {/* Circle Indicator */}
                        <div className={cn(
                            "absolute left-0 h-6 w-6 rounded-full border-4 border-background z-10 flex items-center justify-center",
                            step.active ? "bg-primary animate-pulse" :
                                step.status === "Selesai" ? "bg-primary/40" : "bg-border"
                        )}>
                          {step.status === "Selesai" && <CheckCircle2 className="h-3 w-3 text-white" />}
                        </div>

                        <div className="flex-1">
                          <p className={cn(
                              "text-sm font-bold leading-tight",
                              step.active ? "text-foreground" : "text-foreground/40"
                          )}>
                            {step.desc}
                          </p>
                          <p className="text-[10px] font-medium text-foreground/30 mt-1 uppercase tracking-wider">
                            {step.time}
                          </p>
                        </div>
                      </div>
                  ))}
                </div>

                {/* Courier Info Card */}
                <div className="mt-10 rounded-2xl bg-primary/5 border border-primary/10 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-foreground/10 overflow-hidden border-2 border-background shadow-sm" />
                      <div>
                        <p className="text-xs font-black text-foreground uppercase leading-none">Mas Bagus</p>
                        <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-tighter">Kurir Sembako-Chain</p>
                      </div>
                    </div>
                    <button className="h-9 w-9 flex items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                      <Phone className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  );
}