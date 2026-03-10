"use client";

import PageHeader from "@/components/shared/PageHeader";
import EmptyState from "@/components/shared/EmptyState";

export default function PreOrderPage() {
  return (
    <div>
      <PageHeader
        title="Pre-Order Panen"
        description="Pesan hasil panen sebelum dipanen untuk harga lebih baik"
      />

      {/* TODO: Implement pre-order listing from upcoming harvests */}
      <EmptyState
        icon="CalendarClock"
        title="Belum ada pre-order tersedia"
        description="Pre-order akan tersedia saat ada petani yang membuka jadwal panen mendatang."
      />
    </div>
  );
}
