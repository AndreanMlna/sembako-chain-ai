import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });
const baseUrl = process.env.NEXTAUTH_URL || "https://sembako-chain.vercel.app";

export const metadata: Metadata = {
    metadataBase: new URL(baseUrl),
    title: {
        default: "Sembako-Chain AI | Ekosistem Distribusi Pangan Berbasis AI",
        template: "%s | Sembako-Chain AI",
    },
    description:
        "Ekosistem Distribusi Pangan Hybrid Berbasis AI untuk Stabilisasi Inflasi, Efisiensi Rantai Pasok, dan Inklusi Ekonomi Petani & Mitra Toko.",
    keywords: [
        "sembako", "harvest", "pangan", "AI", "distribusi", "supply chain", "inflasi", "petani", "Indonesia", "b2b ecommerce pangan"
    ],
    authors: [{ name: "Sembako-Chain Team" }],
    creator: "Sembako-Chain AI",
    publisher: "Sembako-Chain AI",
    alternates: {
        canonical: "/",
    },
    openGraph: {
        title: "Sembako-Chain AI - Smart Food Supply Chain",
        description: "Ekosistem Distribusi Pangan Hybrid Berbasis AI untuk Stabilisasi Inflasi dan Inklusi Ekonomi",
        url: baseUrl,
        siteName: "Sembako-Chain AI",
        locale: "id_ID",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Sembako-Chain AI",
        description: "Ekosistem Distribusi Pangan Hybrid Berbasis AI untuk Stabilisasi Inflasi dan Inklusi Ekonomi",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
};

// JSON-LD Structured Data Schema (Schema.org) untuk SEO Mesin Pencari
const jsonLdSchema = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Organization",
            "@id": `${baseUrl}/#organization`,
            "name": "Sembako-Chain AI",
            "url": baseUrl,
            "logo": `${baseUrl}/logo.png`,
            "description": "Platform supply chain pangan berbasis AI dan transparansi distribusi komoditas.",
        },
        {
            "@type": "WebSite",
            "@id": `${baseUrl}/#website`,
            "url": baseUrl,
            "name": "Sembako-Chain AI",
            "description": "Ekosistem Distribusi Pangan Berbasis AI untuk Stabilisasi Inflasi",
            "publisher": {
                "@id": `${baseUrl}/#organization`
            },
            "inLanguage": "id-ID"
        }
    ]
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="id" suppressHydrationWarning>
        <head>
            {/* Structured Data (Schema.org JSON-LD) untuk Google Rich Snippets */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
            />
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
            <Providers>
                {children}
            </Providers>
        </ThemeProvider>
        </body>
        </html>
    );
}
