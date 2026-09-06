// src/app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || "https://sembako-chain.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login", "/register", "/pembeli/katalog"],
        disallow: [
          "/api/",
          "/petani/",
          "/mitra-toko/",
          "/kurir/",
          "/regulator/",
          "/admin/",
          "/profil/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/dashboard/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
