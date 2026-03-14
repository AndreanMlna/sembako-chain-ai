"use client";

import { Plus, MapPin, Ruler, Sprout } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/shared/EmptyState";
import { Card, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function LahanPage() {
    const hasData = true;
    const dataLahan = [
        { id: 1, nama: "Lahan Utara 01", luas: 500, status: "Aktif", lokasi: "Tegal Timur" },
        { id: 2, nama: "Lahan Sawah Hijau", luas: 1200, status: "Persiapan", lokasi: "Adiwerna" },
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="Data Lahan"
                description="Kelola data lahan pertanian Anda"
                action={
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Tambah Lahan
                    </Button>
                }
            />

            {!hasData ? (
                <EmptyState
                    icon="MapPin"
                    title="Belum ada data lahan"
                    description="Tambahkan data lahan pertanian Anda untuk mulai mengelola tanaman dan panen."
                    actionLabel="Tambah Lahan Pertama"
                    onAction={() => console.log("Add lahan")}
                />
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {dataLahan.map((lahan) => (
                        <Card key={lahan.id} className="group hover:border-primary/50 transition-all cursor-pointer">
                            <CardContent className="p-5">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="rounded-lg bg-primary/10 p-2 text-primary">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    {/* FIX: Menggunakan 'default' sebagai pengganti 'secondary' */}
                                    <Badge variant={lahan.status === "Aktif" ? "success" : "default"}>
                                        {lahan.status}
                                    </Badge>
                                </div>

                                <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                                    {lahan.nama}
                                </h3>
                                <p className="text-sm text-foreground/50 mb-4 flex items-center gap-1">
                                    <MapPin className="h-3 w-3" /> {lahan.lokasi}
                                </p>

                                <div className="flex items-center gap-4 border-t border-border pt-4">
                                    <div className="flex items-center gap-1.5">
                                        <Ruler className="h-4 w-4 text-primary" />
                                        <span className="text-sm font-medium">{lahan.luas} m²</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Sprout className="h-4 w-4 text-primary" />
                                        <span className="text-sm font-medium">1 Tanaman</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}