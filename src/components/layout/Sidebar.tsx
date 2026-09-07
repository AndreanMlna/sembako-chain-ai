"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, APP_NAME } from "@/constants";
import * as LucideIcons from "lucide-react";
import { Circle, type LucideIcon } from "lucide-react";
import { UserRole } from "@/types";

interface SidebarProps {
    role: UserRole;
}

export default function Sidebar({ role }: SidebarProps) {
    const pathname = usePathname();

    // Memastikan role valid sebagai key untuk NAV_ITEMS
    const navItems = NAV_ITEMS[role] || [];

    // Casting LucideIcons agar TypeScript tidak bingung saat indexing
    const icons = LucideIcons as unknown as Record<string, LucideIcon>;

    return (
        <div className="h-full flex flex-col bg-transparent">
            <nav className="flex-1 flex flex-col gap-1 px-4 py-4 md:py-8">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    // Ambil komponen icon, jika tidak ketemu pakai Circle sebagai fallback
                    const IconComponent = icons[item.icon] || Circle;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 group",
                                isActive
                                    ? "bg-white/10 text-white shadow-lg shadow-black/20"
                                    : "text-accent/50 hover:bg-white/5 hover:text-accent"
                            )}
                        >
                            <IconComponent className={cn(
                                "h-5 w-5 transition-all duration-300",
                                isActive ? "text-primary scale-110" : "text-accent/30 group-hover:text-accent/60"
                            )} />
                            <span>{item.label}</span>
                            {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer Sidebar (Optional) */}
            <div className="p-6 mt-auto border-t border-white/5 opacity-20 hidden md:block">
                <p className="text-[10px] text-accent font-medium uppercase tracking-widest">
                    v1.0.0 Stable
                </p>
            </div>
        </div>
    );
}