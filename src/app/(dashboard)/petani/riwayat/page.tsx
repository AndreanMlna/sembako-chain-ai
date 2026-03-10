"use client";

import PageHeader from "@/components/shared/PageHeader";
import EmptyState from "@/components/shared/EmptyState";

export default function RiwayatPetaniPage() {
  return (
    <div>
      <PageHeader
        title="Riwayat"
        description="Riwayat penjualan dan transaksi Anda"
      />

      {/* TODO: Implement transaction history with filters */}
      <EmptyState
        icon="History"
        title="Belum ada riwayat"
        description="Riwayat transaksi akan muncul setelah Anda melakukan penjualan."
      />
    </div>
  );
}
