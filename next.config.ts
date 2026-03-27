import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // INI KUNCINYA: Membiarkan Prisma berjalan murni sebagai Node.js
  serverExternalPackages: ["@prisma/client", "prisma"],
};

export default nextConfig;