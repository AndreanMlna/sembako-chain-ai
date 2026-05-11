"use client";

import { useState, useEffect } from "react";
import { Bell, CheckCheck, Trash2, Info, AlertTriangle, BadgeCheck } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/shared/EmptyState";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { apiGet, apiPatch } from "@/lib/api";

interface Notif {
    id: string; judul: string; pesan: string; tipe: string;
    dibaca: boolean; createdAt: string; link?: string;
}

export default function NotifikasiPage() {
    const [notifs, setNotifs] = useState<Notif[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifs = async () => {
        try {
            const res = await apiGet<Notif[]>("/notifikasi");
            if (res.success && res.data) setNotifs(res.data);
        } catch { /* silent */ } finally { setLoading(false); }
    };

    useEffect(() => { fetchNotifs(); }, []);

    const markAllRead = async () => {
        await apiPatch("/notifikasi", { readAll: true });
        setNotifs((prev) => prev.map((n) => ({ ...n, dibaca: true })));
    };

    const markRead = async (id: string) => {
        await apiPatch("/notifikasi", { id });
        setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, dibaca: true } : n)));
    };

    const getIcon = (tipe: string) => {
        switch (tipe) {
            case "SUKSES": return <BadgeCheck className="h-5 w-5 text-green-500" />;
            case "PERINGATAN": return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
            case "ERROR": return <AlertTriangle className="h-5 w-5 text-red-500" />;
            default: return <Info className="h-5 w-5 text-blue-500" />;
        }
    };

    const unreadCount = notifs.filter((n) => !n.dibaca).length;

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-6 animate-in">
            <PageHeader
                title={`Notifikasi${unreadCount > 0 ? ` (${unreadCount})` : ""}`}
                description="Semua pemberitahuan aktivitas Anda"
                action={
                    notifs.length > 0 && (
                        <Button variant="ghost" size="sm" onClick={markAllRead} className="text-primary">
                            <CheckCheck className="mr-2 h-4 w-4" /> Tandai Semua Dibaca
                        </Button>
                    )
                }
            />

            {notifs.length > 0 ? (
                <div className="mx-auto max-w-3xl space-y-3">
                    {notifs.map((notif) => (
                        <div key={notif.id} onClick={() => !notif.dibaca && markRead(notif.id)} className="cursor-pointer">
                        <Card className={cn(
                                "transition-all duration-300 border-l-4 shadow-sm cursor-pointer",
                                notif.dibaca ? "border-l-border bg-card/50" : "border-l-primary bg-primary/5"
                            )}
                        >
                            <CardContent className="flex items-start gap-4 p-4">
                                <div className={cn("mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full", notif.dibaca ? "bg-foreground/10" : "bg-primary/20")}>
                                    {getIcon(notif.tipe)}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className={cn("text-sm font-bold", notif.dibaca ? "text-foreground/70" : "text-foreground")}>
                                            {notif.judul}
                                        </h4>
                                        <span className="text-[10px] font-medium text-foreground/40 uppercase">
                                            {new Date(notif.createdAt).toLocaleDateString("id-ID")}
                                        </span>
                                    </div>
                                    <p className={cn("text-sm", notif.dibaca ? "text-foreground/50" : "text-foreground/80")}>
                                        {notif.pesan}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState icon="Bell" title="Tidak ada notifikasi" description="Semua pemberitahuan aktivitas terbaru akan muncul di sini." />
            )}
        </div>
    );
}
