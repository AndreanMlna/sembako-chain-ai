import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXTAUTH_URL || "https://sembako-chain.vercel.app";
  const currentDate = new Date().toISOString();

  // Halaman publik yang diizinkan untuk di-crawl dan di-index oleh mesin pencari
  return [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pembeli/katalog`,
      lastModified: currentDate,
      changeFrequency: "hourly",
      priority: 0.9,
    },
  ];
}
