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
    <div className={cn("rounded-xl border bg-white p-5 shadow-sm", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p
              className={cn(
                "mt-1 text-xs font-medium",
                trend.isPositive ? "text-green-600" : "text-red-600"
              )}
            >
              {trend.isPositive ? "+" : ""}
              {trend.value}% dari minggu lalu
            </p>
          )}
        </div>
        <div className="rounded-lg bg-green-50 p-2.5">
          <IconComponent className="h-6 w-6 text-green-600" />
        </div>
      </div>
    </div>
  );
}
