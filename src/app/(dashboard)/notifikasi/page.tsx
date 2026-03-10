"use client";

import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/shared/EmptyState";

export default function NotifikasiPage() {
  return (
    <div>
      <PageHeader
        title="Notifikasi"
        description="Semua notifikasi dan pemberitahuan"
        action={
          <Button variant="ghost" size="sm">
            Tandai Semua Dibaca
          </Button>
        }
      />

      {/* TODO: Implement notification list */}
      <EmptyState
        icon="Bell"
        title="Tidak ada notifikasi"
        description="Notifikasi baru akan muncul di sini."
      />
    </div>
  );
}
