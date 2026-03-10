"use client";

import PageHeader from "@/components/shared/PageHeader";
import StatsCard from "@/components/cards/StatsCard";

export default function RegulatorDashboard() {
  return (
    <div>
      <PageHeader
        title="Dashboard Regulator"
        description="Monitoring inflasi pangan dan stok nasional"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Rata-rata Inflasi"
          value="3.2%"
          icon="TrendingUp"
          trend={{ value: -0.5, isPositive: true }}
        />
        <StatsCard
          title="Wilayah Rawan"
          value="12"
          icon="AlertTriangle"
          trend={{ value: 2, isPositive: false }}
        />
        <StatsCard
          title="Total Transaksi"
          value="45.230"
          icon="Activity"
          trend={{ value: 18, isPositive: true }}
        />
        <StatsCard
          title="Lapangan Kerja Baru"
          value="1.250"
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
          {/* TODO: Implement early warning alerts */}
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Ringkasan Stok Nasional
          </h3>
          <p className="text-sm text-gray-500">
            Overview stok komoditas strategis.
          </p>
          {/* TODO: Implement national stock summary chart */}
        </div>
      </div>
    </div>
  );
}
