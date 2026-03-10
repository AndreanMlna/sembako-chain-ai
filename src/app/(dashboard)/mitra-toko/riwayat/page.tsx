"use client";

import PageHeader from "@/components/shared/PageHeader";
import EmptyState from "@/components/shared/EmptyState";

export default function RiwayatTokoPage() {
  return (
    <div>
      <PageHeader
        title="Riwayat Transaksi"
        description="Riwayat penjualan dan restock toko"
      />

      {/* TODO: Implement transaction history with date filter */}
      <EmptyState
        icon="History"
        title="Belum ada riwayat"
        description="Riwayat transaksi POS dan restock akan muncul di sini."
      />
    </div>
  );
}
