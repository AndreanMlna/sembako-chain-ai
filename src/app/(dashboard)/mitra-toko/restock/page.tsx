"use client";

import PageHeader from "@/components/shared/PageHeader";
import EmptyState from "@/components/shared/EmptyState";

export default function RestockPage() {
  return (
    <div>
      <PageHeader
        title="Auto-Restock"
        description="Notifikasi otomatis stok rendah dan request restock dari petani terdekat"
      />

      {/* TODO: Implement restock alerts and auto-matching with nearby farmers */}
      <EmptyState
        icon="RefreshCw"
        title="Tidak ada alert restock"
        description="Semua stok dalam kondisi aman. Alert akan muncul saat stok di bawah minimum."
      />
    </div>
  );
}
