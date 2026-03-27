"use client";

import { FileText, Download } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
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
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Pilih tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INFLASI">Inflasi & Harga</SelectItem>
                <SelectItem value="STOK">Stok Pangan</SelectItem>
                <SelectItem value="LAPANGAN_KERJA">Lapangan Kerja</SelectItem>
                <SelectItem value="TRANSAKSI">Transaksi</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Pilih wilayah" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NASIONAL">Nasional</SelectItem>
                <SelectItem value="JAWA_BARAT">Jawa Barat</SelectItem>
                <SelectItem value="JAWA_TENGAH">Jawa Tengah</SelectItem>
                <SelectItem value="JAWA_TIMUR">Jawa Timur</SelectItem>
              </SelectContent>
            </Select>
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
          <p className="text-sm text-gray-500">
            Belum ada laporan yang di-generate.
          </p>
          {/* TODO: Implement report history with download links */}
        </CardContent>
      </Card>
    </div>
  );
}
