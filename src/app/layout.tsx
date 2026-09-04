import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Providers } from "@/components/providers"; // Import Providers Anda

const inter = Inter({ subsets: ["latin"] });

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
        <head>
            <script
                dangerouslySetInnerHTML={{
                    __html: `
(function() {
  try {
    // 1. Redam error pihak ketiga dari ekstensi browser (Chrome/Edge Extension seperti VPN, Adblocker, dll)
    window.addEventListener('error', function(e) {
      if (
        (e.filename && (e.filename.startsWith('chrome-extension://') || e.filename.startsWith('moz-extension://') || e.filename.startsWith('edge-extension://'))) ||
        (e.error && e.error.stack && (e.error.stack.indexOf('chrome-extension://') !== -1 || e.error.stack.indexOf('moz-extension://') !== -1))
      ) {
        e.stopImmediatePropagation();
        e.preventDefault();
      }
    }, true);

    window.addEventListener('unhandledrejection', function(e) {
      var reason = e.reason;
      var stack = (reason && reason.stack) || '';
      if (stack.indexOf('chrome-extension://') !== -1 || stack.indexOf('moz-extension://') !== -1) {
        e.stopImmediatePropagation();
        e.preventDefault();
      }
    }, true);

    // 2. Bersihkan atribut injeksi ekstensi seperti bis_skin_checked
    var orig = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function(name, val) {
      if (name === 'bis_skin_checked') return;
      return orig.apply(this, arguments);
    };
    var obs = new MutationObserver(function(mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var m = mutations[i];
        if (m.type === 'attributes' && m.attributeName === 'bis_skin_checked') {
          m.target.removeAttribute('bis_skin_checked');
        }
      }
    });
    obs.observe(document.documentElement, {
      attributes: true,
      subtree: true,
      attributeFilter: ['bis_skin_checked']
    });
  } catch (e) {}
})();
`,
                }}
            />
        </head>
        <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {/* Bungkus dengan SessionProvider melalui komponen Providers */}
            <Providers>
                {children}
            </Providers>
        </ThemeProvider>
        </body>
        </html>
    );
}