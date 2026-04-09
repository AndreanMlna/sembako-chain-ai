import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Providers } from "@/components/providers";

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
    <html lang="id" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
