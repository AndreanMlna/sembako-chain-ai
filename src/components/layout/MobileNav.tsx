"use client";

import { useState, useEffect } from "react"; // Tambahkan useEffect & useState
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type LucideIcon, Circle } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types";
import { NAV_ITEMS } from "@/constants";

const icons = LucideIcons as unknown as Record<string, LucideIcon>;

interface MobileNavProps {
    role: UserRole;
}

export default function MobileNav({ role }: MobileNavProps) {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false); // State untuk handle hydration

    // Pastikan komponen hanya me-render konten dinamis setelah mounted di client
    useEffect(() => {
        setMounted(true);
    }, []);

    const navItems = NAV_ITEMS[role] || [];
    const visibleItems = navItems.slice(0, 5);

    // Mencegah mismatch antara Server HTML dan Client HTML
    if (!mounted) {
        return <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden h-16" />;
    }

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden transition-colors duration-300">
            {/* suppressHydrationWarning tetap dipertahankan untuk menangkal gangguan ekstensi browser */}
            <div className="flex items-center justify-around" suppressHydrationWarning>
                {visibleItems.map((item) => {
                    const isActive = pathname === item.href;
                    const IconComponent = icons[item.icon] || Circle;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center gap-1 px-2 py-2 text-[10px] transition-colors",
                                isActive ? "text-primary font-bold" : "text-foreground/50"
                            )}
                        >
                            <IconComponent className={cn("h-5 w-5", isActive && "scale-110")} />
                            <span className="truncate">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}