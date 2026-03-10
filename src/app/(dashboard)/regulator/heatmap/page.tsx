"use client";

import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import Select from "@/components/ui/Select";
import { KATEGORI_KOMODITAS } from "@/constants";

export default function HeatmapPage() {
  const komoditasOptions = KATEGORI_KOMODITAS.map((k) => ({
    value: k,
    label: k,
  }));

  return (
    <div>
      <PageHeader
        title="Heatmap Stok Pangan"
        description="Visualisasi distribusi stok pangan nasional"
      />

      {/* Filters */}
      <div className="mb-6">
        <Select
          options={komoditasOptions}
          placeholder="Pilih Komoditas"
          className="w-full sm:w-48"
        />
      </div>

      {/* Map */}
      <Card className="h-96 lg:h-[500px]">
        <CardContent className="flex h-full items-center justify-center">
          <p className="text-gray-500">
            {/* TODO: Integrate heatmap (Mapbox/Google Maps/Leaflet) */}
            Heatmap stok pangan nasional akan ditampilkan di sini.
            <br />
            Warna menunjukkan level stok: Merah (kritis), Kuning (rendah), Hijau
            (aman).
          </p>
        </CardContent>
      </Card>

      {/* Regional Stats */}
      <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Statistik per Wilayah
        </h3>
        <p className="text-sm text-gray-500">
          Detail stok dan harga per wilayah.
        </p>
        {/* TODO: Implement regional stats table */}
      </div>
    </div>
  );
}
