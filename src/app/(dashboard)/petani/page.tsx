"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2, RefreshCw, BarChart3, Target, MapPin, Wheat, Package, Wallet } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import StatsCard from "@/components/cards/StatsCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { getDashboardData, type DashboardData } from "@/services/petani.service";
import { toast } from "react-hot-toast";

// Definisi interface untuk menangani error catch secara spesifik
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export default function PetaniDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchDashboardData = async (showRefresh = false) => {
    try {
      if (showRefresh) setIsRefreshing(true);

      const response = await getDashboardData();

      if (response.success && response.data) {
        setData(response.data);
        if (showRefresh) toast.success("Dashboard diperbarui");
      } else {
        if (response.message?.includes("Unauthorized")) {
          router.push("/auth/login");
          return;
        }
        toast.error(response.message || "Gagal mengambil data dari server");
      }
    } catch (error: unknown) {
      console.error("Dashboard Fetch Error:", error);
      const err = error as ApiError;
      toast.error(err.response?.data?.message || err.message || "Terjadi kesalahan sistem (Error 500)");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (mounted) {
      void fetchDashboardData();
    }
  }, [mounted]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (date: string | number | Date | null | undefined) => {
    if (!date) return "N/A";
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
    }).format(new Date(date));
  };

  if (!mounted || isLoading) {
    return (
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-foreground/60">Sinkronisasi data...</p>
          </div>
        </div>
    );
  }

  return (
      <div className="space-y-8 animate-in pb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <PageHeader title="Dashboard Petani" description="Ringkasan ekosistem pertanian Anda" />
          <div className="flex items-center gap-3">
            <button
                onClick={() => fetchDashboardData(true)}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-4 py-2 bg-card rounded-xl border border-border text-foreground/70 hover:bg-foreground/5 transition-all"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="text-sm font-medium">Perbarui</span>
            </button>
            <button
                className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all font-bold"
                onClick={() => router.push("/petani/lahan/tambah")}
            >
              <Plus className="h-4 w-4" />
              <span className="text-sm">Tambah Lahan</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard title="Total Lahan" value={`${data?.stats?.totalLahan || 0} Lahan`} icon="MapPin" />
          <StatsCard title="Tanaman Aktif" value={String(data?.stats?.totalTanamanAktif || 0)} icon="Wheat" />
          <StatsCard title="Siap Panen" value={String(data?.stats?.totalSiapPanen || 0)} icon="Package" />
          <StatsCard title="Saldo Wallet" value={formatCurrency(data?.stats?.saldoWallet || 0)} icon="Wallet" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between p-6">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" /> Panen Mendatang
                </CardTitle>
                <Badge variant="success">{data?.upcomingHarvests?.length || 0} Unit</Badge>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                {data?.upcomingHarvests && data.upcomingHarvests.length > 0 ? (
                    <div className="space-y-4">
                      {data.upcomingHarvests.map((harvest) => (
                          <div key={harvest.id} className="p-4 bg-background/40 rounded-xl border border-border flex justify-between items-center hover:border-primary/30 transition-all">
                            <div>
                              <h4 className="font-bold text-foreground">{harvest.nama}</h4>
                              <p className="text-sm text-foreground/50">{harvest.lahan} • {harvest.lokasi}</p>
                            </div>
                            <Badge variant="info" className="bg-primary/10 text-primary border-none font-bold">
                              {formatDate(harvest.estimasiPanen)}
                            </Badge>
                          </div>
                      ))}
                    </div>
                ) : (
                    <div className="text-center py-10 text-foreground/40 italic">Belum ada tanaman siap panen.</div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader className="p-6">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" /> Aktivitas
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                {data?.recentActivities && data.recentActivities.length > 0 ? (
                    <div className="space-y-4">
                      {data.recentActivities.map((activity) => (
                          <div key={activity.id} className="text-sm border-l-2 border-border pl-4 py-1 hover:border-primary/50 transition-all">
                            <p className="text-foreground font-medium">{activity.description}</p>
                            <div className="flex justify-between mt-1">
                              <span className="text-foreground/40 text-xs">{formatDate(activity.createdAt)}</span>
                              <span className={`font-bold ${activity.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {formatCurrency(activity.amount)}
                        </span>
                            </div>
                          </div>
                      ))}
                    </div>
                ) : (
                    <div className="text-center py-10 text-foreground/40 italic">Tidak ada aktivitas.</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  );
}