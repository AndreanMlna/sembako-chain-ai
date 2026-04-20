"use client";

import PageHeader from "@/components/shared/PageHeader";
import StatsCard from "@/components/cards/StatsCard";

export default function LapanganKerjaPage() {
  return (
    <div className="space-y-8 animate-in pb-20">
      <PageHeader
        title="Data Lapangan Kerja"
        description="Impact penciptaan lapangan kerja digital di pedesaan"
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Petani Terdaftar" value="5.230" icon="Wheat" />
        <StatsCard title="Kurir Aktif" value="1.450" icon="Truck" />
        <StatsCard title="Mitra Toko" value="820" icon="Store" />
        <StatsCard title="Agri-Enumerator" value="350" icon="ClipboardCheck" />
      </div>

      {/* TODO: Implement employment impact charts and regional breakdown */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-foreground">
            Pertumbuhan Tenaga Kerja
          </h3>
          <p className="text-sm text-foreground/60">
            Grafik pertumbuhan pengguna per kategori pekerjaan.
          </p>
          {/* TODO: Line chart showing growth over time */}
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-foreground">
            Distribusi per Wilayah
          </h3>
          <p className="text-sm text-foreground/60">
            Sebaran tenaga kerja digital per provinsi.
          </p>
          {/* TODO: Bar chart per region */}
        </div>
      </div>
    </div>
  );
}
