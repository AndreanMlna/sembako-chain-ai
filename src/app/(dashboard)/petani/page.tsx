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

  // Mengganti 'any' dengan 'string | number | Date'
  const formatDate = (date: string | number | Date | null | undefined) => {
    if (!date) return "N/A";
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
    }).format(new Date(date));
  };

  if (!mounted || isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto" />
            <p className="text-slate-400">Sinkronisasi data...</p>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-8">
            <PageHeader title="Dashboard Petani" description="Ringkasan ekosistem pertanian Anda" />
            <div className="flex items-center gap-3 mt-4">
              <button
                  onClick={() => fetchDashboardData(true)}
                  disabled={isRefreshing}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-xl border border-slate-700 text-slate-300"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Perbarui
              </button>
              <button
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-colors"
                  onClick={() => router.push("/petani/lahan/tambah")}
              >
                <Plus className="h-4 w-4" />
                Tambah Lahan
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard title="Total Lahan" value={`${data?.stats?.totalLahan || 0} Lahan`} icon="MapPin" />
            <StatsCard title="Tanaman Aktif" value={String(data?.stats?.totalTanamanAktif || 0)} icon="Wheat" />
            <StatsCard title="Siap Panen" value={String(data?.stats?.totalSiapPanen || 0)} icon="Package" />
            <StatsCard title="Saldo Wallet" value={formatCurrency(data?.stats?.saldoWallet || 0)} icon="Wallet" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2">
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Target className="h-5 w-5 text-blue-500" /> Panen Mendatang
                  </CardTitle>
                  <Badge variant="success">{data?.upcomingHarvests?.length || 0} Unit</Badge>
                </CardHeader>
                <CardContent>
                  {data?.upcomingHarvests && data.upcomingHarvests.length > 0 ? (
                      <div className="space-y-4">
                        {data.upcomingHarvests.map((harvest) => (
                            <div key={harvest.id} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 flex justify-between items-center">
                              <div>
                                <h4 className="font-bold text-white">{harvest.nama}</h4>
                                <p className="text-sm text-slate-400">{harvest.lahan} • {harvest.lokasi}</p>
                              </div>
                              {/* Perbaikan TS2322: Mengubah 'outline' menjadi 'info' atau 'default' */}
                              <Badge variant="info" className="border-blue-500 text-blue-400">
                                {formatDate(harvest.estimasiPanen)}
                              </Badge>
                            </div>
                        ))}
                      </div>
                  ) : (
                      <div className="text-center py-10 text-slate-500">Belum ada tanaman siap panen.</div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-400" /> Aktivitas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {data?.recentActivities && data.recentActivities.length > 0 ? (
                      <div className="space-y-4">
                        {data.recentActivities.map((activity) => (
                            <div key={activity.id} className="text-sm border-l-2 border-slate-700 pl-4 py-1">
                              <p className="text-white font-medium">{activity.description}</p>
                              <div className="flex justify-between mt-1">
                                <span className="text-slate-500 text-xs">{formatDate(activity.createdAt)}</span>
                                <span className={activity.amount > 0 ? 'text-green-400' : 'text-red-400'}>
                            {formatCurrency(activity.amount)}
                          </span>
                              </div>
                            </div>
                        ))}
                      </div>
                  ) : (
                      <div className="text-center py-10 text-slate-500">Tidak ada aktivitas.</div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
  );
}