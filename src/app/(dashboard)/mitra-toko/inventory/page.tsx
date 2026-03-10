"use client";

import { Plus } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import SearchBar from "@/components/shared/SearchBar";
import EmptyState from "@/components/shared/EmptyState";

export default function InventoryPage() {
  return (
    <div>
      <PageHeader
        title="Inventori"
        description="Kelola stok produk di toko Anda"
        action={
          <Button>
            <Plus className="h-4 w-4" />
            Tambah Produk
          </Button>
        }
      />

      <div className="mb-4">
        <SearchBar
          placeholder="Cari produk..."
          onSearch={(q) => console.log("Search:", q)}
        />
      </div>

      {/* TODO: Implement inventory table with CRUD */}
      <EmptyState
        icon="Package"
        title="Inventori kosong"
        description="Tambahkan produk untuk mulai mengelola stok toko Anda."
        actionLabel="Tambah Produk"
        onAction={() => console.log("Add product")}
      />
    </div>
  );
}
