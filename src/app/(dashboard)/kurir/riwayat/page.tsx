"use client";

import { useState, useEffect, useCallback } from "react";
import { History, MapPin, Package, Calendar, Search, Download, CheckCircle2 } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import EmptyState from "@/components/shared/EmptyState";
import { Card, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import SearchBar from "@/components/shared/SearchBar";
import { apiGet } from "@/lib/api";

interface DeliveryHistoryItem {
  id: string;
  date: string;
  time: string;
  store: string;
  item: string;
  pickup: string;
  dropoff: string;
  fee: number;
  distance: string;
  status: string;
}

export default function RiwayatKurirPage() {
  const [history, setHistory] = useState<DeliveryHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGet<DeliveryHistoryItem[]>("/kurir/jobs/history");
      if (res.success && Array.isArray(res.data)) {
        setHistory(res.data);
      }
    } catch (err) {
      console.error("Gagal memuat riwayat pengiriman kurir:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const filteredHistory = history.filter(
    (job) =>
      job.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.dropoff.toLowerCase().includes(searchQuery.toLowerCase())
  );


  function handleDownloadRekap() {
    if (history.length === 0) {
      alert("Belum ada data riwayat pengiriman untuk direkap.");
      return;
    }

    const headers = ["ID Pengiriman", "Tanggal", "Waktu", "Muatan", "Tujuan", "Jarak", "Ongkos Kirim (Rp)", "Status"];
    const rows = history.map((item) => [
      item.id,
      item.date,
      `${item.time} WIB`,
      `"${item.item.replace(/"/g, '""')}"`,
      `"${item.dropoff.replace(/"/g, '""')}"`,
      item.distance,
      item.fee,
      item.status,
    ]);

    const totalFee = history.reduce((acc, curr) => acc + curr.fee, 0);
    rows.push(["", "", "", "", "TOTAL PENDAPATAN", "", totalFee, ""]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rekap_Gaji_Kurir_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="space-y-6 animate-in">
      <PageHeader
        title="Riwayat Pengiriman"
        description="Pantau semua pekerjaan yang telah Anda selesaikan"
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadRekap}
            className="font-bold border-border bg-card"
          >
            <Download className="mr-2 h-4 w-4" />
            Rekap Gaji
          </Button>
        }
      />

            {/* Filter & Search */}
            <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex-1">
                    <SearchBar
                        placeholder="Cari ID pengiriman atau nama lokasi..."
                        onSearch={(q) => setSearchQuery(q)}
                    />
                </div>
                <Button variant="outline" className="h-11 border-border bg-card font-bold" onClick={fetchHistory} disabled={loading}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Segarkan
                </Button>
            </div>

            {filteredHistory.length > 0 ? (
                <div className="space-y-4">
                    {filteredHistory.map((job) => (
                        <Card key={job.id} className="border-border bg-card hover:border-primary/50 transition-all overflow-hidden">
                            <CardContent className="p-0">
                                <div className="flex flex-col md:flex-row md:items-center p-5 gap-6">

                                    {/* Info Status & ID */}
                                    <div className="flex items-center gap-4 md:w-1/4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
                                            <CheckCircle2 className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-primary uppercase tracking-widest">{job.id}</p>
                                            <p className="text-sm font-bold text-foreground">{job.date}</p>
                                            <p className="text-[10px] text-foreground/40 font-bold uppercase">{job.time} WIB</p>
                                        </div>
                                    </div>

                                    {/* Route Info */}
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-primary" />
                                            <p className="text-xs text-foreground/60 leading-tight">
                                                <span className="font-bold text-foreground">Pickup:</span> {job.pickup}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-red-500" />
                                            <p className="text-xs text-foreground/60 leading-tight">
                                                <span className="font-bold text-foreground">Dropoff:</span> {job.dropoff}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Earnings & Details */}
                                    <div className="flex items-center justify-between md:flex-col md:items-end md:justify-center md:w-1/4 gap-1">
                                        <div className="text-left md:text-right">
                                            <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Ongkos Kirim</p>
                                            <p className="text-lg font-black text-primary">Rp {job.fee.toLocaleString("id-ID")}</p>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-foreground/40 uppercase">
                                            <MapPin className="h-3 w-3" />
                                            {job.distance}
                                        </div>
                                    </div>

                                </div>

                                {/* Footer Item Info */}
                                <div className="bg-foreground/[0.02] border-t border-border px-5 py-2 flex items-center gap-2">
                                    <Package className="h-3 w-3 text-foreground/30" />
                                    <p className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider">
                                        Muatan: <span className="text-foreground">{job.item}</span>
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon="History"
                    title={loading ? "Memuat riwayat pengiriman..." : "Belum ada riwayat pengiriman"}
                    description={loading ? "Mengambil data dari database..." : "Riwayat pekerjaan pengiriman yang Anda selesaikan akan otomatis tercatat di sini."}
                />
            )}
        </div>
    );
}