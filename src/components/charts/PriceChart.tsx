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
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      {title && (
        <h3 className="mb-4 text-lg font-semibold text-gray-900">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="tanggal" fontSize={12} />
          <YAxis
            fontSize={12}
            tickFormatter={(value) => formatRupiah(value)}
          />
          <Tooltip
            formatter={(value) => formatRupiah(Number(value))}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="hargaAktual"
            name="Harga Aktual"
            stroke="#16a34a"
            strokeWidth={2}
            dot={false}
          />
          {data.some((d) => d.hargaPrediksi !== undefined) && (
            <Line
              type="monotone"
              dataKey="hargaPrediksi"
              name="Prediksi AI"
              stroke="#f59e0b"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
