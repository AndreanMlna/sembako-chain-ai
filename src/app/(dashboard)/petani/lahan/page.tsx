"use client";

import { Plus } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/shared/EmptyState";

export default function LahanPage() {
  // TODO: Fetch lahan data from API

  return (
    <div>
      <PageHeader
        title="Data Lahan"
        description="Kelola data lahan pertanian Anda"
        action={
          <Button>
            <Plus className="h-4 w-4" />
            Tambah Lahan
          </Button>
        }
      />

      {/* TODO: Implement lahan list/grid with data */}
      <EmptyState
        icon="MapPin"
        title="Belum ada data lahan"
        description="Tambahkan data lahan pertanian Anda untuk mulai mengelola tanaman dan panen."
        actionLabel="Tambah Lahan Pertama"
        onAction={() => console.log("Add lahan")}
      />
    </div>
  );
}
