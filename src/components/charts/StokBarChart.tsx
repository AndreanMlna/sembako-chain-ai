"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/Card";

interface StokBarChartProps {
  data: {
    komoditas: string;
    stok: number;
    permintaan: number;
  }[];
  title?: string;
}

export default function StokBarChart({ data, title }: StokBarChartProps) {
  return (
      <Card className="border-border bg-card shadow-sm">
        <CardContent className="p-6">
          {title && (
              <h3 className="mb-6 text-lg font-bold text-foreground tracking-tight">{title}</h3>
          )}
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-10" vertical={false} />
              <XAxis
                  dataKey="komoditas"
                  fontSize={12}
                  tick={{ fill: 'currentColor' }}
                  className="opacity-50"
              />
              <YAxis
                  fontSize={10}
                  tick={{ fill: 'currentColor' }}
                  className="opacity-50"
              />
              <Tooltip
                  cursor={{ fill: 'var(--primary)', opacity: 0.05 }}
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    borderColor: 'var(--border)',
                    borderRadius: '8px',
                  }}
              />
              <Legend verticalAlign="top" height={36} />
              <Bar
                  dataKey="stok"
                  name="Stok"
                  fill="var(--primary)"
                  radius={[4, 4, 0, 0]}
              />
              <Bar
                  dataKey="permintaan"
                  name="Permintaan"
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                  opacity={0.8}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
  );
}