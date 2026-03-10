"use client";

import PageHeader from "@/components/shared/PageHeader";
import EmptyState from "@/components/shared/EmptyState";

export default function RiwayatKurirPage() {
  return (
    <div>
      <PageHeader
        title="Riwayat Pengiriman"
        description="Riwayat job dan pengiriman Anda"
      />

      <EmptyState
        icon="History"
        title="Belum ada riwayat"
        description="Riwayat pengiriman akan muncul setelah Anda menyelesaikan job."
      />
    </div>
  );
}
