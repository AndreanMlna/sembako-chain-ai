"use client";

import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { KATEGORI_KOMODITAS } from "@/constants";

export default function HeatmapPage() {
  return (
    <div className="space-y-6 animate-in pb-20">
      <PageHeader
        title="Heatmap Stok Pangan"
        description="Visualisasi distribusi stok pangan nasional"
      />

      {/* Filters */}
      <div className="mb-6">
        <Select>
          <SelectTrigger className="w-full sm:w-48 bg-card border-border">
            <SelectValue placeholder="Pilih Komoditas" />
          </SelectTrigger>
          <SelectContent>
            {KATEGORI_KOMODITAS.map((komoditas) => (
              <SelectItem key={komoditas} value={komoditas}>
                {komoditas}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Map */}
      <Card className="h-96 lg:h-[500px]">
        <CardContent className="flex h-full items-center justify-center">
          <p className="text-foreground/60">
            {/* TODO: Integrate heatmap (Mapbox/Google Maps/Leaflet) */}
            Heatmap stok pangan nasional akan ditampilkan di sini.
            <br />
            Warna menunjukkan level stok: Merah (kritis), Kuning (rendah), Hijau
            (aman).
          </p>
        </CardContent>
      </Card>

      {/* Regional Stats */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-bold text-foreground">
          Statistik per Wilayah
        </h3>
        <p className="text-sm text-foreground/60">
          Detail stok dan harga per wilayah.
        </p>
        {/* TODO: Implement regional stats table */}
      </div>
    </div>
  );
}
