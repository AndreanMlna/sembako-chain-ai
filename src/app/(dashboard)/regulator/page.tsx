"use client";

import PageHeader from "@/components/shared/PageHeader";
import StatsCard from "@/components/cards/StatsCard";

export default function RegulatorDashboard() {
  return (
    <div className="space-y-8 animate-in pb-20">
      <PageHeader
        title="Dashboard Regulator"
        description="Monitoring inflasi pangan dan stok nasional"
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-foreground">
            Early Warning System
          </h3>
          <p className="text-sm text-foreground/60">
            Peringatan dini wilayah yang terdeteksi potensi kenaikan harga.
          </p>
          {/* TODO: Implement early warning alerts */}
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-foreground">
            Ringkasan Stok Nasional
          </h3>
          <p className="text-sm text-foreground/60">
            Overview stok komoditas strategis.
          </p>
          {/* TODO: Implement national stock summary chart */}
        </div>
      </div>
    </div>
  );
}
