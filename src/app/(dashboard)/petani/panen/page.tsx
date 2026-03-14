"use client";

import { Calendar, Sprout, CheckCircle2, Timer } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import EmptyState from "@/components/shared/EmptyState";
import { Card, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function ManajemenPanenPage() {
    // Mock data - Nanti ganti dengan fetch API
    const hasData = true;
    const dataPanen = [
        {
            id: 1,
            tanaman: "Padi Ciherang",
            lahan: "Lahan Utara 01",
            status: "Siap Panen",
            progress: 100,
            tglPanen: "15 Mar 2026"
        },
        {
            id: 2,
            tanaman: "Jagung Manis",
            lahan: "Lahan Sawah Hijau",
            status: "Pertumbuhan",
            progress: 65,
            tglPanen: "28 Apr 2026"
        },
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="Manajemen Panen"
                description="Kelola jadwal panen dan status tanaman Anda"
            />

            {!hasData ? (
                <EmptyState
                    icon="Wheat"
                    title="Belum ada data panen"
                    description="Data panen akan muncul setelah Anda menambahkan tanaman di lahan."
                />
            ) : (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {dataPanen.map((panen) => (
                        <Card key={panen.id} className="overflow-hidden border-l-4 border-l-primary">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-bold text-foreground">{panen.tanaman}</h3>
                                        <p className="text-sm text-foreground/50 flex items-center gap-1">
                                            <Sprout className="h-3 w-3" /> {panen.lahan}
                                        </p>
                                    </div>
                                    <Badge variant={panen.status === "Siap Panen" ? "success" : "info"}>
                                        {panen.status}
                                    </Badge>
                                </div>

                                {/* Progress Bar */}
                                <div className="space-y-2 mb-6">
                                    <div className="flex justify-between text-xs font-medium">
                                        <span className="text-foreground/60">Progress Pertumbuhan</span>
                                        <span className="text-primary">{panen.progress}%</span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-primary/10">
                                        <div
                                            className="h-full rounded-full bg-primary transition-all duration-500"
                                            style={{ width: `${panen.progress}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between border-t border-border pt-4">
                                    <div className="flex items-center gap-2 text-sm text-foreground/70">
                                        <Calendar className="h-4 w-4 text-primary" />
                                        <span>Estimasi Panen: <strong>{panen.tglPanen}</strong></span>
                                    </div>

                                    {panen.status === "Siap Panen" ? (
                                        <button className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                                            <CheckCircle2 className="h-4 w-4" /> Proses Panen
                                        </button>
                                    ) : (
                                        <div className="text-xs text-foreground/40 flex items-center gap-1 italic">
                                            <Timer className="h-4 w-4" /> Menunggu...
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}