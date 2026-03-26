import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes"; // Import ini

export const metadata: Metadata = {
  title: "Sembako-Chain AI",
  description:
      "Ekosistem Distribusi Pangan Hybrid Berbasis AI untuk Stabilisasi Inflasi dan Inklusi Ekonomi",
  keywords: [
    "sembako", "pangan", "AI", "distribusi", "supply chain", "inflasi", "petani", "Indonesia",
  ],
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="id" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
      {/* Attribute="class" penting supaya Tailwind v4 tahu kapan pakai mode gelap */}
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
      </body>
      </html>
  );
}