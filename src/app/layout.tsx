import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sembako-Chain AI",
  description:
    "Ekosistem Distribusi Pangan Hybrid Berbasis AI untuk Stabilisasi Inflasi dan Inklusi Ekonomi",
  keywords: [
    "sembako",
    "pangan",
    "AI",
    "distribusi",
    "supply chain",
    "inflasi",
    "petani",
    "Indonesia",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
