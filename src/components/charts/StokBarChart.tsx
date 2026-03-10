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
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      {title && (
        <h3 className="mb-4 text-lg font-semibold text-gray-900">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="komoditas" fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip />
          <Legend />
          <Bar dataKey="stok" name="Stok" fill="#16a34a" />
          <Bar dataKey="permintaan" name="Permintaan" fill="#f59e0b" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
