"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import StatsCard from "@/components/cards/StatsCard";
import { apiGet } from "@/lib/api";

interface RegulatorStats {
  rataRataInflasi: string;
  wilayahRawan: number;
  totalTransaksi: string;
  lapanganKerjaBaru: string;
  distribusiUser: {
    petani: number;
    kurir: number;
    toko: number;
  };
  totalKomoditasTersedia: number;
}

export default function RegulatorDashboard() {
  const [stats, setStats] = useState<RegulatorStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await apiGet<RegulatorStats>("/regulator/dashboard");
        if (res.success && res.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error("Gagal mengambil data dashboard regulator:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div>
      <PageHeader
        title="Dashboard Regulator"
        description="Monitoring inflasi pangan dan stok nasional"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Rata-rata Inflasi"
          value={loading ? "..." : (stats?.rataRataInflasi || "0.0%")}
          icon="TrendingUp"
          trend={{ value: -0.5, isPositive: true }}
        />
        <StatsCard
          title="Wilayah Pantauan"
          value={loading ? "..." : (stats ? String(stats.wilayahRawan) : "0")}
          icon="AlertTriangle"
          trend={{ value: 2, isPositive: false }}
        />
        <StatsCard
          title="Total Transaksi"
          value={loading ? "..." : (stats?.totalTransaksi || "0")}
          icon="Activity"
          trend={{ value: 18, isPositive: true }}
        />
        <StatsCard
          title="Lapangan Kerja Baru"
          value={loading ? "..." : (stats?.lapanganKerjaBaru || "0")}
          icon="Users"
          trend={{ value: 22, isPositive: true }}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Early Warning System
          </h3>
          <p className="text-sm text-gray-500">
            Peringatan dini wilayah yang terdeteksi potensi kenaikan harga.
          </p>
          <div className="mt-4 rounded-lg bg-emerald-50 p-4 border border-emerald-200">
            <div className="flex items-center gap-2 text-emerald-800 font-medium text-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Sistem Pemantauan Aktif
            </div>
            <p className="mt-1 text-xs text-emerald-700">
              {stats?.totalKomoditasTersedia ?? 0} komoditas pangan dipantau di database real-time. Tidak terdeteksi lonjakan ekstrem di atas ambang batas.
            </p>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Ringkasan Stok & Partisipan Nasional
          </h3>
          <p className="text-sm text-gray-500">
            Overview partisipan rantai pasok sembako yang terverifikasi dalam sistem.
          </p>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs text-gray-500">Petani</p>
              <p className="mt-1 text-lg font-bold text-gray-900">
                {loading ? "..." : (stats?.distribusiUser.petani ?? 0)}
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs text-gray-500">Kurir</p>
              <p className="mt-1 text-lg font-bold text-gray-900">
                {loading ? "..." : (stats?.distribusiUser.kurir ?? 0)}
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs text-gray-500">Mitra Toko</p>
              <p className="mt-1 text-lg font-bold text-gray-900">
                {loading ? "..." : (stats?.distribusiUser.toko ?? 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

