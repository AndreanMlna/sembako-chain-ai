"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/constants";
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
        <div className="h-full bg-transparent py-4">
            <nav className="flex flex-col gap-1 px-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    // Ambil komponen icon, jika tidak ketemu pakai Circle sebagai fallback
                    const IconComponent = icons[item.icon] || Circle;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-accent/20 text-accent shadow-sm ring-1 ring-white/10"
                                    : "text-accent/60 hover:bg-white/5 hover:text-accent"
                            )}
                        >
                            <IconComponent className={cn(
                                "h-5 w-5 transition-colors",
                                isActive ? "text-accent" : "text-accent/40"
                            )} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}