"use client";

import { ShoppingCart, Truck, Wallet, CalendarClock, MapPin, Star, ArrowRight, PackageCheck } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import StatsCard from "@/components/cards/StatsCard";
import { Card, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
// --- IMPORT INI YANG KURANG ---
import { cn } from "@/lib/utils";

export default function PembeliDashboard() {
    // Dummy data produk terdekat
    const nearbyProducts = [
        { id: 1, name: "Beras Pandan Wangi", seller: "Petani Ahmad", price: "Rp 14.500/kg", dist: "1.2 km", rating: 4.8 },
        { id: 2, name: "Telur Ayam Negeri", seller: "Peternakan Berkah", price: "Rp 26.000/kg", dist: "2.5 km", rating: 4.9 },
    ];

    // Dummy data pesanan terbaru
    const recentOrders = [
        { id: "ORD-7721", status: "Dikirim", item: "Sembako Mingguan", total: "Rp 215.000" },
        { id: "ORD-7715", status: "Selesai", item: "Beras & Minyak", total: "Rp 150.000" },
    ];

    return (
        <div className="space-y-6 animate-in">
            <PageHeader
                title="Dashboard Pembeli"
                description="Temukan bahan pangan segar langsung dari sumbernya"
                action={
                    <Button size="sm" className="font-bold shadow-lg shadow-primary/20">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Belanja Sekarang
                    </Button>
                }
            />

            {/* STATS SECTION */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard title="Pesanan Aktif" value="2" icon="ShoppingCart" />
                <StatsCard title="Dalam Pengiriman" value="1" icon="Truck" />
                <StatsCard title="Total Belanja" value="Rp 850.000" icon="Wallet" />
                <StatsCard title="Pre-Order" value="3" icon="CalendarClock" />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* PRODUK TERDEKAT */}
                <Card className="border-border bg-card">
                    <CardContent className="p-6">
                        <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-primary" />
                                <h3 className="text-lg font-bold text-foreground">Produk Terdekat</h3>
                            </div>
                            <Button variant="ghost" size="sm" className="text-xs text-primary font-bold">Lihat Semua</Button>
                        </div>

                        <div className="space-y-4">
                            {nearbyProducts.map((product) => (
                                <div key={product.id} className="group flex items-center justify-between rounded-xl border border-border p-3 hover:border-primary/50 hover:bg-primary/[0.02] transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                            <PackageCheck className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-foreground leading-tight">{product.name}</p>
                                            <p className="text-[10px] text-foreground/50 font-medium">{product.seller} • {product.dist}</p>
                                            <div className="flex items-center gap-1 mt-1">
                                                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                                <span className="text-[10px] font-bold text-foreground/60">{product.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-primary">{product.price}</p>
                                        <button className="mt-1 text-[10px] font-bold text-foreground/30 group-hover:text-primary transition-colors">
                                            + Keranjang
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* PESANAN TERBARU */}
                <Card className="border-border bg-card">
                    <CardContent className="p-6">
                        <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
                            <div className="flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5 text-primary" />
                                <h3 className="text-lg font-bold text-foreground">Pesanan Terbaru</h3>
                            </div>
                            <Button variant="ghost" size="sm" className="text-xs text-foreground/40">Riwayat</Button>
                        </div>

                        <div className="divide-y divide-border">
                            {recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between py-4">
                                    <div className="flex items-center gap-3">
                                        {/* FUNGSI cn DIGUNAKAN DI SINI */}
                                        <div className={cn(
                                            "flex h-10 w-10 items-center justify-center rounded-full text-xs font-black shadow-inner",
                                            order.status === "Dikirim" ? "bg-yellow-500/10 text-yellow-600" : "bg-primary/10 text-primary"
                                        )}>
                                            {order.status === "Dikirim" ? "TR" : "OK"}
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-foreground/30 uppercase tracking-tighter">{order.id}</p>
                                            <p className="text-sm font-bold text-foreground">{order.item}</p>
                                            <Badge variant={order.status === "Dikirim" ? "warning" : "success"} className="text-[9px] h-4 mt-1">
                                                {order.status}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-foreground">{order.total}</p>
                                        <ArrowRight className="h-4 w-4 ml-auto mt-1 text-foreground/20" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}