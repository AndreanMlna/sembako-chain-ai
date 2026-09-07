"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, MapPin, Truck, CheckCircle2, Clock, Navigation, Phone, Box, Loader2, ShieldCheck, Image as ImageIcon } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import EmptyState from "@/components/shared/EmptyState";
import { Card, CardContent } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { apiGet } from "@/lib/api";

interface OrderTracking {
  id: string;
  totalHarga: number;
  ongkosKirim: number;
  status: string;
  createdAt: string;
  alamatPengiriman?: string;
  qrCode?: string;
  items: Array<{
    id: string;
    jumlah: number;
    produk: {
      nama: string;
      satuan: string;
    };
  }>;
  job?: {
    id: string;
    status: string;
    estimasiJarak?: number;
    estimasiWaktu?: number;
    kurir?: {
      nama: string;
      telepon?: string;
    };
  };
}

function TrackingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<OrderTracking[]>([]);
  const [searchId, setSearchId] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrderTracking | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGet<OrderTracking[]>("/pembeli/orders");
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setOrders(res.data);
        const paramId = searchParams.get("id") || searchParams.get("orderId");
        if (paramId) {
          const matched = res.data.find(
            (o) => o.id === paramId || o.id.toLowerCase().includes(paramId.toLowerCase())
          );
          setSelectedOrder(matched || res.data[0]);
        } else {
          setSelectedOrder(res.data[0]);
        }
      }
    } catch (err) {
      console.error("Gagal mengambil data tracking pesanan:", err);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleSearch = () => {
    if (!searchId.trim()) return;
    const found = orders.find((o) =>
      o.id.toLowerCase().includes(searchId.trim().toLowerCase())
    );
    if (found) {
      setSelectedOrder(found);
    }
  };

  const currentStatus = selectedOrder?.status || "PENDING";
  const isCompleted = currentStatus === "DELIVERED" || currentStatus === "SELESAI";
  const isInTransit = currentStatus === "IN_TRANSIT" || currentStatus === "PICKED_UP" || currentStatus === "DALAM_PENGIRIMAN";
  const isConfirmed = currentStatus === "CONFIRMED" || currentStatus === "DIKONFIRMASI" || isInTransit || isCompleted;

  const orderDate = selectedOrder
    ? new Date(selectedOrder.createdAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Hari ini";

  const trackingSteps = [
    {
      status: isCompleted ? "Selesai" : "Pending",
      desc: "Pesanan Diterima di Tujuan",
      time: isCompleted ? "Selesai" : "Menunggu pengantaran",
      active: isCompleted,
    },
    {
      status: isInTransit ? "Proses" : isCompleted ? "Selesai" : "Pending",
      desc: "Kurir Menuju Lokasi Anda",
      time: isInTransit ? "Sedang Berjalan" : isCompleted ? "Telah Lewat" : "Menunggu kurir",
      active: isInTransit,
    },
    {
      status: isConfirmed ? "Selesai" : "Pending",
      desc: "Barang Diproses & Siap Kirim",
      time: isConfirmed ? orderDate : "Menunggu konfirmasi",
      active: !isInTransit && !isCompleted && isConfirmed,
    },
    {
      status: "Selesai",
      desc: "Pesanan Dibuat & Terverifikasi",
      time: orderDate,
      active: false,
    },
  ];

  const courierName = selectedOrder?.job?.kurir?.nama || "Kurir Mitra Sembako";
  const courierPhone = selectedOrder?.job?.kurir?.telepon || "-";
  const estDistance = selectedOrder?.job?.estimasiJarak ? `${selectedOrder.job.estimasiJarak} km` : "3.5 km";


  if (loading) {
    return (
      <div className="space-y-6 animate-in">
        <PageHeader
          title="Tracking Pengiriman"
          description="Pantau posisi kurir dan estimasi waktu tiba pesanan Anda"
        />
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-semibold text-foreground/50">Menghubungkan ke satelit logistik & status pesanan...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="space-y-6 animate-in">
        <PageHeader
          title="Tracking Pengiriman"
          description="Pantau posisi kurir dan estimasi waktu tiba pesanan Anda"
        />
        <EmptyState
          icon="Truck"
          title="Belum ada pengiriman aktif"
          description="Pesanan yang sedang dikirim akan otomatis terlacak di sini secara real-time. Silakan lakukan pemesanan melalui katalog sembako."
          actionLabel="Mulai Belanja"
          onAction={() => router.push("/pembeli/katalog")}
        />
      </div>
    );
  }

  return (
      <div className="space-y-6 animate-in">
        <PageHeader
            title="Tracking Pengiriman"
            description="Pantau posisi kurir dan estimasi waktu tiba pesanan Anda"
        />

        {/* SEARCH BAR */}
        <Card className="border-border bg-card/50">
          <CardContent className="p-4 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/30" />
              <Input
                  placeholder="Masukkan nomor pesanan (contoh: ORD-7721)..."
                  className="pl-10 bg-background border-border"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button className="font-bold shadow-lg shadow-primary/20" onClick={handleSearch}>
              LACAK SEKARANG
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* LEFT: REAL-TIME INTERACTIVE MAP */}
          <div className="lg:col-span-2">
            <Card className="h-[500px] border-border bg-card relative overflow-hidden group shadow-lg flex flex-col">
              <CardContent className="flex flex-col h-full justify-between p-0 relative">
                {/* Live OpenStreetMap Embed */}
                <div className="relative w-full h-full min-h-[380px]">
                  <iframe
                    title="Live Tracking Map Pembeli"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=109.09%2C-7.02%2C109.18%2C-6.95&layer=mapnik&marker=-6.9856%2C109.1352`}
                    className="w-full h-full border-0 absolute inset-0"
                    loading="lazy"
                  />

                  {/* Pulsing Live Courier Tracker Overlay */}
                  <div className="absolute top-4 left-4 z-10">
                    <div className="flex items-center gap-2 rounded-xl bg-background/90 backdrop-blur-md px-3.5 py-2 shadow-lg border border-border">
                      <span className="relative flex h-3 w-3">
                        <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", isCompleted ? "bg-emerald-500" : "bg-primary")} />
                        <span className={cn("relative inline-flex rounded-full h-3 w-3", isCompleted ? "bg-emerald-500" : "bg-primary")} />
                      </span>
                      <span className="text-xs font-bold text-foreground">
                        {isCompleted
                          ? "Pesanan Telah Tiba di Lokasi Anda"
                          : isInTransit
                          ? "Kurir Sedang Dalam Perjalanan (Live GPS)"
                          : "Kurir Sedang Mengambil Paket di Gudang"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Map Overlay Stats */}
                <div className="z-10 flex flex-wrap justify-between items-center gap-3 p-4 bg-background/95 backdrop-blur-md border-t border-border">
                  <div className="max-w-md">
                    <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest leading-none mb-1">
                      Tujuan Pengiriman
                    </p>
                    <p className="text-sm font-bold text-foreground line-clamp-1">
                      {selectedOrder?.alamatPengiriman || "Alamat Pembeli, Kab. Tegal"}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest leading-none mb-1">
                        Sisa Jarak
                      </p>
                      <p className="text-sm font-black text-primary">
                        {selectedOrder?.job?.estimasiJarak ? `${selectedOrder.job.estimasiJarak} KM` : "±3.8 KM"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest leading-none mb-1">
                        Estimasi Tiba
                      </p>
                      <p className="text-sm font-black text-yellow-500">
                        {isCompleted ? "Tiba" : selectedOrder?.job?.estimasiWaktu ? `${selectedOrder.job.estimasiWaktu} Menit` : "15 Menit"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: TRACKING STATUS TIMELINE */}
          <div>
            <Card className="h-full border-border bg-card">
              <CardContent className="p-6">
                <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
                  <div>
                    <h3 className="text-base font-bold text-foreground">Timeline Pengantaran</h3>
                    <p className="text-xs text-foreground/40 font-bold uppercase mt-0.5 tracking-wider">
                      {selectedOrder ? `ORD-${selectedOrder.id.slice(-4).toUpperCase()}` : "PESANAN"}
                    </p>
                  </div>
                  <Badge variant={isCompleted ? "success" : isInTransit ? "warning" : "default"} className="font-bold">
                    {currentStatus}
                  </Badge>
                </div>

                {/* Timeline Items */}
                <div className="relative space-y-10 before:absolute before:left-[11px] before:top-2 before:h-[calc(100%-24px)] before:w-0.5 before:bg-border/50">
                  {trackingSteps.map((step, idx) => (
                      <div key={idx} className="relative flex items-start gap-6 pl-8">
                        {/* Circle Indicator */}
                        <div className={cn(
                            "absolute left-0 h-6 w-6 rounded-full border-4 border-background z-10 flex items-center justify-center",
                            step.active ? "bg-primary animate-pulse" :
                                step.status === "Selesai" ? "bg-primary/40" : "bg-border"
                        )}>
                          {step.status === "Selesai" && <CheckCircle2 className="h-3 w-3 text-white" />}
                        </div>

                        <div className="flex-1">
                          <p className={cn(
                              "text-sm font-bold leading-tight",
                              step.active ? "text-foreground" : "text-foreground/40"
                          )}>
                            {step.desc}
                          </p>
                          <p className="text-[10px] font-medium text-foreground/30 mt-1 uppercase tracking-wider">
                            {step.time}
                          </p>
                        </div>
                      </div>
                  ))}
                </div>

                {/* Courier Info Card */}
                <div className="mt-10 rounded-2xl bg-primary/5 border border-primary/10 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-foreground/10 overflow-hidden border-2 border-background shadow-sm flex items-center justify-center text-primary font-bold">
                        <Truck className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-foreground uppercase leading-none">{courierName}</p>
                        <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-tighter">
                          {selectedOrder?.job ? "Kurir Mitra Sembako-Chain" : "Kurir Standby"}
                        </p>
                      </div>
                    </div>
                    <a
                      href={`tel:${courierPhone}`}
                      className="h-9 w-9 flex items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                      title={courierPhone}
                    >
                      <Phone className="h-4 w-4" />
                    </a>
                  </div>
                </div>

                {/* Delivery Photo Proof for Buyer */}
                {isCompleted && selectedOrder?.qrCode?.startsWith("BUKTI:") && (
                  <div className="mt-4 rounded-2xl border border-primary/30 bg-primary/5 p-4 space-y-3 animate-in">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-primary" />
                      <p className="text-xs font-bold text-foreground">Foto Bukti Penerimaan Barang</p>
                    </div>
                    <div className="relative rounded-xl overflow-hidden border border-border shadow max-h-52 bg-black">
                      <img
                        src={selectedOrder.qrCode.replace("BUKTI:", "")}
                        alt="Bukti Serah Terima"
                        className="w-full h-auto max-h-52 object-contain mx-auto"
                      />
                    </div>
                    <p className="text-[10px] text-foreground/50 text-center font-medium">
                      Foto diambil langsung oleh kurir saat paket sembako diserahkan.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  );
}

export default function TrackingPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-semibold text-foreground/50">Memuat modul tracking...</p>
      </div>
    }>
      <TrackingContent />
    </Suspense>
  );
}