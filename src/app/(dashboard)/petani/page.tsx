"use client";

import PageHeader from "@/components/shared/PageHeader";
import StatsCard from "@/components/cards/StatsCard";

export default function PetaniDashboard() {
  return (
    <div>
      <PageHeader
        title="Dashboard Petani"
        description="Ringkasan data lahan, panen, dan penjualan Anda"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Lahan"
          value="3 Lahan"
          icon="MapPin"
          trend={{ value: 0, isPositive: true }}
        />
        <StatsCard
          title="Tanaman Aktif"
          value="12"
          icon="Wheat"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Siap Panen"
          value="5"
          icon="Package"
        />
        <StatsCard
          title="Saldo Wallet"
          value="Rp 2.450.000"
          icon="Wallet"
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      {/* TODO: Add recent activity, upcoming harvest, alerts sections */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Panen Mendatang
          </h3>
          <p className="text-sm text-gray-500">
            Daftar tanaman yang akan segera dipanen.
          </p>
          {/* TODO: Implement upcoming harvest list */}
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Aktivitas Terakhir
          </h3>
          <p className="text-sm text-gray-500">
            Riwayat transaksi dan aktivitas terbaru.
          </p>
          {/* TODO: Implement recent activity list */}
        </div>
      </div>
    </div>
  );
}
