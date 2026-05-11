"use client";

import { useState, useEffect, useCallback } from "react";
import { RefreshCw, MapPin, Wheat, ArrowRight, AlertCircle, CheckCircle2, ShoppingCart } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import EmptyState from "@/components/shared/EmptyState";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { cn, formatRupiah } from "@/lib/utils";
import { apiGet, apiPost } from "@/lib/api";

interface RestockAlert {
    id: string;
    produkId: string;
    produkNama: string;
    kategori: string;
    satuan: string;
    stok: number;
    minStok: number;
    shortage: number;
    percentage: number;
    severity: "danger" | "warning";
    hargaJual: number;
    petani: {
        id: string;
        nama: string;
        latitude: number | null;
        longitude: number | null;
    } | null;
}

interface OrderResult {
    orderId: string;
    petaniNama: string;
    produkNama: string;
    quantity: number;
    hargaSatuan: number;
    totalHarga: number;
    status: string;
}

export default function RestockPage() {
    const [alerts, setAlerts] = useState<RestockAlert[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Restock modal
    const [selectedAlert, setSelectedAlert] = useState<RestockAlert | null>(null);
    const [restockQty, setRestockQty] = useState(0);
    const [ordering, setOrdering] = useState(false);
    const [orderResult, setOrderResult] = useState<OrderResult | null>(null);
    const [orderError, setOrderError] = useState("");

    const fetchAlerts = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const res = await apiGet<RestockAlert[]>("/mitra-toko/restock-alerts");
            if (res.success && res.data) {
                setAlerts(res.data);
            } else {
                setError(res.message || "Gagal mengambil data");
            }
        } catch {
            setError("Gagal terhubung ke server");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAlerts();
    }, [fetchAlerts]);

    const openRestockModal = (alert: RestockAlert) => {
        setSelectedAlert(alert);
        setRestockQty(alert.shortage);
        setOrderResult(null);
        setOrderError("");
        setOrdering(false);
    };

    const handleRestockOrder = async () => {
        if (!selectedAlert || restockQty <= 0) return;
        setOrdering(true);
        setOrderError("");
        try {
            const res = await apiPost<OrderResult>(
                `/mitra-toko/restock-alerts/${selectedAlert.id}/order`,
                { quantity: restockQty }
            );
            if (res.success && res.data) {
                setOrderResult(res.data);
                fetchAlerts(); // Refresh alerts after order
            } else {
                setOrderError(res.message || "Gagal membuat order");
            }
        } catch {
            setOrderError("Gagal terhubung ke server");
        } finally {
            setOrdering(false);
        }
    };

    const getProgressColor = (pct: number) => {
        if (pct === 0) return "bg-red-500";
        if (pct < 50) return "bg-yellow-500";
        return "bg-orange-400";
    };

    return (
        <div className="space-y-6 animate-in">
            <PageHeader
                title="Auto-Restock"
                description="Notifikasi otomatis stok rendah dan rekomendasi suplai dari petani terdekat"
                action={
                    <Button
                        variant="outline"
                        size="sm"
                        className="font-bold border-primary/20 text-primary"
                        onClick={fetchAlerts}
                        disabled={loading}
                    >
                        <RefreshCw className={cn("mr-2 h-4 w-4", loading && "animate-spin")} />
                        Refresh
                    </Button>
                }
            />

            {loading ? (
                <LoadingSpinner />
            ) : error ? (
                <div className="text-center py-12 text-red-500">{error}</div>
            ) : alerts.length === 0 ? (
                <EmptyState
                    icon="CheckCircle2"
                    title="Semua stok aman"
                    description="Tidak ada produk yang membutuhkan restock. Alert akan muncul otomatis saat stok di bawah batas minimum."
                />
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {alerts.map((alert) => (
                        <Card
                            key={alert.id}
                            className={cn(
                                "border-l-4 overflow-hidden bg-card",
                                alert.severity === "danger"
                                    ? "border-l-red-500"
                                    : "border-l-yellow-500"
                            )}
                        >
                            <CardContent className="p-0">
                                <div className="flex flex-col lg:flex-row">
                                    {/* LEFT: Product Info */}
                                    <div className="flex-1 p-6 border-b lg:border-b-0 lg:border-r border-border">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <AlertCircle
                                                        className={cn(
                                                            "h-5 w-5",
                                                            alert.severity === "danger"
                                                                ? "text-red-500"
                                                                : "text-yellow-500"
                                                        )}
                                                    />
                                                    <h3 className="text-lg font-bold text-foreground">
                                                        {alert.produkNama}
                                                    </h3>
                                                </div>
                                                <p className="text-sm text-foreground/50">
                                                    Stok saat ini:{" "}
                                                    <span
                                                        className={cn(
                                                            "font-bold",
                                                            alert.severity === "danger"
                                                                ? "text-red-500"
                                                                : "text-yellow-500"
                                                        )}
                                                    >
                                                        {alert.stok}
                                                    </span>{" "}
                                                    / Min: {alert.minStok} {alert.satuan}
                                                </p>
                                            </div>
                                            <Badge variant={alert.severity === "danger" ? "danger" : "warning"}>
                                                {alert.severity === "danger" ? "HABIS" : `Kurang ${alert.shortage}`}
                                            </Badge>
                                        </div>

                                        <div className="mt-6 flex items-center gap-4">
                                            <div className="flex-1 h-2 bg-foreground/10 rounded-full overflow-hidden">
                                                <div
                                                    className={cn(
                                                        "h-full transition-all rounded-full",
                                                        getProgressColor(alert.percentage)
                                                    )}
                                                    style={{ width: `${Math.max(alert.percentage, 4)}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-bold text-foreground/40">
                                                {alert.percentage}%
                                            </span>
                                        </div>
                                    </div>

                                    {/* RIGHT: Recommendation */}
                                    <div className="flex-1 p-6 bg-primary/[0.03]">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="bg-primary/20 p-1.5 rounded-lg">
                                                <Wheat className="h-4 w-4 text-primary" />
                                            </div>
                                            <h4 className="text-sm font-bold text-primary uppercase tracking-wider">
                                                Rekomendasi Restock
                                            </h4>
                                        </div>

                                        {alert.petani ? (
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="h-4 w-4 text-foreground/40" />
                                                        <span className="text-sm font-bold text-foreground">
                                                            {alert.petani.nama}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-foreground/50">Harga Beli:</span>
                                                    <span className="font-bold text-foreground">
                                                        {formatRupiah(alert.hargaJual)}/{alert.satuan}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-foreground/50">Kebutuhan:</span>
                                                    <span className="font-bold text-foreground">
                                                        {alert.shortage} {alert.satuan}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 pt-2">
                                                    <Button
                                                        className="flex-1 font-bold"
                                                        onClick={() => openRestockModal(alert)}
                                                    >
                                                        Pesan Restock
                                                        <ArrowRight className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-foreground/50 py-4">
                                                Tidak ada data petani untuk produk ini. Tambahkan stok manual di halaman Inventori.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* RESTOCK ORDER MODAL */}
            <Modal
                isOpen={!!selectedAlert}
                onClose={() => setSelectedAlert(null)}
                title={orderResult ? "Order Berhasil Dibuat" : "Konfirmasi Restock"}
            >
                {selectedAlert && !orderResult ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 rounded-lg bg-foreground/5 p-4">
                            <ShoppingCart className="h-6 w-6 text-primary" />
                            <div>
                                <p className="font-bold text-foreground">{selectedAlert.produkNama}</p>
                                <p className="text-sm text-foreground/50">
                                    Stok: {selectedAlert.stok} → Restock: {restockQty} {selectedAlert.satuan}
                                </p>
                            </div>
                        </div>

                        {selectedAlert.petani && (
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-foreground/50">Petani:</span>
                                    <span className="font-bold">{selectedAlert.petani.nama}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-foreground/50">Harga per {selectedAlert.satuan}:</span>
                                    <span className="font-bold">{formatRupiah(selectedAlert.hargaJual)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-foreground/50">Total Estimasi:</span>
                                    <span className="font-bold text-primary">
                                        {formatRupiah(selectedAlert.hargaJual * restockQty)}
                                    </span>
                                </div>
                            </div>
                        )}

                        {orderError && (
                            <div className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-500">
                                {orderError}
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-2">
                            <Button variant="outline" onClick={() => setSelectedAlert(null)} disabled={ordering}>
                                Batal
                            </Button>
                            <Button onClick={handleRestockOrder} disabled={ordering || restockQty <= 0}>
                                {ordering ? "Memproses..." : "Konfirmasi Pesan"}
                            </Button>
                        </div>
                    </div>
                ) : orderResult ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 rounded-lg bg-green-500/10 p-4">
                            <CheckCircle2 className="h-8 w-8 text-green-500" />
                            <div>
                                <p className="font-bold text-foreground">Restock order berhasil dibuat!</p>
                                <p className="text-xs text-foreground/50">Order ID: {orderResult.orderId}</p>
                            </div>
                        </div>
                        <div className="space-y-2 text-sm border-y border-border py-3">
                            <div className="flex justify-between">
                                <span className="text-foreground/50">Produk:</span>
                                <span className="font-bold">{orderResult.produkNama}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-foreground/50">Petani:</span>
                                <span className="font-bold">{orderResult.petaniNama}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-foreground/50">Jumlah:</span>
                                <span className="font-bold">{orderResult.quantity}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-foreground/50">Total:</span>
                                <span className="font-bold text-primary">{formatRupiah(orderResult.totalHarga)}</span>
                            </div>
                        </div>
                        <Button className="w-full" onClick={() => setSelectedAlert(null)}>
                            Selesai
                        </Button>
                    </div>
                ) : null}
            </Modal>
        </div>
    );
}
