"use client";

import PageHeader from "@/components/shared/PageHeader";
import StatsCard from "@/components/cards/StatsCard";

export default function PembeliDashboard() {
  return (
    <div>
      <PageHeader
        title="Dashboard Pembeli"
        description="Temukan bahan pangan segar dari petani terdekat"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Pesanan Aktif" value="2" icon="ShoppingCart" />
        <StatsCard title="Dalam Pengiriman" value="1" icon="Truck" />
        <StatsCard title="Total Belanja" value="Rp 850.000" icon="Wallet" />
        <StatsCard title="Pre-Order" value="3" icon="CalendarClock" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Produk Terdekat
          </h3>
          <p className="text-sm text-gray-500">
            Produk segar dari petani di sekitar lokasi Anda.
          </p>
          {/* TODO: Implement nearby products */}
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Pesanan Terbaru
          </h3>
          <p className="text-sm text-gray-500">
            Status pesanan terbaru Anda.
          </p>
          {/* TODO: Implement recent orders */}
        </div>
      </div>
    </div>
  );
}
