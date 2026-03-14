"use client";

import { useState } from "react";
import { Search, Filter, Download, Calendar, Eye, ShoppingBag, ArrowRight } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import SearchBar from "@/components/shared/SearchBar";
import { cn } from "@/lib/utils";

// Dummy Data Riwayat Transaksi
const TRANSACTION_HISTORY = [
    {
        id: "TRX-8821",
        date: "14 Mar 2026",
        time: "10:30",
        customer: "Umum",
        total: 125000,
        items: 4,
        status: "Selesai",
        payment: "Tunai"
    },
    {
        id: "TRX-8820",
        date: "14 Mar 2026",
        time: "09:15",
        customer: "Warung Bu Siti",
        total: 450000,
        items: 12,
        status: "Selesai",
        payment: "E-Wallet"
    },
    {
        id: "TRX-8819",
        date: "13 Mar 2026",
        time: "16:45",
        customer: "Umum",
        total: 32000,
        items: 2,
        status: "Dibatalkan",
        payment: "-"
    },
    {
        id: "TRX-8818",
        date: "13 Mar 2026",
        time: "14:20",
        customer: "Katering Berkah",
        total: 1200000,
        items: 25,
        status: "Selesai",
        payment: "Transfer"
    }
];

export default function RiwayatPage() {
    const [transactions] = useState(TRANSACTION_HISTORY);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Selesai": return <Badge variant="success" className="font-bold">Selesai</Badge>;
            case "Dibatalkan": return <Badge variant="danger" className="font-bold">Batal</Badge>;
            default: return <Badge variant="warning" className="font-bold">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6 animate-in">
            <PageHeader
                title="Riwayat Transaksi"
                description="Pantau semua transaksi masuk dan keluar dari toko Anda"
                action={
                    <Button variant="outline" size="sm" className="font-bold border-border bg-card">
                        <Download className="mr-2 h-4 w-4" />
                        Export Laporan
                    </Button>
                }
            />

            {/* FILTER & SEARCH */}
            <Card className="border-border bg-card/50">
                <CardContent className="p-4 flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <SearchBar placeholder="Cari ID transaksi atau nama pelanggan..." onSearch={() => {}} />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="border-border bg-card">
                            <Calendar className="mr-2 h-4 w-4" />
                            Tanggal
                        </Button>
                        <Button variant="outline" className="border-border bg-card">
                            <Filter className="mr-2 h-4 w-4" />
                            Filter
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* TRANSACTION LIST */}
            <div className="space-y-3">
                {transactions.map((trx) => (
                    <Card key={trx.id} className="group border-border hover:border-primary/50 transition-all bg-card overflow-hidden">
                        <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row md:items-center p-5 gap-4">
                                {/* ID & Time */}
                                <div className="flex items-center gap-4 md:w-1/4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <ShoppingBag className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-foreground uppercase">{trx.id}</p>
                                        <p className="text-xs text-foreground/50">{trx.date} • {trx.time}</p>
                                    </div>
                                </div>

                                {/* Customer */}
                                <div className="md:w-1/4">
                                    <p className="text-xs font-medium text-foreground/40 uppercase tracking-wider">Pelanggan</p>
                                    <p className="text-sm font-bold text-foreground">{trx.customer}</p>
                                </div>

                                {/* Total & Payment */}
                                <div className="md:w-1/4">
                                    <p className="text-xs font-medium text-foreground/40 uppercase tracking-wider">Total Transaksi</p>
                                    <p className="text-sm font-black text-foreground">Rp {trx.total.toLocaleString("id-ID")}</p>
                                    <p className="text-[10px] font-bold text-primary">{trx.payment}</p>
                                </div>

                                {/* Status & Action */}
                                <div className="flex items-center justify-between md:justify-end md:w-1/4 gap-4">
                                    {getStatusBadge(trx.status)}
                                    <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground/5 text-foreground/50 hover:bg-primary hover:text-white transition-all">
                                        <Eye className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* FOOTER INFO */}
            <div className="flex justify-center pt-4">
                <p className="text-sm text-foreground/40 italic font-medium">
                    Menampilkan {transactions.length} transaksi terakhir
                </p>
            </div>
        </div>
    );
}