"use client";

import PageHeader from "@/components/shared/PageHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { KATEGORI_KOMODITAS } from "@/constants";

export default function InflasiPage() {
  return (
    <div className="space-y-6 animate-in pb-20">
      <PageHeader
        title="Dashboard Inflasi"
        description="Monitoring dan prediksi pergerakan harga komoditas pangan"
      />

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
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
        <Select>
          <SelectTrigger className="w-full sm:w-48 bg-card border-border">
            <SelectValue placeholder="Periode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7 Hari</SelectItem>
            <SelectItem value="30d">30 Hari</SelectItem>
            <SelectItem value="90d">90 Hari</SelectItem>
            <SelectItem value="1y">1 Tahun</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* TODO: Integrate PriceChart component with real data */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-bold text-foreground">
          Grafik Harga vs Prediksi AI
        </h3>
        <p className="text-sm text-foreground/60">
          Grafik pergerakan harga pasar dibandingkan dengan prediksi AI (LSTM).
        </p>
        {/* TODO: <PriceChart data={...} /> */}
      </div>

      {/* Commodity Table */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-bold text-foreground">
          Tabel Harga Komoditas
        </h3>
        <p className="text-sm text-foreground/60">
          Perbandingan harga per komoditas per wilayah.
        </p>
        {/* TODO: Implement commodity price table */}
      </div>
    </div>
  );
}
