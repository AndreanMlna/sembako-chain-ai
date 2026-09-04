"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Briefcase, Truck, Star, Wallet, Package, Navigation, Clock, Loader2 } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import StatsCard from "@/components/cards/StatsCard";
import { Card, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { formatRupiah } from "@/lib/utils";
import { apiGet } from "@/lib/api";

interface KurirDashboardData {
  stats: {
    availableJobs: number;
    deliveriesToday: number;
    rating: number;
    earningsToday: number;
  };
  activeJob: {
    id: string;
    from: string;
    to: string;
    distance: string;
    status: string;
    items: string;
  } | null;
  recentDeliveries: Array<{
    id: string;
    dest: string;
    time: string;
    fee: number;
  }>;
}

export default function KurirDashboard() {
  const [data, setData] = useState<KurirDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await apiGet<KurirDashboardData>("/kurir/dashboard");
        if (res.success && res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error("Gagal memuat dashboard kurir:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const stats = data?.stats || {
    availableJobs: 0,
    deliveriesToday: 0,
    rating: 5.0,
    earningsToday: 0,
  };

  const activeJob = data?.activeJob || null;
  const recentDeliveries = data?.recentDeliveries || [];

  return (
    <div className="space-y-6 animate-in">
      <PageHeader
        title="Dashboard Kurir"
        description="Pantau tugas pengiriman dan pendapatan Anda"
        action={
          <Link href="/kurir/jobs">
            <Button size="sm" className="font-bold shadow-lg shadow-primary/20">
              <Briefcase className="mr-2 h-4 w-4" />
              Cari Job Baru
            </Button>
          </Link>
        }
      />

      {/* STATS SECTION */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Job Tersedia" value={String(stats.availableJobs)} icon="Briefcase" />
        <StatsCard
          title="Pengiriman Hari Ini"
          value={String(stats.deliveriesToday)}
          icon="Truck"
        />
        <StatsCard title="Rating" value={stats.rating.toFixed(1)} icon="Star" />
        <StatsCard
          title="Pendapatan Hari Ini"
          value={formatRupiah(stats.earningsToday)}
          icon="Wallet"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* JOB AKTIF */}
        <Card className="border-primary/20 bg-primary/5 shadow-none">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground">Job Aktif</h3>
              </div>
              {activeJob ? (
                <Badge variant="warning" className="animate-pulse">{activeJob.status}</Badge>
              ) : (
                <Badge variant="default">Standby</Badge>
              )}
            </div>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : activeJob ? (
              <div className="space-y-4 rounded-xl bg-card p-4 border border-border">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Package className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{activeJob.items}</p>
                    <p className="text-[10px] text-foreground/40 uppercase font-black">ID: {activeJob.id.slice(0, 8)}</p>
                  </div>
                </div>

                <div className="space-y-3 relative before:absolute before:left-[7px] before:top-2 before:h-10 before:w-0.5 before:bg-border">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded-full border-2 border-primary bg-background z-10" />
                    <p className="text-xs text-foreground/70"><span className="font-bold">Dari:</span> {activeJob.from}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded-full border-2 border-red-500 bg-background z-10" />
                    <p className="text-xs text-foreground/70"><span className="font-bold">Ke:</span> {activeJob.to}</p>
                  </div>
                </div>

                <div className="pt-2">
                  <Link href="/kurir/route-optimizer">
                    <Button className="w-full font-bold">
                      Buka Peta Navigasi
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-sm text-foreground/50">
                <p>Tidak ada pengiriman yang sedang berjalan.</p>
                <Link href="/kurir/jobs">
                  <Button variant="outline" size="sm" className="mt-3 font-bold text-xs border-primary/50 text-primary">
                    Pilih Job di Marketplace
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* PENGIRIMAN TERAKHIR */}
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-foreground/40" />
              <h3 className="text-lg font-bold text-foreground">Pengiriman Terakhir</h3>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : recentDeliveries.length === 0 ? (
              <div className="text-center py-6 text-sm text-foreground/50">
                Belum ada riwayat pengiriman selesai hari ini.
              </div>
            ) : (
              <div className="space-y-3">
                {recentDeliveries.map((delivery) => (
                  <div key={delivery.id} className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-foreground/[0.02] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <div>
                        <p className="text-sm font-bold text-foreground">{delivery.dest}</p>
                        <p className="text-xs text-foreground/50">{delivery.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">{formatRupiah(delivery.fee)}</p>
                      <p className="text-[10px] text-foreground/30 font-bold">SUKSES</p>
                    </div>
                  </div>
                ))}
                <Link href="/kurir/riwayat" className="block w-full">
                  <Button variant="ghost" className="w-full text-xs text-foreground/40">
                    Lihat Semua Riwayat
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}