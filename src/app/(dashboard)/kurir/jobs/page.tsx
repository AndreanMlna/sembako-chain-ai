"use client";

import PageHeader from "@/components/shared/PageHeader";
import EmptyState from "@/components/shared/EmptyState";
import SearchBar from "@/components/shared/SearchBar";

export default function JobMarketplacePage() {
  return (
    <div>
      <PageHeader
        title="Job Marketplace"
        description="Temukan dan ambil pekerjaan pengiriman yang tersedia"
      />

      <div className="mb-4 flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <SearchBar
            placeholder="Cari berdasarkan area..."
            onSearch={(q) => console.log("Search:", q)}
          />
        </div>
        {/* TODO: Add filter by distance, earnings */}
      </div>

      {/* TODO: Implement job listing cards with accept button */}
      <EmptyState
        icon="Briefcase"
        title="Belum ada job tersedia"
        description="Job pengiriman baru akan muncul di sini. Pastikan status Anda 'Tersedia'."
      />
    </div>
  );
}
