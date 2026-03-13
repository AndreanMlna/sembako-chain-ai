"use client";

import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth-store"; // Pakai store auth kita
import {
    LayoutDashboard, ShoppingBag, Truck,
    Sprout, Database, Wallet, User
} from "lucide-react";

// Pisahkan list menu berdasarkan Role
const MENU_PEMBELI = [
    { name: "Dashboard", href: "/pembeli", icon: LayoutDashboard },
    { name: "Katalog", href: "/pembeli/katalog", icon: ShoppingBag },
    { name: "Pre-Order", href: "/pembeli/pre-order", icon: Sprout },
    // ... dst
];

const MENU_PETANI = [
    { name: "Dashboard", href: "/petani", icon: LayoutDashboard },
    { name: "Data Lahan", href: "/petani/lahan", icon: Database },
    // ... dst
];

export default function Sidebar() {
    const pathname = usePathname();
    const { user } = useAuthStore(); // Ambil data user & role

    // LOGIC FIX: Tentukan menu berdasarkan Role User, bukan cuma URL
    const menus = user?.role === "petani" ? MENU_PETANI : MENU_PEMBELI;

    return (
        <aside className="w-64 border-r border-border bg-card/50">
            <nav className="space-y-1 p-4">
                {menus.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                            pathname === item.href ? "bg-primary/10 text-primary" : "text-foreground/50 hover:text-foreground"
                        )}
                    >
                        <item.icon className="h-4 w-4" />
                        {item.name}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}