"use client";

import PageHeader from "@/components/shared/PageHeader";
import Select from "@/components/ui/Select";
import { KATEGORI_KOMODITAS } from "@/constants";

export default function InflasiPage() {
  const komoditasOptions = KATEGORI_KOMODITAS.map((k) => ({
    value: k,
    label: k,
  }));

  return (
    <div>
      <PageHeader
        title="Dashboard Inflasi"
        description="Monitoring dan prediksi pergerakan harga komoditas pangan"
      />

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <Select
          options={komoditasOptions}
          placeholder="Pilih Komoditas"
          className="w-full sm:w-48"
        />
        <Select
          options={[
            { value: "7d", label: "7 Hari" },
            { value: "30d", label: "30 Hari" },
            { value: "90d", label: "90 Hari" },
            { value: "1y", label: "1 Tahun" },
          ]}
          placeholder="Periode"
          className="w-full sm:w-48"
        />
      </div>

      {/* TODO: Integrate PriceChart component with real data */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Grafik Harga vs Prediksi AI
        </h3>
        <p className="text-sm text-gray-500">
          Grafik pergerakan harga pasar dibandingkan dengan prediksi AI (LSTM).
        </p>
        {/* TODO: <PriceChart data={...} /> */}
      </div>

      {/* Commodity Table */}
      <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Tabel Harga Komoditas
        </h3>
        <p className="text-sm text-gray-500">
          Perbandingan harga per komoditas per wilayah.
        </p>
        {/* TODO: Implement commodity price table */}
      </div>
    </div>
  );
}
