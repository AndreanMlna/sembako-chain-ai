"use client";

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
    const navItems = NAV_ITEMS[role] || [];
    const visibleItems = navItems.slice(0, 5);

    return (
        /* GANTI: bg-white jadi bg-background, border-t otomatis ikut variabel */
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden transition-colors duration-300">
            <div className="flex items-center justify-around">
                {visibleItems.map((item) => {
                    const isActive = pathname === item.href;
                    const IconComponent = icons[item.icon] || Circle;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center gap-1 px-2 py-2 text-[10px] transition-colors",
                                /* GANTI: text-green-700 jadi text-primary, text-gray-500 jadi text-foreground/50 */
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