// copy-paste full kode ini ke src/components/cards/StatsCard.tsx

"use client";

import { cn } from "@/lib/utils";
import { type LucideIcon, Activity } from "lucide-react";
import * as LucideIcons from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export default function StatsCard({
                                    title,
                                    value,
                                    icon,
                                    trend,
                                    className,
                                  }: StatsCardProps) {
  const icons = LucideIcons as unknown as Record<string, LucideIcon>;
  const IconComponent = icons[icon] || Activity;

  return (
      <div
          className={cn(
              // Rounded dan border dasar
              "rounded-xl border shadow-sm transition-colors duration-300",
              // Mode Terang: Background mint pucat, teks hijau paling gelap
              "bg-sembako-accent border-sembako-light/20 text-sembako-darkest",
              // Mode Gelap: Background hijau hutan, border halus, teks putih mint
              "dark:bg-sembako-dark dark:border-sembako-light/10 dark:text-sembako-accent",
              className
          )}
      >
        <div className="flex items-start justify-between p-5">
          <div>
            {/* text-gray-500 -> text-inherit opacity-70 agar ikut warna parent */}
            <p className="text-sm font-medium text-inherit opacity-70">{title}</p>
            {/* text-gray-900 -> text-inherit */}
            <p className="mt-1 text-2xl font-bold text-inherit">{value}</p>
            {trend && (
                <p
                    className={cn(
                        "mt-1 text-xs font-medium",
                        // Warna trend menyesuaikan mode
                        trend.isPositive
                            ? "text-primary dark:text-sembako-light"
                            : "text-red-600 dark:text-red-400"
                    )}
                >
                  {trend.isPositive ? "+" : ""}
                  {trend.value}% dari minggu lalu
                </p>
            )}
          </div>
          {/* bg-green-50 -> bg-primary/10 (hijau transparan) */}
          <div className="rounded-lg bg-primary/10 p-2.5">
            {/* text-green-600 -> text-primary (mode terang), text-sembako-light (mode gelap) */}
            <IconComponent className="h-6 w-6 text-primary dark:text-sembako-light" />
          </div>
        </div>
      </div>
  );
}