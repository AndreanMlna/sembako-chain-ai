"use client";

import PageHeader from "@/components/shared/PageHeader";
import EmptyState from "@/components/shared/EmptyState";

export default function PesananPage() {
  return (
    <div>
      <PageHeader
        title="Pesanan Saya"
        description="Daftar semua pesanan Anda"
      />

      {/* TODO: Implement order list with status filters */}
      <EmptyState
        icon="Package"
        title="Belum ada pesanan"
        description="Pesanan Anda akan muncul di sini setelah melakukan pembelian."
        actionLabel="Mulai Belanja"
        onAction={() => console.log("Go to katalog")}
      />
    </div>
  );
}
