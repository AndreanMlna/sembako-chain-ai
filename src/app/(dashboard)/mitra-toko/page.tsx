"use client";

import PageHeader from "@/components/shared/PageHeader";
import StatsCard from "@/components/cards/StatsCard";

export default function MitraTokoDashboard() {
  return (
    <div>
      <PageHeader
        title="Dashboard Mitra Toko"
        description="Ringkasan inventori dan penjualan toko Anda"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Produk" value="45" icon="Package" />
        <StatsCard
          title="Stok Rendah"
          value="8"
          icon="AlertTriangle"
          trend={{ value: -12, isPositive: false }}
        />
        <StatsCard
          title="Penjualan Hari Ini"
          value="Rp 1.250.000"
          icon="CreditCard"
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard title="Order Masuk" value="12" icon="ShoppingCart" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Alert Restock
          </h3>
          <p className="text-sm text-gray-500">
            Produk yang perlu di-restock segera.
          </p>
          {/* TODO: Implement restock alerts */}
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Penjualan Terbaru
          </h3>
          <p className="text-sm text-gray-500">
            Transaksi POS terbaru.
          </p>
          {/* TODO: Implement recent sales */}
        </div>
      </div>
    </div>
  );
}
