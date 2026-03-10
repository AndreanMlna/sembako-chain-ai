"use client";

import { FileText, Download } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";

export default function LaporanPage() {
  return (
    <div>
      <PageHeader
        title="Laporan"
        description="Generate dan unduh laporan analitik"
      />

      <Card>
        <CardContent>
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Generate Laporan Baru
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="Tipe Laporan"
              options={[
                { value: "INFLASI", label: "Inflasi & Harga" },
                { value: "STOK", label: "Stok Pangan" },
                { value: "LAPANGAN_KERJA", label: "Lapangan Kerja" },
                { value: "TRANSAKSI", label: "Transaksi" },
              ]}
              placeholder="Pilih tipe"
            />
            <Select
              label="Wilayah"
              options={[
                { value: "NASIONAL", label: "Nasional" },
                { value: "JAWA_BARAT", label: "Jawa Barat" },
                { value: "JAWA_TENGAH", label: "Jawa Tengah" },
                { value: "JAWA_TIMUR", label: "Jawa Timur" },
              ]}
              placeholder="Pilih wilayah"
            />
            <Input label="Tanggal Mulai" type="date" />
            <Input label="Tanggal Selesai" type="date" />
          </div>
          <Button className="mt-4">
            <FileText className="h-4 w-4" />
            Generate Laporan
          </Button>
        </CardContent>
      </Card>

      {/* Report History */}
      <Card className="mt-6">
        <CardContent>
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Riwayat Laporan
          </h3>
          <p className="text-sm text-gray-500">Belum ada laporan yang di-generate.</p>
          {/* TODO: Implement report history with download links */}
        </CardContent>
      </Card>
    </div>
  );
}
