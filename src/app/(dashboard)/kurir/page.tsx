"use client";

import PageHeader from "@/components/shared/PageHeader";
import StatsCard from "@/components/cards/StatsCard";

export default function KurirDashboard() {
  return (
    <div>
      <PageHeader
        title="Dashboard Kurir"
        description="Ringkasan pengiriman dan pekerjaan Anda"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Job Tersedia" value="8" icon="Briefcase" />
        <StatsCard
          title="Pengiriman Hari Ini"
          value="5"
          icon="Truck"
          trend={{ value: 10, isPositive: true }}
        />
        <StatsCard title="Rating" value="4.8" icon="Star" />
        <StatsCard
          title="Pendapatan Hari Ini"
          value="Rp 185.000"
          icon="Wallet"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Job Aktif
          </h3>
          <p className="text-sm text-gray-500">Tidak ada job aktif saat ini.</p>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Pengiriman Terakhir
          </h3>
          <p className="text-sm text-gray-500">Daftar pengiriman terbaru.</p>
        </div>
      </div>
    </div>
  );
}
