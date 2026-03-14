"use client";

import { MapPin, Navigation, Clock, Milestone, ArrowRight, Zap, Info } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export default function RouteOptimizerPage() {
  // Dummy data rute multi-drop
  const routePoints = [
    { id: 1, type: "Pickup", location: "Gudang Tani Jaya", status: "Selesai" },
    { id: 2, type: "Drop-off 1", location: "Toko Berkah Slawi", status: "Sekarang" },
    { id: 3, type: "Drop-off 2", location: "Warung Bu Siti", status: "Mendatang" },
    { id: 4, type: "Drop-off 3", location: "Katering Berkah", status: "Mendatang" },
  ];

  return (
      <div className="space-y-6 animate-in">
        <PageHeader
            title="AI Route Optimizer"
            description="Rute pengiriman multi-drop yang dioptimasi AI untuk efisiensi bensin dan waktu"
            action={
              <Badge variant="success" className="bg-primary/20 text-primary border-primary/20 py-1.5 px-3">
                <Zap className="mr-1.5 h-3 w-3 fill-current" />
                AI Optimized
              </Badge>
            }
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* LEFT: MAP AREA */}
          <div className="lg:col-span-2">
            <Card className="h-[500px] border-border bg-card relative overflow-hidden group">
              <CardContent className="flex h-full items-center justify-center p-0">
                {/* Mockup Peta dengan Overlay Dark Mode */}
                <div className="absolute inset-0 bg-foreground/5 opacity-50 dark:opacity-20" />
                <div className="text-center space-y-4 z-10 px-6">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center animate-bounce">
                    <Navigation className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">Integrasi Peta Real-time</p>
                    <p className="text-sm text-foreground/50 max-w-sm mx-auto leading-relaxed">
                      AI sedang menghitung rute tercepat melalui 4 titik pemberhentian menggunakan dataset lalu lintas terbaru.
                    </p>
                  </div>
                  <Button variant="outline" className="border-primary/20 text-primary font-bold">
                    Buka di Google Maps
                  </Button>
                </div>

                {/* FIX: Ganti 'size' jadi 'backgroundSize' agar TypeScript senang */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
                    style={{
                      backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                      backgroundSize: '40px 40px'
                    }}
                />
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: ROUTE DETAILS */}
          <div className="space-y-4">
            <Card className="border-primary/20 shadow-xl shadow-primary/5">
              <CardContent className="p-6">
                <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-foreground">
                  {/* FIX: Milestone (S-nya satu) */}
                  <Milestone className="h-5 w-5 text-primary" />
                  Detail Rute Optimal
                </h3>

                {/* Waypoints Timeline */}
                <div className="relative space-y-8 before:absolute before:left-[11px] before:top-2 before:h-[calc(100%-24px)] before:w-0.5 before:bg-border">
                  {routePoints.map((point) => (
                      <div key={point.id} className="relative flex items-start gap-4 pl-8">
                        {/* Bullet Point */}
                        <div className={cn(
                            "absolute left-0 h-6 w-6 rounded-full border-4 border-background z-10 flex items-center justify-center",
                            point.status === "Selesai" ? "bg-primary" :
                                point.status === "Sekarang" ? "bg-yellow-500 animate-pulse" : "bg-border"
                        )}>
                          {point.status === "Selesai" && <div className="h-2 w-2 bg-background rounded-full" />}
                        </div>

                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">
                              {point.type}
                            </p>
                            {point.status === "Sekarang" && (
                                <span className="text-[9px] font-bold text-yellow-500 uppercase tracking-tighter">Lokasi Saat Ini</span>
                            )}
                          </div>
                          <h4 className={cn(
                              "text-sm font-bold mt-1",
                              point.status === "Mendatang" ? "text-foreground/40" : "text-foreground"
                          )}>
                            {point.location}
                          </h4>
                        </div>
                      </div>
                  ))}
                </div>

                {/* Stats Summary */}
                <div className="mt-8 grid grid-cols-2 gap-3 border-t border-border pt-6">
                  <div className="rounded-xl bg-foreground/5 p-3 text-center border border-border/50">
                    <Clock className="mx-auto mb-1 h-4 w-4 text-primary" />
                    <p className="text-[10px] font-bold text-foreground/40 uppercase">Estimasi</p>
                    <p className="text-sm font-black text-foreground">45 Menit</p>
                  </div>
                  <div className="rounded-xl bg-foreground/5 p-3 text-center border border-border/50">
                    <Navigation className="mx-auto mb-1 h-4 w-4 text-primary" />
                    <p className="text-[10px] font-bold text-foreground/40 uppercase">Jarak</p>
                    <p className="text-sm font-black text-foreground">12.4 KM</p>
                  </div>
                </div>

                <Button className="mt-6 w-full py-6 font-black tracking-wider shadow-lg shadow-primary/20 active:scale-95 transition-all">
                  MULAI NAVIGASI
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>

            {/* Info AI Card */}
            <Card className="bg-primary/5 border-primary/10 border-l-4 border-l-primary">
              <CardContent className="p-4 flex gap-3">
                <Info className="h-5 w-5 text-primary shrink-0" />
                <p className="text-xs text-foreground/70 leading-relaxed font-medium">
                  Rute ini telah dihitung ulang secara otomatis untuk menghindari kemacetan di area <span className="text-primary font-bold">Pasar Pagi</span>.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  );
}