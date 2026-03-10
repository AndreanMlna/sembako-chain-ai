"use client";

import PageHeader from "@/components/shared/PageHeader";
import EmptyState from "@/components/shared/EmptyState";

export default function ManajemenPanenPage() {
  // TODO: Fetch tanaman/panen data from API

  return (
    <div>
      <PageHeader
        title="Manajemen Panen"
        description="Kelola jadwal panen dan status tanaman Anda"
      />

      {/* TODO: Implement harvest management with filters by status */}
      <EmptyState
        icon="Wheat"
        title="Belum ada data panen"
        description="Data panen akan muncul setelah Anda menambahkan tanaman di lahan."
      />
    </div>
  );
}
