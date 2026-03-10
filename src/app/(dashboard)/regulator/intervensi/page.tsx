"use client";

import { Plus } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/shared/EmptyState";

export default function IntervensiPage() {
  return (
    <div>
      <PageHeader
        title="Intervensi Pasar"
        description="Berikan subsidi ongkir/harga ke wilayah yang terdeteksi inflasi"
        action={
          <Button>
            <Plus className="h-4 w-4" />
            Buat Intervensi Baru
          </Button>
        }
      />

      {/* TODO: Implement intervention form and list */}
      {/* Features: subsidi ongkir digital, subsidi harga, distribusi langsung */}
      <EmptyState
        icon="Shield"
        title="Belum ada intervensi aktif"
        description="Buat intervensi pasar baru untuk menstabilkan harga di wilayah yang terdeteksi inflasi."
        actionLabel="Buat Intervensi"
        onAction={() => console.log("Create intervention")}
      />
    </div>
  );
}
