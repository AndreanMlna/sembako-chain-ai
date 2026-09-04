"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import StatsCard from "@/components/cards/StatsCard";
import { apiGet } from "@/lib/api";

interface RegulatorStats {
  distribusiUser: {
    petani: number;
    kurir: number;
    toko: number;
  };
  lapanganKerjaBaru: string;
}

export default function LapanganKerjaPage() {
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
        console.error("Gagal memuat data lapangan kerja:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const petaniCount = stats ? stats.distribusiUser.petani.toLocaleString("id-ID") : "0";
  const kurirCount = stats ? stats.distribusiUser.kurir.toLocaleString("id-ID") : "0";
  const tokoCount = stats ? stats.distribusiUser.toko.toLocaleString("id-ID") : "0";
  const totalCount = stats?.lapanganKerjaBaru || "0";

  return (
    <div>
      <PageHeader
        title="Data Lapangan Kerja"
        description="Impact penciptaan lapangan kerja digital di rantai pasok pangan"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Petani Terdaftar" value={loading ? "..." : petaniCount} icon="Wheat" />
        <StatsCard title="Kurir Aktif" value={loading ? "..." : kurirCount} icon="Truck" />
        <StatsCard title="Mitra Toko" value={loading ? "..." : tokoCount} icon="Store" />
        <StatsCard title="Total Lapangan Kerja" value={loading ? "..." : totalCount} icon="Users" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Pertumbuhan Tenaga Kerja
          </h3>
          <p className="text-sm text-gray-500">
            Sebaran pengguna aktif terverifikasi di rantai distribusi sembako.
          </p>
          <div className="mt-4 space-y-3">
            <div>
              <div className="flex justify-between text-sm font-medium">
                <span className="text-gray-600">Sektor Petani / Produsen</span>
                <span className="text-gray-900 font-semibold">{petaniCount} Pengguna</span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "65%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-medium">
                <span className="text-gray-600">Sektor Kurir Logistik</span>
                <span className="text-gray-900 font-semibold">{kurirCount} Pengguna</span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: "25%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-medium">
                <span className="text-gray-600">Sektor Toko Pengecer</span>
                <span className="text-gray-900 font-semibold">{tokoCount} Pengguna</span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: "15%" }} />
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Distribusi Ekosistem
          </h3>
          <p className="text-sm text-gray-500">
            Rasio pemberdayaan tenaga kerja lokal pada rantai pasok berbasis AI.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-3xl font-extrabold text-emerald-600">{loading ? "..." : totalCount}</p>
            <p className="text-sm font-medium text-gray-700 mt-1">Total Entitas Ekonomi Terhubung</p>
            <p className="text-xs text-gray-500 mt-1">Mendorong digitalisasi desa dan transparansi logistik sembako nasional.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

