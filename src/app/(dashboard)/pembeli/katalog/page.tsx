"use client";

import PageHeader from "@/components/shared/PageHeader";
import SearchBar from "@/components/shared/SearchBar";
import Select from "@/components/ui/Select";
import { KATEGORI_KOMODITAS } from "@/constants";

export default function KatalogPage() {
  const kategoriOptions = [
    { value: "", label: "Semua Kategori" },
    ...KATEGORI_KOMODITAS.map((k) => ({ value: k, label: k })),
  ];

  return (
    <div>
      <PageHeader
        title="Katalog Produk"
        description="Cari bahan pangan segar berdasarkan jarak terdekat"
      />

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <SearchBar
            placeholder="Cari produk..."
            onSearch={(q) => console.log("Search:", q)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select options={kategoriOptions} placeholder="Kategori" />
        </div>
      </div>

      {/* TODO: Implement product grid with ProdukCard components */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <p className="col-span-full py-12 text-center text-sm text-gray-500">
          Produk akan ditampilkan berdasarkan jarak terdekat dari lokasi Anda.
        </p>
      </div>
    </div>
  );
}
