"use client";

import { useState } from "react";
import { Bell, CheckCheck, Trash2, Info, AlertTriangle, BadgeCheck } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/shared/EmptyState";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

const INITIAL_NOTIFICATIONS = [
    {
        id: 1,
        title: "Panen Berhasil",
        description: "Tanaman Padi di Lahan A telah berhasil dicatat panennya.",
        time: "2 jam yang lalu",
        type: "success",
        isRead: false,
    },
    {
        id: 2,
        title: "Peringatan Cuaca",
        description: "Prakiraan hujan lebat di wilayah Tegal sore ini. Cek saluran irigasi Anda.",
        time: "5 jam yang lalu",
        type: "warning",
        isRead: false,
    },
    {
        id: 3,
        title: "Dana Wallet Masuk",
        description: "Saldo sebesar Rp 500.000 telah ditambahkan ke wallet Anda.",
        time: "1 hari yang lalu",
        type: "info",
        isRead: true,
    },
];

export default function NotifikasiPage() {
    const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

    const markAllRead = () => {
        // Pakai 'n' secara konsisten
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    };

    const deleteNotif = (id: number) => {
        // Pakai 'n' secara konsisten
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const getIcon = (type: string) => {
        switch (type) {
            case "success": return <BadgeCheck className="h-5 w-5 text-primary" />;
            case "warning": return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
            default: return <Info className="h-5 w-5 text-blue-500" />;
        }
    };

    return (
        <div className="space-y-6 animate-in">
            <PageHeader
                title="Notifikasi"
                description="Semua pemberitahuan aktivitas Anda"
                action={
                    notifications.length > 0 && (
                        <Button variant="ghost" size="sm" onClick={markAllRead} className="text-primary hover:text-primary/80">
                            <CheckCheck className="mr-2 h-4 w-4" />
                            Tandai Semua Dibaca
                        </Button>
                    )
                }
            />

            {notifications.length > 0 ? (
                <div className="mx-auto max-w-3xl space-y-3">
                    {notifications.map((notif) => (
                        <Card
                            key={notif.id}
                            className={cn(
                                "transition-all duration-300 border-l-4 shadow-sm",
                                notif.isRead ? "border-l-border bg-card/50" : "border-l-primary bg-primary/5"
                            )}
                        >
                            <CardContent className="flex items-start gap-4 p-4">
                                <div className={cn(
                                    "mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                                    notif.isRead ? "bg-foreground/10" : "bg-primary/20"
                                )}>
                                    {getIcon(notif.type)}
                                </div>

                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className={cn(
                                            "text-sm font-bold",
                                            notif.isRead ? "text-foreground/70" : "text-foreground"
                                        )}>
                                            {notif.title}
                                        </h4>
                                        <span className="text-[10px] font-medium text-foreground/40 uppercase tracking-wider">
                      {notif.time}
                    </span>
                                    </div>
                                    <p className={cn(
                                        "text-sm leading-relaxed",
                                        notif.isRead ? "text-foreground/50" : "text-foreground/80"
                                    )}>
                                        {notif.description}
                                    </p>
                                </div>

                                <button
                                    onClick={() => deleteNotif(notif.id)}
                                    className="rounded-lg p-2 text-foreground/20 hover:bg-red-500/10 hover:text-red-500 transition-all"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon="Bell"
                    title="Tidak ada notifikasi"
                    description="Semua pemberitahuan aktivitas terbaru akan muncul di sini."
                />
            )}
        </div>
    );
}