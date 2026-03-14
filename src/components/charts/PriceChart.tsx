"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatRupiah } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/Card";

interface PriceChartProps {
  data: {
    tanggal: string;
    hargaAktual: number;
    hargaPrediksi?: number;
  }[];
  title?: string;
}

export default function PriceChart({ data, title }: PriceChartProps) {
  return (
      <Card className="border-border bg-card shadow-sm">
        <CardContent className="p-6">
          {title && (
              <h3 className="mb-6 text-lg font-bold text-foreground tracking-tight">{title}</h3>
          )}
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              {/* Stroke grid pakai warna border agar adaptif */}
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-10" />
              <XAxis
                  dataKey="tanggal"
                  fontSize={12}
                  tick={{ fill: 'currentColor' }}
                  className="opacity-50"
              />
              <YAxis
                  fontSize={10}
                  tick={{ fill: 'currentColor' }}
                  className="opacity-50"
                  tickFormatter={(value) => formatRupiah(value)}
              />
              <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    borderColor: 'var(--border)',
                    borderRadius: '8px',
                    color: 'var(--foreground)'
                  }}
                  itemStyle={{ fontWeight: 'bold' }}
                  formatter={(value) => [formatRupiah(Number(value)), ""]}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Line
                  type="monotone"
                  dataKey="hargaAktual"
                  name="Harga Aktual"
                  stroke="var(--primary)" // Pakai warna brand Sembako-Chain
                  strokeWidth={3}
                  dot={{ r: 4, fill: 'var(--primary)', strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
              />
              {data.some((d) => d.hargaPrediksi !== undefined) && (
                  <Line
                      type="monotone"
                      dataKey="hargaPrediksi"
                      name="Prediksi AI"
                      stroke="#f59e0b" // Kuning cerah untuk pembeda AI
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                  />
              )}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
  );
}