"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type LucideIcon, Circle } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types";
import { NAV_ITEMS } from "@/constants";

const icons = LucideIcons as unknown as Record<string, LucideIcon>;

interface SidebarProps {
  role: UserRole;
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const navItems = NAV_ITEMS[role] || [];

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-white md:block">
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const IconComponent = icons[item.icon] || Circle;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-green-50 text-green-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <IconComponent className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
